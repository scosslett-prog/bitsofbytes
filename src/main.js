/* Start-up: connect to the backend, load the signed-in account, fetch the lesson content,
   then run the site's scripts (public/app/*) in order. Those scripts are plain browser
   scripts that share globals; they reach the backend only through window.BOB. */
import { supabaseBackend } from './backend/supabase.js';
import { devBackend } from './backend/dev.js';
import { createStore } from './store.js';
import { createSchool } from './school.js';
import { applyDisplay, DEFAULTS as DISPLAY_DEFAULTS } from './display.js';
import { createPay } from './pay.js';

const ENV = import.meta.env || {};
const BUILD = typeof __BUILD__ !== 'undefined' ? __BUILD__ : String(Date.now());
const APP = ['01-content.js', '02-core.js', '03-exams.js', '04-school.js', '05-account.js', '06-extra-activities.js', '07-router.js'];

async function backend() {
  if (ENV.VITE_SUPABASE_URL && ENV.VITE_SUPABASE_ANON_KEY) return supabaseBackend(ENV.VITE_SUPABASE_URL, ENV.VITE_SUPABASE_ANON_KEY);
  return devBackend();
}
const get = (path, as) => fetch(`${path}?v=${BUILD}`).then((r) => { if (!r.ok) throw new Error(`${path}: ${r.status}`); return r[as](); });
const script = (src) => new Promise((ok, fail) => {
  const s = document.createElement('script');
  s.src = `${src}?v=${BUILD}`; s.onload = ok; s.onerror = () => fail(new Error('Could not load ' + src));
  document.body.appendChild(s);
});

/* a small notice when progress can't be saved (shown only when something is wrong) */
function saveStatus(s) {
  let el = document.getElementById('savestat');
  if (!el) { el = document.createElement('div'); el.id = 'savestat'; el.setAttribute('role', 'status'); document.body.appendChild(el); }
  el.className = s;
  el.textContent = s === 'error' ? "Your progress isn't saving. Check your connection; we'll keep trying." : s === 'saved' && el.dataset.err ? 'Progress saved.' : '';
  if (s === 'error') el.dataset.err = '1';
  else if (s === 'saved' && el.dataset.err) { delete el.dataset.err; setTimeout(() => { if (el.className === 'saved') el.textContent = ''; }, 2500); }
}

async function boot() {
  const [api, theory, exams] = await Promise.all([
    backend().catch((e) => { console.error(e); return null; }),
    get('/content/theory.html', 'text'),
    get('/content/exams.json', 'json'),
  ]);
  document.getElementById('content').innerHTML = theory;
  window.__EXDATA = exams;

  const store = createStore(api);
  const school = createSchool(api, () => store.user);
  store.onStatus = saveStatus;
  const pay = createPay(api, store, ENV);
  window.BOB = {
    mode: api ? api.name : 'offline',
    store, school, SC: school.SC,
    initialState: () => store.initialState(),
    save: (S) => store.save(S),
    signOut: () => store.signOut(),
    auth: store.auth,
    notice: () => { const n = store.notice; store.notice = ''; return n; },
    display: { apply: applyDisplay, defaults: DISPLAY_DEFAULTS },
    pay,
    google: api && api.name === 'supabase' && ENV.VITE_GOOGLE_SIGN_IN === 'on',
  };
  await store.init(school);
  applyDisplay(store.S.display);
  /* links from emails (confirm address, reset password) arrive with ?code=… or an error */
  const q = new URLSearchParams(location.search);
  if (q.has('error_description')) store.notice = q.get('error_description') + '. Try again, or ask for a new link.';
  const checkout = q.get('checkout');
  if (checkout === 'success') store.notice = 'Thank you! Your payment went through. It can take a few seconds to appear here.';
  if (checkout === 'cancelled') store.notice = "Checkout was cancelled. You haven't been charged.";
  if (q.has('code') || q.has('error') || q.has('error_description') || checkout) history.replaceState(null, '', location.pathname + location.hash);
  if (store.user) {
    try { await school.load(); } catch (e) { console.error(e); store.notice = "Your class details couldn't be loaded. Refresh the page to try again."; }
  }
  const land = await store.afterLoad();
  await pay.load();
  if (land) history.replaceState(null, '', location.pathname + location.search + '#' + land);
  for (const f of APP) await script('/app/' + f);
  document.getElementById('boot')?.remove();
  if (checkout === 'success') afterCheckout(pay, school);
}

/* Stripe tells the database about a new payment a moment after checkout; look again for a while */
function afterCheckout(pay, school) {
  const before = JSON.stringify([pay.access, pay.licenceSubs]);
  let n = 0;
  const t = setInterval(async () => {
    n++;
    await pay.load();
    if (JSON.stringify([pay.access, pay.licenceSubs]) !== before || n >= 12) {
      clearInterval(t);
      try { await school.load(); } catch (e) {}
      if (typeof window.render === 'function') window.render();
    }
  }, 2500);
}

boot().catch((e) => {
  console.error(e);
  const b = document.getElementById('boot');
  if (b) b.innerHTML = '<span>Bits of Bytes could not start. Check your connection and refresh the page.</span>';
});
