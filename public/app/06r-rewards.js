/* ================= points, ranks and achievements =================
   Points are worked out from the progress a student already has, so nothing can be earned twice and
   better results earn more: a quick check scores from its best result, an exam question from its best
   marks, a puzzle from its best score. Optional practice (puzzles, flash cards, making cards) adds more.
   The total and rank are saved as user_progress kind 'pts' so the class leaderboard can read them. */
S.pts=S.pts||{};
const RW_RANKS=[[0,"Bit"],[150,"Nibble"],[400,"Byte"],[1000,"Kilobyte"],[2500,"Megabyte"],[5000,"Gigabyte"],[10000,"Terabyte"]];
const RW_BITS=["1b","4b","8b","1K","1M","1G","1T"];
function rwRank(p){let i=0;RW_RANKS.forEach(([min],k)=>{if(p>=min)i=k});const nx=RW_RANKS[i+1];
  return {i,name:RW_RANKS[i][1],min:RW_RANKS[i][0],next:nx?{name:nx[1],min:nx[0]}:null,pct:nx?Math.round((p-RW_RANKS[i][0])/(nx[0]-RW_RANKS[i][0])*100):100}}

/* days the student did something, from the dates saved with their results */
function rwDays(){const d=new Set(),add=x=>{if(!x)return;const t=typeof x==="number"?new Date(x):new Date(x);if(!isNaN(t))d.add(t.toISOString().slice(0,10))};
  Object.values(S.lessons||{}).forEach(x=>add(x.date));Object.values(S.scores||{}).forEach(x=>add(x.date));
  Object.values(S.acts||{}).forEach(x=>(x.hist||[]).forEach(h=>add(h.date)));Object.values(S.ex||{}).forEach(x=>add(x.t));
  Object.values(S.fcs||{}).forEach(x=>add(x.date));(S.fch||[]).forEach(x=>add(x.date));(S.exh||[]).forEach(x=>add(x.t));
  Object.values(S.tz||{}).forEach(x=>add(x.date));
  const days=[...d].sort();let best=0,run=0,prev=null;
  for(const s of days){const t=Date.parse(s);run=prev!=null&&t-prev===864e5?run+1:1;best=Math.max(best,run);prev=t}
  /* the current streak: today or yesterday, and the days before it */
  let cur=0;const today=Date.parse(new Date().toISOString().slice(0,10));
  if(d.has(new Date(today).toISOString().slice(0,10))||d.has(new Date(today-864e5).toISOString().slice(0,10))){let t=d.has(new Date(today).toISOString().slice(0,10))?today:today-864e5;while(d.has(new Date(t).toISOString().slice(0,10))){cur++;t-=864e5}}
  return {n:days.length,best,cur}}

function rwStats(){const L=ALL_LESSONS,st={};
  st.qcPassed=L.filter(qcPassed).length;st.qcPerfect=L.filter(l=>S.lessons[l.id]&&S.lessons[l.id].best>=100).length;
  st.lessonsDone=L.filter(done).length;st.lessonsAll=L.length;
  st.secure=TOPICS.filter(t=>t.lessons&&level(t.id)===3).length;
  st.acts=L.reduce((a,l)=>a+(l.acts||[]).filter(x=>actStats(S.acts[l.id+"-"+x.id])).length,0);
  const ex=Object.entries(S.ex||{});st.exTried=ex.length;
  st.exFull=ex.filter(([id,r])=>{const q=typeof EXQ!=="undefined"&&EXQ.find(x=>x.id===id);return q?r.b>=q.m:r.m&&r.b>=r.m}).length;
  st.cardsMade=Object.values(S.cards||{}).reduce((a,x)=>a+x.length,0);
  st.mastered=typeof fcPool==="function"?fcPool(L.map(l=>l.id),"both").filter(fcMastered).length:0;
  st.rounds=Object.values(S.fcs||{}).reduce((a,x)=>a+(x.rounds||0),0);
  st.tzLessons=L.filter(l=>tzDone(l.id)||pzDone(l.id,"match")||pzDone(l.id,"memory")||pzDone(l.id,"cross")).length;st.memory=L.filter(l=>pzDone(l.id,"memory")).length;st.cross=L.filter(l=>pzDone(l.id,"cross")).length;st.match=L.filter(l=>pzDone(l.id,"match")).length;const tc=L.map(l=>S.tz[l.id+"-c"]).filter(Boolean);
  st.tzChallenge=tc.length;st.tzFlawless=tc.filter(x=>x.best>=100).length;st.tzFast=tc.filter(x=>x.secs&&x.secs<=300).length;
  const dy=rwDays();st.days=dy.n;st.streak=dy.best;st.curStreak=dy.cur;
  return st}

const RW_ACH=[
  ["first-check","🎯","First check","Pass your first quick check",s=>[s.qcPassed,1]],
  ["perfect","💯","Perfect score","Get 100% on a quick check",s=>[s.qcPerfect,1]],
  ["perfect-10","🏹","Sharpshooter","Get 100% on 10 quick checks",s=>[s.qcPerfect,10]],
  ["lesson-1","📗","Lesson learnt","Complete a lesson",s=>[s.lessonsDone,1]],
  ["lessons-10","📚","Bookworm","Complete 10 lessons",s=>[s.lessonsDone,10]],
  ["lessons-half","🧠","Halfway there","Complete half of the lessons",s=>[s.lessonsDone,Math.ceil(s.lessonsAll/2)]],
  ["lessons-all","🎓","Course complete","Complete every lesson",s=>[s.lessonsDone,s.lessonsAll]],
  ["secure-1","🔒","Locked in","Make a section secure (80% or more)",s=>[s.secure,1]],
  ["secure-5","🛡️","Fortress","Make 5 sections secure",s=>[s.secure,5]],
  ["acts-25","⚙️","Busy bee","Finish 25 activities",s=>[s.acts,25]],
  ["tz-1","🔺","Puzzle solver","Solve a puzzle",s=>[s.tzLessons,1]],
  ["pz-cross","✏️","Wordsmith","Complete 5 crosswords",s=>[s.cross,5]],
  ["pz-match","🔗","Perfect pairs","Finish 5 pairs match games",s=>[s.match,5]],
  ["pz-memory","🧠","Total recall","Finish 5 memory pairs games",s=>[s.memory,5]],
  ["tz-c","🧩","Challenge accepted","Solve a Challenge puzzle",s=>[s.tzChallenge,1]],
  ["tz-flawless","✨","Flawless","Solve a Challenge puzzle with no mistakes",s=>[s.tzFlawless,1]],
  ["tz-fast","⏱️","Speed run","Solve a Challenge puzzle in 5 minutes or less",s=>[s.tzFast,1]],
  ["tz-10","🏔️","Puzzle master","Solve the puzzles for 10 lessons",s=>[s.tzLessons,10]],
  ["cards-10","✍️","Card maker","Make 10 of your own flash cards",s=>[s.cardsMade,10]],
  ["mastered-50","🃏","Card shark","Master 50 flash cards",s=>[s.mastered,50]],
  ["rounds-20","🔁","Practice makes permanent","Play 20 flash card rounds",s=>[s.rounds,20]],
  ["ex-50","📝","Exam ready","Try 50 exam questions",s=>[s.exTried,50]],
  ["ex-full-25","🏆","Full marks","Get full marks on 25 exam questions",s=>[s.exFull,25]],
  ["streak-3","🔥","On a roll","Study on 3 days in a row",s=>[s.streak,3]],
  ["streak-7","🌋","Week streak","Study on 7 days in a row",s=>[s.streak,7]],
  ["days-30","📅","Regular","Study on 30 different days",s=>[s.days,30]]];
const RW_ACH_PTS=25;

/* every source of points, each with a short explanation for the breakdown table */
function rwCompute(){const st=rwStats();let les=0,act=0;
  for(const l of ALL_LESSONS){const lp=lessonParts(l);
    for(const p of lp.parts){if(p.kind==="qc")les+=p.done?20+Math.round(p.pct/5):p.tried?Math.round(p.pct/10):0;
      else if(p.kind==="kv")les+=p.done?Math.round(p.pct/5):0;else if(p.kind==="act")act+=p.done?Math.round(p.pct/5):0}
    if(lp.parts.every(p=>p.done))les+=25}
  const secVocab=TOPICS.reduce((a,t)=>a+(S.scores[t.id]?Math.round(S.scores[t.id].best/5):0),0);
  const exam=Object.values(S.ex||{}).reduce((a,r)=>a+5*(r.b||0),0);
  const tz=ALL_LESSONS.reduce((a,l)=>a+Math.round(((S.tz[l.id+"-e"]||{}).best||0)/4)+Math.round(((S.tz[l.id+"-c"]||{}).best||0)/2)+Math.round(pzBest(l.id,"match")/5)+Math.round(pzBest(l.id,"memory")/5)+Math.round(pzBest(l.id,"cross")/4),0);
  const fc=Object.values(S.fcs||{}).reduce((a,x)=>a+3*Math.min(x.rounds||0,10),0)+2*st.mastered+Object.values(S.cards||{}).reduce((a,x)=>a+2*Math.min(x.length,10),0);
  const ach=RW_ACH.filter(a=>{const [n,need]=a[4](st);return n>=need}).map(a=>a[0]);
  const parts=[
    ["Lessons and quick checks",les+secVocab,"Up to 40 per quick check, 20 per key vocabulary test, 25 for each lesson completed"],
    ["Activities",act,"Up to 20 for each activity, from your overall score"],
    ["Sections secure",50*st.secure,"50 for each section at 80% or more"],
    ["Exam questions",exam,"5 for every mark, from your best try at each question"],
    ["Puzzles",tz,"In each lesson: tarsia up to 25 for Easy and 50 for Challenge, pairs match and memory pairs up to 20 each, crossword up to 25"],
    ["Flash cards",fc,"3 a round (up to 10 rounds a lesson), 2 per card mastered, 2 per card you make"],
    ["Days studied",5*st.days,"5 for each day you study"],
    ["Achievements",RW_ACH_PTS*ach.length,`${RW_ACH_PTS} for each one unlocked`]];
  const total=parts.reduce((a,p)=>a+p[1],0);
  return {total,parts,st,ach,rank:rwRank(total)}}

/* ---------- keeping the saved total up to date, and celebrating ---------- */
const rwStudent=()=>!isTeacher();
let RW_LAST=null;
const rwSaveRaw=save;
function rwSync(quiet){if(!rwStudent()||(typeof dmState!=="undefined"&&dmState.depth))return;const R=rwCompute();RW_LAST=R;
  const cur=S.pts.total;if(!cur||cur.points!==R.total||cur.rank!==R.rank.name){S.pts.total={points:R.total,rank:R.rank.name,date:new Date().toISOString()};rwSaveRaw()}
  /* announce new achievements and ranks; the first time, everything earned so far is taken as seen */
  if(!S.rwSeen){S.rwSeen=R.ach.slice();S.rwRankSeen=R.rank.i;rwSaveRaw();return}
  const fresh=R.ach.filter(id=>!S.rwSeen.includes(id));const up=R.rank.i>(S.rwRankSeen||0);
  if(!fresh.length&&!up)return;
  S.rwSeen=S.rwSeen.concat(fresh);if(up)S.rwRankSeen=R.rank.i;rwSaveRaw();
  if(quiet)return;
  if(up)rwToast("⬆️",`New rank: ${R.rank.name}`,`You've reached ${R.rank.min.toLocaleString()} points.`);
  fresh.forEach(id=>{const a=RW_ACH.find(x=>x[0]===id);rwToast(a[1],`Achievement: ${a[2]}`,`${a[3]} · +${RW_ACH_PTS} points`)})}
let RWT=0;
/* save() is called after every result; check points shortly afterwards (once per burst of saves) */
save=function(){const r=rwSaveRaw.apply(this,arguments);clearTimeout(RWT);RWT=setTimeout(()=>rwSync(false),400);return r};
function rwAfter(){clearTimeout(RWT);RWT=setTimeout(()=>rwSync(false),300)}
function rwToast(icon,title,text){let box=document.getElementById("rwtoasts");if(!box){box=document.createElement("div");box.id="rwtoasts";box.setAttribute("aria-live","polite");document.body.append(box)}
  const t=document.createElement("a");t.className="rwtoast";t.href="#rewards";t.innerHTML=`<span class="rwti" aria-hidden="true">${icon}</span><span><b>${esc(title)}</b><small>${esc(text)}</small></span>`;
  box.append(t);setTimeout(()=>t.classList.add("out"),5200);setTimeout(()=>t.remove(),5800)}

/* ---------- what students see ---------- */
function rwBadge(r,big){return `<span class="rwbadge r${r.i}${big?" big":""}" aria-hidden="true"><b>${RW_BITS[r.i]}</b></span>`}
function rwNav(route){if(!S.user||isTeacher())return "";const R=RW_LAST||rwCompute();
  return `<a href="#rewards" class="rwnav${route==="rewards"?" on":""}" title="Your rank and points">${rwBadge(R.rank)}<span>${R.total.toLocaleString()}<small> pts</small></span></a>`}
function rwPanel(){const R=rwCompute(),r=R.rank,last=RW_ACH.filter(a=>R.ach.includes(a[0])).slice(-4);
  return `<div class="panel rwpanel">
   <div class="rwhead">${rwBadge(r,true)}<div><span class="eyebrow">Rank</span><b class="rwname">${r.name}</b><div class="stat">${R.total.toLocaleString()}<small> pts</small></div></div></div>
   <div class="rwmid">${r.next?`<div class="bar"><i style="width:${r.pct}%"></i></div><span class="sub">${(r.next.min-R.total).toLocaleString()} points to ${r.next.name}</span>`:`<span class="sub">Top rank reached.</span>`}
   ${last.length?`<div class="rwmini">${last.map(a=>`<span title="${esc(a[2])}: ${esc(a[3])}">${a[1]}</span>`).join("")}<span class="sub">${R.ach.length} of ${RW_ACH.length} achievements</span></div>`:`<span class="sub">Pass a quick check or solve a puzzle to unlock your first achievement.</span>`}</div>
   <a class="btn small" href="#rewards">All rewards</a></div>`}
function rewardsPage(){const R=rwCompute(),r=R.rank,st=R.st;RW_LAST=R;
  if(isTeacher())return `<div class="formwrap"><h1>Rewards</h1><p>Students earn points, ranks and achievements as they work. You can see your classes' points on each class's Progress tab.</p><a class="btn primary" href="#teacher">Go to my classes</a></div>`;
  const c=typeof myClass==="function"&&myClass();
  const ach=RW_ACH.map(a=>{const [n,need]=a[4](st),got=n>=need;
    return `<li class="rwach${got?" got":""}"><span class="rwai" aria-hidden="true">${a[1]}</span><span><b>${esc(a[2])}</b><small>${esc(a[3])}</small>${got?`<em>Unlocked</em>`:`<span class="rwprog"><i style="width:${Math.min(100,Math.round(n/need*100))}%"></i></span><small class="mono">${Math.min(n,need)}/${need}</small>`}</span></li>`}).join("");
  return `<div style="${accent(1)}"><div class="crumbs"><a href="#home">Home</a><span>/</span><span>Rewards</span></div>
  ${!S.user?`<div class="proto" style="margin-bottom:18px"><span>Your points are saved in this browser. <a href="#register">Create an account</a> to keep them and join your class leaderboard.</span></div>`:""}
  <div class="rwhero"><div class="rwhead">${rwBadge(r,true)}<div><span class="eyebrow">Your rank</span><h1>${r.name}</h1></div></div>
   <div class="rwnums"><div><b>${R.total.toLocaleString()}</b><span>points</span></div><div><b>${R.ach.length}/${RW_ACH.length}</b><span>achievements</span></div><div><b>${st.curStreak}</b><span>day streak</span></div></div>
   <div class="rwnext">${r.next?`<div class="bar"><i style="width:${r.pct}%"></i></div><span class="sub">${(r.next.min-R.total).toLocaleString()} points to <b>${r.next.name}</b></span>`:`<span class="sub">You've reached the top rank. Legend.</span>`}</div></div>
  <ol class="rwladder">${RW_RANKS.map(([min,name],i)=>`<li class="${i<r.i?"past":i===r.i?"here":""}">${rwBadge({i})}<b>${name}</b><small>${min.toLocaleString()}+</small></li>`).join("")}</ol>
  <div class="rwgrid">
   <section class="panel"><h3>Achievements</h3><ul class="rwachs">${ach}</ul></section>
   <div class="rwside">
    ${c?`<section class="panel" id="rwlb"><h3>${esc(c.name)} leaderboard</h3><p class="sub">Loading…</p></section>`:""}
    <section class="panel"><h3>Where your points come from</h3><table class="table rwtab"><tbody>${R.parts.map(p=>`<tr><td><b>${p[0]}</b><br><span class="sub">${p[2]}</span></td><td class="mono">${p[1].toLocaleString()}</td></tr>`).join("")}<tr class="rwtot"><td><b>Total</b></td><td class="mono"><b>${R.total.toLocaleString()}</b></td></tr></tbody></table>
     <p class="sub" style="margin:0">Points come from your best results, so trying again can only help. Tarsia puzzles, flash cards and making your own cards are bonus ways to climb.</p></section>
   </div></div></div>`}
/* the class leaderboard, filled in once it has loaded */
const RWLB={};
function rwLbRows(rows,teach){return `<table class="table rwlb"><thead><tr><th>#</th><th>Student</th><th>Rank</th><th>Points</th></tr></thead><tbody>${rows.map(x=>`<tr class="${x.me?"me":""}"><td class="mono">${x.place}</td><td>${esc(x.name)}${x.me?" <span class=\"sub\">(you)</span>":""}</td><td>${rwBadge(rwRank(x.points))} ${esc(rwRank(x.points).name)}</td><td class="mono">${x.points.toLocaleString()}</td></tr>`).join("")}</tbody></table>`}
async function rwLoadLb(cid){try{const r=await SCH.A.leaderboard(cid);RWLB[cid]={rows:Array.isArray(r)?r:[],at:Date.now()}}catch(e){RWLB[cid]={rows:[],err:e.message,at:Date.now()}}}
async function rwFillLb(){const el=$("#rwlb"),c=myClass&&myClass();if(!el||!c)return;
  if(c.leaderboard===false){el.innerHTML=`<h3>${esc(c.name)} leaderboard</h3><p class="sub" style="margin:0">Your teacher has turned the leaderboard off for this class.</p>`;return}
  rwSync(true);try{if(S.user)await BOB.store.flush()}catch(e){}await rwLoadLb(c.id);const L=RWLB[c.id],box=$("#rwlb");if(!box)return;
  box.innerHTML=`<h3>${esc(c.name)} leaderboard</h3>${L.err?`<p class="sub">The leaderboard couldn't load. Try again later.</p>`:L.rows.length?rwLbRows(L.rows):`<p class="sub">No points yet.</p>`}<p class="sub" style="margin:0">Top 10 in your class. Everyone sees their own place.</p>`}

/* the teacher's view: every student's points, and the switch for the students' leaderboard */
function rwClassPanel(c){let L=RWLB[c.id];
  /* the guest preview works out the example students' points from their example progress */
  if(typeof dmState!=="undefined"&&dmState.depth){const rows=studentsOf(c).map(u=>({student_id:u.id,name:u.name,points:withProg(SC.prog[u.id],()=>rwCompute().total)})).sort((a,b)=>b.points-a.points);
    rows.forEach((r,i)=>r.place=i&&rows[i-1].points===r.points?rows[i-1].place:i+1);L={rows,at:Date.now()}}
  else if(!L||Date.now()-L.at>60000)rwLoadLb(c.id).then(()=>{const el=$("#rwcls");if(el)el.outerHTML=rwClassPanel(c)});
  return `<section class="panel" id="rwcls"><div class="trow"><h3>Points and ranks</h3>
   <label class="rwlbsw"><input type="checkbox" data-rwlb="${c.id}"${c.leaderboard!==false?" checked":""}> Show students a top-10 leaderboard</label></div>
   ${!L?`<p class="sub">Loading…</p>`:L.err?`<p class="sub">Couldn't load points.</p>`:L.rows.length?rwLbRows(L.rows,true):`<p class="sub">No students yet.</p>`}
   <p class="sub" style="margin:0">Points come from each student's best results, plus bonus practice: tarsia puzzles and flash cards. ${c.leaderboard!==false?"Students see the top 10 and their own place.":"Students can't see the leaderboard."}</p></section>`}
document.addEventListener("change",e=>{const t=e.target.closest("[data-rwlb]");if(!t)return;const id=t.dataset.rwlb,on=t.checked;
  tDo(()=>SCH.A.setLeaderboard(id,on))});

/* when the site opens, anything already earned counts as seen, so only new achievements pop up */
if(rwStudent()&&!S.rwSeen){try{const R=rwCompute();S.rwSeen=R.ach.slice();S.rwRankSeen=R.rank.i}catch(e){}}
