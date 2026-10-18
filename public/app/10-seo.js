/* ================= page titles, descriptions and canonical addresses; Google Analytics ================= */

/* each page's own address (the ones scripts/prerender.mjs builds for search engines) */
function seoPath(r){let m;
  if(r==="home")return "/";
  if(/^paper-[12]$/.test(r))return "/"+r;
  if((m=r.match(/^t-(.+)$/))&&TOPICS.some(t=>t.id===m[1]))return "/topic/"+m[1];
  if((m=r.match(/^l-(.+)$/))&&ALL_LESSONS.some(l=>l.id===m[1]))return "/lesson/"+m[1];
  return {exams:"/exam-questions",flashcards:"/flash-cards",pricing:"/pricing",dashboard:"/dashboard-preview"}[r]||null}
const SEO_COURSE="Cambridge IGCSE Computer Science (0478)";
function seoMeta(r){const B="Bits of Bytes",lc=s=>s.charAt(0).toLowerCase()+s.slice(1);let t,l,m;
  if(r==="home")return {title:`${B} · Cambridge IGCSE Computer Science 0478 lessons, quizzes and past papers`,desc:`Full coverage of the ${SEO_COURSE} syllabus: short lessons, key vocabulary, quizzes, activities and past paper questions, with dashboards for students and teachers.`};
  if(/^paper-[12]$/.test(r)){const P=PAPERS[+r.slice(-1)];return {title:`${P.code}: ${P.title} · IGCSE Computer Science 0478 · ${B}`,desc:`${SEO_COURSE} ${P.code}, ${P.title}: ${P.blurb}`}}
  if((m=r.match(/^t-(.+)$/))&&(t=TOPICS.find(x=>x.id===m[1])))return {title:`${t.code} ${t.title} · IGCSE Computer Science 0478 · ${B}`,desc:`${t.code} ${t.title} for ${SEO_COURSE}: ${t.obj.map(lc).join("; ")}.`};
  if((m=r.match(/^l-(.+)$/))&&(l=ALL_LESSONS.find(x=>x.id===m[1]))){t=l.topic;return {title:`${l.title} · ${t.code} ${t.title} · IGCSE Computer Science 0478`,desc:`Learn ${lc(l.title)} for ${SEO_COURSE}, syllabus ${l.covers.map(c=>t.code+"."+c).join(" and ")}: ${l.covers.map(c=>lc(t.obj[c-1]||"")).join("; ")}.`}}
  const T={exams:["IGCSE Computer Science 0478 past paper questions by topic","Practise Cambridge IGCSE Computer Science (0478) past paper questions by topic, with mark schemes and instant marking."],
    flashcards:["IGCSE Computer Science 0478 flash cards","Flash cards for every Cambridge IGCSE Computer Science (0478) lesson, with spaced practice."],
    pricing:["Plans and pricing","Start free with the first lesson of every section. Students subscribe monthly or yearly; schools buy yearly class licences."],
    dashboard:["Student and teacher dashboards","Example student and teacher dashboards: progress, to-do lists, class tracking and assignment insights."],
    register:["Create an account"],login:["Sign in"],teacher:["My classes"],todo:["My to-do list"],account:["My account"],display:["Display settings"],admin:["Admin"]}[r.startsWith("class-")?"teacher":r];
  return T?{title:`${T[0]} · ${B}`,desc:T[1]}:{title:B}}
const seoTag=(sel,make)=>document.head.querySelector(sel)||document.head.appendChild(make());
function seoApply(r){const m=seoMeta(r),p=seoPath(r);
  document.title=m.title;
  if(m.desc)seoTag('meta[name="description"]',()=>Object.assign(document.createElement("meta"),{name:"description"})).setAttribute("content",m.desc.length>160?m.desc.slice(0,m.desc.lastIndexOf(" ",157))+"…":m.desc);
  const c=seoTag('link[rel="canonical"]',()=>Object.assign(document.createElement("link"),{rel:"canonical"}));
  if(p)c.setAttribute("href",location.origin+p);else c.remove();
  let rb=document.head.querySelector('meta[name="robots"][data-app]');
  if(!p){if(!rb){rb=document.createElement("meta");rb.name="robots";rb.dataset.app="1";document.head.append(rb)}rb.content="noindex"}else if(rb)rb.remove()}

/* ---------- Google Analytics, only with the visitor's agreement ---------- */
const GA=BOB.gaId;
const gaChoice=()=>{try{return localStorage.getItem("bob-analytics")}catch(e){return null}};
function gaLoad(){if(!GA||window.gtag)return;window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
  gtag("js",new Date());gtag("config",GA,{send_page_view:false});
  const s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA);document.head.append(s)}
/* page views use the page's own address; signed-in pages are grouped without ids */
function gaPage(r){if(!window.gtag)return;const p=seoPath(r)||"/app/"+r.replace(/^class-.*/,"class").replace(/[^\w-]/g,"");
  gtag("event","page_view",{page_title:document.title,page_location:location.origin+p,page_path:p})}
function gaBanner(){if(!GA||$("#gabar"))return;const b=document.createElement("div");b.id="gabar";b.setAttribute("role","dialog");b.setAttribute("aria-label","Analytics cookies");
  b.innerHTML=`<p><b>Can we count visits?</b> We'd like to use Google Analytics cookies to see which pages are used, so we can improve the site. No adverts, and we never share what you do in lessons.</p>
   <div class="tbb"><button class="btn small" data-ga="no">No thanks</button><button class="btn primary small" data-ga="yes">Allow</button></div>`;
  document.body.append(b)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-ga],[data-cookies]");if(!b)return;e.preventDefault();
  if(b.dataset.cookies!=null){try{localStorage.removeItem("bob-analytics")}catch(x){}gaBanner();return}
  const yes=b.dataset.ga==="yes";try{localStorage.setItem("bob-analytics",yes?"yes":"no")}catch(x){}$("#gabar")?.remove();
  if(yes){gaLoad();seoLast=null;seoTick()}
  else if(window.gtag){gtag("consent","update",{analytics_storage:"denied"});document.cookie.split(";").map(c=>c.split("=")[0].trim()).filter(n=>/^_ga/.test(n)).forEach(n=>{document.cookie=`${n}=; Max-Age=0; path=/; domain=${location.hostname.replace(/^www\./,"")}`;document.cookie=`${n}=; Max-Age=0; path=/`})}});
if(GA){const fl=document.querySelector("[data-cookies]");if(fl)fl.hidden=false;
  if(gaChoice()==="yes")gaLoad();else if(!gaChoice())setTimeout(gaBanner,1200)}

/* after every page change */
let seoLast=null;
const seoTick=()=>{const r=(location.hash||"#home").slice(1)||"home";seoApply(r);if(r!==seoLast){seoLast=r;gaPage(r)}};
new MutationObserver(seoTick).observe(document.getElementById("app"),{childList:true});seoTick();
