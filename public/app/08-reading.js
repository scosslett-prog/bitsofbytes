/* ================= reading aids: the page title shrinking into the menu bar, and focus mode ================= */

/* ---------- title in the menu bar ----------
   As the page's heading scrolls up under the menu bar it shrinks and fades, and a small copy grows
   in beside the logo. Scrolling back up reverses it. Linked to the scroll position, so it follows
   the reader's speed in both directions. */
const rdNT=(()=>{const w=document.querySelector(".nav .wrap"),logo=w&&w.querySelector(".logo");if(!w)return null;
  const el=document.createElement("button");el.type="button";el.className="navtitle";el.tabIndex=-1;el.setAttribute("aria-hidden","true");el.title="Back to the top";
  el.innerHTML="<span></span>";el.addEventListener("click",()=>window.scrollTo({top:0,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"}));
  logo.after(el);return el})();
function rdNtHeading(){const r=location.hash.slice(1)||"home";if(r==="home")return null;return document.querySelector("#app .lhead h1, #app .phead h1, #app h1")}
let rdNTH=null;
function rdNtUpdate(){if(!rdNT)return;const h=rdNTH;
  if(!h||!document.body.contains(h)){rdNT.classList.remove("on");rdNT.style.removeProperty("--p");document.querySelector(".nav").classList.remove("hastitle");return}
  const nav=document.querySelector(".nav").getBoundingClientRect(),r=h.getBoundingClientRect();
  // 0 while the heading sits clear of the bar, 1 once it has gone underneath it
  const p=Math.max(0,Math.min(1,(nav.bottom+24-r.top)/(r.height+24)));
  h.style.setProperty("--p",p.toFixed(3));h.classList.add("ntsrc");
  rdNT.style.setProperty("--p",p.toFixed(3));rdNT.classList.toggle("on",p>0.02);
  document.querySelector(".nav").classList.toggle("hastitle",p>0.5)}
function rdNtSetup(){if(!rdNT)return;if(rdNTH){rdNTH.classList.remove("ntsrc");rdNTH.style.removeProperty("--p")}
  rdNTH=rdNtHeading();rdNT.querySelector("span").textContent=rdNTH?rdNTH.textContent.trim():"";rdNtUpdate()}

/* ---------- focus mode ----------
   One "Part" of a lesson at a time: everything else is covered with a light grey veil, and the
   spotlight glides to the next part as the reader scrolls. The switch stays in the corner of the
   screen. While an activity is open the spotlight steps aside, and comes back when it closes. */
let rdFPin=null,rdFPinY=0;
let rdFOCUS=(()=>{try{return localStorage.getItem("bob-focus")==="1"}catch(e){return false}})(),rdFPART=null;
const rdFBTN=(()=>{const b=document.createElement("button");b.type="button";b.id="focusbtn";b.hidden=true;
  b.innerHTML=`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><circle cx="12" cy="12" r="3.2" fill="currentColor"/><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg><span>Focus</span>`;
  b.addEventListener("click",()=>{rdFOCUS=!rdFOCUS;try{localStorage.setItem("bob-focus",rdFOCUS?"1":"0")}catch(e){}rdFPART=null;rdFUpdate(true);
    if(rdFOCUS){const s=rdFCurrent();if(s)rdFScrollTo(s)}});
  document.body.append(b);return b})();
const rdSPOT=(()=>{const d=document.createElement("div");d.id="fspot";d.setAttribute("aria-hidden","true");document.body.append(d);return d})();
const rdFParts=()=>{const p=document.getElementById("pane-theory");return p&&!p.hidden?[...p.querySelectorAll(".theory > section")]:[]};
/* the part crossing a line 40% of the way down the screen */
function rdFCurrent(){const ps=rdFParts();if(!ps.length)return null;
  /* the line slides down the screen near the bottom of the page, so short last parts still get their turn */
  const left=document.documentElement.scrollHeight-(scrollY+innerHeight),near=innerHeight*0.6,t=Math.max(0,Math.min(1,1-left/near));
  const line=innerHeight*(0.4+0.55*t*t);
  if(rdFPin&&document.body.contains(rdFPin)&&Math.abs(scrollY-rdFPinY)<60)return rdFPin;rdFPin=null;
  let best=ps[0];for(const s of ps){if(s.getBoundingClientRect().top<=line)best=s;else break}return best}
function rdFScrollTo(s){const nav=document.querySelector(".nav").getBoundingClientRect().bottom,top=s.getBoundingClientRect().top+scrollY-nav-28;
  if(top<scrollY||s.getBoundingClientRect().top>innerHeight*0.4)window.scrollTo({top,behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}
function rdFUpdate(instant){
  const onLesson=/^#l-/.test(location.hash),ps=onLesson?rdFParts():[];
  rdFBTN.hidden=!onLesson||ps.length<2;
  rdFBTN.setAttribute("aria-pressed",String(rdFOCUS));rdFBTN.querySelector("span").textContent=rdFOCUS?"Focus on":"Focus";rdFBTN.classList.toggle("on",rdFOCUS);
  const paused=!!document.querySelector(".check.focus");
  rdFBTN.classList.toggle("paused",rdFOCUS&&paused);rdFBTN.title=rdFOCUS?(paused?"Focus mode is paused while an activity is open":"Focus mode is on: one part at a time"):"Focus on one part at a time";
  const active=rdFOCUS&&!rdFBTN.hidden&&!paused;
  document.documentElement.classList.toggle("focusing",active);
  if(!active){rdSPOT.classList.remove("on");rdFPART=null;return}
  const s=rdFCurrent();if(!s){rdSPOT.classList.remove("on");return}
  ps.forEach(p=>p.classList.toggle("fcur",p===s));
  const r=s.getBoundingClientRect(),pad=14;
  if(instant||!rdSPOT.classList.contains("on"))rdSPOT.classList.add("jump");
  Object.assign(rdSPOT.style,{top:(r.top+scrollY-pad)+"px",left:(r.left+scrollX-pad)+"px",width:(r.width+pad*2)+"px",height:(r.height+pad*2)+"px"});
  rdSPOT.classList.add("on");rdFPART=s;
  if(rdSPOT.classList.contains("jump"))requestAnimationFrame(()=>requestAnimationFrame(()=>rdSPOT.classList.remove("jump")))}

/* clicking a dimmed part moves the spotlight to it */
document.addEventListener("click",e=>{if(!document.documentElement.classList.contains("focusing"))return;
  const s=e.target.closest("#pane-theory .theory > section");if(!s||s===rdFPART)return;
  rdFPin=s;rdFPinY=scrollY;rdFUpdate(false);if(s.getBoundingClientRect().top<0||s.getBoundingClientRect().bottom>innerHeight)rdFScrollTo(s),rdFPinY=-1e9});

/* ---------- keep both up to date ---------- */
let rdRA=0;const rdTick=()=>{if(rdRA)return;rdRA=requestAnimationFrame(()=>{rdRA=0;rdNtUpdate();rdFUpdate(false)})};
addEventListener("scroll",rdTick,{passive:true});addEventListener("resize",()=>{rdFPART=null;rdTick()});
/* a new page, a tab switch, an activity opening or closing, or content growing (tables, diagrams) */
const rdRO=new ResizeObserver(rdTick);
new MutationObserver(()=>{rdNtSetup();rdFPART=null;const p=document.getElementById("pane-theory");rdRO.disconnect();if(p)rdRO.observe(p);rdFUpdate(true)}).observe(document.getElementById("app"),{childList:true});
new MutationObserver(rdTick).observe(document.documentElement,{attributes:true,attributeFilter:["class"]});
document.addEventListener("click",e=>{if(e.target.closest("[data-tab]"))setTimeout(()=>rdFUpdate(true),0)});
rdNtSetup();rdFUpdate(true);

/* ---------- the menu on small screens: folded behind a menu button ---------- */
{const nav=document.querySelector(".nav"),btn=document.getElementById("menubtn");
  const set=open=>{if(!nav||!btn)return;nav.classList.toggle("open",open);btn.setAttribute("aria-expanded",String(open));btn.setAttribute("aria-label",open?"Close menu":"Open menu")};
  if(btn)btn.addEventListener("click",()=>set(!nav.classList.contains("open")));
  addEventListener("hashchange",()=>set(false));
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&nav.classList.contains("open")){set(false);btn.focus()}});
  document.addEventListener("click",e=>{if(!nav.classList.contains("open"))return;
    if(!e.target.closest(".nav"))return set(false);
    const a=e.target.closest("#links a");if(a&&!a.closest("[data-um]"))set(false)});
  addEventListener("resize",()=>{if(innerWidth>900)set(false)})}
