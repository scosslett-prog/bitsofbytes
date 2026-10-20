// Bits of Bytes: payments called from the site.
//   { action: "prices" }                         public: the prices to show on the pricing page
//   { action: "checkout", plan, quantity? }      signed in: start a Stripe Checkout page
//        plan = "teacher" (a teacher's own yearly subscription) | "licences" (teachers; quantity = number of
//        licences) | "student_monthly" | "student_yearly"
//   { action: "portal" }                         signed in: Stripe's page to manage or cancel a subscription
//   { action: "seller" }                         public: the licence price and the seller's details, for a quote
//   { action: "invoice", quantity, school, email, address?, po? }
//        teachers: a yearly licence subscription paid by invoice. Stripe emails the invoice to the school's
//        finance email (payable by card or bank transfer within 30 days). The licences work straight away;
//        if the invoice isn't paid, Stripe cancels the subscription (Settings → Billing → Subscriptions and
//        emails → "Manage invoices sent to customers") and the licences stop.
//   { action: "set_licences", id, quantity }     teachers: change the number of licences on one of their
//        subscriptions (row id from public.subscriptions). More licences are charged straight away for the
//        rest of the year (to the card, or as an invoice emailed to the school); fewer gives a credit at renewal.
//        The new total can't drop below the students already in the teacher's classes.
//   A teacher's first licence purchase (card or invoice) also adds the yearly teacher subscription, if they
//   don't already have full access; "seller" says whether it will (for a signed-in teacher).
// Secrets (Supabase → Edge Functions → Secrets): STRIPE_SECRET_KEY, STRIPE_PRICE_LICENCE, STRIPE_PRICE_TEACHER,
// STRIPE_PRICE_STUDENT_MONTHLY, STRIPE_PRICE_STUDENT_YEARLY, SITE_URL (e.g. https://bitsofbytes.co).
import Stripe from "npm:stripe@17.7.0";
import { createClient } from "npm:@supabase/supabase-js@2.49.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") ?? "", { httpClient: Stripe.createFetchHttpClient() });
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, { auth: { persistSession: false } });
const PRICES = {
  licences: Deno.env.get("STRIPE_PRICE_LICENCE") ?? "",
  teacher: Deno.env.get("STRIPE_PRICE_TEACHER") ?? "",
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

/* does this teacher already have full access (a live teacher subscription, or any licences)? If not, their
   licence purchase also includes the yearly teacher subscription. Same rule as public._teacher_live. */
async function teacherLive(uid: string) {
  const { data, error } = await admin.rpc("_teacher_live", { u: uid });
  if (error) throw error;
  return !!data;
}
/* the same rows the webhook writes (see stripe-webhook), saved straight away */
async function saveRows(sub: Stripe.Subscription, user_id: string) {
  const items = sub.items.data;
  for (const item of items) {
    const priceId = item.price.id, plan = priceId === PRICES.teacher ? "teacher" : "licences";
    const end = (sub as unknown as { current_period_end?: number }).current_period_end ?? (item as unknown as { current_period_end?: number })?.current_period_end;
    await admin.from("subscriptions").upsert({
      id: items.length === 1 ? sub.id : `${sub.id}:${plan}`, user_id, plan, status: sub.status, quantity: item.quantity ?? 1, price_id: priceId,
      interval: item.price.recurring?.interval ?? null, current_period_end: end ? new Date(end * 1000).toISOString() : null,
      cancel_at_period_end: !!sub.cancel_at_period_end, collection: sub.collection_method ?? "send_invoice", updated_at: new Date().toISOString(),
    });
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
      const teacher = PRICES.teacher ? money(await stripe.prices.retrieve(PRICES.teacher)) : null;
      const me = await signedInUser(req).catch(() => null);
      const firstBuy = !!me && ["teacher", "admin"].includes(me.role) && !!PRICES.teacher && !(await teacherLive(me.id));
      return reply(200, { price, teacher, firstBuy, seller: await seller(), days: INVOICE_DAYS });
    }

    const user = await signedInUser(req);
    if (!user) return reply(401, { error: "Sign in first." });
    const base = returnBase(req);

    if (action === "checkout") {
      const plan = String(body.plan ?? "");
      const price = PRICES[plan as keyof typeof PRICES];
      if (!price) return reply(400, { error: "That plan isn't available." });
      const teacherPlan = plan === "licences" || plan === "teacher";
      if (teacherPlan && !["teacher", "admin"].includes(user.role)) return reply(403, { error: plan === "teacher" ? "Teacher subscriptions are for teacher accounts." : "Only teacher accounts can buy class licences." });
      if (!teacherPlan && user.role !== "student") return reply(403, { error: "Student subscriptions are for student accounts." });
      if (plan === "teacher" && await teacherLive(user.id)) return reply(409, { error: "You already have full access as a teacher." });
      const quantity = plan === "licences" ? Math.max(1, Math.min(1000, Math.floor(Number(body.quantity) || 0))) : 1;
      if (!teacherPlan) {
        const { data: live } = await admin.from("subscriptions").select("id").eq("user_id", user.id).eq("plan", "student").in("status", ["active", "trialing", "past_due"]);
        if (live?.length) return reply(409, { error: "You already have a subscription. Use Manage subscription to change it." });
      }
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        customer: await customerFor(user),
        client_reference_id: user.id,
        line_items: [
          ...(plan === "licences" && PRICES.teacher && !(await teacherLive(user.id)) ? [{ price: PRICES.teacher, quantity: 1 }] : []),
          { price, quantity, ...(plan === "licences" ? { adjustable_quantity: { enabled: true, minimum: 1, maximum: 1000 } } : {}) }],
        subscription_data: { metadata: { user_id: user.id, plan: plan === "teacher" ? "teacher" : plan === "licences" ? "licences" : "student" } },
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
      const withTeacher = !!PRICES.teacher && !(await teacherLive(user.id));
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
        items: [...(withTeacher ? [{ price: PRICES.teacher, quantity: 1 }] : []), { price: PRICES.licences, quantity }],
        collection_method: "send_invoice",
        days_until_due: INVOICE_DAYS,
        metadata: { user_id: user.id, plan: "licences", po },
        description: `${withTeacher ? "Teacher subscription and class licences" : "Class licences"} for ${school}${po ? ` (PO ${po})` : ""}`,
      });
      // finalise and email the first invoice now rather than in an hour
      let inv = await stripe.invoices.retrieve(typeof sub.latest_invoice === "string" ? sub.latest_invoice : sub.latest_invoice!.id);
      if (inv.status === "draft") inv = await stripe.invoices.finalizeInvoice(inv.id);
      try { inv = await stripe.invoices.sendInvoice(inv.id); } catch (e) { console.warn("send invoice", e); }
      // record it now too, so the licences show at once even before the webhook arrives
      await saveRows(sub, user.id);
      return reply(200, { teacher: withTeacher, number: inv.number, url: inv.hosted_invoice_url, pdf: inv.invoice_pdf, email, total: inv.total, currency: inv.currency, due: inv.due_date });
    }

    if (action === "set_licences") {
      if (!["teacher", "admin"].includes(user.role)) return reply(403, { error: "Only teacher accounts have licences." });
      const quantity = Math.floor(Number(body.quantity) || 0);
      if (!(quantity >= 1 && quantity <= 1000)) return reply(400, { error: "Choose from 1 to 1000 licences." });
      const sid = String(body.id ?? "").split(":")[0];
      if (!/^sub_[A-Za-z0-9]+$/.test(sid)) return reply(400, { error: "That isn't one of your subscriptions." });
      const sub = await stripe.subscriptions.retrieve(sid);
      if (sub.metadata?.user_id !== user.id) return reply(403, { error: "That isn't one of your subscriptions." });
      if (!["active", "trialing", "past_due"].includes(sub.status)) return reply(400, { error: "That subscription has ended. Buy new licences instead." });
      const item = sub.items.data.find((i) => i.price.id === PRICES.licences) ?? (sub.items.data.length === 1 && sub.metadata?.plan === "licences" ? sub.items.data[0] : undefined);
      if (!item) return reply(400, { error: "That subscription has no licences." });
      const before = item.quantity ?? 0;
      if (quantity === before) return reply(200, { quantity });
      const [{ data: total }, { data: used }] = await Promise.all([admin.rpc("_licence_total", { t: user.id }), admin.rpc("_licences_used", { t: user.id })]);
      if (Number(total ?? 0) - before + quantity < Number(used ?? 0))
        return reply(400, { error: `${used} students are using licences in your classes, so you need at least ${Number(used) - Number(total ?? 0) + before} on this subscription. Remove students from a class first to go lower.` });
      const more = quantity > before, byInvoice = sub.collection_method === "send_invoice";
      let updated: Stripe.Subscription;
      try {
        updated = await stripe.subscriptions.update(sid, {
          items: [{ id: item.id, quantity }],
          proration_behavior: more ? "always_invoice" : "create_prorations",
          ...(more && !byInvoice ? { payment_behavior: "error_if_incomplete" as const } : {}),
        });
      } catch (e) {
        const msg = (e as { message?: string })?.message ?? "";
        return reply(402, { error: /card|declin|payment/i.test(msg) ? `The payment didn't go through: ${msg}` : "The licences couldn't be changed. Please try again." });
      }
      let invoice: { url?: string | null; number?: string | null } | null = null;
      if (more && byInvoice && updated.latest_invoice) {
        let inv = await stripe.invoices.retrieve(typeof updated.latest_invoice === "string" ? updated.latest_invoice : updated.latest_invoice.id);
        if (inv.status === "draft") inv = await stripe.invoices.finalizeInvoice(inv.id);
        try { inv = await stripe.invoices.sendInvoice(inv.id); } catch (e) { console.warn("send invoice", e); }
        invoice = { url: inv.hosted_invoice_url, number: inv.number };
      }
      await saveRows(updated, user.id);
      return reply(200, { quantity, invoice, byInvoice });
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
