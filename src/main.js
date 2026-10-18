/* Start-up: connect to the backend, load the signed-in account, fetch the lesson content,
   then run the site's scripts (public/app/*) in order. Those scripts are plain browser
   scripts that share globals; they reach the backend only through window.BOB. */
import { supabaseBackend } from './backend/supabase.js';
import { devBackend } from './backend/dev.js';
import { createStore } from './store.js';
import { createSchool } from './school.js';
import { applyDisplay, DEFAULTS as DISPLAY_DEFAULTS } from './display.js';
import { createPay } from './pay.js';
import { createContent, forgetContent } from './content.js';

const ENV = import.meta.env || {};
const BUILD = typeof __BUILD__ !== 'undefined' ? __BUILD__ : String(Date.now());
const APP = ['01-content.js', '02-core.js', '03-exams.js', '04-school.js', '05-account.js', '06-extra-activities.js', '07-router.js', '08-reading.js', '09-demo.js', '10-seo.js'];
/* Google Analytics 4 measurement ID (it's public). Analytics only load after a visitor agrees. */
const GA_ID = ENV.VITE_GA_ID || 'G-TBRKMHE7BF';

/* Pages have their own addresses for search engines (scripts/prerender.mjs), e.g. /lesson/1-1-binary.
   The app itself works from #routes, so an address like that opens the matching page. */
export function pathToRoute(p) {
  p = (p || '/').replace(/\/+$/, '') || '/';
  let m;
  if (p === '/' || p === '/index.html') return null;
  if ((m = p.match(/^\/paper-([12])$/))) return 'paper-' + m[1];
  if ((m = p.match(/^\/topic\/([\w-]+)$/))) return 't-' + m[1];
  if ((m = p.match(/^\/lesson\/([\w-]+)$/))) return 'l-' + m[1];
  return { '/exam-questions': 'exams', '/flash-cards': 'flashcards', '/pricing': 'pricing', '/dashboard-preview': 'dashboard', '/contact': 'contact' }[p] || 'home';
}
{
  const r = pathToRoute(location.pathname);
  if (r !== null) history.replaceState(null, '', '/' + location.search + (location.hash || '#' + r));
}

/* The live project's address and publishable key. Both are public (every visitor's browser has
   them); what each account can do is enforced by the database. .env.local or the host's
   environment variables can point the site somewhere else. */
const LIVE = { url: 'https://cvijqlbtakistuikogoz.supabase.co', key: 'sb_publishable_yVwFuNNXXeM09nneiZZOig_MnaBvmDT' };

async function backend() {
  if (ENV.VITE_SUPABASE_URL && ENV.VITE_SUPABASE_ANON_KEY) return supabaseBackend(ENV.VITE_SUPABASE_URL, ENV.VITE_SUPABASE_ANON_KEY);
  // the local test server (tests/devserver.py) when it's running, otherwise the live project
  return (await devBackend()) || supabaseBackend(LIVE.url, LIVE.key);
}
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
  const api = await backend().catch((e) => { console.error(e); return null; });
  const content = createContent(api);
  // show "Continue with Google" once the Google provider is switched on in Supabase
  const providersP = api && api.auth.providers ? api.auth.providers() : Promise.resolve({});

  const store = createStore(api);
  const school = createSchool(api, () => store.user);
  store.onStatus = saveStatus;
  const pay = createPay(api, store, content);
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
    content,
    /* after joining a class or paying: fetch what this person can now open, then redraw */
    refreshContent: async () => { await content.load(); content.apply(); await pay.load(); },
    google: false,
    gaId: GA_ID,
  };
  const link = await emailLink(api);
  await store.init(school);
  applyDisplay(store.S.display);
  if (link.notice) store.notice = link.notice;
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
  await content.load();
  content.apply();
  await pay.load();
  window.BOB.google = api && api.name === 'supabase' && (ENV.VITE_GOOGLE_SIGN_IN === 'on' || !!(await providersP).google);
  if (land) history.replaceState(null, '', location.pathname + location.search + '#' + land);
  for (const f of APP) await script('/app/' + f);
  document.getElementById('boot')?.remove();
  if (checkout === 'success') afterCheckout(pay, school);
}

/* A link from one of our emails: confirm an address (type=email) or reset a password (type=recovery).
   Verified here, before the account loads, so the person arrives signed in. */
async function emailLink(api) {
  const q = new URLSearchParams(location.search), th = q.get('token_hash');
  if (!th || !api || !api.auth.verifyLink) return {};
  const type = ['recovery', 'email_change'].includes(q.get('type')) ? q.get('type') : 'email';
  let notice = '', hash = location.hash.replace(/^#/, '');
  try {
    await api.auth.verifyLink(th, type);
    if (type === 'recovery') hash = 'reset';
    else if (type === 'email_change') notice = 'Your new email address is confirmed.';
    else { notice = 'Your email address is confirmed. Welcome to Bits of Bytes!'; try { localStorage.setItem('bob-after-login', '1'); } catch (e) {} }
  } catch (e) {
    notice = type === 'recovery'
      ? 'That password reset link has expired or has already been used. Ask for a new one below.'
      : 'That confirmation link has expired or has already been used. Sign in below and we can send you a new one.';
    hash = type === 'recovery' ? 'forgot' : 'login';
  }
  q.delete('token_hash'); q.delete('type');
  history.replaceState(null, '', location.pathname + (q.toString() ? '?' + q : '') + (hash ? '#' + hash : ''));
  return { notice };
}

/* Stripe tells the database about a new payment a moment after checkout; look again for a while */
function afterCheckout(pay, school) {
  const before = JSON.stringify([pay.access, pay.licenceSubs]);
  let n = 0;
  const t = setInterval(async () => {
    n++;
    await pay.load();
    if (JSON.stringify([pay.access, pay.licenceSubs]) !== before || n >= 12) {
      try { await window.BOB.refreshContent(); } catch (e) { console.error(e); }
      clearInterval(t);
      try { await school.load(); } catch (e) {}
      if (typeof window.render === 'function') window.render();
    }
  }, 2500);
}

boot().catch((e) => {
  console.error(e);
  const b = document.getElementById('boot');
  if (b) b.innerHTML = /could not reach its database/.test(e && e.message)
    ? '<span>Bits of Bytes could not connect to its database. If you are running it on your own computer, check that <b>.env.local</b> is in the project folder, then restart <b>npm run dev</b>.</span>'
    : '<span>Bits of Bytes could not start. Check your connection and refresh the page.</span>';
});
