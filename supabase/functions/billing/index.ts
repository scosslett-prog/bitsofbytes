// Bits of Bytes: payments called from the site.
//   { action: "prices" }                         public: the prices to show on the pricing page
//   { action: "checkout", plan, quantity? }      signed in: start a Stripe Checkout page
//        plan = "licences" (teachers; quantity = number of licences) | "student_monthly" | "student_yearly"
//   { action: "portal" }                         signed in: Stripe's page to manage or cancel a subscription
//   { action: "seller" }                         public: the licence price and the seller's details, for a quote
//   { action: "invoice", quantity, school, email, address?, po? }
//        teachers: a yearly licence subscription paid by invoice. Stripe emails the invoice to the school's
//        finance email (payable by card or bank transfer within 30 days). The licences work straight away;
//        if the invoice isn't paid, Stripe cancels the subscription (Settings → Billing → Subscriptions and
//        emails → "Manage invoices sent to customers") and the licences stop.
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
    if (o && (o === SITE || /^http:\/\/localhost(:\d+)?$/.test(o) || /\.(vercel|netlify)\.app$/.test(new URL(o).hostname))) return o;
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

const INVOICE_DAYS = 30;
const clip = (v: unknown, n: number) => String(v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
const emailOk = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
/* the business details Stripe holds for the account (public details, Settings → Business → Public details) */
async function seller() {
  try {
    const a = await stripe.accounts.retrieve();
    const bp = (a.business_profile ?? {}) as Partial<Stripe.Account.BusinessProfile>;
    const ad = bp.support_address ?? null;
    return {
      name: bp.name || a.settings?.dashboard?.display_name || "Bits of Bytes",
      email: bp.support_email || a.email || "",
      phone: bp.support_phone || "",
      url: bp.url || SITE,
      address: ad ? [ad.line1, ad.line2, ad.city, ad.state, ad.postal_code, ad.country].filter(Boolean).join(", ") : "",
    };
  } catch (e) {
    console.warn("account details", e);
    return { name: "Bits of Bytes", email: "", phone: "", url: SITE, address: "" };
  }
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

    if (action === "seller") {
      const price = PRICES.licences ? money(await stripe.prices.retrieve(PRICES.licences)) : null;
      return reply(200, { price, seller: await seller(), days: INVOICE_DAYS });
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

    if (action === "invoice") {
      if (!["teacher", "admin"].includes(user.role)) return reply(403, { error: "Only teacher accounts can buy class licences." });
      if (!PRICES.licences) return reply(400, { error: "Licences aren't on sale yet." });
      const quantity = Math.floor(Number(body.quantity) || 0);
      if (!(quantity >= 1 && quantity <= 1000)) return reply(400, { error: "Choose from 1 to 1000 licences." });
      const school = clip(body.school, 120), email = clip(body.email, 200).toLowerCase(), po = clip(body.po, 60);
      const address = String(body.address ?? "").split(/\n/).map((l) => clip(l, 100)).filter(Boolean).slice(0, 5);
      if (!school) return reply(400, { error: "Enter the school's name." });
      if (!emailOk(email)) return reply(400, { error: "Enter the email address the invoice should go to." });
      // one Stripe customer per invoice, so it goes to the school's finance office, not the teacher's card account
      const customer = await stripe.customers.create({
        name: school, email,
        ...(address.length ? { address: { line1: address[0], line2: address.slice(1).join(", ") || undefined } } : {}),
        metadata: { user_id: user.id, teacher_email: user.email, kind: "invoice" },
        invoice_settings: { custom_fields: [...(po ? [{ name: "Purchase order", value: po }] : []), { name: "Teacher", value: clip(`${user.full_name || ""} ${user.email}`, 140) }] },
      });
      const sub = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: PRICES.licences, quantity }],
        collection_method: "send_invoice",
        days_until_due: INVOICE_DAYS,
        metadata: { user_id: user.id, plan: "licences", po },
        description: `Class licences for ${school}${po ? ` (PO ${po})` : ""}`,
      });
      // finalise and email the first invoice now rather than in an hour
      let inv = await stripe.invoices.retrieve(typeof sub.latest_invoice === "string" ? sub.latest_invoice : sub.latest_invoice!.id);
      if (inv.status === "draft") inv = await stripe.invoices.finalizeInvoice(inv.id);
      try { inv = await stripe.invoices.sendInvoice(inv.id); } catch (e) { console.warn("send invoice", e); }
      // record it now too, so the licences show at once even before the webhook arrives
      const item = sub.items.data[0];
      const end = (sub as unknown as { current_period_end?: number }).current_period_end ?? (item as unknown as { current_period_end?: number })?.current_period_end;
      await admin.from("subscriptions").upsert({
        id: sub.id, user_id: user.id, plan: "licences", status: sub.status, quantity, price_id: PRICES.licences,
        interval: item?.price?.recurring?.interval ?? null, current_period_end: end ? new Date(end * 1000).toISOString() : null,
        cancel_at_period_end: false, collection: "send_invoice", updated_at: new Date().toISOString(),
      });
      return reply(200, { number: inv.number, url: inv.hosted_invoice_url, pdf: inv.invoice_pdf, email, total: inv.total, currency: inv.currency, due: inv.due_date });
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
