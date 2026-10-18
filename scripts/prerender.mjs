/* After `vite build`: give every public page its own address and a real HTML page, so search
   engines can find and index it. The site itself still runs from index.html; each generated
   page is index.html with its own title, description, social preview, structured data and a
   readable outline of the page (headings, syllabus points, key vocabulary, links) that the app
   replaces when it starts. Paid lesson text is never included: only the public outline.

   Addresses (see pathToRoute in src/main.js, which maps them back to the app's pages):
     /paper-1  /paper-2  /topic/1-1  /lesson/1-1-binary  /exam-questions  /flash-cards  /pricing  /dashboard-preview

   Also writes sitemap.xml, robots.txt and 404.html. If anything goes wrong it prints a warning
   and leaves the normal build untouched, so it can never stop the site from deploying.

   node scripts/prerender.mjs [distDir]    (the site address comes from SITE_URL, or Netlify's URL) */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const NAME = 'Bits of Bytes';
const COURSE = 'Cambridge IGCSE Computer Science (0478)';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const clip = (s, n = 158) => { s = String(s).replace(/\s+/g, ' ').trim(); return s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n - 1)).replace(/[\s,;:.(–-]+$/, '') + '…'; };
/* the main sentence, plus the extra one only if both fit */
const fit = (main, extra, n = 158) => (main + ' ' + extra).length <= n ? main + ' ' + extra : clip(main, n);
const list = (xs) => xs.length < 2 ? xs.join('') : xs.slice(0, -1).join(', ') + ' and ' + xs[xs.length - 1];

export function course() {
  const src = fs.readFileSync(path.join(ROOT, 'public/app/01-content.js'), 'utf8');
  const load = (code) => { const ctx = { window: {}, document: { getElementById: () => null, addEventListener() {} }, addEventListener() {}, console }; vm.createContext(ctx); vm.runInContext(code + ';this.D={TOPICS,ALL_LESSONS,CH,PAPERS}', ctx); return ctx.D; };
  let D = load(src);
  /* 06-extra-activities.js adds more activities to the lessons. It expects the rest of the site to be
     there, so anything it asks for that isn't is stood in for by a harmless stub; only the counts matter. */
  try {
    const x = fs.readFileSync(path.join(ROOT, 'public/app/06-extra-activities.js'), 'utf8');
    const stub = 'const __s=new Proxy(function(){},{get:(t,k)=>k===Symbol.toPrimitive?()=>"":k==="length"?0:__s,apply:()=>__s,construct:()=>__s});';
    const missing = new Set();
    for (let n = 0; n < 40; n++) {
      try { D = load(src + ';' + stub + [...missing].map((m) => `var ${m}=__s;`).join('') + x); break; }
      catch (e) { const m = /^(\w+) is not defined/.exec(e.message); if (!m || missing.has(m[1])) break; missing.add(m[1]); }
    }
  } catch (e) { /* counts only */ }
  let exams = { EXAMS: [], Q: [] };
  try { exams = JSON.parse(fs.readFileSync(path.join(ROOT, 'content/exams.json'), 'utf8')); } catch (e) { /* counts only */ }
  return { ...D, exams };
}

export function pages(D, site) {
  const { TOPICS, ALL_LESSONS, CH, PAPERS, exams } = D;
  const url = (p) => site + p;
  const years = [...new Set(exams.EXAMS.map((x) => 2000 + +String(x.id).slice(0, 2)))].sort();
  const nAct = ALL_LESSONS.reduce((a, l) => a + (l.acts || []).length, 0);
  const org = { '@type': 'Organization', name: NAME, url: site };
  const courseLd = { '@context': 'https://schema.org', '@type': 'Course', name: COURSE, description: `Lessons, key vocabulary, quizzes, interactive activities and ${exams.Q.length || 'over 1,000'} past paper questions covering the whole Cambridge IGCSE Computer Science (0478) syllabus, Paper 1 and Paper 2.`, provider: org, url: site + '/', educationalLevel: 'IGCSE', inLanguage: 'en-GB', about: ['Computer science', 'Programming', 'Algorithms', 'Data representation', 'Networks', 'Cyber security', 'Databases', 'Boolean logic'] };
  const crumbs = (xs) => ({ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: xs.map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: url(p) })) });
  const crumbHtml = (xs) => `<nav class="crumbs" aria-label="Breadcrumb">${xs.map(([n, p], i) => i < xs.length - 1 ? `<a href="${p}">${esc(n)}</a><span>/</span>` : `<span>${esc(n)}</span>`).join('')}</nav>`;
  const topicPath = (t) => `/topic/${t.id}`, lessonPath = (l) => `/lesson/${l.id}`;
  const out = [];

  /* home */
  out.push({
    path: '/', title: `${NAME} · Cambridge IGCSE Computer Science 0478 lessons, quizzes and past papers`,
    desc: `Full coverage of Cambridge IGCSE Computer Science (0478): ${ALL_LESSONS.length} lessons, quizzes, ${nAct} activities and ${exams.Q.length} past paper questions, with student and teacher dashboards.`,
    ld: [courseLd, { '@context': 'https://schema.org', '@type': 'WebSite', name: NAME, url: site + '/' }],
    body: `<section class="hero"><div><div class="eyebrow">Cambridge IGCSE Computer Science · 0478</div><h1>Every syllabus point, one byte at a time.</h1>
      <p class="lead">Full coverage of the Cambridge IGCSE Computer Science (0478) syllabus for exams in 2026, 2027 and 2028: ${ALL_LESSONS.length} short lessons, key vocabulary, quizzes, ${nAct} interactive activities and ${exams.Q.length} past paper questions${years.length ? ` from ${exams.EXAMS.length} papers (${years[0]}–${years[years.length - 1]})` : ''}, with dashboards for students and teachers.</p></div></section>
      ${[1, 2].map((p) => `<section><h2><a href="/paper-${p}">${PAPERS[p].code}: ${esc(PAPERS[p].title)}</a></h2><p>${esc(PAPERS[p].blurb)}</p>
        <ul>${TOPICS.filter((t) => t.ch.paper === p).map((t) => `<li><a href="${topicPath(t)}">${t.code} ${esc(t.title)}</a></li>`).join('')}</ul></section>`).join('')}
      <section><h2>For students</h2><p>Short lessons with worked examples, quick checks, key vocabulary tests, interactive activities, flash cards and real past paper questions with mark schemes, plus a dashboard that shows which topics are secure.</p>
      <h2>For teachers</h2><p>Class licences, homework from lessons or past paper questions, progress tracking for every student, every answer to review, and insights into the questions your class finds hardest.</p></section>`,
  });

  /* papers */
  for (const p of [1, 2]) {
    const P = PAPERS[p], ts = TOPICS.filter((t) => t.ch.paper === p);
    out.push({
      path: `/paper-${p}`, title: `${P.code}: ${P.title} · IGCSE Computer Science 0478 · ${NAME}`,
      desc: clip(`${COURSE} ${P.code}, ${P.title}: ${P.blurb} Lessons, vocabulary and past paper questions for every section.`),
      ld: [courseLd, crumbs([['Home', '/'], [P.code, `/paper-${p}`]])],
      body: `${crumbHtml([['Home', '/'], [P.code, '']])}<div class="phead"><div class="eyebrow">${P.code} · ${esc(P.facts.slice(0, 3).join(' · '))}</div><h1>${esc(P.title)}</h1><p>${esc(P.blurb)}</p></div>
        ${CH.filter((c) => c.paper === p).map((c) => `<section><h2>${c.n}. ${esc(c.title)}</h2><ul>${c.topics.map((t) => `<li><a href="${topicPath(t)}">${t.code} ${esc(t.title)}</a>${t.lessons ? `: ${t.lessons.map((l) => `<a href="${lessonPath(l)}">${esc(l.title)}</a>`).join(', ')}` : ''}</li>`).join('')}</ul></section>`).join('')}`,
    });
  }

  /* syllabus sections */
  for (const t of TOPICS) {
    const P = PAPERS[t.ch.paper];
    out.push({
      path: topicPath(t), title: `${t.code} ${t.title} · IGCSE Computer Science 0478 · ${NAME}`,
      desc: fit(`${t.code} ${t.title} for ${COURSE}: ${list(t.obj.map((o) => o.charAt(0).toLowerCase() + o.slice(1)))}.`, 'Lessons, key vocabulary and past paper questions.'),
      ld: [{ '@context': 'https://schema.org', '@type': 'LearningResource', name: `${t.code} ${t.title}`, learningResourceType: 'Lesson', educationalLevel: 'IGCSE', inLanguage: 'en-GB', isPartOf: courseLd, teaches: t.obj,
        educationalAlignment: { '@type': 'AlignmentObject', alignmentType: 'teaches', educationalFramework: COURSE, targetName: `${t.code} ${t.title}` } },
        crumbs([['Home', '/'], [P.code, `/paper-${t.ch.paper}`], [`${t.code} ${t.title}`, topicPath(t)]])],
      body: `${crumbHtml([['Home', '/'], [P.code, `/paper-${t.ch.paper}`], [`${t.code} ${t.title}`, '']])}<div class="phead"><div class="eyebrow">Unit ${t.ch.n} · ${esc(t.ch.title)}</div><h1>${t.code} ${esc(t.title)}</h1></div>
        <section><h2>By the end of this section you should be able to</h2><ul>${t.obj.map((o, i) => `<li>${t.code}.${i + 1} ${esc(o)}</li>`).join('')}</ul></section>
        ${t.lessons ? `<section><h2>Lessons</h2><ol>${t.lessons.map((l) => `<li><a href="${lessonPath(l)}">${esc(l.title)}</a></li>`).join('')}</ol></section>` : ''}
        ${t.v && t.v.length ? `<section><h2>Key vocabulary</h2><dl>${t.v.map(([k, d]) => `<dt>${esc(k)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></section>` : ''}`,
    });
  }

  /* lessons: the outline, vocabulary and activities, never the paid lesson text */
  for (const l of ALL_LESSONS) {
    const t = l.topic, P = PAPERS[t.ch.paper], ls = t.lessons, prev = ls[l.n - 2], next = ls[l.n];
    const covers = l.covers.map((c) => t.obj[c - 1]).filter(Boolean);
    out.push({
      path: lessonPath(l), title: `${l.title} · ${t.code} ${t.title} · IGCSE Computer Science 0478`,
      desc: fit(`Learn ${l.title.charAt(0).toLowerCase() + l.title.slice(1)} for ${COURSE}, syllabus ${l.covers.map((c) => `${t.code}.${c}`).join(' and ')}: ${list(covers.map((o) => o.charAt(0).toLowerCase() + o.slice(1)))}.`, `With a quick check, key vocabulary${(l.acts || []).length ? ' and activities' : ''}.`),
      ld: [{ '@context': 'https://schema.org', '@type': 'LearningResource', name: l.title, learningResourceType: 'Lesson', educationalLevel: 'IGCSE', inLanguage: 'en-GB', isPartOf: courseLd, teaches: covers,
        educationalAlignment: l.covers.map((c) => ({ '@type': 'AlignmentObject', alignmentType: 'teaches', educationalFramework: COURSE, targetName: `${t.code}.${c} ${t.obj[c - 1] || ''}`.trim() })) },
        crumbs([['Home', '/'], [P.code, `/paper-${t.ch.paper}`], [`${t.code} ${t.title}`, topicPath(t)], [l.title, lessonPath(l)]])],
      body: `${crumbHtml([['Home', '/'], [P.code, `/paper-${t.ch.paper}`], [`${t.code} ${t.title}`, topicPath(t)], [l.title, '']])}
        <div class="lhead"><div class="eyebrow">${t.code} · Lesson ${l.n} of ${ls.length}</div><h1>${esc(l.title)}</h1><div class="covers">${l.covers.map((c) => `<span>Syllabus ${t.code}.${c}</span>`).join('')}</div></div>
        <section><h2>What this lesson covers</h2><ul>${covers.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></section>
        ${l.v && l.v.length ? `<section><h2>Key vocabulary</h2><dl>${l.v.map(([k, d]) => `<dt>${esc(k)}</dt><dd>${esc(d)}</dd>`).join('')}</dl></section>` : ''}
        <section><h2>Check your learning</h2><ul><li>Quick check${l.q ? `: ${l.q.length} questions` : ''}</li>${l.v ? `<li>Key vocabulary test: ${l.v.length} terms</li>` : ''}${(l.acts || []).map((a) => `<li>${esc(a.title)}: ${esc(a.desc || '')}</li>`).join('')}</ul></section>
        <nav class="pager">${prev ? `<a href="${lessonPath(prev)}">← ${esc(prev.title)}</a>` : `<a href="${topicPath(t)}">← ${t.code} ${esc(t.title)}</a>`}${next ? `<a href="${lessonPath(next)}">${esc(next.title)} →</a>` : ''}</nav>`,
    });
  }

  /* other public pages */
  out.push({ path: '/exam-questions', title: `IGCSE Computer Science 0478 past paper questions by topic · ${NAME}`,
    desc: clip(`Practise ${exams.Q.length} Cambridge IGCSE Computer Science (0478) past paper questions${years.length ? ` from ${years[0]} to ${years[years.length - 1]}` : ''}, chosen by topic, with mark schemes and instant marking.`),
    ld: [courseLd], body: `<div class="phead"><div class="eyebrow">Exam questions</div><h1>Past paper questions by topic</h1><p>${exams.Q.length} questions from ${exams.EXAMS.length} Cambridge IGCSE Computer Science (0478) papers, each mapped to the lessons it tests, with mark schemes. Choose sections and years, answer, and see your marks.</p></div>` });
  out.push({ path: '/flash-cards', title: `IGCSE Computer Science 0478 flash cards · ${NAME}`,
    desc: 'Flash cards for every Cambridge IGCSE Computer Science (0478) lesson, with spaced practice, and space to add your own cards.',
    ld: [courseLd], body: `<div class="phead"><div class="eyebrow">Flash cards</div><h1>Flash cards for every lesson</h1><p>Key terms and definitions from all ${ALL_LESSONS.length} lessons of the Cambridge IGCSE Computer Science (0478) course, with spaced practice. Add your own cards to any deck.</p></div>` });
  out.push({ path: '/pricing', title: `Plans and pricing · ${NAME}`,
    desc: 'Start free with the first lesson of every section. Students can subscribe monthly or yearly; schools buy yearly class licences.',
    ld: [courseLd], body: `<div class="phead"><div class="eyebrow">Pricing</div><h1>Plans and pricing</h1><p>The first lesson of every section is free. Students can subscribe monthly or yearly for the full course; teachers buy yearly licences for their classes, by card or invoice.</p></div>` });
  out.push({ path: '/contact', title: `Contact us · ${NAME}`,
    desc: 'Questions about Bits of Bytes, school licences, invoices or your account? Send us a message or email info@bitsofbytes.ac.',
    ld: [{ '@context': 'https://schema.org', '@type': 'ContactPage', name: 'Contact Bits of Bytes', url: url('/contact'), mainEntity: { ...org, email: 'info@bitsofbytes.ac' } }],
    body: `<div class="phead"><div class="eyebrow">Contact</div><h1>Contact us</h1><p>Questions about the course, school licences and invoices, or your account? Email <a href="mailto:info@bitsofbytes.ac">info@bitsofbytes.ac</a> or use the form on this page.</p></div>` });
  out.push({ path: '/dashboard-preview', title: `Student and teacher dashboards · ${NAME}`,
    desc: 'See what Bits of Bytes looks like with an account: an example student dashboard and to-do list, and a teacher view with class tracking, assignments and insights.',
    ld: [courseLd], body: `<div class="phead"><div class="eyebrow">Preview</div><h1>Student and teacher dashboards</h1><p>An example student account with progress, a syllabus map and a homework to-do list, and an example teacher account with classes, progress tracking, assignment insights and every student's answers.</p></div>` });
  return out;
}

export function render(tpl, page, site) {
  const canon = site + page.path, img = site + '/og.png';
  const head = `<link rel="canonical" href="${esc(canon)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${NAME}"><meta property="og:url" content="${esc(canon)}">
<meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.desc)}">
<meta property="og:image" content="${img}"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:locale" content="en_GB">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.desc)}"><meta name="twitter:image" content="${img}">
${(page.ld || []).map((x) => `<script type="application/ld+json">${JSON.stringify(x).replace(/</g, '\\u003c')}</script>`).join('\n')}`;
  let html = tpl.replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(page.title)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(page.desc)}">`)
    .replace(/<!-- seo -->[\s\S]*?<!-- \/seo -->/, '')
    .replace('</head>', `<!-- seo -->\n${head}\n<!-- /seo -->\n</head>`);
  html = html.replace(/<div class="wrap" id="app">[\s\S]*?<\/div><\/main>/, `<div class="wrap" id="app">${page.body}</div></main>`);
  return html;
}

export function run(dist = path.join(ROOT, 'dist'), site = process.env.SITE_URL || process.env.URL || 'https://bitsofbytes.netlify.app') {
  site = site.replace(/\/$/, '');
  const tplPath = path.join(dist, 'index.html');
  const tpl = fs.readFileSync(tplPath, 'utf8');
  const D = course(), list = pages(D, site);
  for (const p of list) {
    const file = p.path === '/' ? tplPath : path.join(dist, p.path, 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, render(tpl, p, site));
  }
  const today = new Date().toISOString().slice(0, 10);
  const pri = (p) => (p === '/' ? '1.0' : /^\/paper-/.test(p) ? '0.9' : /^\/topic\//.test(p) ? '0.8' : /^\/lesson\//.test(p) ? '0.7' : '0.5');
  fs.writeFileSync(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${list.map((p) => `  <url><loc>${site}${p.path}</loc><lastmod>${today}</lastmod><priority>${pri(p.path)}</priority></url>`).join('\n')}\n</urlset>\n`);
  fs.writeFileSync(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site}/sitemap.xml\n`);
  const nf = tpl.replace(/<title>[\s\S]*?<\/title>/, `<title>Page not found · ${NAME}</title>`).replace('</head>', '<meta name="robots" content="noindex">\n</head>');
  fs.writeFileSync(path.join(dist, '404.html'), nf);
  return list.length;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { console.log(`Search pages: wrote ${run(process.argv[2] ? path.resolve(process.argv[2]) : undefined)} pages, sitemap.xml and robots.txt.`); }
  catch (e) { console.warn('Search pages were not generated (the site still works):', e.message); }
}
