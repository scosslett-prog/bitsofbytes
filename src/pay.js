/* Payments and access.
   Full access comes from being a teacher or admin, being in a class whose teacher has licences,
   or having your own student subscription. Without one of those, only the first lesson of each
   section is open. All of this is switched off until VITE_PAYMENTS=on, so nothing locks before
   Stripe is set up. The database (my_access) is the source of truth; Stripe updates it through
   the stripe-webhook function. */
export function createPay(api, store, env) {
  const local = (() => { try { return localStorage.getItem('bob-paytest') === '1'; } catch (e) { return false; } })();
  const enabled = !!api && ((api.name === 'supabase' && env.VITE_PAYMENTS === 'on') || (api.name === 'dev' && local));
  const pay = { enabled, access: { staff: false, class: false, sub: null }, licenceSubs: [], prices: null, broken: false };

  pay.load = async () => {
    if (!enabled || !store.user) return;
    try {
      pay.access = (await api.db.rpc('my_access', {})) || pay.access;
      pay.licenceSubs = store.user.role === 'student' ? [] :
        (await api.db.select('subscriptions', { eq: { user_id: store.user.id, plan: 'licences' } })).filter((s) => ['active', 'trialing', 'past_due'].includes(s.status));
    } catch (e) {
      // the payments database step hasn't been run: don't lock anyone out
      console.warn('Payments not ready', e); pay.broken = true;
    }
  };
  pay.full = () => !enabled || pay.broken || !!(store.user && (pay.access.staff || pay.access.class || pay.access.sub));
  pay.loadPrices = async () => {
    if (pay.prices) return pay.prices;
    try { pay.prices = (await api.fn('billing', { action: 'prices' })) || {}; } catch (e) { console.warn(e); pay.prices = {}; }
    return pay.prices;
  };
  pay.checkout = async (plan, quantity) => { const r = await api.fn('billing', { action: 'checkout', plan, quantity }); location.href = r.url; };
  pay.portal = async () => { const r = await api.fn('billing', { action: 'portal' }); location.href = r.url; };
  pay.money = (p) => (p && p.amount != null ? new Intl.NumberFormat('en-GB', { style: 'currency', currency: (p.currency || 'gbp').toUpperCase(), currencyDisplay: 'narrowSymbol', minimumFractionDigits: p.amount % 100 ? 2 : 0 }).format(p.amount / 100) : null);
  return pay;
}
