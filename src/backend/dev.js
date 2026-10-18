/* Local test backend: the same interface as supabase.js, talking to tests/devserver.py,
   which runs each request against a local Postgres as the signed-in user, so the real
   row level security rules apply. Only used when no Supabase settings are present and
   the dev server answers. Never used on the live site. */
export async function devBackend() {
  // Vite's dev server answers any unknown path with index.html, so check for the real reply
  const r = await fetch('/__dev/ping').catch(() => null);
  const j = r && r.ok && /json/.test(r.headers.get('content-type') || '') ? await r.json().catch(() => null) : null;
  if (!j || j.ok !== true) return null;
  const KEY = 'bob-dev-session';
  let me = null;
  try { me = JSON.parse(localStorage.getItem(KEY)); } catch (e) {}
  const call = async (path, body) => {
    const res = await fetch('/__dev/' + path, {
      method: 'POST', headers: { 'content-type': 'application/json', 'x-user': me ? me.id : '' }, body: JSON.stringify(body),
    });
    const j = await res.json().catch(() => ({ error: 'The local test server did not answer (' + res.status + ').' }));
    if (!res.ok) throw new Error(j.error || 'Request failed');
    return j.data;
  };
  const db = {
    select: (table, o = {}) => call('db', { op: 'select', table, ...o }),
    insert: (table, rows) => call('db', { op: 'insert', table, rows: [].concat(rows) }),
    upsert: (table, rows, onConflict) => call('db', { op: 'upsert', table, rows: [].concat(rows), onConflict }),
    update: (table, values, o) => call('db', { op: 'update', table, values, ...o }),
    delete: (table, o) => call('db', { op: 'delete', table, ...o }),
    rpc: (fn, args = {}) => call('rpc', { fn, args }),
  };
  const set = (u) => { me = u; try { u ? localStorage.setItem(KEY, JSON.stringify(u)) : localStorage.removeItem(KEY); } catch (e) {} };
  const auth = {
    async session() { return me; },
    async signUp(email, password, meta) { set(await call('signup', { email, password, meta })); return { confirm: false }; },
    async signIn(email, password) { set(await call('signin', { email, password })); return me; },
    async signOut() { set(null); },
    async signInWithGoogle() { throw new Error('Google sign-in only works on the live site.'); },
    async resetPassword() {},
    async resendConfirm() {},
    async verifyLink(tokenHash) { if (tokenHash !== 'dev-good') throw new Error('Email link is invalid or has expired'); },
    async updatePassword(password) { await call('password', { password }); },
    onChange() {},
  };
  const fn = async () => { throw new Error('Payments only work on the live site.'); };
  return { name: 'dev', db, auth, fn };
}
