/* Lesson content and past paper questions come from the database (course_content), which sends
   each person only what they can use. A copy is kept in the browser's cache and reused while the
   version still matches, so the full content is only downloaded when it changes. */
const CACHE = 'bob-content';
const KEY = '/__bob-content';

async function cached() {
  try { const r = await (await caches.open(CACHE)).match(KEY); return r ? await r.json() : null; } catch (e) { return null; }
}
async function keep(c) {
  try { await (await caches.open(CACHE)).put(KEY, new Response(JSON.stringify(c), { headers: { 'content-type': 'application/json' } })); } catch (e) {}
}
export async function forgetContent() {
  try { await caches.delete(CACHE); } catch (e) {}
}

export function createContent(api) {
  const C = { payments: false, full: true, locked: 0, theory: {}, exams: [], q: [] };
  C.load = async () => {
    if (!api) throw new Error('Bits of Bytes could not reach its database.');
    const old = await cached();
    const r = await api.db.rpc('course_content', { have: old && old.ver ? old.ver : null });
    const c = r && r.same && old ? { ...old, payments: r.payments, full: r.full } : r;
    if (!c || !c.theory) throw new Error('The course content did not load.');
    if (!r.same) keep(c);
    Object.assign(C, { payments: !!c.payments, full: !!c.full, locked: c.locked || 0, ver: c.ver, theory: c.theory, exams: c.exams || [], q: c.q || [] });
    return C;
  };
  /* put the lessons into the page, and the questions where the site's scripts read them */
  C.apply = () => {
    const box = document.getElementById('content');
    box.textContent = '';
    for (const [id, html] of Object.entries(C.theory)) {
      const t = document.createElement('template');
      t.id = 'th-' + id; t.innerHTML = html; box.appendChild(t);
    }
    // the site's scripts keep references to these arrays, so refill them rather than replace them
    const X = window.__EXDATA || (window.__EXDATA = { EXAMS: [], Q: [] });
    X.EXAMS.splice(0, X.EXAMS.length, ...C.exams);
    X.Q.splice(0, X.Q.length, ...C.q);
  };
  return C;
}
