/* Payments and access.
   Full access comes from being a teacher or admin, being in a class whose teacher has licences,
   or having your own student subscription. Without one of those, only the first lesson of each
   section is open. The switch is in the database (site_settings.payments); while it's off,
   everything is open to everyone. The database is the source of truth: it sends only the content
   each person can open (course_content), and Stripe updates it through the stripe-webhook function. */
export function createPay(api, store, content) {
  const pay = { get enabled() { return !!api && content.payments; }, access: { staff: false, class: false, sub: null }, licenceSubs: [], prices: null, broken: false };

  pay.load = async () => {
    if (!pay.enabled || !store.user) return;
    try {
      pay.access = (await api.db.rpc('my_access', {})) || pay.access;
      pay.licenceSubs = store.user.role === 'student' ? [] :
        (await api.db.select('subscriptions', { eq: { user_id: store.user.id, plan: 'licences' } })).filter((s) => ['active', 'trialing', 'past_due'].includes(s.status));
    } catch (e) {
      // the payments database step hasn't been run: don't lock anyone out
      console.warn('Payments not ready', e); pay.broken = true;
    }
  };
  pay.full = () => !pay.enabled || content.full;
  pay.loadPrices = async () => {
    if (pay.prices) return pay.prices;
    try { pay.prices = (await api.fn('billing', { action: 'prices' })) || {}; } catch (e) { console.warn(e); pay.prices = {}; }
    return pay.prices;
  };
  pay.checkout = async (plan, quantity) => { const r = await api.fn('billing', { action: 'checkout', plan, quantity }); location.href = r.url; };
  pay.seller = async () => { if (!pay.sellerInfo) pay.sellerInfo = await api.fn('billing', { action: 'seller' }); return pay.sellerInfo; };
  pay.invoice = (d) => api.fn('billing', Object.assign({ action: 'invoice' }, d));
  pay.portal = async () => { const r = await api.fn('billing', { action: 'portal' }); location.href = r.url; };
  pay.money = (p) => (p && p.amount != null ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: (p.currency || 'gbp').toUpperCase(), currencyDisplay: 'narrowSymbol', minimumFractionDigits: p.amount % 100 ? 2 : 0 }).format(p.amount / 100) : null);
  return pay;
}
