/* Accounts and progress.
   Guests: progress is kept in this browser (localStorage), as before.
   Signed in: progress is loaded from the account when the page opens and every change is
   saved back a moment later. Each quick check, vocabulary test, activity and exam question
   is its own row in user_progress, so only what changed is sent. Everything else a student
   keeps (flash cards, confidence ratings, which units are open) is one user_state document.
   Answers to exam assignments go to assignment_submissions, where the teacher can read them. */

const GUEST_KEY = 'bob-state-v1';
const MERGE_KEY = 'bob-merge-guest';     // set at sign-in when this browser has guest progress
const JOIN_KEY = 'bob-pending-join';     // a class code typed at sign-up, used at first sign-in
const AFTER_KEY = 'bob-after-login';     // choose a landing page after signing in
const ROLE_KEY = 'bob-pending-role';     // "teacher" chosen before signing up with Google
const KINDS = ['lessons', 'scores', 'acts', 'ex'];
const NOT_STATE = new Set(['user', 'account', 'asgAns', ...KINDS]);

const ls = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} },
  del(k) { try { localStorage.removeItem(k); } catch (e) {} },
};
const now = () => new Date().toISOString();
const chunks = (a, n) => { const out = []; for (let i = 0; i < a.length; i += n) out.push(a.slice(i, i + n)); return out; };

function guestState() {
  try { const raw = ls.get(GUEST_KEY); if (raw) return JSON.parse(raw); } catch (e) {}
  return null;
}
function hasProgress(g) { return !!g && KINDS.some((k) => g[k] && Object.keys(g[k]).length); }

/* everything the server holds for S, as comparable strings */
function snapshot(S) {
  const rows = new Map();
  for (const kind of KINDS) for (const [key, v] of Object.entries(S[kind] || {})) rows.set(kind + '\n' + key, JSON.stringify(v));
  const doc = {};
  for (const [k, v] of Object.entries(S)) if (!NOT_STATE.has(k) && v !== undefined) doc[k] = v;
  const subs = new Map();
  for (const [aid, r] of Object.entries(S.asgAns || {})) subs.set(aid, JSON.stringify({ ans: r.ans || {}, done: !!r.done, date: r.date || null }));
  return { rows, state: JSON.stringify(doc), subs };
}

/* keep the better of two results for the same quick check / test / activity / question */
function better(a, b) {
  const score = (x) => (x && (x.best ?? x.b ?? x.bestN ?? 0)) || 0;
  return score(b) > score(a) ? b : a;
}

export function createStore(api) {
  const st = {
    api, user: null, S: null, notice: '',
    status: 'saved', onStatus: () => {},
  };
  let synced = null, timer = null, busy = false, again = false, retry = null;
  let school = null;

  const setStatus = (s) => { st.status = s; st.onStatus(s); };

  async function loadAccount(session) {
    const { db } = api;
    const id = session.id;
    const [profiles, rows, states, subs] = await Promise.all([
      db.select('profiles', { eq: { id } }),
      db.select('user_progress', { eq: { user_id: id }, order: [['kind'], ['key']] }),
      db.select('user_state', { eq: { user_id: id } }),
      db.select('assignment_submissions', { eq: { student_id: id } }),
    ]);
    const p = profiles[0];
    if (!p) throw new Error('Your account profile is missing. Please contact Bits of Bytes.');
    st.user = { id, email: p.email || session.email, name: p.full_name || (p.email || '').split('@')[0], role: p.role, school: p.school || '' };
    const S = Object.assign({}, (states[0] && states[0].data) || {});
    for (const k of KINDS) S[k] = {};
    for (const r of rows) if (S[r.kind]) S[r.kind][r.key] = r.data;
    S.asgAns = {};
    for (const s of subs) S.asgAns[s.assignment_id] = { ans: s.answers || {}, done: s.done, date: s.submitted_at ? Date.parse(s.submitted_at) : null };
    S.user = st.user;
    st.S = S;
    return S;
  }

  /* bring progress made as a guest in this browser into the account, once */
  function mergeGuest(S) {
    const g = guestState();
    ls.del(MERGE_KEY);
    if (!hasProgress(g)) return false;
    for (const k of KINDS) for (const [key, v] of Object.entries(g[k] || {})) S[k][key] = S[k][key] ? better(S[k][key], v) : v;
    for (const [k, v] of Object.entries(g)) {
      if (NOT_STATE.has(k) || v == null) continue;
      if (Array.isArray(v)) S[k] = [...(Array.isArray(S[k]) ? S[k] : []), ...v];
      else if (typeof v === 'object') S[k] = Object.assign({}, v, S[k] || {});
      else if (S[k] === undefined) S[k] = v;
    }
    ls.del(GUEST_KEY);
    return true;
  }

  st.init = async (sch) => {
    school = sch;
    let S = null;
    if (api) {
      try {
        const session = await api.auth.session();
        if (session) {
          S = await loadAccount(session);
          synced = snapshot(S);
          if (ls.get(MERGE_KEY)) st.merged = mergeGuest(S);
        }
      } catch (e) {
        console.error(e);
        st.notice = "We couldn't load your account just now, so you're browsing as a guest. Refresh the page to try again.";
        st.user = null; S = null;
      }
      api.auth.onChange((event, who) => {
        if (event === 'PASSWORD_RECOVERY') location.hash = 'reset';
        if (event === 'SIGNED_OUT' && st.user) location.reload();
      });
    }
    if (!S) S = Object.assign({ user: null, scores: {}, lessons: {} }, guestState() || {}, { user: null });
    delete S.account;
    st.S = S;
    return S;
  };

  /* things to do once the school data is loaded: a join code from sign-up, landing page */
  st.afterLoad = async () => {
    if (ls.get(ROLE_KEY) && st.user) {
      const want = ls.get(ROLE_KEY); ls.del(ROLE_KEY);
      if (want === 'teacher' && st.user.role === 'student') {
        try { if (await api.db.rpc('claim_teacher', {})) { st.user.role = 'teacher'; st.S.user = st.user; await school.load(); } } catch (e) { console.warn(e); }
      }
    }
    if (st.merged) { st.merged = false; await flush(); }
    const code = ls.get(JOIN_KEY);
    if (code && st.user) {
      ls.del(JOIN_KEY);
      if (st.user.role === 'student') {
        try { await api.db.rpc('join_class', { code }); await school.load(); st.notice = 'You have joined your class.'; }
        catch (e) { st.notice = e.message + ' You can try again from your dashboard.'; }
      }
    }
    if (ls.get(AFTER_KEY)) {
      ls.del(AFTER_KEY);
      if (!st.user) return null;
      if (st.user.role === 'teacher' || st.user.role === 'admin') return 'teacher';
      const SC = school.SC, mine = SC.users[st.user.id];
      const fresh = mine && mine.cls && Object.values(SC.asg).some((a) => a.cls === mine.cls && !SC.seen.includes(a.id));
      return fresh ? 'todo' : 'dashboard';
    }
    return null;
  };

  st.initialState = () => st.S;

  st.save = (S) => {
    st.S = S;
    if (!st.user) { ls.set(GUEST_KEY, JSON.stringify(Object.assign({}, S, { user: null }))); return; }
    clearTimeout(timer);
    timer = setTimeout(flush, 800);
    if (st.status !== 'error') setStatus('pending');
  };

  async function flush() {
    if (!st.user || !synced) return;
    if (busy) { again = true; return; }
    busy = true; clearTimeout(timer); clearTimeout(retry);
    const { db } = api, uid = st.user.id, cur = snapshot(st.S);
    try {
      const up = [], gone = {};
      for (const [k, v] of cur.rows) if (synced.rows.get(k) !== v) { const [kind, key] = k.split('\n'); up.push({ user_id: uid, kind, key, data: JSON.parse(v), updated_at: now() }); }
      for (const k of synced.rows.keys()) if (!cur.rows.has(k)) { const [kind, key] = k.split('\n'); (gone[kind] = gone[kind] || []).push(key); }
      for (const c of chunks(up, 500)) await db.upsert('user_progress', c, 'user_id,kind,key');
      for (const [kind, keys] of Object.entries(gone)) for (const c of chunks(keys, 100)) await db.delete('user_progress', { eq: { user_id: uid, kind }, in: { key: c } });
      if (cur.state !== synced.state) await db.upsert('user_state', [{ user_id: uid, data: JSON.parse(cur.state), updated_at: now() }], 'user_id');
      for (const [aid, v] of cur.subs) {
        const before = synced.subs.get(aid);
        if (before === v || (before && JSON.parse(before).done) || !(school && school.SC.asg[aid])) continue;
        const r = JSON.parse(v);
        try {
          await db.upsert('assignment_submissions', [{ assignment_id: aid, student_id: uid, answers: r.ans, done: r.done,
            submitted_at: r.done ? new Date(r.date || Date.now()).toISOString() : null, updated_at: now() }], 'assignment_id,student_id');
        } catch (e) { console.warn('Assignment answers not saved', aid, e.message); }
      }
      synced = cur;
      setStatus('saved');
    } catch (e) {
      console.error(e);
      setStatus('error');
      retry = setTimeout(flush, 10000);
    } finally {
      busy = false;
      if (again) { again = false; flush(); }
    }
  }
  st.flush = flush;
  addEventListener('pagehide', () => { if (st.status === 'pending') flush(); });
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && st.status === 'pending') flush(); });

  /* ---- account actions, used by the register / sign-in / reset pages ---- */
  const need = () => { if (!api) throw new Error("Accounts aren't available on this copy of the site yet."); };
  const friendly = (e) => {
    const m = String(e && e.message || e);
    if (/invalid login credentials/i.test(m)) return "That email and password don't match an account.";
    if (/already registered|already been registered|already exists/i.test(m)) return "There's already an account with that email. Sign in instead.";
    if (/email not confirmed/i.test(m)) return 'Confirm your email address first, using the link we sent you.';
    if (/email address .* is invalid/i.test(m)) return "We couldn't use that email address. Check it's typed correctly, or try another address.";
    if (/rate limit/i.test(m)) return 'Too many attempts. Wait a few minutes and try again.';
    if (/password should be|weak password/i.test(m)) return 'Choose a longer password (at least 8 characters).';
    return m;
  };
  const landed = () => {
    if (hasProgress(guestState())) ls.set(MERGE_KEY, '1');
    ls.set(AFTER_KEY, '1');
    history.replaceState(null, '', location.pathname + '#home');
    location.reload();
  };
  st.auth = {
    available: () => !!api,
    async register({ role, name, email, school: sch, code, password }) {
      need();
      try {
        const r = await api.auth.signUp(email, password, { role, full_name: name, school: sch });
        if (code) ls.set(JOIN_KEY, code);
        if (r.confirm) return { confirm: true };
        landed();
        return {};
      } catch (e) { throw new Error(friendly(e)); }
    },
    async login(email, password) {
      need();
      try { await api.auth.signIn(email, password); } catch (e) { throw new Error(friendly(e)); }
      landed();
    },
    /* Google: the page leaves for Google and comes back signed in; choices made on the form are kept until then */
    async google({ role, code } = {}) {
      need();
      if (!api.auth.signInWithGoogle) throw new Error('Google sign-in only works on the live site.');
      if (hasProgress(guestState())) ls.set(MERGE_KEY, '1');
      ls.set(AFTER_KEY, '1');
      if (role === 'teacher') ls.set(ROLE_KEY, 'teacher'); else ls.del(ROLE_KEY);
      if (code) ls.set(JOIN_KEY, code);
      try { await api.auth.signInWithGoogle(location.origin + '/'); } catch (e) { throw new Error(friendly(e)); }
    },
    async forgot(email) { need(); try { await api.auth.resetPassword(email); } catch (e) { throw new Error(friendly(e)); } },
    async setPassword(password) { need(); try { await api.auth.updatePassword(password); } catch (e) { throw new Error(friendly(e)); } },
    async updateProfile({ name, school: sch }) {
      need();
      await api.db.update('profiles', { full_name: name, school: sch }, { eq: { id: st.user.id } });
      st.user.name = name; st.user.school = sch;
      if (school && school.SC.users[st.user.id]) Object.assign(school.SC.users[st.user.id], { name, school: sch });
    },
  };
  st.signOut = async () => {
    try { await flush(); } catch (e) {}
    try { if (api) await api.auth.signOut(); } catch (e) {}
    history.replaceState(null, '', location.pathname + '#home');
    location.reload();
  };
  return st;
}
