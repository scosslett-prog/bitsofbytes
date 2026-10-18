/* ================= schools: teachers, classes, licences, assignments =================
   The data lives in the database. src/school.js loads what this account may see into SC
   (people and classes are keyed by id) and every change goes through BOB.school.A, after
   which the cache is reloaded and the page redrawn. */
const SC=BOB.SC,SCH=BOB.school;

/* progress snapshots: the signed-in user's live state, or a student's loaded from the server */
const PKEYS={asgAns:{},scores:{},lessons:{},acts:{},ex:{},exh:[],conf:{},cards:{},fcard:{},fcs:{},fch:[]};
function progSnap(){const p={};for(const k in PKEYS)p[k]=S[k];return p}
function progLoad(p){for(const k in PKEYS)S[k]=p&&p[k]!=null?p[k]:JSON.parse(JSON.stringify(PKEYS[k]))}
function withProg(p,fn){const keep={};for(const k in PKEYS)keep[k]=S[k];progLoad(p);try{return fn()}finally{for(const k in PKEYS)S[k]=keep[k]}}
const progOf=id=>S.user&&id===S.user.id?progSnap():SC.prog[id];

const me=()=>S.user?(SC.users[S.user.id]||Object.assign({cls:null},S.user)):null;
const isTeacher=()=>!!(S.user&&(S.user.role==="teacher"||S.user.role==="admin"));
/* home page buttons: guests are invited to register; signed-in people go to their own pages,
   and students without full access are offered a subscription */
function homeCtas(){const browse=`<a class="btn" href="#paper-1">Browse the course</a>`;
  if(!S.user)return `<a class="btn primary" href="#register">Create a free account</a>${browse}<a class="btn" href="#dashboard">Preview the dashboards</a>`;
  if(isTeacher())return `<a class="btn primary" href="#teacher">Go to my classes</a>${browse}`;
  if(!BOB.pay.full())return `<a class="btn primary" href="#pricing">Subscribe for full access</a>${browse}`;
  return `<a class="btn primary" href="#dashboard">Go to my dashboard</a>${browse}`}
const isAdmin=()=>!!(S.user&&S.user.role==="admin");
const myClass=()=>{const u=me();return u&&!isTeacher()&&u.cls&&SC.classes[u.cls]||null};
const teacherOf=c=>SC.users[c.teacher]||{name:"Your teacher",school:""};
const tClasses=id=>Object.values(SC.classes).filter(c=>c.teacher===id).sort((a,b)=>a.created-b.created);
function licInfo(id){const L=SC.lic[id]||{bought:0,used:0,hist:[],req:[]};return {bought:L.bought,used:L.used,free:Math.max(0,L.bought-L.used),hist:L.hist||[],req:L.req||[]}}
const plural=(n,w,ws)=>`${n} ${n===1?w:(ws||w+"s")}`;
const byName=(a,b)=>a.name.localeCompare(b.name);
const studentsOf=c=>c.students.map(id=>SC.users[id]).filter(Boolean).sort(byName);
/* dates are stored as YYYY-MM-DD; "today" uses the viewer's clock */
const isoDay=d=>{const z=new Date(d.getTime()-d.getTimezoneOffset()*6e4);return z.toISOString().slice(0,10)};
const todayISO=()=>isoDay(new Date());
const fmtDay=s=>new Date(s+"T12:00:00").toLocaleDateString("en-GB",{weekday:"short",day:"numeric",month:"short"});
function dueText(s){const d=Math.round((new Date(s+"T12:00:00")-new Date(todayISO()+"T12:00:00"))/864e5);
  return d<0?`Overdue by ${plural(-d,"day")}`:d===0?"Due today":d===1?"Due tomorrow":`Due ${fmtDay(s)} · in ${d} days`}
const myInvites=()=>{const u=me();return u&&!isTeacher()?Object.values(SC.classes).filter(c=>c.invites.includes(u.email)&&c.id!==u.cls):[]};

/* run a change on the server, then reload the class data and redraw */
let TBUSY=false;
async function tDo(fn,{reload=true,err=null,ok=null}={}){if(TBUSY)return false;TBUSY=true;document.body.classList.add("tbusy");let good=false;
  try{await fn();if(reload)await SCH.load();good=true}
  catch(e){const m=String(e&&e.message||e);const x=err&&$("#"+err);if(x){x.textContent=m;x.hidden=false}else alert(m)}
  finally{TBUSY=false;document.body.classList.remove("tbusy")}
  if(good){if(ok)ok();if(reload)tRender()}return good}

/* assignment progress for one student */
/* reassignments: the latest one sets the student's due date; a reassigned lesson
   assignment only counts work done after the reassignment */
const reList=(aid,id)=>((SC.re[aid]||{})[id])||[];
const reOf=(aid,id)=>{const l=reList(aid,id);return l.length?l[l.length-1]:null};
const effDue=(a,id)=>{const r=reOf(a.id,id);return r?r.due:a.due};
const myDue=a=>me()?effDue(a,me().id):a.due;
function redoPart(l,a,since){const after=x=>!!(x&&x.date&&x.date>since),qc=S.lessons[l.id],qt=after(qc),qok=qt&&qc.last>=75;
  if(a.mode==="qc")return {l,ok:qok,started:qt,pct:qt?qc.last:0};
  const parts=[{ok:qok,t:qt,pct:qt?qc.last:0}];
  if(l.v){const v=S.scores["lv-"+l.id],t=after(v);parts.push({ok:t,t,pct:t?v.last:0})}
  (l.acts||[]).forEach(ac=>{const x=S.acts[l.id+"-"+ac.id],h=x&&x.hist?x.hist.filter(e=>e.date>since):[],last=h[h.length-1],q=x&&(x.qn||x.total);
    parts.push({ok:h.length>0,t:h.length>0,pct:last&&q?Math.round(last.n/q*100):0})});
  return {l,ok:parts.every(p=>p.ok),started:parts.some(p=>p.t),pct:Math.round(parts.reduce((t,p)=>t+p.pct,0)/parts.length)}}
function asgStatus(a,id){if(a.kind==="exam")return asgExamStatus(a,id);const re=reOf(a.id,id),since=re?new Date(re.at).toISOString():null;
  return withProg(progOf(id),()=>{const ls=a.lessons.map(x=>ALL_LESSONS.find(l=>l.id===x)).filter(Boolean);
    const per=ls.map(l=>{if(since)return redoPart(l,a,since);const lp=lessonParts(l),qc=S.lessons[l.id];
      const ok=a.mode==="qc"?qcPassed(l):done(l),started=a.mode==="qc"?!!qc:lp.started;
      return {l,ok,started,pct:a.mode==="qc"?(qc?qc.best:0):lp.overall}});
    const nOk=per.filter(x=>x.ok).length,score=per.length?Math.round(per.reduce((t,x)=>t+x.pct,0)/per.length):0;
    const complete=nOk===per.length&&per.length>0,started=per.some(x=>x.started||x.ok);
    const late=!complete&&effDue(a,id)<todayISO();
    return {per,nOk,score,complete,started,late,re,reN:reList(a.id,id).length,key:complete?"done":late?"late":started?"prog":"todo"}})}
const ST_LBL={done:"Completed",prog:"In progress",todo:"Not started",late:"Overdue"},ST_CLS={done:"sec",prog:"dev",todo:"none",late:"start"};
const reTip=(r)=>`Reassigned ${new Date(r.re.at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}, due ${fmtDay(r.re.due)}${r.re.prev!=null?` · previous score ${r.re.prev}%`:""}${r.re.comment?` · “${r.re.comment}”`:""}`;
const stChip=s=>`<span class="chip ${ST_CLS[s.key]}">${ST_LBL[s.key]}</span>${s.re?` <span class="chip tre" title="${esc(reTip(s))}">↻ Reassigned${s.reN>1?" ×"+s.reN:""}</span>`:""}`;
const classAsg=c=>Object.values(SC.asg).filter(a=>a.cls===c.id).sort((a,b)=>a.due.localeCompare(b.due)||a.set-b.set);
const myAsg=()=>{const c=myClass();return c?classAsg(c):[]};
const unseen=()=>me()?myAsg().filter(a=>!SC.seen.includes(a.id)):[];
function markSeen(){const n=unseen().map(a=>a.id);if(!n.length)return;SC.seen.push(...n);SCH.A.markSeen(n).catch(e=>console.warn(e))}
const todoCount=()=>{const u=me();return u?myAsg().filter(a=>!asgStatus(a,u.id).complete).length:0};

/* a student's overall summary, from their stored progress */
function stuSummary(id){const p=SC.prog[id];
  return withProg(p,()=>{const avg=pp=>{const ts=TOPICS.filter(t=>t.ch.paper===pp);return Math.round(ts.reduce((a,t)=>a+secStatus(t).pct,0)/ts.length)};
    const qcs=ALL_LESSONS.map(l=>S.lessons[l.id]).filter(Boolean);
    return {done:ALL_LESSONS.filter(done).length,p1:avg(1),p2:avg(2),qc:qcs.length?Math.round(qcs.reduce((a,q)=>a+q.best,0)/qcs.length):null,nqc:qcs.length,
      sec:TOPICS.map(t=>{const st=secStatus(t);return {t,pct:st.pct,lv:lvOf(st.pct,st.started)}}),last:SC.progLast[id]||0}})}
const ago=t=>{if(!t)return "Never";const d=Math.floor((Date.now()-t)/864e5);return d<1?"Today":d===1?"Yesterday":d<7?`${d} days ago`:new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short"})};
const dshort=t=>new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});

/* ---------- teacher area ---------- */
let TV={tab:"students",req:10,form:null,open:{}};
function teacherPage(){const u=me();
  if(!isTeacher())return `<div class="formwrap"><div><div class="eyebrow">Teachers</div><h1 style="margin-top:8px">Teacher area</h1></div><p>Sign in with a teacher account to manage licences, classes and assignments.</p><div style="display:flex;gap:8px"><a class="btn primary" href="#register">Create a teacher account</a><a class="btn" href="#login">Sign in</a></div></div>`;
  const L=licInfo(u.id),cls=tClasses(u.id),pend=L.req.filter(r=>r.status==="pending");
  return `<div style="${accent(1)}"><div class="phead" style="padding-bottom:20px"><div class="eyebrow">Teacher area${u.school?" · "+esc(u.school):""}</div><h1>Your classes</h1>
   <p>Get licences, create a class, then add students with a join code or an email invitation. Each student in a class uses one licence.</p></div>
  <div class="tgrid">
   <section class="panel tlic" style="${accent(2)}"><h3>Licences</h3>
    <div class="tlstats"><div><b>${L.bought}</b><span>total</span></div><div><b>${L.used}</b><span>in use</span></div><div><b>${L.free}</b><span>free</span></div></div>
    <div class="bar"><i style="width:${L.bought?Math.min(100,L.used/L.bought*100):0}%"></i></div>
    ${licBilling()}
    ${pend.length?`<div class="treq"><span class="sub">Waiting for approval</span><ul class="tlist">${pend.map(r=>`<li><span>${plural(r.n,"licence")}</span><span class="sub">requested ${dshort(r.date)}</span></li>`).join("")}</ul></div>`:""}
    ${BOB.pay.enabled?`<details class="treqd"><summary>Paying by invoice or purchase order?</summary>`:""}<form id="reqForm" class="tbuy"><label for="reqn">Number of licences<input type="number" id="reqn" min="1" max="1000" value="${TV.req}" inputmode="numeric"></label>
     <label for="reqm">Message <span class="sub">(optional)</span><textarea id="reqm" rows="2" maxlength="300" placeholder="e.g. School name, purchase order number"></textarea></label>
     <button class="btn primary" type="submit">Request licences</button>
     <p class="vfoot" style="margin:0">${BOB.pay.enabled?"Request licences and we'll send you an invoice. They're added to your account once it's paid.":"One licence gives one student full access for the school year. Bits of Bytes adds the licences once your request is approved. Online payment is coming soon."}</p></form>
    <p class="err" id="reqerr" hidden></p>${BOB.pay.enabled?"</details>":""}
    ${L.hist.length||L.req.some(r=>r.status!=="pending")?`<details class="thist"><summary>Licence history</summary><ul>${[
      ...L.hist.map(h=>({d:h.date,t:`${plural(h.n,"licence")} added`})),
      ...L.req.filter(r=>r.status==="declined").map(r=>({d:r.date,t:`Request for ${plural(r.n,"licence")} declined`}))].sort((a,b)=>b.d-a.d)
      .map(h=>`<li><span>${h.t}</span><span class="sub">${dshort(h.d)}</span></li>`).join("")}</ul></details>`:""}
   </section>
   <section class="panel tcls"><div class="trow"><h3>Classes</h3></div>
    ${cls.length?`<div class="tclist">${cls.map(c=>{const open=classAsg(c).filter(a=>a.due>=todayISO()).length;
      return `<a class="clcard" href="#class-${c.id}"><div><b>${esc(c.name)}</b><span class="sub">${plural(c.students.length,"student")}${c.invites.length?` · ${c.invites.length} invited`:""} · ${plural(open,"open assignment")}</span></div><span class="tcode" title="Join code">${c.code}</span></a>`}).join("")}</div>`:`<p class="sub">No classes yet. Create your first one below.</p>`}
    <form id="clsForm" class="tinline"><label for="clsn">New class name<input type="text" id="clsn" placeholder="e.g. 10B Computer Science" maxlength="60" required></label><button class="btn" type="submit">Create class</button></form>
    <p class="err" id="clserr" hidden></p>
   </section>
  </div></div>`}

/* the progress and assignment tabs need the students' progress, which loads on demand */
function needProg(c){if(!SCH.progPending(c.students))return "";
  SCH.ensureProg(c.students).then(ch=>{if(ch&&location.hash==="#class-"+c.id)tRender()}).catch(e=>console.error(e));
  return `<div class="panel"><p class="sub" style="margin:0">Loading your students' progress…</p></div>`}

function classPage(id){const c=SC.classes[id],u=me();
  if(!c||!isTeacher()||c.teacher!==u.id)return `<div class="formwrap"><h1>Class not found</h1><a class="btn" href="#teacher">Back to your classes</a></div>`;
  const L=licInfo(u.id),tabs=[["students","Students"],["progress","Progress"],["assign","Assignments"],["lessons","Lesson access"]];
  let body="";
  if(TV.tab==="students"){
    const studs=studentsOf(c);
    body=`<div class="tgrid">
     <section class="panel"><h3>Add students</h3>
      <div class="tjoin"><span class="sub">Join code</span><span class="tcode big">${c.code}</span><button class="btn small" data-tc="copy" data-v="${c.code}">Copy</button><button class="btn small" data-tc="newcode">New code</button></div>
      <p class="sub" style="margin:0">Students create an account (or sign in), go to their dashboard and enter this code. They join straight away while you have free licences (<b>${L.free}</b> left).</p>
      <form id="invForm" class="tinv"><label for="invs">Invite by email<textarea id="invs" rows="3" placeholder="One email per line, or separated by commas"></textarea></label><button class="btn" type="submit">Add invitations</button></form>
      <p class="vfoot" style="margin:0">No email is sent yet. A student sees the invitation when they sign in with that address, so tell them to register with it.</p>
      <p class="err" id="inverr" hidden></p><p class="msg ok" id="invok" hidden></p>
      ${c.invites.length?`<div><span class="sub">Waiting to accept</span><ul class="tlist">${c.invites.map(e=>`<li><span class="mono">${esc(e)}</span><button class="btn small" data-tc="uninv" data-v="${esc(e)}">Cancel</button></li>`).join("")}</ul></div>`:""}
     </section>
     <section class="panel"><div class="trow"><h3>${plural(studs.length,"student")}</h3></div>
      ${studs.length?`<ul class="tlist">${studs.map(s=>`<li><span><b>${esc(s.name)}</b><br><span class="sub mono">${esc(s.email)}</span></span><button class="btn small" data-tc="remove" data-v="${s.id}">Remove</button></li>`).join("")}</ul>`:`<p class="sub">No students yet. Share the join code or add invitations.</p>`}
      <p class="vfoot" style="margin:0">Removing a student frees their licence. Their own progress isn't deleted.</p>
     </section></div>`}
  else if(TV.tab==="lessons")body=classLessons(c);
  else body=needProg(c)||(TV.tab==="progress"?classProgress(c):classAssign(c));
  return `<div style="${accent(1)}"><div class="crumbs"><a href="#teacher">Your classes</a> / ${esc(c.name)}</div>
  <div class="phead" style="padding-bottom:16px"><div class="eyebrow">Class · join code ${c.code}</div><h1>${esc(c.name)}</h1>
   <p>${plural(c.students.length,"student")} · ${plural(classAsg(c).length,"assignment")}</p></div>
  <div class="tabs ttabs" role="tablist">${tabs.map(([k,n])=>`<button role="tab" data-tc="tab" data-v="${k}" aria-selected="${TV.tab===k}">${n}</button>`).join("")}</div>
  <div class="tpane">${body}</div>
  <details class="tdanger"><summary>Class settings</summary><form id="renForm" class="tinline"><label for="renn">Class name<input type="text" id="renn" value="${esc(c.name)}" maxlength="60" required></label><button class="btn" type="submit">Rename</button></form>
   <button class="btn small" data-tc="delcls">Delete this class</button><span class="vfoot">Students are removed from the class and their licences are freed. The class's assignments are deleted.</span></details>${revOverlay()}${reModal()}</div>`}

function classProgress(c){
  const studs=studentsOf(c);
  if(!studs.length)return `<div class="panel"><p class="sub">Progress appears here once students join the class.</p></div>`;
  const rows=studs.map(s=>({s,m:stuSummary(s.id)})),N=ALL_LESSONS.length;
  const avg=f=>Math.round(rows.reduce((a,r)=>a+f(r.m),0)/rows.length),week=rows.filter(r=>Date.now()-r.m.last<7*864e5).length;
  const LV=["sunk","bad-soft","warn-soft","good-soft"];
  return `<div class="tstats">
    <div class="panel"><span class="eyebrow">Lessons complete</span><div class="stat">${avg(m=>m.done)}<small> / ${N} avg</small></div></div>
    <div class="panel" style="${accent(1)}"><span class="eyebrow">Paper 1</span><div class="stat">${avg(m=>m.p1)}<small>%</small></div><div class="bar"><i style="width:${avg(m=>m.p1)}%"></i></div></div>
    <div class="panel" style="${accent(2)}"><span class="eyebrow">Paper 2</span><div class="stat">${avg(m=>m.p2)}<small>%</small></div><div class="bar"><i style="width:${avg(m=>m.p2)}%"></i></div></div>
    <div class="panel"><span class="eyebrow">Active this week</span><div class="stat">${week}<small> / ${rows.length}</small></div></div></div>
  <section class="panel" style="margin-top:16px"><div class="trow"><h3>Students</h3><button class="btn small" data-tc="reprog">Refresh</button></div><div class="tscroll"><table class="table ttab"><thead><tr><th>Student</th><th>Lessons complete</th><th>Paper 1</th><th>Paper 2</th><th>Quick checks</th><th>Last active</th></tr></thead><tbody>
   ${rows.map(({s,m})=>`<tr><td><b>${esc(s.name)}</b></td><td><div class="tmini"><div class="bar"><i style="width:${m.done/N*100}%"></i></div><span class="mono">${m.done}</span></div></td><td class="mono">${m.p1}%</td><td class="mono">${m.p2}%</td><td>${m.qc==null?`<span class="sub">None yet</span>`:`<span class="mono">${m.qc}%</span> <span class="sub">avg of ${m.nqc}</span>`}</td><td class="sub">${ago(m.last)}</td></tr>`).join("")}</tbody></table></div></section>
  <section class="panel" style="margin-top:16px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline"><h3>By syllabus section</h3>
   <div class="legend">${[0,1,2,3].map(l=>`<span><i style="background:var(--${LV[l]})"></i>${LBL[l]}</span>`).join("")}</div></div>
   <div class="tscroll"><table class="theat"><thead><tr><th></th>${TOPICS.map(t=>`<th title="${esc(t.title)}"><a href="#t-${t.id}">${t.code}</a></th>`).join("")}</tr></thead><tbody>
   ${rows.map(({s,m})=>`<tr><th>${esc(s.name)}</th>${m.sec.map(x=>`<td style="background:var(--${LV[x.lv]})" title="${esc(s.name)} · ${x.t.code} ${esc(x.t.title)}: ${x.pct}%">${x.pct?x.pct:""}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
   <span class="sub">Each cell is the student's completion across all the tasks in that section. Hover a cell for details.</span></section>${examHeat(c,studs)}`}

function classAssign(c){
  const as=classAsg(c),studs=studentsOf(c);
  const F=TV.form||(TV.form=newForm());
  const picker=[1,2].map(pp=>{const np=F.lessons.filter(id=>{const l=ALL_LESSONS.find(x=>x.id===id);return l&&l.topic.ch.paper===pp}).length;return `<details class="tpaper"${TV.open["p"+pp]?" open":""} data-topen="p${pp}"><summary><span>Paper ${pp} · ${pp===1?"Computer systems":"Algorithms, programming and logic"}</span>${np?`<span class="chip sec">${np} chosen</span>`:""}</summary><div class="tpick">${TOPICS.filter(t=>t.ch.paper===pp&&t.lessons).map(t=>{const n=t.lessons.filter(l=>F.lessons.includes(l.id)).length;
    return `<details${TV.open[t.id]||n?" open":""} data-topen="${t.id}"><summary><span>${t.code} ${esc(t.title)}</span>${n?`<span class="chip sec">${n} chosen</span>`:""}</summary>
     <div class="tpl">${t.lessons.map(l=>`<label><input type="checkbox" data-tl="${l.id}"${F.lessons.includes(l.id)?" checked":""}> ${l.n}. ${esc(l.title)}</label>`).join("")}</div></details>`}).join("")}</div></details>`}).join("");
  const list=as.length?as.map(a=>{if(a.kind==="exam")return examAsgCard(a,studs);const st=studs.map(s=>({s,r:asgStatus(a,s.id)})),nd=st.filter(x=>x.r.complete).length,
      sc=st.length?Math.round(st.reduce((t,x)=>t+x.r.score,0)/st.length):0,ls=a.lessons.map(id=>ALL_LESSONS.find(l=>l.id===id)).filter(Boolean);
    return `<details class="panel tasg"${TV.open[a.id]?" open":""} data-topen="${a.id}"><summary><div><b>${esc(a.title)}</b><span class="sub">${dueText(a.due)} · ${plural(ls.length,"lesson")} · ${a.mode==="qc"?"quick checks only":"complete each lesson"}</span></div>
      <div class="tasum"><span class="mono">${nd}/${st.length}</span><span class="sub">completed</span></div></summary><div class="tasgb">
     ${a.note?`<p class="tnote">${esc(a.note)}</p>`:""}
     ${lessonAsgInsights(a,st)}
     <div class="tchips">${ls.map(l=>`<a class="chip none" href="#l-${l.id}">${l.topic.code} · ${esc(l.title)}</a>`).join("")}</div>
     ${st.length?`${reBar(a)}<div class="tscroll"><table class="table ttab"><thead><tr>${selHead(a,st)}<th>Student</th><th>Status</th><th>Score</th>${ls.map((l,i)=>`<th title="${esc(l.title)}">L${i+1}</th>`).join("")}<th></th></tr></thead><tbody>
      ${st.map(({s,r})=>`<tr>${selBox(a,s)}<td><b>${esc(s.name)}</b></td><td>${stChip(r)}</td><td class="mono">${r.started||r.complete?r.score+"%":"–"}</td>${r.per.map(x=>`<td class="tck" title="${esc(x.l.title)}: ${x.ok?"complete":x.started?x.pct+"%":"not started"}">${x.ok?`<span class="tick">✓</span>`:x.started?`<span class="sub">${x.pct}%</span>`:`<span class="sub">·</span>`}</td>`).join("")}<td><div class="tbb tnowrap">${r.started||r.complete?`<button class="btn small" data-tc="rev" data-a="${a.id}" data-v="${s.id}">View answers</button>`:""}${reBtn(a,s)}</div></td></tr>`).join("")}</tbody></table></div>
      <p class="sub" style="margin:0">Class average score ${sc}%. Score is ${a.mode==="qc"?"the best quick check result":"completion across all the lesson's tasks"}, averaged over the lessons.</p>`:`<p class="sub">No students in this class yet.</p>`}
     <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-tc="delasg" data-v="${a.id}">Delete assignment</button></div></div></details>`}).join(""):`<p class="sub">No assignments yet.</p>`;
  const anim=TV.spring;TV.spring=false;
  if(!TV.newOpen)return `<div class="tasgrid"><div class="tnewbar"><button class="btn primary tcreate" data-tc="newasg"><span aria-hidden="true">＋</span> Create an assignment</button></div>
   <section class="tasl"><div class="trow" style="margin:0 0 10px"><h3 style="margin:0">Set assignments</h3>${as.length?`<button class="btn small" data-tc="reprog">Refresh</button>`:""}</div>${list}</section></div>`;
  return `<div class="tasgrid"><section class="panel tnew${anim?" spring":""}"><div class="trow"><h3>New assignment</h3><button class="iconbtn" data-tc="closeasg" aria-label="Close without setting an assignment" title="Close"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>
   <form id="asgForm" class="tform">
    <label for="atitle">Title<input type="text" id="atitle" maxlength="80" value="${esc(F.title)}" placeholder="e.g. Buses and the fetch–decode–execute cycle"></label>
    <div class="tkind" role="radiogroup" aria-label="Assignment type">${[["lessons","Lessons","Work through lessons and their tasks"],["exam","Exam questions","A fixed set of past paper questions"]].map(([k,n,d])=>`<label class="${F.kind===k?"on":""}"><input type="radio" name="akind" value="${k}" data-ta="kind"${F.kind===k?" checked":""}><span><b>${n}</b><small>${d}</small></span></label>`).join("")}</div>
    <div class="tform2"><label for="adue">Due date<input type="date" id="adue" value="${F.due}" min="${todayISO()}"></label>
     ${F.kind==="exam"?`<label for="an">Number of questions<select id="an" data-ta="n">${[5,10,15,20,30].map(n=>`<option value="${n}"${F.n===n?" selected":""}>${n}</option>`).join("")}</select></label>`:`<label for="amode">Students must<select id="amode"><option value="all"${F.mode==="all"?" selected":""}>Complete each lesson (all tasks)</option><option value="qc"${F.mode==="qc"?" selected":""}>Pass each quick check</option></select></label>`}</div>
    <label for="anote">Message to students <span class="sub">(optional)</span><textarea id="anote" rows="2" maxlength="300">${esc(F.note)}</textarea></label>
    ${F.kind==="exam"?examFields(F):`<div><span class="tlab">Lessons <span class="sub">${plural(F.lessons.length,"lesson")} chosen</span></span>${picker}</div>`}
    <p class="err" id="asgerr" hidden></p>
    <button class="btn primary" type="submit">Set assignment</button>
   </form></section>
   <section class="tasl"><div class="trow" style="margin:0 0 10px"><h3 style="margin:0">Set assignments</h3>${as.length?`<button class="btn small" data-tc="reprog">Refresh</button>`:""}</div>${list}</section></div>`}

/* ---------- student side ---------- */
function todoPage(){const u=me(),c=myClass();
  if(!c)return `<div class="formwrap"><h1>To-do</h1><p>Your to-do list appears here when you're in a school class. Join one from your <a href="#dashboard">dashboard</a> with the code your teacher gives you.</p></div>`;
  markSeen();const as=myAsg().map(a=>({a,r:asgStatus(a,u.id)}));
  const todo=as.filter(x=>!x.r.complete),doneL=as.filter(x=>x.r.complete).reverse();
  const card=({a,r})=>{if(a.kind==="exam")return examTodoCard(a,r,c);const nx=r.per.find(x=>!x.ok);
    return tdCard(a,r,c,`${r.complete?`Due ${fmtDay(myDue(a))}`:dueText(myDue(a))} · ${plural(r.per.length,"lesson")}`,tdBar(r.nOk,r.per.length),`
     ${a.note?`<p class="tnote">${esc(a.note)}</p>`:""}${reFeedback(r,c)}
     <ul class="tdl">${r.per.map(x=>`<li class="${x.ok?"ok":""}"><span class="fdot ${x.ok?"ok":x.started?"part":""}" aria-hidden="true">${x.ok?"✓":""}</span><a href="#l-${x.l.id}">${x.l.topic.code} · ${esc(x.l.title)}</a><span class="sub">${x.ok?"Done":x.started?x.pct+"%":a.mode==="qc"?"Quick check":"Not started"}</span></li>`).join("")}</ul>
     ${nx?`<a class="btn primary small" style="align-self:flex-start" href="#l-${nx.l.id}">${nx.started?"Continue":"Start"}: ${esc(nx.l.title)}</a>`:""}
     <p class="vfoot" style="margin:0">${a.mode==="qc"?"Pass the quick check (3 out of 4) in each lesson.":"Complete every task in each lesson: the quick check, key vocabulary and activities."}</p>`)};
  return `<div style="${accent(1)}"><div class="phead" style="padding-bottom:18px"><div class="eyebrow">${esc(c.name)} · ${esc(teacherOf(c).name)}</div><h1>To-do</h1>
   <p>${todo.length?`You have ${plural(todo.length,"assignment")} to do.`:"You're all caught up."} Your progress is shared with your teacher.</p></div>
  ${todo.length?`<div class="todos">${todo.map(card).join("")}</div>`:`<div class="panel"><p class="sub">Nothing to do right now. New assignments from your teacher will appear here.</p></div>`}
  ${doneL.length?`<h2 style="margin:28px 0 12px">Completed</h2><div class="todos">${doneL.map(card).join("")}</div>`:""}${revOverlay()}</div>`}

/* banner shown across the site: a message from start-up, new assignments, or class invitations */
function schoolNotice(route){const n0=BOB.notice();if(n0)return `<div class="tbanner" role="status"><span>${esc(n0)}</span></div>`;
  const u=me();if(!u||isTeacher())return "";
  const inv=myInvites();if(inv.length&&route!=="dashboard"){const c=inv[0];
    return `<div class="tbanner" role="status"><span>📨 <b>${esc(teacherOf(c).name)}</b> invited you to join <b>${esc(c.name)}</b>.</span><span class="tbb"><button class="btn primary small" data-tc="accept" data-v="${c.id}">Join class</button><button class="btn small" data-tc="decline" data-v="${c.id}">Not now</button></span></div>`}
  if(route==="todo")return "";const n=unseen();if(!n.length)return "";const a=n[0];
  return `<div class="tbanner" role="status"><span>${reOf(a.id,u.id)?"↻ Reassigned":"📌 New assignment"}${n.length>1?` (+${n.length-1} more)`:""}: <b>${esc(a.title)}</b> · ${dueText(myDue(a))}</span><span class="tbb"><a class="btn primary small" href="#todo">Open to-do list</a><button class="btn small" data-tc="seen" aria-label="Dismiss">Dismiss</button></span></div>`}

/* dashboard panels */
function schoolPanel(){const u=me();if(!u)return "";
  if(isTeacher()){const L=licInfo(u.id),cls=tClasses(u.id),due=cls.flatMap(c=>classAsg(c).filter(a=>a.due>=todayISO()));
    return `<div class="panel span3" style="${accent(2)}"><div class="trow"><div><h3>Your classes</h3><p class="sub" style="margin:0">${u.school?esc(u.school)+" · ":""}${plural(cls.length,"class","classes")} · ${L.used} of ${plural(L.bought,"licence")} in use · ${plural(due.length,"open assignment")}</p></div><a class="btn primary" href="#teacher">Open teacher area</a></div>
     ${cls.length?`<div class="tclist">${cls.map(c=>`<a class="clcard" href="#class-${c.id}"><div><b>${esc(c.name)}</b><span class="sub">${plural(c.students.length,"student")}</span></div><span class="tcode">${c.code}</span></a>`).join("")}</div>`:`<p class="sub" style="margin:0">Request licences and create your first class in the teacher area. Below is your own practice progress.</p>`}</div>`}
  const c=myClass();
  if(c){const as=myAsg().map(a=>({a,r:asgStatus(a,u.id)})).filter(x=>!x.r.complete);
    return `<div class="panel span3" style="${accent(1)}"><div class="trow"><div><h3>${esc(c.name)}</h3><p class="sub" style="margin:0">${esc(teacherOf(c).name)}${teacherOf(c).school?" · "+esc(teacherOf(c).school):""}</p></div><a class="btn primary" href="#todo">To-do list${as.length?` (${as.length})`:""}</a></div>
     ${as.length?`<ul class="tdl">${as.slice(0,3).map(({a,r})=>`<li><span class="fdot ${r.started?"part":""}" aria-hidden="true"></span><a href="#todo">${esc(a.title)}</a><span class="sub${r.late?" bad":""}">${dueText(myDue(a))} · ${r.nOk}/${r.per.length}</span></li>`).join("")}</ul>`:`<p class="sub" style="margin:0">No assignments to do. Keep working through the lessons at your own pace.</p>`}</div>`}
  const inv=myInvites();
  return `<div class="panel span3"><div class="trow"><div><h3>Studying with a school?</h3><p class="sub" style="margin:0">Enter the join code your teacher gives you. You can also keep working on your own.</p></div></div>
   ${inv.map(c=>`<div class="tjoin"><span>📨 <b>${esc(teacherOf(c).name)}</b> invited you to <b>${esc(c.name)}</b></span><button class="btn primary small" data-tc="accept" data-v="${c.id}">Join class</button><button class="btn small" data-tc="decline" data-v="${c.id}">Decline</button></div>`).join("")}
   <form id="joinForm" class="tinline"><label for="jcode">Class join code<input type="text" id="jcode" maxlength="8" autocomplete="off" placeholder="K7M2QX" style="text-transform:uppercase"></label><button class="btn" type="submit">Join class</button></form><p class="err" id="joinerr" hidden></p></div>`}

/* ---------- events ---------- */
function tRender(){const y=scrollY;render();scrollTo(0,y)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tc]");if(!b)return;const a=b.dataset.tc,v=b.dataset.v,r=location.hash.slice(1),u=me();
  const c=r.startsWith("class-")?SC.classes[r.slice(6)]:null;
  if(a==="tab"){TV.tab=v;tRender();return}
  if(a==="goasg"){TV.tab="assign";TV.open={[v]:true};tRender();return}
  if(a==="newasg"){TV.newOpen=true;TV.spring=true;tRender();const t=$("#atitle");if(t)t.focus({preventScroll:true});return}
  if(a==="closeasg"){TV.newOpen=false;tRender();return}
  if(a==="copy"){try{navigator.clipboard.writeText(v);b.textContent="Copied"}catch(x){}return}
  if(a==="seen"){markSeen();tRender();return}
  if(a==="accept"){if(!u)return;tDo(()=>SCH.A.acceptInvite(v),{ok:()=>BOB.refreshContent().catch(()=>{}).then(()=>{location.hash="todo";render()})});return}
  if(a==="decline"){if(!u)return;tDo(()=>SCH.A.declineInvite(v));return}
  if(a==="asgstart"){const as=SC.asg[v];if(as)asgStartRun(as);return}
  if(a==="rev"){TV.rev={a:b.dataset.a,e:v};tRender();return}
  if(a==="revclose"){TV.rev=null;tRender();return}
  if(a==="revnav"){TV.rev.e=v;tRender();const o=$(".trevp");if(o)o.scrollTop=0;return}
  if(!c||!isTeacher()||c.teacher!==u.id)return;
  if(a==="reprog"){c.students.forEach(id=>delete SC.prog[id]);tDo(()=>SCH.load());return}
  if(a==="newcode"){if(confirm("Make a new join code? The old one will stop working."))tDo(()=>SCH.A.newCode(c.id))}
  else if(a==="uninv")tDo(()=>SCH.A.uninvite(c.id,v));
  else if(a==="remove"){const s=SC.users[v];if(confirm(`Remove ${s?s.name:"this student"} from ${c.name}? Their licence will be freed.`))tDo(()=>SCH.A.removeStudent(c.id,v))}
  else if(a==="delasg"){const as=SC.asg[v];if(as&&confirm(`Delete "${as.title}"? Students will no longer see it, and their answers to it are deleted.`))tDo(()=>SCH.A.deleteAssignment(v))}
  else if(a==="delcls"){if(confirm(`Delete ${c.name}? Its ${plural(c.students.length,"student")} will be removed and their licences freed.`))tDo(()=>SCH.A.deleteClass(c.id),{ok:()=>{location.hash="teacher"}})}
});
document.addEventListener("change",e=>{const t=e.target;
  if(t.matches("[data-tl]")){const F=TV.form;const id=t.dataset.tl;F.lessons=t.checked?[...F.lessons,id]:F.lessons.filter(x=>x!==id);
    F.lessons.sort((a,b)=>ALL_LESSONS.findIndex(l=>l.id===a)-ALL_LESSONS.findIndex(l=>l.id===b));
    for(const d of [t.closest("details"),t.closest("details.tpaper")]){if(!d)continue;const n=d.querySelectorAll("[data-tl]:checked").length,s=d.querySelector(":scope > summary");s.querySelector(".chip")?.remove();if(n)s.insertAdjacentHTML("beforeend",`<span class="chip sec">${n} chosen</span>`)}
    const lab=document.querySelector(".tlab .sub");if(lab)lab.textContent=plural(F.lessons.length,"lesson")+" chosen"}
  if(TV.form&&t.closest("#asgForm")){const F=TV.form;if(t.id==="adue")F.due=t.value;if(t.id==="amode")F.mode=t.value;
    const k=t.dataset.ta;if(k){if(k==="kind")F.kind=t.value;else if(k==="n")F.n=+t.value;else if(k==="big")F.big=t.checked;
      else if(k==="paper"){const pp=+t.value;F.papers=t.checked?[...new Set([...F.papers,pp])]:F.papers.filter(x=>x!==pp);F.topics=F.topics.filter(id=>F.papers.includes(TOPICS.find(x=>x.id===id).ch.paper))}
      else if(k==="year"){const y=+t.value;F.years=t.checked?[...new Set([...F.years,y])]:F.years.filter(x=>x!==y)}
      else if(k==="topic"){F.topics=t.checked?[...new Set([...F.topics,t.value])]:F.topics.filter(x=>x!==t.value)}
      else if(k==="alltop"){const pp=+t.dataset.p,ids=TOPICS.filter(x=>x.ch.paper===pp&&examPool({...F,topics:[x.id]}).length).map(x=>x.id);F.topics=t.checked?[...new Set([...F.topics,...ids])]:F.topics.filter(x=>!ids.includes(x))}
      tRender()}}});
document.addEventListener("input",e=>{const t=e.target;if(!TV.form||!t.closest("#asgForm"))return;if(t.id==="atitle")TV.form.title=t.value;if(t.id==="anote")TV.form.note=t.value});
document.addEventListener("toggle",e=>{const d=e.target;if(d.dataset&&d.dataset.topen)TV.open[d.dataset.topen]=d.open},true);
document.addEventListener("submit",e=>{const f=e.target,u=me();const err=(id,m)=>{const x=$("#"+id);if(x){x.textContent=m;x.hidden=!m}};
  if(f.id==="joinForm"){e.preventDefault();const code=$("#jcode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,"");
    if(!code)return err("joinerr","Enter the code your teacher gave you.");
    tDo(()=>SCH.A.joinCode(code),{err:"joinerr",ok:()=>BOB.refreshContent().catch(()=>{}).then(()=>{location.hash="todo";render()})});return}
  if(!isTeacher())return;
  if(f.id==="reqForm"){e.preventDefault();const n=Math.floor(+$("#reqn").value);if(!(n>=1&&n<=1000))return err("reqerr","Enter a number of licences from 1 to 1000.");
    TV.req=n;tDo(()=>SCH.A.requestLicences(n,$("#reqm").value.trim()),{err:"reqerr"});return}
  if(f.id==="clsForm"){e.preventDefault();const name=$("#clsn").value.trim();if(!name)return err("clserr","Enter a name for the class.");
    let id=null;tDo(async()=>{id=await SCH.A.createClass(name)},{err:"clserr",ok:()=>{TV.tab="students";location.hash="class-"+id}});return}
  const c=SC.classes[location.hash.slice(7)];if(!c||c.teacher!==u.id)return;
  if(f.id==="renForm"){e.preventDefault();const n=$("#renn").value.trim();if(n)tDo(()=>SCH.A.renameClass(c.id,n));return}
  if(f.id==="invForm"){e.preventDefault();const list=[...new Set($("#invs").value.split(/[\s,;]+/).map(x=>x.trim().toLowerCase()).filter(Boolean))];
    const bad=list.filter(x=>!/^\S+@\S+\.\S+$/.test(x));if(!list.length)return err("inverr","Enter at least one email address.");if(bad.length)return err("inverr",`Check ${bad.length>1?"these addresses":"this address"}: ${bad.join(", ")}`);
    const inCls=new Set(studentsOf(c).map(s=>s.email)),already=list.filter(x=>inCls.has(x)),add=list.filter(x=>!inCls.has(x)&&!c.invites.includes(x));
    tDo(()=>SCH.A.invite(c.id,add),{err:"inverr",ok:()=>setTimeout(()=>{const ok=$("#invok"),L=licInfo(u.id),c2=SC.classes[c.id];if(ok){ok.textContent=`${plural(add.length,"invitation")} added${already.length?`; ${already.length} already in the class`:""}.${c2&&c2.invites.length>L.free?` You have ${L.free} free licences, so request more before everyone accepts.`:""}`;ok.hidden=false}})});return}
  if(f.id==="asgForm"){e.preventDefault();const F=TV.form;F.title=$("#atitle").value.trim();F.due=$("#adue").value;F.note=$("#anote").value.trim();
    if(F.kind!=="exam")F.mode=$("#amode").value;
    if(!F.title)return err("asgerr","Give the assignment a title.");if(!F.due)return err("asgerr","Choose a due date.");if(F.due<todayISO())return err("asgerr","The due date is in the past.");
    let row;
    if(F.kind==="exam"){const pool=examPool(F);if(!F.topics.length)return err("asgerr","Choose at least one syllabus section.");if(!pool.length)return err("asgerr","No questions match these choices. Choose more sections or years.");
      const qids=shuffle(pool.map(q=>q.id)).slice(0,F.n).sort((x,y)=>EXQ.findIndex(q=>q.id===x)-EXQ.findIndex(q=>q.id===y));
      row={kind:"exam",cls:c.id,title:F.title,note:F.note,qids,due:F.due,spec:{papers:F.papers,topics:F.topics,years:F.years,big:F.big,n:F.n}}}
    else{if(!F.lessons.length)return err("asgerr","Choose at least one lesson.");
      row={kind:"lessons",cls:c.id,title:F.title,note:F.note,lessons:F.lessons.slice(),mode:F.mode,due:F.due}}
    let id=null;tDo(async()=>{id=await SCH.A.createAssignment(row)},{err:"asgerr",ok:()=>{TV.lastKind=F.kind;TV.form=null;TV.newOpen=false}});return}
});
document.addEventListener("change",e=>{if(e.target.name==="role"){const l=$("#rcodel");if(l)l.hidden=e.target.value!=="student"}});

/* ================= exam-question assignments ================= */
const EXYEARS=[...new Set(EXAMS.map(x=>2000+ +x.id.slice(0,2)))].sort();
const exYear=x=>2000+ +x.slice(0,2);
const L2T={};ALL_LESSONS.forEach(l=>L2T[l.id]=l.topic.id);
function newForm(){return {kind:TV.lastKind||"lessons",title:"",due:isoDay(new Date(Date.now()+7*864e5)),note:"",mode:"all",lessons:[],papers:[1],topics:[],years:EXYEARS.slice(),n:10,big:false}}
/* every question that fits the teacher's choices */
function examPool(F){return EXQ.filter(q=>F.papers.includes(exPap(q.x))&&F.years.includes(exYear(q.x))&&(F.big||q.t!=="big")&&q.l.some(l=>F.topics.includes(L2T[l])))}
function examFields(F){const pool=examPool(F),n=Math.min(F.n,pool.length),avgM=pool.length?pool.reduce((a,q)=>a+q.m,0)/pool.length:0;
  const tops=pp=>TOPICS.filter(t=>t.ch.paper===pp).map(t=>({t,k:examPool({...F,topics:[t.id]}).length})).filter(x=>x.k);
  return `<fieldset class="tfs"><legend>Exam papers</legend><div class="tchk">${[1,2].map(pp=>`<label><input type="checkbox" data-ta="paper" value="${pp}"${F.papers.includes(pp)?" checked":""}> Paper ${pp}</label>`).join("")}
    ${F.papers.includes(2)?`<label><input type="checkbox" data-ta="big"${F.big?" checked":""}> Include the 15-mark programming questions</label>`:""}</div></fieldset>
   <fieldset class="tfs"><legend>Exam years</legend><div class="tchk">${EXYEARS.map(y=>`<label><input type="checkbox" data-ta="year" value="${y}"${F.years.includes(y)?" checked":""}> ${y}</label>`).join("")}</div></fieldset>
   <div><span class="tlab">Syllabus sections <span class="sub">${plural(F.topics.length,"section")} chosen</span></span>
    ${F.papers.map(pp=>{const T=tops(pp),on=T.filter(x=>F.topics.includes(x.t.id)).length;
      return `<details class="tpaper"${TV.open["xp"+pp]?" open":""} data-topen="xp${pp}"><summary><span>Paper ${pp} · ${pp===1?"Computer systems":"Algorithms, programming and logic"}</span>${on?`<span class="chip sec">${on} chosen</span>`:""}</summary>
       <div class="tpl"><span class="sub" style="text-align:right;font-size:.75rem">questions</span><label class="tall"><input type="checkbox" data-ta="alltop" data-p="${pp}"${on&&on===T.length?" checked":""}> <b>All sections</b></label>
       ${T.map(({t,k})=>`<label><input type="checkbox" data-ta="topic" value="${t.id}"${F.topics.includes(t.id)?" checked":""}> ${t.code} ${esc(t.title)} <span class="sub">${k}</span></label>`).join("")}</div></details>`}).join("")||`<p class="sub">Choose a paper first.</p>`}</div>
   <p class="tpool">${F.topics.length?`<b>${pool.length}</b> questions match. Each student gets the same <b>${n}</b>, picked at random when you set it (about ${Math.round(avgM*n)} marks).${pool.length<F.n?" There aren't enough matching questions for the number you chose, so all of them will be used.":""}`:"Choose at least one section to see how many questions match."}</p>`}
/* a student's answers: their own live state, or what the server holds for them */
const subOf=(aid,id)=>S.user&&id===S.user.id?(S.asgAns||{})[aid]:((SC.subs[aid]||{})[id]);
function asgExamStatus(a,id){const r=subOf(a.id,id),tot=a.qids.reduce((t,q)=>t+(EXQ.find(x=>x.id===q)||{m:0}).m,0);
  const ans=r?r.ans||{}:{},n=a.qids.filter(q=>ans[q]).length,tm=tMarks(a.id,id),mk=q=>q in tm?tm[q]:ans[q]?ans[q].m:0,marks=a.qids.reduce((t,q)=>t+mk(q),0);
  const complete=!!(r&&r.done),started=!!r&&n>0,late=!complete&&effDue(a,id)<todayISO(),re=reOf(a.id,id);
  return {re,reN:reList(a.id,id).length,exam:true,per:a.qids.map(q=>({id:q,ok:!!ans[q],m:ans[q]||q in tm?mk(q):null,t:q in tm,q:EXQ.find(x=>x.id===q)})),nOk:n,marks,total:tot,score:tot?Math.round(marks/tot*100):0,complete,started,late,date:r&&r.date,key:complete?"done":late?"late":started?"prog":"todo"}}
function examAsgCard(a,studs){const st=studs.map(s=>({s,r:asgStatus(a,s.id)})),nd=st.filter(x=>x.r.complete).length,qs=a.qids.map(id=>EXQ.find(q=>q.id===id)).filter(Boolean),tot=qs.reduce((t,q)=>t+q.m,0);
  const fin=st.filter(x=>x.r.complete),avg=fin.length?Math.round(fin.reduce((t,x)=>t+x.r.score,0)/fin.length):null,sp=a.spec||{};
  return `<details class="panel tasg"${TV.open[a.id]?" open":""} data-topen="${a.id}"><summary><div><b>${esc(a.title)}</b><span class="sub">${dueText(a.due)} · ${plural(qs.length,"exam question")} · ${tot} marks</span></div>
    <div class="tasum"><span class="mono">${nd}/${st.length}</span><span class="sub">completed</span></div></summary><div class="tasgb">
   ${a.note?`<p class="tnote">${esc(a.note)}</p>`:""}
   ${examAsgInsights(a,st)}
   <p class="sub" style="margin:0">Paper ${(sp.papers||[]).join(" and ")} · ${(sp.years||[]).join(", ")}${sp.big?" · includes 15-mark questions":""} · sections ${(sp.topics||[]).map(id=>(TOPICS.find(t=>t.id===id)||{code:id}).code).join(", ")}</p>
   ${st.length?`${reBar(a)}<div class="tscroll"><table class="table ttab"><thead><tr>${selHead(a,st)}<th>Student</th><th>Status</th><th>Score</th>${qs.map((q,i)=>`<th title="${esc(exX(q.x).s)} ${exX(q.x).code} Q${q.n} · ${q.m} marks">Q${i+1}</th>`).join("")}<th></th></tr></thead><tbody>
    ${st.map(({s,r})=>`<tr>${selBox(a,s)}<td><b>${esc(s.name)}</b></td><td>${stChip(r)}</td><td class="mono">${r.started||r.complete?`${r.marks}/${r.total} <span class="sub">${r.score}%</span>`:"–"}</td>${r.per.map(x=>`<td class="tck"><span class="${x.m==null?"sub":x.m===x.q.m?"tgood":x.m?"tpart":"tbad"}"${x.t?' title="Mark changed by you"':""}>${x.m==null?"·":x.m}${x.t?"<sup>*</sup>":""}</span></td>`).join("")}<td><div class="tbb tnowrap">${r.started||r.complete?`<button class="btn small" data-tc="rev" data-a="${a.id}" data-v="${s.id}">View answers</button>`:""}${reBtn(a,s)}</div></td></tr>`).join("")}
    <tr class="tqm"><td colspan="4" class="sub">Marks available</td>${qs.map(q=>`<td class="tck sub">${q.m}</td>`).join("")}<td></td></tr></tbody></table></div>
    <p class="sub" style="margin:0">${avg==null?"No one has finished yet.":`Average for students who have finished: ${avg}%.`} Answers that the computer can't mark are self-marked by the student against the mark scheme, so check them under View answers, where you can change any mark. * shows a mark you've changed.</p>`:`<p class="sub">No students in this class yet.</p>`}
   <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-tc="delasg" data-v="${a.id}">Delete assignment</button></div></div></details>`}
function examTodoCard(a,r,c){const u=me();
  return tdCard(a,r,c,`${r.complete?`Handed in ${r.date?new Date(r.date).toLocaleDateString("en-GB",{day:"numeric",month:"short"}):""}`:dueText(myDue(a))} · ${plural(r.per.length,"exam question")} · ${r.total} marks`,
    r.complete?`<span class="tdscore"><b>${r.marks}/${r.total}</b> ${r.score}%</span>`:tdBar(r.nOk,r.per.length),`
   ${a.note?`<p class="tnote">${esc(a.note)}</p>`:""}${reFeedback(r,c)}
   ${r.complete?`<div class="tscore"><b>${r.marks}/${r.total}</b><span>${r.score}%</span></div><button class="btn small" style="align-self:flex-start" data-tc="rev" data-a="${a.id}" data-v="${u.id}">Review my answers</button>`
     :`<div class="tprog"><div class="bar"><i style="width:${r.per.length?r.nOk/r.per.length*100:0}%"></i></div><span class="mono">${r.nOk}/${r.per.length}</span></div>
      <button class="btn primary small" style="align-self:flex-start" data-tc="asgstart" data-v="${a.id}">${r.nOk?"Continue":"Start"} the questions</button>`}
   <p class="vfoot" style="margin:0">${r.complete?"Your answers and marks have been sent to your teacher.":"Your answers save as you go. You can stop and carry on later; it's handed in when you finish the last question."}</p>`)}
/* a to-do item: folded it shows the title, status, due date and progress; open it for the rest */
const tdBar=(n,m)=>`<span class="tprog tdmini"><span class="bar"><i style="width:${m?n/m*100:0}%"></i></span><span class="mono">${n}/${m}</span></span>`;
function tdCard(a,r,c,line,right,body){const k="td-"+a.id;
  return `<details class="panel todo ts-${r.key}"${TV.open[k]?" open":""} data-topen="${k}"><summary><div class="tdsum"><div class="tdtitle"><h3>${esc(a.title)}</h3><span class="sub${r.late&&!r.complete?" tdlate":""}">${line}</span></div>
   <div class="tdright">${stChip(r)}${right}</div></div></summary>
   <div class="todob"><span class="sub">Set by ${esc(teacherOf(c).name)} on ${new Date(a.set).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</span>${body}</div></details>`}

/* review a student's answers (teacher, or the student themselves) */
function revOverlay(){if(!TV.rev)return "";const a=SC.asg[TV.rev.a];if(!a)return "";if(a.kind!=="exam")return lessonRevOverlay(a);const teach=isTeacher();
  const c=SC.classes[a.cls],studs=teach&&c?studentsOf(c).filter(s=>{const x=asgStatus(a,s.id);return x.started||x.complete}):[];
  const i=studs.findIndex(s=>s.id===TV.rev.e),st=SC.users[TV.rev.e]||{name:"Student"},r=asgStatus(a,TV.rev.e);
  const ans=subOf(a.id,TV.rev.e)||{ans:{}};ans.ans=ans.ans||{};
  const nav=teach&&studs.length>1?`<div class="tbb">${i>0?`<button class="btn small" data-tc="revnav" data-v="${studs[i-1].id}">← ${esc(studs[i-1].name.split(" ")[0])}</button>`:""}${i<studs.length-1?`<button class="btn small" data-tc="revnav" data-v="${studs[i+1].id}">${esc(studs[i+1].name.split(" ")[0])} →</button>`:""}</div>`:"";
  const body=a.qids.map((id,k)=>{const q=EXQ.find(x=>x.id===id);if(!q)return "";exRows(q);const X=exX(q.x),A=ans.ans[id],c=A&&A.c,tm=tMarks(a.id,TV.rev.e),orig=A?A.m:0,ch=id in tm,m=ch?tm[id]:orig;
    const self=EX_SELF.has(q.t)&&!(q.t==="wr"&&q.auto);let h;
    if(!c)h=`<p class="sub">Not answered.</p>`;
    else if(q.t==="wr"||q.t==="big")h=`<div><span class="vfoot">${teach?"Student's":"Your"} code</span>${c.code&&c.code.trim()?pcBox(c.code):'<p class="vfoot">(no answer)</p>'}</div>${q.t==="big"?exBigMS(q,{...c,done:true}):q.ms?exMS(q,{...c,done:true}):""}`;
    else if(self)h=exMine(q,c).replace(/Your answer/g,teach?"Student's answer":"Your answer")+(q.ms?exMS(q,{...c,done:true}):"");
    else h=`<div class="exans">${exInputs(q,c,c.R||{marks:0,f:[]})}</div><div class="exms"><span class="vfoot">Mark scheme answer</span>${exAnswerHTML(q)}</div>`;
    const tag=!c?"":self?`<span class="chip dev">Self-marked</span>`:(c.over||(c.ov&&c.ov.length))?`<span class="chip dev">Student counted their wording</span>`:`<span class="chip none">Marked automatically</span>`;
    if(teach)h=h.replace(/Your mark/g,"Student's mark").replace(/Tick each point your answer makes\./g,"Points the student ticked as made by their answer.");
    return `<h3 class="trqn">Question ${k+1}</h3><article class="trq"><div class="exhead"><span class="exsrc">${X.s} · ${X.code} · Q${q.n}</span>${teach?`<span class="tmk"><label for="tm-${id}">Mark</label><select id="tm-${id}" data-tm="${id}">${[...Array(q.m+1)].map((_,v)=>`<option value="${v}"${v===m?" selected":""}>${v}</option>`).join("")}</select><span>/ ${q.m}</span></span>`:`<span class="trm ${m===q.m?"tgood":m?"tpart":"tbad"}">${m} / ${q.m}</span>`}</div>
      <div class="trtags">${tag}${ch?`<span class="chip sec">${teach?`Changed by you from ${orig}`:`Mark changed by your teacher (was ${orig})`}</span>${teach?`<button class="btn small" data-tc="tmreset" data-v="${id}">Undo</button>`:""}`:""}</div>
      ${q.c?`<div class="exctx">${q.c}</div>`:""}${exFigs(q)}<div class="exqt">${q.q}</div>${h}</article>`}).join("");
  return `<div class="trev" role="dialog" aria-modal="true" aria-label="Answers for ${esc(teach?st.name:"you")}"><div class="trevp">
   <div class="trevh"><div><span class="eyebrow">${esc(a.title)}</span><h2>${teach?esc(st.name):"Your answers"}</h2><span class="sub">${r.marks}/${r.total} marks · ${r.score}% · ${r.complete?"handed in":"not finished yet"}</span></div>
    <div class="tbb">${nav}<button class="btn primary small" data-tc="revclose">Close</button></div></div>
   <div class="trevb">${body}</div></div></div>`}
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&(TV.rev||TV.reas)){TV.rev=null;TV.reas=null;tRender()}});

/* running an exam assignment in the exam question runner */
function asgStartRun(a){const u=me();if(!u)return;S.asgAns=S.asgAns||{};
  const r=S.asgAns[a.id]||(S.asgAns[a.id]={ans:{},done:false,date:null});if(r.done)return;
  const q0=EXQ.find(q=>q.id===a.qids[0]);if(q0){EX.paper=exPap(q0.x)}
  exStart(a.qids.slice());EX.asg=a.id;EX.res={};a.qids.forEach(id=>{if(r.ans[id])EX.res[id]=r.ans[id].m});
  const k=a.qids.findIndex(id=>!r.ans[id]);EX.i=k<0?a.qids.length-1:k;exNew();save();
  if(location.hash==="#exams")render();else location.hash="exams"}
const _exStart0=exStart;exStart=function(ids){_exStart0(ids);EX.asg=null};
const _exRecord0=exRecord;exRecord=function(q,mark){_exRecord0(q,mark);
  if(EX.asg&&S.asgAns&&S.asgAns[EX.asg]){const c=JSON.parse(JSON.stringify(EX.c));delete c.sqlres;S.asgAns[EX.asg].ans[q.id]={m:mark,c};save()}};
let EXQUIT=false;document.addEventListener("click",e=>{if(e.target.closest('#exw [data-ex="quit"]'))EXQUIT=true},true);
const _exDraw0=exDraw;exDraw=function(){_exDraw0();const el=$("#exw");if(!el)return;
  if(!EX.asg){if(EX.mode==="done")exDoneWrap(el,Object.keys(EX.res||{}),id=>EX.res[id]);return}
  const a=SC.asg[EX.asg];if(!a){EX.asg=null;return}
  const r=S.asgAns[a.id];
  if(EX.mode==="done"){if(!EXQUIT&&!r.done){r.done=true;r.date=Date.now();save()}EXQUIT=false;const st=asgStatus(a,me().id);
    el.innerHTML=`<div class="panel" style="${accent(1)}"><span class="eyebrow">Assignment · ${esc(a.title)}</span><h2 style="margin:0">${st.complete?"Handed in":"Progress saved"}</h2>
     ${st.complete?`<div class="tscore"><b>${st.marks}/${st.total}</b><span>${st.score}%</span></div><p style="margin:0">Your answers and marks have been sent to your teacher.</p>`:`<p style="margin:0">You've answered ${st.nOk} of ${st.per.length} questions. Carry on from your to-do list when you're ready; it's handed in when you finish the last question.</p>`}
     <div class="tbb">${st.complete?`<button class="btn primary" data-tc="asgreview" data-v="${a.id}">Review my answers</button><a class="btn" href="#todo" data-tc="asgleave">Back to my to-do list</a>`:`<a class="btn primary" href="#todo" data-tc="asgleave">Back to my to-do list</a>`}</div></div>`;
    exDoneWrap(el,a.qids.filter(id=>r.ans[id]),id=>{const tm=tMarks(a.id,me().id);return id in tm?tm[id]:r.ans[id]?r.ans[id].m:0})}};
document.addEventListener("click",e=>{if(e.target.closest('[data-tc="asgleave"]')){EX.asg=null;EX.mode="setup"}
  const rv=e.target.closest('[data-tc="asgreview"]');if(rv&&me()){EX.asg=null;EX.mode="setup";TV.rev={a:rv.dataset.v,e:me().id};location.hash="todo"}});
function tPost(el){el.querySelectorAll(".trev pre.pc").forEach(pcDecorate)}

/* teacher's own marks for exam assignments, kept separately from the student's answers */
const tMarks=(aid,id)=>(SC.tmarks[aid]||{})[id]||{};
function setTMark(aid,id,qid,v){const A=SC.tmarks[aid]=SC.tmarks[aid]||{},M=A[id]=A[id]||{},was=qid in M?M[qid]:null;
  if(v==null)delete M[qid];else M[qid]=v;
  const p=$(".trevp"),y=p?p.scrollTop:0;tRender();const p2=$(".trevp");if(p2)p2.scrollTop=y;
  SCH.A.setMark(aid,id,qid,v).catch(e=>{if(was==null)delete M[qid];else M[qid]=was;alert("That mark wasn't saved: "+e.message);tRender()})}
document.addEventListener("change",e=>{const t=e.target;if(!t.matches("[data-tm]")||!TV.rev||!isTeacher())return;const a=SC.asg[TV.rev.a],q=EXQ.find(x=>x.id===t.dataset.tm);
  const A=subOf(a.id,TV.rev.e),orig=A&&A.ans&&A.ans[q.id]?A.ans[q.id].m:0,v=+t.value;setTMark(a.id,TV.rev.e,q.id,v===orig?null:v)});
document.addEventListener("click",e=>{const b=e.target.closest('[data-tc="tmreset"]');if(!b||!TV.rev||!isTeacher())return;setTMark(TV.rev.a,TV.rev.e,b.dataset.v,null)});

/* while doing an exam assignment the page shows only the assignment's questions:
   no paper choice, practise/insights tabs, stats or topic picker to lead away from it */
const _exPage0=exPage;exPage=function(){const a=EX.asg&&SC.asg[EX.asg];if(!a)return _exPage0();
  return `<div class="crumbs"><a href="#todo" data-tc="asgleave">To-do</a><span>/</span><span>${esc(a.title)}</span></div>
  <div class="lhead"><div class="eyebrow">Assignment · ${dueText(myDue(a))} · answers save as you go</div><h1>${esc(a.title)}</h1>${a.note?`<p class="tnote" style="max-width:64ch">${esc(a.note)}</p>`:""}</div>
  <div class="fcpage exfull"><div class="fcpanel"><h2 id="exh2"></h2><div class="exrun" id="exw"></div></div></div>`};
/* leaving the exam page mid-assignment ends the assignment view; Continue on the to-do list picks it up again */
addEventListener("hashchange",()=>{if(EX.asg&&location.hash!=="#exams"){EX.asg=null;EX.mode="setup"}});

/* ---------- end of a round: how often these topics and question types come up in exams ---------- */
function exRoundInsights(ids,markOf){const qs=ids.map(id=>EXQ.find(q=>q.id===id)).filter(Boolean);if(!qs.length)return "";
  const P=exPap(qs[0].x),XS=EXAMS.filter(x=>exPap(x.id)===P),NP=XS.length,PQ=EXQ.filter(q=>exPap(q.x)===P);
  const pct=(n,d)=>d?Math.round(n/d*100):0;
  /* topics: every lesson these questions test */
  const L=[...new Set(qs.flatMap(q=>q.l))].map(id=>{const all=PQ.filter(q=>q.l.includes(id)),papers=new Set(all.map(q=>q.x)).size,
      mine=qs.filter(q=>q.l.includes(id)),got=mine.reduce((t,q)=>t+markOf(q.id),0),max=mine.reduce((t,q)=>t+q.m,0);
      return {l:exL(id),papers,marks:all.reduce((t,q)=>t+q.m,0)/(NP||1),got,max}}).filter(x=>x.l).sort((a,b)=>b.papers-a.papers);
  /* question types */
  const T=[...new Set(qs.map(exType))].map(k=>{const def=EX_TYPES.find(t=>t[0]===k),all=PQ.filter(q=>exType(q)===k),
      mine=qs.filter(q=>exType(q)===k),got=mine.reduce((t,q)=>t+markOf(q.id),0),max=mine.reduce((t,q)=>t+q.m,0);
      return {k,lab:def?def[1]:k,papers:new Set(all.map(q=>q.x)).size,share:pct(all.reduce((t,q)=>t+q.m,0),PQ.reduce((t,q)=>t+q.m,0)),got,max}}).sort((a,b)=>b.papers-a.papers);
  const bar=(n,d)=>`<span class="rbar" aria-hidden="true"><i style="width:${pct(n,d)}%"></i></span>`;
  const you=(g,m)=>`<span class="rmine ${g===m?"tgood":g?"tpart":"tbad"}">${g}/${m}</span>`;
  const weak=[...T].filter(t=>t.max&&t.got/t.max<.5).sort((a,b)=>b.papers-a.papers)[0];
  return `<aside class="rins" aria-label="How often these come up">
   <span class="eyebrow">How often this comes up</span>
   <p class="sub" style="margin:0">Across all ${NP} Paper ${P} papers in the question bank.</p>
   <h4>Topics</h4><ul>${L.map(x=>`<li><div class="rrow"><a href="#l-${x.l.id}">${x.l.topic.code} · ${esc(x.l.title)}</a>${you(x.got,x.max)}</div>${bar(x.papers,NP)}<span class="sub">In ${x.papers} of ${NP} papers · about ${x.marks<1?x.marks.toFixed(1):Math.round(x.marks)} mark${Math.round(x.marks)===1?"":"s"} a paper</span></li>`).join("")}</ul>
   <h4>Question types</h4><ul>${T.map(x=>`<li><div class="rrow"><span>${esc(x.lab)}</span>${you(x.got,x.max)}</div>${bar(x.papers,NP)}<span class="sub">In ${x.papers} of ${NP} papers · ${x.share}% of all marks</span></li>`).join("")}</ul>
   ${weak?`<p class="rtip">💡 <b>${esc(weak.lab)}</b> come up in ${weak.papers} of ${NP} papers and cost you marks here, so they're worth practising.</p>`:""}
   <a class="btn small" href="#exam-insights" data-tc="asgleave" style="align-self:flex-start">See all exam insights</a></aside>`}
function exDoneWrap(el,ids,markOf){const ins=exRoundInsights(ids,markOf);if(!ins||el.querySelector(".rins"))return;
  el.innerHTML=`<div class="rdone"><div class="rmain">${el.innerHTML}</div>${ins}</div>`;el.querySelectorAll("pre.pc").forEach(pcDecorate)}

/* during an exam assignment, the menu shows you're in your to-do list, not exam practice */
const _nav0=nav;nav=function(route){_nav0(route);if(route==="exams"&&EX.asg){const ls=$("#links");if(!ls)return;
  ls.querySelectorAll('a[href="#exams"]').forEach(x=>x.classList.remove("on"));const t=ls.querySelector('a[href="#todo"]');if(t)t.classList.add("on")}};

/* ---------- assignment insights for the teacher ---------- */
const tile=(lab,val,sub)=>`<div class="tin"><span class="eyebrow">${lab}</span><b>${val}</b>${sub?`<span class="sub">${sub}</span>`:""}</div>`;
function lessonAsgInsights(a,st){if(!st.length)return "";
  const nd=st.filter(x=>x.r.complete).length,ns=st.filter(x=>!x.r.started&&!x.r.complete),late=st.filter(x=>x.r.late).length;
  const avg=Math.round(st.reduce((t,x)=>t+x.r.score,0)/st.length);
  const per=a.lessons.map((id,i)=>{const l=ALL_LESSONS.find(x=>x.id===id);if(!l)return null;const xs=st.map(x=>x.r.per.find(p=>p.l.id===id)).filter(Boolean);
    return {l,i,ok:xs.filter(p=>p.ok).length,pct:xs.length?Math.round(xs.reduce((t,p)=>t+p.pct,0)/xs.length):0}}).filter(Boolean);
  const best=per.length>1?[...per].sort((x,y)=>y.pct-x.pct)[0]:null,worst=per.length>1?[...per].sort((x,y)=>x.pct-y.pct)[0]:null;
  return `<div class="tins"><div class="tingrid">
    ${tile("Completed",`${nd}/${st.length}`,late?`${late} overdue`:"")}
    ${tile("Average score",avg+"%",a.mode==="qc"?"best quick check":"completion of tasks")}
    ${best?tile("Strongest lesson",best.pct+"%",`L${best.i+1} · ${esc(best.l.title)}`):""}
    ${worst?tile("Weakest lesson",worst.pct+"%",`L${worst.i+1} · ${esc(worst.l.title)}`):""}</div>
   ${ns.length?`<p class="tinote">Not started yet: ${ns.map(x=>esc(x.s.name)).join(", ")}.</p>`:""}${lessonQInsights(a,st)}</div>`}

function examAsgInsights(a,st){const qs=a.qids.map(id=>EXQ.find(q=>q.id===id)).filter(Boolean);if(!st.length||!qs.length)return "";
  const went=st.filter(x=>x.r.started||x.r.complete);
  if(!went.length)return `<div class="tins"><p class="tinote" style="margin:0">Insights appear here once students start answering.</p></div>`;
  const fin=st.filter(x=>x.r.complete),pool=fin.length?fin:went,scores=pool.map(x=>x.r.score);
  const avg=Math.round(scores.reduce((t,v)=>t+v,0)/scores.length);
  const hi=pool.reduce((m,x)=>x.r.score>m.r.score?x:m,pool[0]),lo=pool.reduce((m,x)=>x.r.score<m.r.score?x:m,pool[0]);
  /* each question: share of available marks gained by the students who answered it */
  const Q=qs.map((q,i)=>{const got=went.map(x=>x.r.per[i]).filter(p=>p&&p.m!=null);
    return {q,i,n:got.length,pct:got.length?Math.round(got.reduce((t,p)=>t+p.m,0)/(got.length*q.m)*100):null,zero:got.filter(p=>p.m===0).length}}).filter(x=>x.n);
  const best=Q.length>1?[...Q].sort((x,y)=>y.pct-x.pct)[0]:null,worst=Q.length>1?[...Q].sort((x,y)=>x.pct-y.pct)[0]:null;
  const qlab=x=>`Q${x.i+1} · ${esc(exX(x.q.x).s)} ${exX(x.q.x).code} Q${x.q.n}`;
  /* topics: marks lost per lesson */
  const T={};Q.forEach(x=>{const l=x.q.l[0];if(!l)return;const t=T[l]=T[l]||{got:0,max:0};went.forEach(s=>{const p=s.r.per[x.i];if(p&&p.m!=null){t.got+=p.m;t.max+=x.q.m}})});
  const weakT=Object.entries(T).filter(([,t])=>t.max&&t.got/t.max<.6).sort((x,y)=>x[1].got/x[1].max-y[1].got/y[1].max).slice(0,3).map(([l,t])=>({l:exL(l),pct:Math.round(t.got/t.max*100)})).filter(x=>x.l);
  /* common mistakes: the same wrong answer given by more than one student (or by anyone, in a small class) */
  const need=went.length<5?1:2,M=[];
  qs.forEach((q,i)=>{const wrong={};
    went.forEach(x=>{const A=subOf(a.id,x.s.id),e=A&&A.ans&&A.ans[q.id];const c=e&&e.c;if(!c)return;
      const add=(k,txt,right)=>{const t=String(txt||"").trim();if(!t)return;const key=k+"|"+t.toLowerCase();(wrong[key]=wrong[key]||{k,t,right,n:0}).n++};
      if(q.t==="mc"&&c.sel!=null&&c.sel!==q.a)add("",q.o[c.sel],q.o[q.a]);
      else if(["ans","multi","set","cloze"].includes(q.t)&&c.R&&c.R.f)c.R.f.forEach((ok,k)=>{if(ok)return;
        const lab=q.t==="multi"?q.f[k].lab.replace(/^_/,"parity bit for "):q.t==="cloze"?`gap ${k+1}`:"";
        const right=q.t==="ans"?q.acc[0]:q.t==="multi"?q.f[k].acc[0]:q.t==="cloze"?[].concat(q.a[k])[0]:"";add(lab,(c.v||[])[k],right)});
      else if(q.t==="pick")(c.pick||[]).filter(k=>!q.a.includes(k)).forEach(k=>add("",q.o[k],""))});
    Object.values(wrong).filter(w=>w.n>=need).forEach(w=>M.push(Object.assign(w,{i})))});
  M.sort((x,y)=>y.n-x.n);
  const toCheck=went.reduce((t,x)=>t+qs.filter((q,i)=>EX_SELF.has(q.t)&&!(q.t==="wr"&&q.auto)&&x.r.per[i]&&x.r.per[i].ok&&!x.r.per[i].t).length,0);
  return `<div class="tins"><div class="tingrid">
    ${tile("Handed in",`${fin.length}/${st.length}`,went.length>fin.length?`${went.length-fin.length} still working`:"")}
    ${tile(fin.length?"Average":"Average so far",avg+"%",pool.length>1?`highest ${hi.r.score}% · lowest ${lo.r.score}%`:"")}
    ${best?tile("Best answered",best.pct+"%",qlab(best)):""}
    ${worst?tile("Hardest",worst.pct+"%",qlab(worst)+(worst.zero?` · ${worst.zero} scored 0`:"")):""}</div>
   ${M.length?`<div class="tinlist"><span class="eyebrow">Common mistakes</span><ul>${M.slice(0,5).map(w=>`<li><b>Q${w.i+1}</b>${w.k?` (${esc(w.k)})`:""}: ${plural(w.n,"student")} answered <span class="mono">“${esc(w.t)}”</span>${w.right?` · the answer is <span class="mono">${esc(w.right)}</span>`:""}</li>`).join("")}</ul></div>`:""}
   ${weakT.length?`<div class="tinlist"><span class="eyebrow">Topics to revisit</span><ul>${weakT.map(x=>`<li><a href="#l-${x.l.id}">${x.l.topic.code} · ${esc(x.l.title)}</a> · ${x.pct}% of marks</li>`).join("")}</ul></div>`:""}
   ${toCheck?`<p class="tinote">💬 ${plural(toCheck,"self-marked answer")} you haven't checked yet. Open <b>View answers</b> to confirm or change the marks.</p>`:""}</div>`}

/* ---------- lesson access: a teacher can choose which lessons their class may open ---------- */
/* open unless the student's class restricts lessons; lessons in an assignment are always open */
/* without full access (a licensed class, a subscription, or a staff account) only the first lesson of each section is open */
const paidOpen=l=>BOB.pay.full()||l.n===1;
function lessonOpen(l){const L=typeof l==="string"?ALL_LESSONS.find(x=>x.id===l):l;if(!L)return true;const id=L.id;
  if(!paidOpen(L))return false;
  if(!S.user||isTeacher())return true;const c=myClass();if(!c||!c.restrict)return true;
  return c.released.includes(id)||myAsg().some(a=>a.kind==="lessons"&&a.lessons.includes(id))}
function paywallPage(l){const t=l.topic,first=t.lessons[0],stu=S.user&&!isTeacher();
  return `<div class="crumbs"><a href="#paper-${t.ch.paper}">Paper ${t.ch.paper}</a><span>/</span><a href="#t-${t.id}">${t.code} ${esc(t.title)}</a><span>/</span><span>${esc(l.title)}</span></div>
  <div class="formwrap lockpage"><div class="lockicon" aria-hidden="true">🔒</div><div><div class="eyebrow">${t.code} · Lesson ${l.n}</div><h1 style="margin-top:8px">${esc(l.title)}</h1></div>
   <p>This lesson is part of the full course. The first lesson in every section is free; subscribe to unlock all ${ALL_LESSONS.length} lessons with their quick checks, activities and past paper questions.</p>
   <div class="tbb"><a class="btn primary" href="#pricing">See plans</a><a class="btn" href="#l-${first.id}">Try the free lesson: ${esc(first.title)}</a></div>
   <p class="sub" style="margin:0">${stu?`In a school class? Enter your teacher's join code on your <a href="#dashboard">dashboard</a> for full access.`:S.user?"":`Already subscribed or in a school class? <a href="#login">Sign in</a>.`}</p></div>`}
function lockedPage(l){if(!paidOpen(l))return paywallPage(l);const t=l.topic,c=myClass(),next=t.lessons.find(x=>x!==l&&lessonOpen(x));
  return `<div class="crumbs"><a href="#paper-${t.ch.paper}">Paper ${t.ch.paper}</a><span>/</span><a href="#t-${t.id}">${t.code} ${esc(t.title)}</a><span>/</span><span>${esc(l.title)}</span></div>
  <div class="formwrap lockpage"><div class="lockicon" aria-hidden="true">🔒</div><div><div class="eyebrow">${t.code} · Lesson ${l.n}</div><h1 style="margin-top:8px">${esc(l.title)}</h1></div>
   <p>${esc(teacherOf(c).name)} hasn't opened this lesson for ${esc(c.name)} yet. It will unlock here when they do.</p>
   <div class="tbb">${next?`<a class="btn primary" href="#l-${next.id}">Go to ${esc(next.title)}</a>`:""}<a class="btn" href="#t-${t.id}">Back to ${t.code}</a>${myAsg().length?`<a class="btn" href="#todo">My to-do list</a>`:""}</div></div>`}
/* mark links to locked lessons anywhere on the page */
function markLocked(root){if(BOB.pay.full()&&(!S.user||isTeacher()||!myClass()||!myClass().restrict))return;
  root.querySelectorAll('a[href^="#l-"]').forEach(a=>{const l=ALL_LESSONS.find(x=>"#l-"+x.id===a.getAttribute("href"));if(l&&!lessonOpen(l)){a.classList.add("lklock");a.title=paidOpen(l)?"Your teacher hasn't opened this lesson yet":"Part of the full course"}})}
function classLessons(c){const R=new Set(c.released),AL=new Set(classAsg(c).filter(a=>a.kind==="lessons").flatMap(a=>a.lessons)),N=ALL_LESSONS.length;
  const isOpen=l=>R.has(l.id)||AL.has(l.id),open=ALL_LESSONS.filter(isOpen).length;
  const mode=`<div class="tkind" role="radiogroup" aria-label="Lesson access">${[["all","All lessons open","Students work through any lesson at their own pace"],["released","Only lessons I open","Students can open only the lessons you choose, plus any lesson in an assignment"]].map(([k,n,d])=>{const on=(k==="released")===c.restrict;
    return `<label class="${on?"on":""}"><input type="radio" name="tacc" value="${k}" data-tacc="mode"${on?" checked":""}><span><b>${n}</b><small>${d}</small></span></label>`}).join("")}</div>`;
  if(!c.restrict)return `<section class="panel"><h3>Lesson access</h3>${mode}<p class="sub" style="margin:0">Every lesson is open to students in ${esc(c.name)}. Choose <b>Only lessons I open</b> to release lessons as you teach them.</p></section>`;
  const tree=[1,2].map(pp=>{const ls=ALL_LESSONS.filter(l=>l.topic.ch.paper===pp),n=ls.filter(isOpen).length;
    return `<details class="tpaper"${TV.open["la"+pp]?" open":""} data-topen="la${pp}"><summary><span>Paper ${pp} · ${pp===1?"Computer systems":"Algorithms, programming and logic"}</span><span class="chip ${n===ls.length?"sec":n?"dev":"none"}">${n}/${ls.length} open</span></summary>
     <div class="tbb" style="padding:10px 0 6px"><button class="btn small" data-tc="laall" data-v="${pp}">Open all of Paper ${pp}</button><button class="btn small" data-tc="lanone" data-v="${pp}">Close all of Paper ${pp}</button></div>
     <div class="tpick">${TOPICS.filter(t=>t.ch.paper===pp&&t.lessons).map(t=>{const m=t.lessons.filter(isOpen).length;
      return `<details${TV.open["la"+t.id]?" open":""} data-topen="la${t.id}"><summary><span>${t.code} ${esc(t.title)}</span><span class="chip ${m===t.lessons.length?"sec":m?"dev":"none"}">${m}/${t.lessons.length}</span></summary>
       <div class="tpl"><label class="tall"><input type="checkbox" data-tacc="sec" value="${t.id}"${m===t.lessons.length?" checked":""}> <b>All of ${t.code}</b></label>
       ${t.lessons.map(l=>{const as=AL.has(l.id);return `<label><input type="checkbox" data-tacc="l" value="${l.id}"${isOpen(l)?" checked":""}${as?" disabled":""}> ${l.n}. ${esc(l.title)}${as?` <span class="sub">· in an assignment</span>`:""}</label>`}).join("")}</div></details>`}).join("")}</div></details>`}).join("");
  return `<section class="panel"><h3>Lesson access</h3>${mode}<p class="sub" style="margin:0"><b>${open}</b> of ${N} lessons open to ${esc(c.name)}. Changes save straight away. Lessons in an assignment are always open, and locked lessons are left out of exam question practice.</p>${tree}</section>`}
function saveAccess(c,restrict,released){c.restrict=restrict;c.released=[...new Set(released)].sort((a,b)=>ALL_LESSONS.findIndex(l=>l.id===a)-ALL_LESSONS.findIndex(l=>l.id===b));tRender();
  SCH.A.setAccess(c.id,c.restrict,c.released).catch(e=>{alert("That change wasn't saved: "+e.message);SCH.load().then(tRender)})}
document.addEventListener("change",e=>{const t=e.target;if(!t.matches("[data-tacc]")||!isTeacher())return;const c=SC.classes[location.hash.slice(7)];if(!c||c.teacher!==me().id)return;
  const k=t.dataset.tacc,R=new Set(c.released);
  if(k==="mode")return saveAccess(c,t.value==="released",c.released);
  const ids=k==="sec"?(TOPICS.find(x=>x.id===t.value).lessons||[]).map(l=>l.id):[t.value];
  ids.forEach(id=>t.checked?R.add(id):R.delete(id));saveAccess(c,true,[...R])});
document.addEventListener("click",e=>{const b=e.target.closest('[data-tc="laall"],[data-tc="lanone"]');if(!b||!isTeacher())return;const c=SC.classes[location.hash.slice(7)];if(!c||c.teacher!==me().id)return;
  const pp=+b.dataset.v,ids=ALL_LESSONS.filter(l=>l.topic.ch.paper===pp).map(l=>l.id),R=new Set(c.released);
  if(b.dataset.tc==="lanone"&&!confirm(`Close every Paper ${pp} lesson for ${c.name}? Lessons in an assignment stay open.`))return;
  ids.forEach(id=>b.dataset.tc==="laall"?R.add(id):R.delete(id));saveAccess(c,true,[...R])});

/* ---------- progress tab: every exam question assignment, one column each ---------- */
function examHeat(c,studs){const ex=classAsg(c).filter(a=>a.kind==="exam").sort((a,b)=>a.set-b.set);if(!ex.length||!studs.length)return "";
  const LV=["sunk","bad-soft","warn-soft","good-soft"],short=s=>new Date(s+"T12:00:00").toLocaleDateString("en-GB",{day:"numeric",month:"short"});
  const cell=(a,s)=>{const r=asgStatus(a,s.id);
    if(!r.started&&!r.complete)return `<td style="background:var(--sunk)" title="${esc(s.name)} · ${esc(a.title)}: not started${r.late?" · overdue":""}${r.re?" · "+esc(reTip(r)):""}">${r.late?`<span class="tlate">!</span>`:""}${r.re?`<sup class="trex">↻</sup>`:""}</td>`;
    const lv=r.score>=80?3:r.score>=50?2:1;
    return `<td style="background:var(--${LV[lv]})"${r.complete?"":' class="tinprog"'} title="${esc(s.name)} · ${esc(a.title)}: ${r.marks}/${r.total} marks (${r.score}%)${r.complete?"":" · not handed in yet"}${r.re?" · "+esc(reTip(r)):""}">${r.score}${r.re?`<sup class="trex">↻</sup>`:""}</td>`};
  const avg=a=>{const f=studs.map(s=>asgStatus(a,s.id)).filter(r=>r.complete);return f.length?Math.round(f.reduce((t,r)=>t+r.score,0)/f.length):null};
  const leg=[["sunk","Not started"],["bad-soft","Below 50%"],["warn-soft","50 to 79%"],["good-soft","80% or more"]];
  return `<section class="panel" style="margin-top:16px"><div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;align-items:baseline"><h3>Exam question assignments</h3>
   <div class="legend">${leg.map(([v,n])=>`<span><i style="background:var(--${v})"></i>${n}</span>`).join("")}</div></div>
   <div class="tscroll"><table class="theat theatx"><thead><tr><th></th>${ex.map(a=>`<th title="${esc(a.title)} · due ${fmtDay(a.due)}"><button class="thx" data-tc="goasg" data-v="${a.id}">${esc(a.title)}</button><small>due ${short(a.due)}</small></th>`).join("")}</tr></thead><tbody>
   ${studs.map(s=>`<tr><th>${esc(s.name)}</th>${ex.map(a=>cell(a,s)).join("")}</tr>`).join("")}
   <tr class="tavg"><th>Class average</th>${ex.map(a=>{const v=avg(a);return `<td title="Average of students who have handed in">${v==null?"–":v}</td>`}).join("")}</tr></tbody></table></div>
   <span class="sub">One column per exam question assignment, oldest first. Each cell is the student's score as a percentage; a faded cell isn't handed in yet, <b class="tlate">!</b> means overdue and <b>↻</b> means reassigned. Click a title to open that assignment.</span></section>`}

/* ---------- reassigning an assignment to one or more students ---------- */
TV.sel={};
const selIds=aid=>TV.sel[aid]||[];
const selHead=(a,st)=>{const n=selIds(a.id).length;return `<th class="tsel"><input type="checkbox" data-tselall="${a.id}"${n&&n===st.length?" checked":""} aria-label="Select every student"></th>`};
const selBox=(a,s)=>`<td class="tsel"><input type="checkbox" data-tsel="${a.id}" value="${s.id}"${selIds(a.id).includes(s.id)?" checked":""} aria-label="Select ${esc(s.name)}"></td>`;
const reBtn=(a,s)=>`<button class="btn small" data-tc="reone" data-a="${a.id}" data-v="${s.id}">↻ Reassign</button>`;
function reBar(a){const n=selIds(a.id).length;return `<div class="trebar"><button class="btn small${n?" primary":""}" data-tc="resel" data-v="${a.id}"${n?"":" disabled"}>↻ Reassign selected${n?` (${n})`:""}</button><span class="sub">Tick students to reassign to several at once.</span></div>`}
function reFeedback(r,c){if(!r.re)return "";
  return `<div class="tfeed"><b>↻ Reassigned by ${esc(teacherOf(c).name)} · ${new Date(r.re.at).toLocaleDateString("en-GB",{day:"numeric",month:"short"})}</b>${r.re.comment?`<p>${esc(r.re.comment)}</p>`:""}</div>`}
function reModal(){if(!TV.reas)return "";const a=SC.asg[TV.reas.a];if(!a)return "";const ss=TV.reas.ids.map(id=>SC.users[id]).filter(Boolean);
  return `<div class="trev tmodal" role="dialog" aria-modal="true" aria-labelledby="reh"><div class="trevp tmodalp">
   <div class="trevh"><div><span class="eyebrow">Reassign</span><h2 id="reh">${esc(a.title)}</h2></div><button class="iconbtn" data-tc="reclose" aria-label="Close" title="Close"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div>
   <form id="reForm" class="trevb tform" novalidate>
    <div><span class="tlab">${ss.length===1?"Student":plural(ss.length,"student")}</span><div class="tchips">${ss.map(s=>{const n=reList(a.id,s.id).length;return `<span class="chip none">${esc(s.name)}${n?` · reassigned ${n}×`:""}</span>`}).join("")}</div></div>
    <label for="redue">New due date<input type="date" id="redue" value="${isoDay(new Date(Date.now()+7*864e5))}" min="${todayISO()}" required></label>
    <label for="renote">Feedback <span class="sub">(optional)</span><textarea id="renote" rows="3" maxlength="500" placeholder="e.g. Have another look at the theory on the control unit before you try these again."></textarea></label>
    <p class="vfoot" style="margin:0">${a.kind==="exam"?"Their answers and your marks are kept in the history, and the questions start again from blank.":"They need to redo each lesson's tasks after today for it to count. Their earlier work isn't deleted."} The assignment goes back on their to-do list with your feedback.</p>
    <p class="err" id="reerr" hidden></p>
    <div class="tbb"><button class="btn primary" type="submit">↻ Reassign${ss.length>1?` to ${ss.length} students`:""}</button><button class="btn" type="button" data-tc="reclose">Cancel</button></div>
   </form></div></div>`}
document.addEventListener("click",e=>{const b=e.target.closest('[data-tc="reone"],[data-tc="resel"],[data-tc="reclose"]');if(!b||!isTeacher())return;
  const k=b.dataset.tc;
  if(k==="reclose"){TV.reas=null;tRender();return}
  const ids=k==="reone"?[b.dataset.v]:selIds(b.dataset.v),aid=k==="reone"?b.dataset.a:b.dataset.v;if(!ids.length)return;
  TV.reas={a:aid,ids};TV.open[aid]=true;tRender();const n=$("#renote");if(n)n.focus({preventScroll:true})});
document.addEventListener("change",e=>{const t=e.target;if(!isTeacher())return;
  if(t.matches("[data-tsel]")){const a=t.dataset.tsel,S0=new Set(selIds(a));t.checked?S0.add(t.value):S0.delete(t.value);TV.sel[a]=[...S0];tRender();return}
  if(t.matches("[data-tselall]")){const a=SC.asg[t.dataset.tselall];if(!a)return;TV.sel[a.id]=t.checked?studentsOf(SC.classes[a.cls]).map(s=>s.id):[];tRender()}});
document.addEventListener("submit",e=>{if(e.target.id!=="reForm"||!TV.reas||!isTeacher())return;e.preventDefault();
  const a=SC.asg[TV.reas.a],ids=TV.reas.ids.slice(),due=$("#redue").value,note=$("#renote").value.trim(),x=$("#reerr");
  if(!due||due<todayISO()){x.textContent="Choose a due date from today onwards.";x.hidden=false;return}
  const prev={};ids.forEach(id=>{const r=asgStatus(a,id);if(r.started||r.complete)prev[id]=r.score});
  tDo(()=>SCH.A.reassign(a.id,ids,due,note,prev),{err:"reerr",ok:()=>{TV.reas=null;TV.sel[a.id]=[];TV.open[a.id]=true}})});

/* ---------- paying for licences (teachers) ---------- */
const fmtD=t=>new Date(t).toLocaleDateString("en-GB",{day:"numeric",month:"short",year:"numeric"});
function licBilling(){const P=BOB.pay;if(!P.enabled)return "";
  if(!P.prices){P.loadPrices().then(()=>{if(location.hash==="#teacher")tRender()});}
  const pr=P.prices&&P.prices.licences,each=pr?P.money(pr):null;
  const subs=P.licenceSubs.map(x=>`<li><span><b>${plural(x.quantity,"licence")}</b> · yearly subscription</span><span class="sub">${x.status==="past_due"?"payment overdue · ":""}${x.cancel_at_period_end?"ends":"renews"} ${x.current_period_end?fmtD(x.current_period_end):""}</span></li>`).join("");
  return `${subs?`<ul class="tlist tsubs">${subs}</ul><button class="btn small" data-pay="portal" style="align-self:flex-start">Manage billing</button><p class="vfoot" style="margin:0">Change the number of licences, update your card, download invoices or cancel.</p>`:""}
   <form id="buyForm" class="tbuy"><label for="buyn">${subs?"Buy more licences":"Number of licences"}<input type="number" id="buyn" min="1" max="1000" value="${TV.buy||10}" inputmode="numeric"></label>
    <button class="btn primary" type="submit">Buy licences</button>
    <p class="vfoot" style="margin:0">${each?`${each} per student per year. `:""}Paid by card through Stripe and renewed each year; you can change the number or cancel at any time. One licence gives one student full access.</p></form>
   <p class="err" id="buyerr" hidden></p>`}
document.addEventListener("submit",e=>{if(e.target.id!=="buyForm")return;e.preventDefault();const n=Math.floor(+$("#buyn").value),x=$("#buyerr");
  if(!(n>=1&&n<=1000)){x.textContent="Enter a number of licences from 1 to 1000.";x.hidden=false;return}TV.buy=n;
  const b=e.target.querySelector("button");b.disabled=true;b.textContent="Opening checkout…";
  BOB.pay.checkout("licences",n).catch(err=>{b.disabled=false;b.textContent="Buy licences";x.textContent=err.message;x.hidden=false})});
document.addEventListener("click",e=>{const b=e.target.closest('[data-pay="portal"]');if(!b)return;b.disabled=true;
  BOB.pay.portal().catch(err=>{b.disabled=false;alert(err.message)})});

/* ---------- lesson assignments: each student's answers, and the questions the class found easiest and hardest ---------- */
const stripTags=h=>String(h==null?"":h).replace(/<[^>]+>/g," ").replace(/\s+/g," ").trim();
const firstSpan=h=>{const m=String(h).match(/^\s*<span[^>]*>([\s\S]*?)<\/span>/);return stripTags(m?m[1]:h)};
const asThey=h=>String(h).replace(/\bYou (wrote|answered|put|said|chose|painted)\b/g,"They $1").replace(/\byou\b(?= (wrote|answered|put|said|chose))/g,"they");
/* a student's latest quick check (question by question, when recorded) and activity tries for each lesson */
function lessonAnswers(a,id){const p=progOf(id)||{},L=p.lessons||{},A=p.acts||{};
  return a.lessons.map(lid=>{const l=ALL_LESSONS.find(x=>x.id===lid);if(!l)return null;
    return {l,qc:L[lid],acts:(l.acts||[]).map(ac=>({ac,s:actStats(A[lid+"-"+ac.id]),T:ACT_TYPES[ac.type||ac.gen]}))}}).filter(Boolean)}
function lessonQInsights(a,st){const Q={},M={};
  st.forEach(({s})=>lessonAnswers(a,s.id).forEach(({l,qc,acts})=>{
    if(qc&&qc.qs)qc.qs.forEach(x=>{const k=l.id+"|"+x.q,o=Q[k]||(Q[k]={l,q:x.q,a:x.a,n:0,ok:0,wrong:{}});o.n++;if(x.g===x.a)o.ok++;else if(x.g!=null)o.wrong[x.g]=(o.wrong[x.g]||0)+1});
    acts.forEach(({ac,s:as,T})=>{const h=as&&as.hist[as.hist.length-1];if(!h||!T)return;const seen=new Set();
      (h.wrong||[]).forEach(w=>{let lab="";try{lab=firstSpan(T.review(w))}catch(e){}if(!lab||seen.has(lab))return;seen.add(lab);const k=l.id+"|"+ac.id+"|"+lab;(M[k]=M[k]||{l,ac,lab,n:0}).n++})})}));
  const qs=Object.values(Q).filter(o=>o.n>=2),pct=o=>Math.round(o.ok/o.n*100),L=o=>`L${a.lessons.indexOf(o.l.id)+1}`;
  if(!qs.length&&!Object.keys(M).length)return `<p class="tinote">Question-by-question results appear here as students take the quick checks and activities.</p>`;
  const best=[...qs].sort((x,y)=>pct(y)-pct(x)||y.n-x.n).slice(0,3),worst=[...qs].filter(o=>pct(o)<100).sort((x,y)=>pct(x)-pct(y)||y.n-x.n).slice(0,3);
  const topWrong=o=>{const e=Object.entries(o.wrong).sort((x,y)=>y[1]-x[1])[0];return e?` · most common wrong answer <span class="mono">“${esc(e[0])}”</span> (${e[1]})`:""};
  const cls=v=>v>=80?"tgood":v>=50?"tpart":"tbad";
  const li=(o,good)=>`<li><div class="tqrow"><span>${esc(o.q)}</span><b class="${cls(pct(o))}">${pct(o)}%</b></div><span class="sub">${L(o)} quick check · ${o.ok} of ${o.n} right${good?"":` · answer <b>${esc(o.a)}</b>${topWrong(o)}`}</span></li>`;
  const am=Object.values(M).sort((x,y)=>y.n-x.n).slice(0,4);
  return `<div class="tqins">
   ${best.length?`<div><span class="eyebrow">Best answered</span><ul>${best.map(o=>li(o,true)).join("")}</ul></div>`:""}
   ${worst.length?`<div><span class="eyebrow">Most often wrong</span><ul>${worst.map(o=>li(o,false)).join("")}</ul></div>`:""}
   ${am.length?`<div class="tqwide"><span class="eyebrow">Common activity mistakes · latest tries</span><ul>${am.map(o=>`<li><div class="tqrow"><span>${esc(o.lab)}</span><b class="tbad">${plural(o.n,"student")}</b></div><span class="sub">${L(o)} · ${esc(o.ac.title)}${o.ac.desc?` · ${esc(o.ac.desc.split(" · ")[0])}`:""}</span></li>`).join("")}</ul></div>`:""}
   <p class="sub tqwide" style="margin:0">From each student's latest quick check and activity tries. Open <b>View answers</b> to see one student's answers.</p></div>`}
function lessonRevOverlay(a){const teach=isTeacher(),c=SC.classes[a.cls],who=teach?"They":"You";
  const studs=teach&&c?studentsOf(c).filter(s=>{const x=asgStatus(a,s.id);return x.started||x.complete}):[];
  const i=studs.findIndex(s=>s.id===TV.rev.e),st=SC.users[TV.rev.e]||{name:"Student"},r=asgStatus(a,TV.rev.e);
  const nav=teach&&studs.length>1?`<div class="tbb">${i>0?`<button class="btn small" data-tc="revnav" data-v="${studs[i-1].id}">← ${esc(studs[i-1].name.split(" ")[0])}</button>`:""}${i<studs.length-1?`<button class="btn small" data-tc="revnav" data-v="${studs[i+1].id}">${esc(studs[i+1].name.split(" ")[0])} →</button>`:""}</div>`:"";
  const body=lessonAnswers(a,TV.rev.e).map(({l,qc,acts},k)=>{
    const nr=qc&&qc.qs?qc.qs.filter(x=>x.g===x.a).length:0;
    const qcH=!qc?`<p class="sub">Quick check not taken yet.</p>`:qc.qs?`<ol class="trql">${qc.qs.map(x=>{const ok=x.g===x.a;
      return `<li class="${ok?"ok":"no"}"><span class="trqm" aria-label="${ok?"Right":"Wrong"}">${ok?"✓":"✗"}</span><div><span>${esc(x.q)}</span><span class="sub">${x.g==null?"Not answered":`${who} answered <b>${esc(x.g)}</b>`}${ok?"":` · answer <b>${esc(x.a)}</b>`}</span></div></li>`}).join("")}</ol>`
      :`<p class="sub">Best ${qc.best}% · latest ${qc.last}%. Answers question by question are kept from the next time ${teach?"they take":"you take"} it.</p>`;
    const actH=acts.map(({ac,s,T})=>{if(!s)return `<div class="tract"><div class="tqrow"><b>${esc(ac.title)}</b><span class="sub">Not started</span></div></div>`;
      const h=s.hist[s.hist.length-1],W=(h&&h.wrong)||[];
      return `<div class="tract"><div class="tqrow"><b>${esc(ac.title)}${ac.desc?` <span class="sub">${esc(ac.desc.split(" · ")[0])}</span>`:""}</b><span class="mono">${s.lastN}/${s.qn} latest · best ${s.bestN}/${s.qn}</span></div>
       ${W.length?`<div class="mistakes">${W.map(w=>{let x="";try{x=T.review(w)}catch(e){}return x?`<p>${teach?asThey(x):x}</p>`:""}).join("")}</div>`:s.lastN<s.qn?`<p class="sub" style="margin:0">${s.qn-s.lastN} wrong; the details of this try weren't recorded.</p>`:`<p class="msg ok" style="margin:0">No mistakes in the latest try.</p>`}</div>`}).join("");
    return `<h3 class="trqn">Lesson ${k+1} · ${esc(l.title)}</h3><article class="trq">
     <div class="exhead"><span class="exsrc">Quick check${qc?` · ${qc.attempts} ${qc.attempts===1?"try":"tries"} · best ${qc.best}%`:""}</span>${qc?`<span class="trm ${qc.last>=75?"tgood":qc.last>=50?"tpart":"tbad"}">${qc.qs?`${nr} / ${qc.qs.length}`:qc.last+"%"}</span>`:""}</div>
     ${qcH}${acts.length?`<span class="exsrc trsub">Activities · mistakes in the latest try</span>${actH}`:""}</article>`}).join("");
  return `<div class="trev" role="dialog" aria-modal="true" aria-label="Answers for ${esc(teach?st.name:"you")}"><div class="trevp">
   <div class="trevh"><div><span class="eyebrow">${esc(a.title)}</span><h2>${teach?esc(st.name):"Your answers"}</h2><span class="sub">${r.score}% · ${r.nOk} of ${r.per.length} lesson${r.per.length===1?"":"s"} complete</span></div>
    <div class="tbb">${nav}<button class="btn primary small" data-tc="revclose">Close</button></div></div>
   <div class="trevb">${body}</div></div></div>`}
