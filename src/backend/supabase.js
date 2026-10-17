/* The Supabase backend. Everything the site needs from the server goes through the small
   interface below (db.* and auth.*), so the rest of the code never touches supabase-js
   directly and can be tested against a local database (see dev.js). */
export async function supabaseBackend(url, key) {
  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(url, key, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: 'pkce' },
  });
  const ok = ({ data, error }) => { if (error) throw new Error(error.message); return data; };
  const filter = (x, o = {}) => {
    for (const [k, v] of Object.entries(o.eq || {})) x = x.eq(k, v);
    for (const [k, v] of Object.entries(o.in || {})) x = x.in(k, v);
    for (const [k, d] of o.order || []) x = x.order(k, { ascending: d !== 'desc' });
    return x;
  };
  const PAGE = 1000; // the API returns at most 1000 rows per request

  const db = {
    async select(table, o = {}) {
      const out = [];
      for (let from = 0; ; from += PAGE) {
        const rows = ok(await filter(sb.from(table).select(o.select || '*'), o).range(from, from + PAGE - 1));
        out.push(...rows);
        if (rows.length < PAGE) return out;
      }
    },
    async insert(table, rows) { return ok(await sb.from(table).insert(rows).select()); },
    async upsert(table, rows, onConflict) { ok(await sb.from(table).upsert(rows, { onConflict })); },
    async update(table, values, o) { ok(await filter(sb.from(table).update(values), o)); },
    async delete(table, o) { ok(await filter(sb.from(table).delete(), o)); },
    async rpc(fn, args = {}) { return ok(await sb.rpc(fn, args)); },
  };
  /* call one of our edge functions (supabase/functions/*) */
  async function fn(name, body) {
    const { data, error } = await sb.functions.invoke(name, { body });
    if (error) {
      let m = error.message;
      try { const j = await error.context.json(); if (j && j.error) m = j.error; } catch (e) {}
      throw new Error(m);
    }
    return data;
  }

  const who = (s) => (s && s.user ? { id: s.user.id, email: s.user.email } : null);
  const auth = {
    async session() { return who(ok(await sb.auth.getSession()).session); },
    async signUp(email, password, meta) {
      const d = ok(await sb.auth.signUp({ email, password, options: { data: meta, emailRedirectTo: location.origin + '/' } }));
      return { confirm: !d.session };
    },
    async signIn(email, password) { return who(ok(await sb.auth.signInWithPassword({ email, password })).session); },
    async signOut() { await sb.auth.signOut(); },
    async signInWithGoogle(redirectTo) { ok(await sb.auth.signInWithOAuth({ provider: 'google', options: { redirectTo } })); },
    async resetPassword(email) { ok(await sb.auth.resetPasswordForEmail(email, { redirectTo: location.origin + '/#reset' })); },
    async updatePassword(password) { ok(await sb.auth.updateUser({ password })); },
    onChange(cb) { sb.auth.onAuthStateChange((event, s) => cb(event, who(s))); },
    /* sign-in methods switched on in Supabase (Authentication → Sign In / Providers) */
    async providers() {
      try {
        const r = await fetch(url.replace(/\/$/, '') + '/auth/v1/settings', { headers: { apikey: key } });
        return r.ok ? ((await r.json()).external || {}) : {};
      } catch (e) { return {}; }
    },
  };
  return { name: 'supabase', db, auth, fn };
}
