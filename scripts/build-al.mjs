/* Build the A-Level course files from content-al/ into content/al/:
     content.js   the syllabus, lessons, vocabulary, quick checks, activities (replaces 01-content.js)
     pairs.js     tarsia puzzle pairs (replaces 06p-tarsia-pairs.js)
     theory.html  lesson text, as <template id="th-…"> blocks
     exams.json   original practice exam questions
   Then upload them from the Admin page ("Upload A-Level files").

   Sources: content-al/course.js (units, topics, sections), content-al/gen.js (activity generators),
   content-al/pairs-gen.js (puzzle generators), and one folder per unit (content-al/u1/ …) holding a .js
   and a .html file per section. Section .js files call:
     L(sectionId, [lessons])     lessons for a section
     B(bankId, [questions])      a question bank for "bank" activities
     P(lessonId, `a | b\n…`)     tarsia pairs for a lesson
   node scripts/build-al.mjs          build and check
   node scripts/build-al.mjs --check  check only */
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SRC = path.join(ROOT, 'content-al'), OUT = path.join(ROOT, 'content', 'al');
const read = (f) => fs.readFileSync(f, 'utf8');
const walk = (d, ext) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name), ext) : e.name.endsWith(ext) ? [path.join(d, e.name)] : []).sort() : [];
const units = fs.readdirSync(SRC).filter((d) => /^u\d$/.test(d)).sort().map((d) => path.join(SRC, d));

/* ---------- collect the section sources ---------- */
const LESSONS = {}, BANKS = {}, PAIRS = {}, ORDERS = {}, SORTS = {}, EXTRA = {}, problems = [];
const ctx = {
  L: (id, ls) => { if (LESSONS[id]) problems.push(`section ${id} defined twice`); LESSONS[id] = ls; },
  B: (id, qs) => { if (BANKS[id]) problems.push(`bank ${id} defined twice`); BANKS[id] = qs; },
  P: (id, txt) => { if (PAIRS[id]) problems.push(`pairs for ${id} defined twice`); PAIRS[id] = txt; },
  O: (id, steps, valid) => { if (ORDERS[id]) problems.push(`order ${id} defined twice`); ORDERS[id] = { steps, valid }; },
  S: (id, zones, per) => { if (SORTS[id]) problems.push(`sort ${id} defined twice`); SORTS[id] = { zones, per }; },
  A: (lid, acts) => { (EXTRA[lid] = EXTRA[lid] || []).push(...acts); },
  /* shortcuts for activity definitions */
  ord: (bank, desc, explain) => ({ gen: 'alorder', type: 'order', bank, desc: desc + ' · put in order', explain: explain + ' You score a mark for every step in the right place.' }),
  srt: (bank, desc, explain) => ({ gen: 'alsortg', type: 'sort', bank, desc: desc + ' · drag and drop', explain: explain + ' You score a mark for every item in the right box. Different items every try.' }),
  bnk: (bank, desc, explain) => ({ gen: 'bank', bank, desc: desc + ' · 8 questions', explain: explain + ' Every try picks a different set.' }),
  console,
};
vm.createContext(ctx);
for (const f of units.flatMap((u) => walk(u, '.js'))) {
  try { vm.runInContext(read(f), ctx, { filename: f }); } catch (e) { problems.push(`${path.relative(ROOT, f)}: ${e.message}`); }
}
/* extra activities added with A(lessonId, [...]): appended to the lesson, numbered after its own */
for (const [lid, acts] of Object.entries(EXTRA)) {
  const [sec] = lid.match(/^a\d+-\d+/) || [], slug = lid.slice((sec || '').length + 1), ls = LESSONS[sec], l = ls && ls.find((x) => x.slug === slug);
  if (!l) { problems.push(`A(): no lesson ${lid}`); continue; }
  l.acts = l.acts || [];
  for (const a of acts) { const n = l.acts.filter((x) => x.type !== 'py').length + 1, np = l.acts.filter((x) => x.type === 'py').length + 1;
    l.acts.push(Object.assign(a.type === 'py' ? { id: 'py' + np, title: 'Code it' } : { id: 'act' + n, title: 'Activity ' + n }, a)); }
}
let theory = units.flatMap((u) => walk(u, '.html')).map(read).join('\n');
/* step-through Python ("trace" widgets): run each example under Python's tracer now, and store the steps in the page */
{
  const { spawnSync } = await import('node:child_process');
  const unesc = (x) => x.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  const attr = (x) => x.replace(/&/g, '&amp;').replace(/'/g, '&#39;').replace(/</g, '&lt;');
  theory = theory.replace(/<div class="alw" data-w="trace"([^>]*)>\s*<pre>([\s\S]*?)<\/pre>\s*<\/div>/g, (all, at, body) => {
    const p = spawnSync('python3', ['-I', path.join(ROOT, 'scripts', 'al-trace.py')], { input: unesc(body), encoding: 'utf8', timeout: 10000 });
    if (p.status !== 0) { problems.push('trace example fails: ' + (p.stderr || '').trim().split('\n').pop() + ' in: ' + unesc(body).slice(0, 60)); return all; }
    return `<div class="alw" data-w="trace"${at} data-steps='${attr(p.stdout.trim())}'><pre>${body}</pre></div>`;
  });
}
const exams = { EXAMS: [], Q: [] };
for (const f of walk(path.join(SRC, 'exams'), '.json')) {
  const x = JSON.parse(read(f));
  exams.EXAMS.push(...(x.EXAMS || [])); exams.Q.push(...(x.Q || []));
}
/* exams/*.js: PAPER({id, s, p, v, code}) then Q(paperId, [questions]); question ids become paperId-n */
{
  const ex = { PAPER: (p) => exams.EXAMS.push(p), Q: (x, qs) => qs.forEach((q) => exams.Q.push({ id: `${x}-${String(q.n).replace(/[()]/g, '')}`, x, ...q })) };
  vm.createContext(ex);
  for (const f of walk(path.join(SRC, 'exams'), '.js')) { try { vm.runInContext(read(f), ex, { filename: f }); } catch (e) { problems.push(`${path.relative(ROOT, f)}: ${e.message}`); } }
  const seen = new Set();
  for (const q of exams.Q) {
    if (seen.has(q.id)) problems.push(`exam question ${q.id}: duplicate id`); seen.add(q.id);
    if (!exams.EXAMS.some((x) => x.id === q.x)) problems.push(`exam question ${q.id}: unknown paper ${q.x}`);
    if (!q.m || !q.q || !q.t) problems.push(`exam question ${q.id}: needs marks, a question and a type`);
    if (q.t === 'mc' && !(q.o && q.o[q.a] !== undefined)) problems.push(`exam question ${q.id}: mc needs options and a correct index`);
    if (q.t === 'ans' && !(q.acc || []).length) problems.push(`exam question ${q.id}: ans needs accepted answers`);
    if (q.t === 'self' && !(q.ms && (q.ms.pts || []).length)) problems.push(`exam question ${q.id}: self needs mark scheme points`);
    if (q.t === 'pick' && (!q.o || (q.a || []).length !== q.k)) problems.push(`exam question ${q.id}: pick needs k answers`);
    if (q.t === 'match' && (!q.L || !q.o || (q.a || []).length !== q.L.length)) problems.push(`exam question ${q.id}: match needs an answer per row`);
    if (q.t === 'cloze' && ((q.txt.match(/\{\d+\}/g) || []).length !== (q.a || []).length || q.a.some((a) => !q.w.includes(a)))) problems.push(`exam question ${q.id}: cloze gaps and answers don't line up`);
    if (q.t === 'set' && (!q.grp || q.grp.length < q.f)) problems.push(`exam question ${q.id}: set needs at least f answer groups`);
    if (q.t === 'tt' && q.a.length !== Math.pow(2, q.ins.length) * q.out.length) problems.push(`exam question ${q.id}: truth table answer is the wrong length`);
  }
  for (const x of exams.EXAMS) { const m = exams.Q.filter((q) => q.x === x.id).reduce((a, q) => a + q.m, 0); console.log(`  ${x.id} ${x.s}: ${m} marks`); }
}

/* ---------- content.js ---------- */
const genSrc = fs.existsSync(path.join(SRC, 'gen.js')) ? read(path.join(SRC, 'gen.js')) : 'const AL_GEN={};';
/* interactive theory widgets (only ever loaded in A-Level mode, from the course files) */
const widgetSrc = fs.existsSync(path.join(SRC, 'widgets.js')) ? read(path.join(SRC, 'widgets.js')) : '';
const content = `/* Generated by scripts/build-al.mjs from content-al/. Do not edit by hand. */
${read(path.join(SRC, 'course.js'))}
const LESSONS=${JSON.stringify(LESSONS)};
const AL_BANKS=${JSON.stringify(BANKS)};
const AL_ORDERS=${JSON.stringify(ORDERS)};
const AL_SORTS=${JSON.stringify(SORTS)};
${genSrc}
const TOPICS=[];CH.forEach(c=>c.topics.forEach(t=>{t.ch=c;TOPICS.push(t)}));
const ALL_LESSONS=[];
TOPICS.forEach(t=>{const ls=LESSONS[t.id];if(!ls)return;t.lessons=ls;ls.forEach((l,i)=>{l.id=t.id+"-"+l.slug;l.topic=t;l.n=i+1;ALL_LESSONS.push(l)})});
/* a section's key terms are its lessons' terms */
TOPICS.forEach(t=>{if(!t.v)t.v=[].concat(...(t.lessons||[]).map(l=>l.v||[]))});
${widgetSrc}
`;

/* ---------- pairs.js: the same helpers as the IGCSE pairs file, with this course's pairs ---------- */
const ig = read(path.join(ROOT, 'public/app/06p-tarsia-pairs.js'));
const helpers = ig.slice(ig.indexOf('const TZTXT={};'), ig.indexOf('TZGEN["1-1-binary"]'));
const pgen = fs.existsSync(path.join(SRC, 'pairs-gen.js')) ? read(path.join(SRC, 'pairs-gen.js')) : '';
const pairs = `/* Generated by scripts/build-al.mjs from content-al/. Do not edit by hand. */
${helpers}
const TZRAW=${JSON.stringify(PAIRS)};
for(const [k,v] of Object.entries(TZRAW))TZTXT[k]=v.trim().split("\\n").map(r=>r.split(" | ").map(s=>s.trim()));
${pgen}
const TZP=Object.assign({},TZTXT,TZGEN);
`;

/* ---------- checks ---------- */
const shuffle = (a) => a.slice().sort(() => Math.random() - 0.5);
const C = { window: {}, document: { getElementById: () => null, querySelector: () => null }, console, shuffle };
vm.createContext(C);
try { vm.runInContext(content + ';this.__T=TOPICS;this.__L=ALL_LESSONS;this.__G=AL_GEN;', C); } catch (e) { problems.push('content.js does not run: ' + e.message); }
try { vm.runInContext(pairs + ';this.__P=TZP;', C); } catch (e) { problems.push('pairs.js does not run: ' + e.message); }
const core = read(path.join(ROOT, 'public/app/02-core.js')) + read(path.join(ROOT, 'public/app/06-extra-activities.js'));
const igGens = new Set([...core.matchAll(/GEN\.(\w+)\s*=\s*function/g)].map((m) => m[1]).concat(['add', 'ovf', 'bank']));
const ids = new Set(), tmpl = new Set([...theory.matchAll(/<template id="th-([^"]+)">/g)].map((m) => m[1]));
const lessons = C.__L || [];
for (const l of lessons) {
  const where = `lesson ${l.id}`;
  if (ids.has(l.id)) problems.push(`${where}: duplicate id`); ids.add(l.id);
  if (!l.title) problems.push(`${where}: no title`);
  if (!(l.covers || []).length || l.covers.some((c) => !l.topic.obj[c - 1])) problems.push(`${where}: covers points the section doesn't have`);
  if (!(l.v || []).length) problems.push(`${where}: no key vocabulary`);
  if (!(l.q || []).length || l.q.length < 4) problems.push(`${where}: needs at least 4 quick check questions`);
  (l.q || []).forEach((q, i) => { if (q.length !== 5 || new Set(q.slice(1)).size !== 4) problems.push(`${where}: quick check ${i + 1} needs a question, the answer and 3 different wrong answers`); });
  if (!tmpl.has(l.id)) problems.push(`${where}: no theory (<template id="th-${l.id}">)`);
  if ((l.acts || []).length < 3) problems.push(`${where}: only ${(l.acts || []).length} activities (3 needed)`);
  for (const a of l.acts || []) {
    if (a.type === 'py') { if (!(a.tasks || []).length) problems.push(`${where} ${a.id}: Code it activity has no tasks`); (a.tasks || []).forEach((t, i) => { if (!(t.tests || []).length) problems.push(`${where} ${a.id} task ${i + 1}: no tests`); }); continue; }
    if (a.gen === 'alorder') { const o = ORDERS[a.bank]; if (!o) problems.push(`${where} ${a.id}: order ${a.bank} missing`); else if (o.steps.length < 4) problems.push(`${where} ${a.id}: order ${a.bank} needs 4+ steps`); if (a.type !== 'order') problems.push(`${where} ${a.id}: order activities need type "order"`); continue; }
    if (a.gen === 'alsortg') { const o = SORTS[a.bank]; if (!o) problems.push(`${where} ${a.id}: sort ${a.bank} missing`); else { const Z = Object.entries(o.zones); if (Z.length < 2 || Z.some(([, v]) => v.length < (o.per || 2))) problems.push(`${where} ${a.id}: sort ${a.bank} needs 2+ groups with enough items`); const all = Z.flatMap(([, v]) => v); if (new Set(all).size !== all.length) problems.push(`${where} ${a.id}: sort ${a.bank} has a duplicate item`); } if (a.type !== 'sort') problems.push(`${where} ${a.id}: sort activities need type "sort"`); continue; }
    if (a.gen === 'bank') { const b = BANKS[a.bank]; if (!b) problems.push(`${where} ${a.id}: bank ${a.bank} missing`); else if (b.length < 8) problems.push(`${where} ${a.id}: bank ${a.bank} has only ${b.length} questions (8+ needed)`); }
    else if (!igGens.has(a.gen) && !(C.__G && C.__G[a.gen])) problems.push(`${where} ${a.id}: unknown generator ${a.gen}`);
  }
  /* puzzle pairs: 18 or more, every half different */
  const P = C.__P && C.__P[l.id];
  if (!P) problems.push(`${where}: no tarsia pairs`);
  else for (let rep = 0; rep < (typeof P === 'function' ? 20 : 1); rep++) {
    const ps = typeof P === 'function' ? P(18) : P;
    if (ps.length < 18) { problems.push(`${where}: only ${ps.length} tarsia pairs (18 needed)`); break; }
    const seen = new Set(); let dup = null;
    for (const [a, b] of ps) for (const x of [a, b]) { if (!x) dup = '(empty)'; else if (seen.has(x)) dup = x; seen.add(x); }
    if (dup) { problems.push(`${where}: tarsia half "${dup}" appears twice`); break; }
    for (const [a, b] of ps) for (const x of [a, b]) if (x.length > 30) problems.push(`${where}: tarsia half too long (${x.length}): ${x}`);
  }
}
for (const id of tmpl) if (!ids.has(id)) problems.push(`theory for unknown lesson ${id}`);
{ /* every interactive widget named in the theory must exist in widgets.js */
  const known = new Set([...widgetSrc.matchAll(/ALW\.(\w+)\s*=\s*function/g)].map((m) => m[1]));
  for (const m of theory.matchAll(/class="alw" data-w="(\w+)"/g)) if (!known.has(m[1])) problems.push(`theory uses an unknown widget "${m[1]}"`);
}

/* Code it tasks: each model solution must pass its own tests, and the starter must not (run with python3) */
{
  const { spawnSync } = await import('node:child_process');
  const pySrc = read(path.join(ROOT, 'public/app/06s-python.js'));
  const harness = pySrc.slice(pySrc.indexOf('String.raw`') + 11, pySrc.indexOf('`;', pySrc.indexOf('String.raw`')));
  const run = (payload) => {
    const p = spawnSync('python3', ['-I', '-c', harness + '\nimport sys\nprint(_bob_run(sys.stdin.read()))\n'], { input: JSON.stringify(payload), encoding: 'utf8', timeout: 8000, cwd: fs.mkdtempSync(path.join(fs.realpathSync('/tmp'), 'alpy-')) });
    if (p.status !== 0) return { err: (p.stderr || 'python failed').trim().slice(-300), out: '', tests: [] };
    return JSON.parse(p.stdout.trim().split('\n').pop());
  };
  const norm = (s) => String(s).replace(/\s+/g, ' ').trim().toLowerCase();
  /* like the site (pyCheck): all assert tests share one run, in order; each input/output test gets its own run */
  const passes = (t, code) => {
    const asserts = t.tests.filter((x) => x.py).map((x) => x.py);
    if (asserts.length) { const r = run({ code, stdin: t.stdin || [], files: t.files, tests: asserts }); if (r.err || !(r.tests || []).every((x) => x.ok)) return false; }
    return t.tests.filter((x) => !x.py).every((x) => { if (!Array.isArray(x.stdin || [])) return false; const r = run({ code, stdin: x.stdin || [], files: t.files }); return !r.err && [].concat(x.expect).every((w) => norm(r.out).includes(norm(w))); });
  };
  /* every runnable example in the theory must run without an error (unless marked data-err) */
  const unesc = (s) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
  for (const m of theory.matchAll(/<template id="th-([^"]+)">([\s\S]*?)<\/template>/g)) for (const p of m[2].matchAll(/<pre class="pc py" data-run([^>]*)>([\s\S]*?)<\/pre>/g)) {
    const st = /data-stdin="([^"]*)"/.exec(p[1]);
    const r = run({ code: unesc(p[2]), stdin: st ? st[1].split('|') : [] });
    const wantErr = /data-err\b/.test(p[1]);   /* data-err marks an example that is meant to fail */
    if (r.err && !wantErr) problems.push(`theory ${m[1]}: runnable example fails: ${r.err}`);
    if (!r.err && wantErr) problems.push(`theory ${m[1]}: example marked data-err ran without an error`);
  }
  for (const l of lessons) for (const a of l.acts || []) if (a.type === 'py') a.tasks.forEach((t, i) => {
    const where = `lesson ${l.id} ${a.id} task ${i + 1}`;
    if ((t.tests || []).some((x) => x.stdin !== undefined && !Array.isArray(x.stdin))) problems.push(`${where}: stdin must be a list of lines`);
    if (!t.solution) problems.push(`${where}: no model solution`);
    else if (!passes(t, t.solution)) problems.push(`${where}: the model solution fails its tests`);
    if (t.starter && passes(t, t.starter)) problems.push(`${where}: the starter code already passes the tests`);
  });
}
for (const [id, b] of Object.entries(BANKS)) b.forEach((q, i) => {
  if (q.t === 'mc' && (!q.a || !(q.w || []).length || (q.w || []).includes(q.a))) problems.push(`bank ${id} question ${i + 1}: needs an answer and different wrong answers`);
  if (q.t === 'blank' && (!(q.a || []).length || !q.q.includes('___'))) problems.push(`bank ${id} question ${i + 1}: blank needs ___ and answers`);
});
for (const q of exams.Q) if (!q.l || q.l.some((l) => !ids.has(l))) problems.push(`exam question ${q.id}: links to a lesson that doesn't exist`);

const counts = `${(C.__T || []).length} sections, ${lessons.length} lessons, ${Object.keys(BANKS).length} banks, ${exams.Q.length} exam questions`;
if (problems.length) { console.error(problems.map((p) => '  ✗ ' + p).join('\n')); console.error(`\n${problems.length} problem(s). ${counts}`); process.exit(1); }
if (!process.argv.includes('--check')) {
  fs.mkdirSync(OUT, { recursive: true });
  fs.writeFileSync(path.join(OUT, 'content.js'), content);
  fs.writeFileSync(path.join(OUT, 'pairs.js'), pairs);
  fs.writeFileSync(path.join(OUT, 'theory.html'), theory);
  fs.writeFileSync(path.join(OUT, 'exams.json'), JSON.stringify(exams));
}
console.log(`OK: ${counts}.${process.argv.includes('--check') ? '' : ' Written to content/al/.'}`);
