/* router */
function render(){
  const r=(location.hash||"#home").slice(1)||"home";
  /* visitors who aren't signed in see example dashboards (09-demo.js) */
  const d=typeof demoView==="function"?demoView(r):null;
  if(!d){renderRoute(r);if(typeof demoAfter==="function")demoAfter(r,null);return}
  demoIn(d.view);try{renderRoute(d.route)}finally{demoOut()}
  demoAfter(r,d);
}
function renderRoute(r){
  if(r==="signout"){BOB.signOut();return}
  const app=$("#app");let t=null;
  if(r==="home")app.innerHTML=home();
  else if(r==="paper-1"||r==="paper-2")app.innerHTML=paper(+r.slice(-1));
  else if(r.startsWith("t-")&&(t=TOPICS.find(x=>"t-"+x.id===r))){if(Q&&Q.id!==t.id)Q=null;app.innerHTML=topic(t);vocab(t)}
  else if(r.startsWith("l-")&&(t=ALL_LESSONS.find(x=>"l-"+x.id===r))&&!lessonOpen(t))app.innerHTML=lockedPage(t);
  else if(r.startsWith("l-")&&(t=ALL_LESSONS.find(x=>"l-"+x.id===r))){
    if(!LQ||LQ.id!==t.id){LQ=null;TAB="theory"}
    if(AQ&&!AQ.key.startsWith(t.id+"-"))AQ=null;if(AQ)AQ.focus=false;
    if(Q&&Q.id!=="lv-"+t.id)Q=null;
    app.innerHTML=lesson(t);foldInit(t);groupSteps(app);initWidgets(app);lcheck(t);if(t.v)vocab(lvt(t));(t.acts||[]).forEach(a=>actCard(t,a));{const lid=t.id;fcWidget($("#fclesson"),{lids:()=>[lid],fixed:true});exLessonCard(t)}if(t.tool)TOOLS[t.tool]($("#tool"))}
  else if(r==="dashboard")app.innerHTML=dashboard();
  else if(r==="flashcards"){app.innerHTML=fcPage();fcPageInit()}
  else if(r==="exams"){app.innerHTML=exPage();exDraw()}
  else if(r==="exam-insights")app.innerHTML=exInsights();
  else if(r==="register")app.innerHTML=register();
  else if(r==="login")app.innerHTML=login();
  else if(r==="forgot")app.innerHTML=forgotPage();
  else if(r==="reset")app.innerHTML=resetPage();
  else if(r==="account")app.innerHTML=accountPage();
  else if(r==="display")app.innerHTML=displayPage();
  else if(r==="admin"){app.innerHTML=adminPage();adminLoad()}
  else if(r==="pricing")app.innerHTML=pricing();
  else if(r==="contact")app.innerHTML=contactPage();
  else if(r==="teacher")app.innerHTML=teacherPage();
  else if(r.startsWith("class-")){app.innerHTML=classPage(r.slice(6));tPost(app)}
  else if(r==="todo"){app.innerHTML=todoPage();tPost(app)}
  else{app.innerHTML=home();r="home"}
  {const nb=schoolNotice(r);if(nb)app.insertAdjacentHTML("afterbegin",nb)}document.body.classList.toggle("wide",r.startsWith("l-"));setFocus(null);
  markLocked(app);nav(r);window.scrollTo(0,0);
}
document.addEventListener("click",e=>{
  const r=location.hash.slice(1);
  const mt=e.target.closest("[data-mtab]");
  if(mt){e.preventDefault();const box=mt.closest(".mtabs"),id=mt.dataset.mtab;
    box.querySelectorAll(".tabs [data-mtab]").forEach(x=>{const on=x.dataset.mtab===id;x.setAttribute("aria-selected",on);box.querySelector("#"+x.dataset.mtab).hidden=!on});
    if(!mt.closest(".tabs"))box.querySelector(".tabs").scrollIntoView();return}
  const jp=e.target.closest("[data-jump]");
  if(jp){const s=document.getElementById(jp.dataset.jump);if(s)s.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"});return}
  const tb=e.target.closest("[data-tab]");
  if(tb){e.preventDefault();TAB=tb.dataset.tab;
    document.querySelectorAll(".tabs [data-tab]").forEach(x=>x.setAttribute("aria-selected",x.dataset.tab===TAB));
    $("#pane-theory").hidden=TAB!=="theory";$("#pane-practice").hidden=TAB!=="practice";
    if(!tb.closest(".tabs"))$(".tabs").scrollIntoView();return}
  const b=e.target.closest("[data-act]");if(!b)return;
  const l=ALL_LESSONS.find(x=>"l-"+x.id===r);
  const VA=["term","start","list","pick","next"];
  if(l&&!(l.v&&VA.includes(b.dataset.act))){const a=b.dataset.act;
    if(["astart","anext","apick","arev","afocus","apix","apal","afill","aclear","apaint","aorder","aup","adown","async","asel","adrop","asort","att","atts","asql","asqlrun"].includes(a)){
      const aid=b.dataset.a||b.closest('[id^="act-"]').id.slice(4),ac=l.acts.find(x=>x.id===aid),key=l.id+"-"+ac.id;
      if(a==="afocus"){const card=document.getElementById("act-"+aid);setFocus(card.classList.contains("focus")?null:card);actCard(l,ac);
        const ib=card.querySelector(".iconbtn");if(ib)ib.focus();return}
      if(a==="astart"){AQ={key,items:GEN[ac.gen].call(ac),k:0,res:[],wrong:[],typed:"",err:"",focus:true,paint:null,sel:null};AVIEW[key]=false}
      else if(a==="anext"){if(AQ.items[AQ.k]&&(AQ.items[AQ.k].kind==="order"||AQ.items[AQ.k].kind==="sort"))AQ.k=AQ.items.length-1;AQ.k++;AQ.typed="";AQ.err="";if(AQ.k>=AQ.items.length)actFinish()}
      else if(a==="apick"){if(AQ&&AQ.res[AQ.k]===undefined){actAnswer(l,ac,b.dataset.v);return}}
      else if(a==="arev")AVIEW[key]=!AVIEW[key];
      else if(a==="asqlrun"||a==="asql"){if(AQ&&AQ.res[AQ.k]===undefined){const ta=document.querySelector(`#act-${ac.id} textarea`),v=ta?ta.value:"";AQ.sqlv=v;AQ.err="";
        if(a==="asqlrun"){try{const R=sqlRun(v);AQ.sqlprev=`<p class="sqlok">${R.agg?"Result":`${R.rows.length} record${R.rows.length===1?"":"s"} found`}</p>`+sqlTable(R.cols,R.types,R.rows,{sm:true})}catch(x){AQ.sqlprev=`<p class="msg bad" style="margin:0">⚠️ ${esc(String(x))}</p>`}actCard(l,ac);const t2=document.querySelector(`#act-${ac.id} textarea`);if(t2)t2.focus();return}
        if(!v.trim()){AQ.err="Write a query first.";actCard(l,ac);return}actAnswer(l,ac,v);return}}
      else if(a==="att"){if(AQ&&AQ.res[AQ.k]===undefined&&AQ.tt){const i=+b.dataset.i;AQ.tt[i]=AQ.tt[i]===0?1:0;AQ.err="";actCard(l,ac);const f=document.querySelector(`#act-${ac.id} [data-act="att"][data-i="${i}"]`);if(f)f.focus();return}}
      else if(a==="atts"){if(AQ&&AQ.res[AQ.k]===undefined&&AQ.tt){if(AQ.tt.includes(-1))AQ.err="Set every output to 0 or 1 first.";else{actAnswer(l,ac,AQ.tt.join(""));return}}}
      else if(a==="aorder"){if(AQ&&AQ.res[AQ.k]===undefined){const T=ordTarget(AQ.ord,AQ.items[0].valid);AQ.items.forEach((it,i)=>{const p=AQ.ord.indexOf(i),e=T.indexOf(i);AQ.res[i]=p===e;if(p!==e)AQ.wrong.push(Object.assign({},it,{givenPos:p,pos:e,given:String(p)}))});
        const w=AQ.res.indexOf(false);AQ.k=w<0?AQ.items.length-1:w;actCard(l,ac);const nx=document.querySelector('[data-act="anext"]');if(nx)nx.focus();return}}
      else if(a==="aup"||a==="adown"){if(AQ&&AQ.ord&&AQ.res[AQ.k]===undefined){const i=+b.dataset.i,j=a==="aup"?i-1:i+1;if(j>=0&&j<AQ.ord.length){[AQ.ord[i],AQ.ord[j]]=[AQ.ord[j],AQ.ord[i]];actCard(l,ac);
          const f=document.querySelector(`#act-${ac.id} [data-act="${a}"][data-i="${j}"]`)||document.querySelector(`#act-${ac.id} [data-i="${j}"]`);if(f)f.focus();refreshStepper(l);return}}}
      else if(a==="async"){}
      else if(a==="asel"){if(AQ&&AQ.res[AQ.k]===undefined&&Date.now()-SORT_DRAG_END>350){const i=+b.dataset.i;AQ.ssel=AQ.ssel===i?null:i}}
      else if(a==="adrop"){if(AQ&&AQ.res[AQ.k]===undefined&&AQ.ssel!=null){AQ.place[AQ.ssel]=b.dataset.z||null;AQ.ssel=null;AQ.err=""}}
      else if(a==="asort"){if(AQ&&AQ.res[AQ.k]===undefined){if(AQ.place.some(p=>p==null)){AQ.err="Place every feature first."}else{AQ.err="";AQ.ssel=null;
        AQ.items.forEach((it,i)=>{AQ.res[i]=AQ.place[i]===it.z;if(!AQ.res[i])AQ.wrong.push(Object.assign({},it,{given:AQ.place[i]}))});
        const w=AQ.res.indexOf(false);AQ.k=w<0?AQ.items.length-1:w;actCard(l,ac);const nx=document.querySelector('[data-act="anext"]');if(nx)nx.focus();return}}}
      else if(AQ&&AQ.res[AQ.k]===undefined&&["apix","apal","afill","aclear","apaint"].includes(a)){
        if(a==="apal")AQ.sel=+b.dataset.c;
        else if(a==="apix"){const i=+b.dataset.i;AQ.paint[i]=AQ.paint[i]===AQ.sel?-1:AQ.sel}
        else if(a==="afill")AQ.paint=AQ.paint.map(v=>v<0?AQ.sel:v);
        else if(a==="aclear")AQ.paint=AQ.paint.map(()=>-1);
        else{actAnswer(l,ac,AQ.paint.join(","));return}}
      actCard(l,ac);refreshStepper(l);return}
    if(a==="lstart")lstart(l);
    else if(a==="lpick"&&LQ.picked==null){LQ.picked=+b.dataset.i;LQ.items[LQ.k].given=LQ.items[LQ.k].opts[LQ.picked];if(LQ.items[LQ.k].opts[LQ.picked]===LQ.items[LQ.k].a)LQ.right++}
    else if(a==="lnext"){LQ.k++;LQ.picked=null;if(LQ.k>=LQ.items.length){lfinish(l);
      document.querySelectorAll(".stepper a").forEach((x,i)=>x.classList.toggle("done",done(l.topic.lessons[i])))}}
    lcheck(l);return}
  const t=l?lvt(l):TOPICS.find(x=>"t-"+x.id===r);if(!t)return;
  const a=b.dataset.act;
  if(a==="term"){const d=b.parentElement,p=d.querySelector("p"),open=p.hidden;p.hidden=!open;d.classList.toggle("open",open);b.setAttribute("aria-expanded",open);return}
  if(a==="start")startQuiz(t);
  else if(a==="list")Q=null;
  else if(a==="pick"&&Q.picked==null){Q.picked=b.dataset.o;if(Q.picked===Q.items[Q.k].k)Q.right++}
  else if(a==="next"){Q.k++;Q.picked=null;if(Q.k>=Q.items.length)finish(t)}
  vocab(t);if(l)refreshStepper(l);
});
function refreshStepper(l){document.querySelectorAll(".stepper a").forEach((x,i)=>x.classList.toggle("done",done(l.topic.lessons[i])))}
document.addEventListener("submit",e=>{
  e.preventDefault();
  if(e.target.classList.contains("actform")){
    const l=ALL_LESSONS.find(x=>"l-"+x.id===location.hash.slice(1));if(!l||!AQ)return;
    const ac=l.acts.find(x=>x.id===e.target.closest('[id^="act-"]').id.slice(4)),v=e.target.querySelector("#act-in").value.trim().replace(/\s/g,"");
    if(AQ.res[AQ.k]!==undefined)return;
    if(ac.gen==="add"&&!/^[01]{1,9}$/.test(v)){AQ.err="Type your answer using only 0s and 1s.";actCard(l,ac);return}
    {const TT=ACT_TYPES[ac.type||ac.gen];if(TT.valid){const m=TT.valid(AQ.items[AQ.k],v);if(m){AQ.err=m;actCard(l,ac);return}}}
    if(!v){AQ.err="Type an answer in the box first.";actCard(l,ac);return}
    AQ.err="";actAnswer(l,ac,v);return}
  /* account forms (register, sign in, reset) are handled in 05-account.js */
});
document.addEventListener("toggle",e=>{const d=e.target;if(!d.matches||!d.matches("details.unit"))return;S.fold=S.fold||{};if(d.open)S.fold[d.dataset.unit]=1;else delete S.fold[d.dataset.unit];save()},true);
document.addEventListener("change",e=>{const c=e.target.closest("[data-conf]");if(!c)return;
  const v=+c.value;if(v)S.conf[c.dataset.conf]=v;else delete S.conf[c.dataset.conf];save();c.className="conf c"+v});
addEventListener("hashchange",render);render();
