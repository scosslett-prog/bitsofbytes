/* ================= preview for visitors who aren't signed in =================
   The dashboard shows example data, with a switch between the student and teacher views
   (and the visitor's own progress in this browser). The example data is swapped in only while
   those pages are drawn (render → demoIn/demoOut) and nothing is saved while it is in place.
   Anything that would change data is blocked with a note; tabs, folding and links still work. */

let dmView=(()=>{try{return sessionStorage.getItem("bob-pv")||"student"}catch(e){return "student"}})();
const dmSetView=v=>{dmView=v;try{sessionStorage.setItem("bob-pv",v)}catch(e){}};
const dmState={depth:0,real:null,cache:{}};
const dmGuest=()=>!(dmState.depth?dmState.real.S.user:S.user);
const dmIsRoute=r=>r==="dashboard"||r==="teacher"||r==="todo"||r.startsWith("class-demo");

/* which example to draw for this address, or null for the normal page */
function demoView(r){
  if(!dmGuest()||!dmIsRoute(r))return null;
  if(r.startsWith("class-demo")||r==="teacher"){dmSetView("teacher");return {view:"teacher",route:r}}
  if(r==="todo"){dmSetView("student");return {view:"student",route:"todo"}}
  if(dmView==="mine")return null;
  return dmView==="teacher"?{view:"teacher",route:"teacher"}:{view:"student",route:"dashboard"}}

function demoIn(view){
  if(dmState.depth++)return;
  const D=dmState.cache[view]||(dmState.cache[view]=dmBuild(view));
  dmState.real={S,SC:Object.assign({},SC)};
  S=D.S;Object.assign(SC,D.SC)}
function demoOut(){
  if(--dmState.depth)return;
  const R=dmState.real;dmState.real=null;
  S=R.S;for(const k of Object.keys(SC))delete SC[k];Object.assign(SC,R.SC)}

/* the banner and switch at the top of the preview, and the menu bar back as the visitor's own */
function demoAfter(r,d){
  const app=$("#app");app.classList.toggle("demo-on",!!d);
  if(dmGuest()&&GUEST_NOTE[r])app.insertAdjacentHTML("afterbegin",guestNote(r));
  if(!dmGuest()||!dmIsRoute(r))return;
  const view=d?d.view:"mine";
  const opt=(v,label,sub)=>`<button type="button" role="radio" aria-checked="${view===v}" data-pv="${v}"${view===v?' class="on"':""}><b>${label}</b><small>${sub}</small></button>`;
  app.insertAdjacentHTML("afterbegin",`<section class="pvbar" aria-label="Preview">
   <div class="pvtext"><span class="pvtag">Preview</span><div><b>${view==="mine"?"Your progress in this browser":`This is an example ${view} account`}</b>
    <span>${view==="mine"?"Guests' progress is kept in this browser only. Create a free account to keep it safe and see it on any device.":"Made-up names and scores, so you can see what Bits of Bytes looks like with an account. Nothing you do here is saved."}</span></div></div>
   <div class="pvswitch" role="radiogroup" aria-label="Choose a preview">${opt("student","Student view","Progress and to-do list")}${opt("teacher","Teacher view","Classes, assignments, insights")}${opt("mine","My progress","What you've done so far")}</div>
   <a class="btn primary small pvcta" href="#register">Create a free account</a>
   ${view==="mine"?"":`<nav class="pvlinks" aria-label="Preview pages"><span class="sub">Look around:</span>${view==="student"
     ?`<a href="#dashboard"${r==="dashboard"?' aria-current="page"':""}>Dashboard</a><a href="#todo"${r==="todo"?' aria-current="page"':""}>My class: to-do list and tracking</a>`
     :`<a href="#teacher"${r==="teacher"||r==="dashboard"?' aria-current="page"':""}>All classes</a><a href="#class-demo-c1"${r==="class-demo-c1"?' aria-current="page"':""}>10C class tracking</a><a href="#class-demo-c2"${r==="class-demo-c2"?' aria-current="page"':""}>11B class tracking</a>`}</nav>`}</section>`);
  nav(r==="dashboard"?"dashboard":r)}

/* the same banner, slimmer, on the other menu pages: what a visitor can do and what an account adds */
const GUEST_NOTE={
  "paper-1":["You're browsing as a guest","{free}Quick checks and activity scores are saved in this browser only, so they're lost if you clear it or change device."],
  "paper-2":["You're browsing as a guest","{free}Quick checks and activity scores are saved in this browser only, so they're lost if you clear it or change device."],
  flashcards:["Flash cards as a guest","Decks you make and the cards you rate are kept in this browser only. With an account they follow you to any device, and your teacher can see your revision."],
  exams:["Exam practice as a guest","{exfree}Your marks are kept in this browser only. With an account they feed your dashboard, and teachers can set past paper questions as homework."]};
function guestNote(r){const full=BOB.pay.full(),[h,t]=GUEST_NOTE[r];
  const txt=t.replace("{free}",full?"":"The first lesson in each section is free; subscribe or join a school class for the rest. ").replace("{exfree}",full?"":"You can practise the questions from the free lessons. ");
  return `<section class="pvbar slim" aria-label="Guest"><div class="pvtext"><span class="pvtag">Guest</span><div><b>${h}</b><span>${txt}</span></div></div>
   <div class="tbb pvbtns"><a class="btn small" href="#dashboard">See the dashboard preview</a><a class="btn primary small" href="#register">Create a free account</a></div></section>`}

/* ---------- read-only while previewing ---------- */
function dmNote(){let n=$("#pvnote");
  if(!n){n=document.createElement("div");n.id="pvnote";n.setAttribute("role","status");document.body.append(n)}
  n.innerHTML=`<span>This is a preview with example data, so nothing can be changed. <a href="#register">Create a free account</a> to try it for real.</span>`;
  n.classList.remove("show");void n.offsetWidth;n.classList.add("show");clearTimeout(dmNote.t);dmNote.t=setTimeout(()=>n.classList.remove("show"),4200)}
const dmOnPage=()=>$("#app").classList.contains("demo-on");
/* actions that only change what's on screen */
const DM_OK_TC=new Set(["tab","goasg","newasg","closeasg","rev","revclose","revnav","copy","asgreview","lanone","laall"]);
document.addEventListener("click",e=>{if(!dmOnPage()||!e.target.closest("#app"))return;
  const pv=e.target.closest("[data-pv]");if(pv)return;
  const b=e.target.closest("button,[role=button],input[type=submit]");if(!b||b.closest("summary"))return;
  const tc=b.dataset.tc;if(tc&&DM_OK_TC.has(tc))return;
  if(b.closest("#asgForm")&&b.type!=="submit")return;
  if(b.dataset.topen||b.matches("[data-fold],[data-mtab],[data-jump],.tsort,[data-sort]"))return;
  e.preventDefault();e.stopImmediatePropagation();dmNote()},true);
document.addEventListener("submit",e=>{if(!dmOnPage()||!e.target.closest("#app"))return;e.preventDefault();e.stopImmediatePropagation();dmNote()},true);
document.addEventListener("change",e=>{if(!dmOnPage()||!e.target.closest("#app"))return;
  if(e.target.closest("#asgForm"))return;
  if(e.target.matches("[data-conf],[data-tacc],[data-tm],[data-tsel],[data-tselall]")){e.preventDefault();e.stopImmediatePropagation();dmNote();render()}},true);
/* belt and braces: no saving, and no school changes, while example data is in place */
{const s0=save;save=function(){if(dmState.depth||dmOnPage())return;return s0()}}
/* and every school change (marking as seen, saving a mark, lesson access) is a no-op */
for(const k of Object.keys(SCH.A)){const f=SCH.A[k];if(typeof f==="function")SCH.A[k]=(...x)=>dmState.depth||dmOnPage()?Promise.resolve(null):f(...x)}
{const t0=tDo;tDo=function(fn,o){if(dmState.depth||dmOnPage()){dmNote();return Promise.resolve(false)}return t0(fn,o)}}
document.addEventListener("click",e=>{const b=e.target.closest("[data-pv]");if(!b)return;
  dmSetView(b.dataset.pv);if(location.hash!=="#dashboard")location.hash="dashboard";else render()});

/* ---------- the example data ---------- */
function dmRand(seed){let a=0;for(const ch of String(seed))a=(a*31+ch.charCodeAt(0))|0;
  return ()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const DAY=864e5;
/* one student's progress: ability (0–1) sets their scores, reach (0–1) how far through each paper they are */
function dmProg(seed,ability,reach){const R=dmRand(seed),now=Date.now(),p={asgAns:{},scores:{},lessons:{},acts:{},ex:{},exh:[],conf:{},cards:{},fcard:{},fcs:{},fch:[]};
  const pct=(lo=0)=>Math.max(lo,Math.min(100,Math.round(ability*100+(R()-.5)*40)));
  const when=()=>new Date(now-Math.floor(R()*28*DAY)-Math.floor(R()*DAY)).toISOString();
  for(const paper of [1,2]){const ls=ALL_LESSONS.filter(l=>l.topic.ch.paper===paper),upto=Math.round(ls.length*reach*(paper===1?1:.55));
    ls.forEach((l,i)=>{if(i>=upto&&!(i===upto&&R()<.5))return;
      const qs=dmQs(l,ability,R),last=qs.length?Math.round(qs.filter(x=>x.g===x.a).length/qs.length*100):pct(35);
      p.lessons[l.id]={best:Math.max(last,pct(35)),last,attempts:1+Math.floor(R()*3),date:when(),qs};
      if(l.v&&R()<.85){const b=pct(40);p.scores["lv-"+l.id]={best:b,last:b,attempts:1+Math.floor(R()*2),date:when()}}
      (l.acts||[]).forEach(a=>{if(R()<.25)return;p.acts[l.id+"-"+a.id]=dmAct(a,ability,R,when())});
      p.conf[l.id]=Math.max(1,Math.min(4,Math.round(ability*4+(R()-.5)*2)));
      EXQ.filter(q=>q.l.includes(l.id)).slice(0,3).forEach(q=>{if(R()<.5)return;const m=Math.min(q.m,Math.round(q.m*(ability+(R()-.5)*.5)));p.ex[q.id]={b:Math.max(0,m),l:Math.max(0,m),m:q.m,n:1,t:now-Math.floor(R()*20*DAY)}})});
    TOPICS.filter(t=>t.ch.paper===paper&&t.lessons&&t.lessons.every(l=>p.lessons[l.id])).forEach(t=>{const b=pct(40);p.scores[t.id]={best:b,last:b,attempts:1,date:when()}})}
  return p}

/* how hard a question is (the same for everyone), so the class insights show real patterns */
const dmDiff=t=>{let h=0;for(const ch of String(t))h=(h*33+ch.charCodeAt(0))|0;return((h>>>0)%1000)/1000-.5};
const dmOk=(ab,t,R)=>R()<Math.max(.06,Math.min(.97,ab+dmDiff(t)*.7));
/* a quick check, question by question; wrong answers lean towards the same tempting option */
function dmQs(l,ab,R){return (l.q||[]).map(([q,a,...w])=>({q,a,g:dmOk(ab,q,R)?a:(R()<.7?w[0]:w[Math.floor(R()*w.length)])}))}
/* an activity try; question-bank activities get real mistakes the teacher can see */
function dmAct(a,ab,R,date){const qn=8;let n,wrong=[];
  const bank=a.gen==="bank"&&typeof BANKS!=="undefined"&&BANKS[a.bank];
  if(bank&&bank.length){const items=[...bank].sort(()=>R()-.5).slice(0,qn);
    items.forEach(it=>{if(dmOk(ab,it.q,R))return;
      if(it.t==="mc"){const opts=[it.a,...it.w].sort((x,y)=>dmDiff(x)-dmDiff(y));wrong.push({t:"mc",q:it.q,a:it.a,opts,given:String(opts.indexOf(it.w[0]))})}
      else wrong.push({t:"blank",q:it.q,a:it.a,given:(it.w&&it.w[0])||"don't know"})});
    n=items.length-wrong.length}
  else n=Math.max(2,Math.min(qn,Math.round(qn*(ab+(R()-.5)*.4))));
  const pc=Math.round(n/qn*100);
  return {attempts:1,correct:n,total:qn,bestN:n,lastN:n,qn,best:pc,last:pc,date,hist:[{date,n,wrong}]}}

/* every task in these lessons done, with good scores */
function dmComplete(p,lids,seed){const R=dmRand(seed+lids.join()),d=()=>new Date(Date.now()-Math.floor(R()*10*864e5)).toISOString();
  lids.forEach(lid=>{const l=ALL_LESSONS.find(x=>x.id===lid);if(!l)return;const qs=dmQs(l,.88,R),b=Math.max(75,qs.length?Math.round(qs.filter(x=>x.g===x.a).length/qs.length*100):80);
    p.lessons[lid]={best:b,last:b,attempts:1+Math.floor(R()*2),date:d(),qs};
    if(l.v)p.scores["lv-"+lid]={best:70+Math.floor(R()*31),last:80,attempts:1,date:d()};
    (l.acts||[]).forEach(a=>{p.acts[lid+"-"+a.id]=dmAct(a,.8,R,d())})})}
function dmBuild(view){const now=Date.now(),iso=d=>new Date(now+d*DAY).toISOString().slice(0,10);
  const T={id:"demo-t",name:"Jordan Rivera",email:"j.rivera@example.school",role:"teacher",school:"Example International School",cls:null};
  const names=["Alex Morgan","Priya Shah","Leo Fernández","Mei Lin Tan","Sam Okafor","Hana Sato","Noah Williams","Aisha Rahman","Tom Becker","Isla Murphy","Kiran Patel","Zoe Laurent","Ben Carter","Nina Kowalski","Omar Haddad","Ruby Evans","Arjun Mehta","Chloe Dubois","Felix Wong","Grace Lee","Hugo Silva"];
  const users={[T.id]:T},prog={},progLast={};
  const mk=(i,cls)=>{const id="demo-s"+i,R=dmRand(id),ab=i===0?.86:.38+R()*.55,reach=i===0?.62:.25+R()*.7;
    users[id]={id,name:names[i],email:names[i].toLowerCase().replace(/[^a-z]+/g,".")+"@example.school",role:"student",school:T.school,cls};
    prog[id]=dmProg(id,ab,reach);progLast[id]=now-Math.floor(R()*5*DAY);return id};
  const c1=[...Array(12)].map((_,i)=>mk(i,"demo-c1")),c2=[...Array(9)].map((_,i)=>mk(12+i,"demo-c2"));
  /* most of 10C have done the homework; one was asked to redo it */
  c1.forEach((id,i)=>{if(i!==4&&i<10)dmComplete(prog[id],["1-1-binary","1-1-hex"],id);if(i>0&&i<4)dmComplete(prog[id],["1-2-charsets"],id)});
  c2.forEach((id,i)=>{if(i<5)dmComplete(prog[id],["10-1-gates","10-1-tables"],id)});
  const classes={
    "demo-c1":{id:"demo-c1",name:"10C Computer Science",teacher:T.id,code:"DEMO42",students:c1,invites:["new.student@example.school"],created:now-40*DAY,restrict:false,released:[]},
    "demo-c2":{id:"demo-c2",name:"11B Computer Science",teacher:T.id,code:"DEMO77",students:c2,invites:[],created:now-60*DAY,restrict:false,released:[]}};
  /* exam questions the visitor can see (the free lessons), from data representation */
  const exPick=(re,n,skip=0)=>EXQ.filter(q=>(q.t==="mc"||q.t==="ans")&&q.l.some(l=>re.test(l))).slice(skip,skip+n).map(q=>q.id);
  const orPick=(...tries)=>tries.find(x=>x.length>=4)||tries[tries.length-1];
  const qids=exPick(/^1-[123]-/,8),qids6=orPick(exPick(/^1-1-/,6,8),exPick(/^1-[123]-/,6,8)),qids5=orPick(exPick(/^(10|9|8|7)-/,6),exPick(/^[2-6]-/,6),exPick(/^1-/,6,14));
  const asg={
    "demo-a1":{id:"demo-a1",kind:"lessons",cls:"demo-c1",title:"Binary and hexadecimal",note:"Finish both lessons, including the activities.",lessons:["1-1-binary","1-1-hex"],qids:[],mode:"all",due:iso(-6),set:now-14*DAY,by:T.id,spec:{}},
    "demo-a2":{id:"demo-a2",kind:"exam",cls:"demo-c1",title:"Data representation: exam practice",note:"Past paper questions. Show your working where you can.",lessons:[],qids,mode:"all",due:iso(3),set:now-4*DAY,by:T.id,spec:{}},
    "demo-a3":{id:"demo-a3",kind:"lessons",cls:"demo-c1",title:"Character sets",note:"",lessons:["1-2-charsets"],qids:[],mode:"all",due:iso(7),set:now-1*DAY,by:T.id,spec:{}},
    "demo-a5":{id:"demo-a5",kind:"exam",cls:"demo-c2",title:"Mock revision: past paper questions",note:"Answer these under timed conditions: about 1 minute per mark.",lessons:[],qids:qids5,mode:"all",due:iso(4),set:now-3*DAY,by:T.id,spec:{}},
    "demo-a6":{id:"demo-a6",kind:"exam",cls:"demo-c1",title:"Number systems: past paper questions",note:"",lessons:[],qids:qids6,mode:"all",due:iso(-10),set:now-20*DAY,by:T.id,spec:{}},
    "demo-a4":{id:"demo-a4",kind:"lessons",cls:"demo-c2",title:"Logic gates and truth tables",note:"Revision before the mock.",lessons:["10-1-gates","10-1-tables"],qids:[],mode:"all",due:iso(5),set:now-2*DAY,by:T.id,spec:{}}};
  /* answers to the exam assignment from most of 10C (not the example student, who hasn't started it) */
  const subs={"demo-a2":{},"demo-a5":{},"demo-a6":{}},re={};
  const answer=(aid,ids,who,done)=>{const R=dmRand(who+aid),ab=.35+R()*.6,ans={};
    ids.forEach(q=>{const Q=EXQ.find(x=>x.id===q);if(!Q||(!done&&R()<.4))return;ans[q]=dmExAns(Q,ab,R)});
    subs[aid][who]={ans,done,date:now-Math.floor(R()*3*DAY)}};
  c1.slice(1).forEach((id,i)=>{if(i<=8)answer("demo-a2",qids,id,i<=6);answer("demo-a6",qids6,id,true)});
  c2.forEach((id,i)=>{if(i<7)answer("demo-a5",qids5,id,i<5)});
  answer("demo-a6",qids6,c1[0],true);
  re["demo-a1"]={[c1[4]]:[{due:iso(2),comment:"Have another go at the hex activity.",at:now-2*DAY,prev:45}]};
  const lic={[T.id]:{bought:30,used:c1.length+c2.length,hist:[{n:30,date:now-70*DAY,note:"Invoice INV-2041"}],req:[]}};
  const SCd={users,classes,asg,subs,tmarks:{},re,seen:view==="student"?["demo-a1","demo-a2","demo-a6"]:[],prog,progLast,lic,admin:null};
  if(view==="teacher")return {S:Object.assign({},dmBlank(),{user:T}),SC:SCd};
  const me=users[c1[0]];
  prog[me.id].asgAns={"demo-a6":subs["demo-a6"][me.id]};
  return {S:Object.assign({},dmBlank(),prog[me.id],{user:{id:me.id,name:me.name,email:me.email,role:"student",school:me.school},fold:{}}),SC:SCd}}
/* the visitor's own settings (display, open units) with every bit of progress emptied */
/* one exam answer: the option chosen or the text typed, marked as the site would mark it */
function dmExAns(q,ab,R){const ok=dmOk(ab,q.id,R),mk=ok?q.m:0;
  if(q.t==="mc"){const wrongs=q.o.map((_,i)=>i).filter(i=>i!==q.a),sel=ok?q.a:wrongs[R()<.7?0:Math.floor(R()*wrongs.length)];return {m:mk,c:{v:[],sel,R:{marks:mk,f:[ok]}}}}
  const a=String((q.acc||[""])[0]);let w;
  if(/^[01]+$/.test(a)){const i=(Math.floor(a.length/2)+(R()<.6?0:1))%a.length;w=a.slice(0,i)+(a[i]==="0"?"1":"0")+a.slice(i+1)}
  else if(/^\d+$/.test(a))w=String(+a+(R()<.65?1:-16));
  else if(/^[0-9A-F]+$/i.test(a))w=a.slice(0,-1)+(a.slice(-1).toUpperCase()==="F"?"E":"F");
  else w=R()<.6?"I'm not sure":"don't know";
  return {m:mk,c:{v:[ok?a:w],R:{marks:mk,f:[ok]}}}}
const dmBlank=()=>Object.assign(JSON.parse(JSON.stringify(S)),{user:null,scores:{},lessons:{},acts:{},ex:{},exh:[],conf:{},cards:{},fcard:{},fcs:{},fch:[],asgAns:{}});

/* draw the preview now if the visitor opened the site on a dashboard address */
if(demoView((location.hash||"#home").slice(1))||((location.hash||"").slice(1)==="dashboard"&&dmGuest()))render();
