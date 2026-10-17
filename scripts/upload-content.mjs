/* Upload the lesson content and past paper questions to the database.
   Run it whenever content/theory.html or content/exams.json changes:

     npm run upload-content

   It needs the project's secret key, which only lives on your computer (never in the site):
   Supabase → Project Settings → API Keys → Secret keys. Put it in .env.local as
     SUPABASE_SECRET_KEY=sb_secret_…
   (.env.local is never committed). The project address comes from VITE_SUPABASE_URL.

   Which content is free: the first lesson of each section (lesson order comes from
   public/app/01-content.js), and the past paper questions belonging to those lessons.

   node scripts/upload-content.mjs --json   prints the rows instead (used by the local tests). */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

export function contentRows() {
  // lesson order and numbering, exactly as the site works it out
  const ctx = { window: {}, document: { getElementById: () => null }, console };
  vm.createContext(ctx);
  vm.runInContext(read('public/app/01-content.js') + ';this.__L = ALL_LESSONS.map((l) => [l.id, l.n]);', ctx);
  const order = new Map(ctx.__L.map(([id, n], i) => [id, { i, free: n === 1 }]));

  const theory = [];
  const re = /<template id="th-([^"]+)">([\s\S]*?)<\/template>/g;
  for (const [, id, html] of read('content/theory.html').matchAll(re)) {
    const o = order.get(id);
    if (!o) throw new Error(`theory.html has a lesson the site doesn't know: ${id}`);
    theory.push({ id, ord: o.i, free: o.free, html });
  }
  const ex = JSON.parse(read('content/exams.json'));
  const papers = ex.EXAMS.map((data, ord) => ({ id: data.id, ord, data }));
  const questions = ex.Q.map((data, ord) => ({ id: data.id, ord, free: (data.l || []).some((l) => order.get(l)?.free), data }));
  return { theory, papers, questions };
}

function loadEnv() {
  for (const f of ['.env.local', '.env']) {
    const p = path.join(ROOT, f);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
      if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^(['"])(.*)\1$/, '$2');
    }
  }
}

async function upload() {
  loadEnv();
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.error('Add SUPABASE_SECRET_KEY=sb_secret_… to .env.local (Supabase → Project Settings → API Keys → Secret keys).');
    process.exit(1);
  }
  const { createClient } = await import('@supabase/supabase-js');
  const sb = createClient(url, key, { auth: { persistSession: false } });
  const { theory, papers, questions } = contentRows();
  const put = async (table, rows, size) => {
    for (let i = 0; i < rows.length; i += size) {
      const { error } = await sb.from(table).upsert(rows.slice(i, i + size), { onConflict: 'id' });
      if (error) throw new Error(`${table}: ${error.message}`);
    }
    // remove anything that's no longer in the files
    const { data, error } = await sb.from(table).select('id');
    if (error) throw new Error(`${table}: ${error.message}`);
    const keep = new Set(rows.map((r) => r.id));
    const gone = data.map((r) => r.id).filter((id) => !keep.has(id));
    for (let i = 0; i < gone.length; i += 200) {
      const { error: e } = await sb.from(table).delete().in('id', gone.slice(i, i + 200));
      if (e) throw new Error(`${table}: ${e.message}`);
    }
  };
  await put('lesson_theory', theory, 20);
  await put('exam_papers', papers, 200);
  await put('exam_questions', questions, 200);
  // a new version makes every browser fetch the content again
  const { error } = await sb.from('site_settings').update({ content_version: new Date().toISOString(), updated_at: new Date().toISOString() }).eq('id', true);
  if (error) throw new Error(`site_settings: ${error.message}`);
  const free = theory.filter((t) => t.free).length;
  console.log(`Uploaded ${theory.length} lessons (${free} free), ${papers.length} papers and ${questions.length} questions (${questions.filter((q) => q.free).length} free).`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (process.argv.includes('--json')) process.stdout.write(JSON.stringify(contentRows()));
  else upload().catch((e) => { console.error('Upload failed:', e.message); process.exit(1); });
}
