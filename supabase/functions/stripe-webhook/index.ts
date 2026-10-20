// Bits of Bytes: Stripe tells us about subscriptions here. Every change (new, renewed, quantity
// changed, payment failed, cancelled) is copied into public.subscriptions, which is what the site
// and the database use to decide licences and access. Deploy with JWT verification turned off:
// Stripe can't sign in, so the request is checked with the webhook signing secret instead.
// Secrets: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PRICE_LICENCE, STRIPE_PRICE_TEACHER.
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { httpClient: Stripe.createFetchHttpClient() });
const crypto = Stripe.createSubtleCryptoProvider();
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const LICENCE_PRICE = Deno.env.get("STRIPE_PRICE_LICENCE") ?? "";
const TEACHER_PRICE = Deno.env.get("STRIPE_PRICE_TEACHER") ?? "";

async function userFor(sub: Stripe.Subscription): Promise<string | null> {
  if (sub.metadata?.user_id) return sub.metadata.user_id;
  const customer = typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const { data } = await admin.from("billing_customers").select("user_id").eq("stripe_customer_id", customer).maybeSingle();
  return data?.user_id ?? null;
}

/* one row per item: a subscription can hold a teacher subscription and licences together (an invoice).
   With one item the row id is the Stripe subscription id; with several it is "<id>:<plan>". */
const planOf = (sub: Stripe.Subscription, priceId: string | null) =>
  priceId && priceId === TEACHER_PRICE ? "teacher" : priceId && priceId === LICENCE_PRICE ? "licences"
  : sub.metadata?.plan === "teacher" ? "teacher" : sub.metadata?.plan === "licences" ? "licences" : "student";
async function save(sub: Stripe.Subscription) {
  const user_id = await userFor(sub);
  if (!user_id) { console.warn("No user for subscription", sub.id); return; }
  const items = sub.items.data, ids: string[] = [];
  for (const item of items) {
    const priceId = item?.price?.id ?? null, plan = planOf(sub, priceId);
    const id = items.length === 1 ? sub.id : `${sub.id}:${plan}`;
    ids.push(id);
    // newer Stripe API versions keep the period on the item rather than the subscription
    const end = (sub as unknown as { current_period_end?: number }).current_period_end ?? (item as unknown as { current_period_end?: number })?.current_period_end;
    const { error } = await admin.from("subscriptions").upsert({
      id, user_id, plan, status: sub.status, quantity: item?.quantity ?? 1, price_id: priceId,
      interval: item?.price?.recurring?.interval ?? null,
      current_period_end: end ? new Date(end * 1000).toISOString() : null,
      cancel_at_period_end: !!sub.cancel_at_period_end, collection: sub.collection_method ?? "charge_automatically", updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  }
  // an item taken off the subscription: its row stops counting
  const { data: old } = await admin.from("subscriptions").select("id").or(`id.eq.${sub.id},id.like.${sub.id}:*`);
  const gone = (old ?? []).map((r: { id: string }) => r.id).filter((id: string) => !ids.includes(id));
  if (gone.length) await admin.from("subscriptions").update({ status: "canceled", updated_at: new Date().toISOString() }).in("id", gone);
}

Deno.serve(async (req) => {
  const sig = req.headers.get("stripe-signature");
  const raw = await req.text();
  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(raw, sig ?? "", Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "", undefined, crypto);
  } catch (e) {
    console.warn("Bad signature", e);
    return new Response("Bad signature", { status: 400 });
  }
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const s = event.data.object as Stripe.Checkout.Session;
        if (s.mode === "subscription" && s.subscription) {
          const id = typeof s.subscription === "string" ? s.subscription : s.subscription.id;
          await save(await stripe.subscriptions.retrieve(id));
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted":
      case "customer.subscription.paused":
      case "customer.subscription.resumed":
        // fetch the latest copy so events arriving out of order can't leave an old state behind
        await save(await stripe.subscriptions.retrieve((event.data.object as Stripe.Subscription).id));
        break;
    }
    return new Response(JSON.stringify({ received: true }), { headers: { "content-type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response("Error", { status: 500 }); // Stripe retries later
  }
});
