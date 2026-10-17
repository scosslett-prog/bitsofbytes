// Bits of Bytes: payments called from the site.
//   { action: "prices" }                         public: the prices to show on the pricing page
//   { action: "checkout", plan, quantity? }      signed in: start a Stripe Checkout page
//        plan = "licences" (teachers; quantity = number of licences) | "student_monthly" | "student_yearly"
//   { action: "portal" }                         signed in: Stripe's page to manage or cancel a subscription
// Secrets (Supabase → Edge Functions → Secrets): STRIPE_SECRET_KEY, STRIPE_PRICE_LICENCE,
// STRIPE_PRICE_STUDENT_MONTHLY, STRIPE_PRICE_STUDENT_YEARLY, SITE_URL (e.g. https://bitsofbytes.co).
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { httpClient: Stripe.createFetchHttpClient() });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const PRICES = {
  licences: Deno.env.get("STRIPE_PRICE_LICENCE") ?? "",
  student_monthly: Deno.env.get("STRIPE_PRICE_STUDENT_MONTHLY") ?? "",
  student_yearly: Deno.env.get("STRIPE_PRICE_STUDENT_YEARLY") ?? "",
};
const SITE = (Deno.env.get("SITE_URL") ?? "").replace(/\/$/, "");

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: { ...cors, "content-type": "application/json" } });

// the site the request came from, if it's one we allow; otherwise the configured site
function returnBase(req: Request) {
  const o = req.headers.get("origin") ?? "";
  try {
    if (o && (o === SITE || /^http:\/\/localhost(:\d+)?$/.test(o) || /\.vercel\.app$/.test(new URL(o).hostname))) return o;
  } catch { /* not a URL */ }
  return SITE;
}

async function signedInUser(req: Request) {
  const jwt = (req.headers.get("authorization") ?? "").replace(/^Bearer\s+/i, "");
  if (!jwt) return null;
  const { data } = await admin.auth.getUser(jwt);
  if (!data?.user) return null;
  const { data: p } = await admin.from("profiles").select("id, email, full_name, role").eq("id", data.user.id).single();
  return p;
}

async function customerFor(user: { id: string; email: string; full_name: string }) {
  const { data } = await admin.from("billing_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
  if (data?.stripe_customer_id) return data.stripe_customer_id as string;
  const c = await stripe.customers.create({ email: user.email, name: user.full_name || undefined, metadata: { user_id: user.id } });
  await admin.from("billing_customers").insert({ user_id: user.id, stripe_customer_id: c.id });
  return c.id;
}

const money = (p: Stripe.Price) => ({ id: p.id, amount: p.unit_amount, currency: p.currency, interval: p.recurring?.interval ?? null });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  try {
    const body = await req.json().catch(() => ({}));
    const action = body.action;

    if (action === "prices") {
      const out: Record<string, unknown> = {};
      for (const [k, id] of Object.entries(PRICES)) if (id) out[k] = money(await stripe.prices.retrieve(id));
      return reply(200, out);
    }

    const user = await signedInUser(req);
    if (!user) return reply(401, { error: "Sign in first." });
    const base = returnBase(req);

    if (action === "checkout") {
      const plan = String(body.plan ?? "");
      const price = PRICES[plan as keyof typeof PRICES];
      if (!price) return reply(400, { error: "That plan isn't available." });
      const teacherPlan = plan === "licences";
      if (teacherPlan && !["teacher", "admin"].includes(user.role)) return reply(403, { error: "Only teacher accounts can buy class licences." });
      if (!teacherPlan && user.role !== "student") return reply(403, { error: "Student subscriptions are for student accounts." });
      const quantity = teacherPlan ? Math.max(1, Math.min(1000, Math.floor(Number(body.quantity) || 0))) : 1;
      if (!teacherPlan) {
        const { data: live } = await admin.from("subscriptions").select("id").eq("user_id", user.id).eq("plan", "student").in("status", ["active", "trialing", "past_due"]);
        if (live?.length) return reply(409, { error: "You already have a subscription. Use Manage subscription to change it." });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: await customerFor(user),
        client_reference_id: user.id,
        line_items: [{ price, quantity, ...(teacherPlan ? { adjustable_quantity: { enabled: true, minimum: 1, maximum: 1000 } } : {}) }],
        subscription_data: { metadata: { user_id: user.id, plan: teacherPlan ? "licences" : "student" } },
        allow_promotion_codes: true,
        billing_address_collection: "auto",
        success_url: `${base}/?checkout=success#${teacherPlan ? "teacher" : "account"}`,
        cancel_url: `${base}/?checkout=cancelled#${teacherPlan ? "teacher" : "pricing"}`,
      });
      return reply(200, { url: session.url });
    }

    if (action === "portal") {
      const { data } = await admin.from("billing_customers").select("stripe_customer_id").eq("user_id", user.id).maybeSingle();
      if (!data) return reply(404, { error: "There's no billing account yet." });
      const s = await stripe.billingPortal.sessions.create({
        customer: data.stripe_customer_id,
        return_url: `${base}/#${["teacher", "admin"].includes(user.role) ? "teacher" : "account"}`,
      });
      return reply(200, { url: s.url });
    }

    return reply(400, { error: "Unknown action." });
  } catch (e) {
    console.error(e);
    return reply(500, { error: "Payments aren't working right now. Please try again later." });
  }
});
