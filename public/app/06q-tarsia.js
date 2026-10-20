/* ================= tarsia puzzles: one per lesson =================
   Triangular pieces carry halves of matching pairs on their edges. Students drag the pieces onto a
   triangle board and turn them so that every pair of touching edges matches.
   Easy: 9 pieces (9 pairs). Challenge: 16 pieces (18 pairs).
   The pairs for each lesson are in 06p-tarsia-pairs.js (some lessons make fresh numbers every time).
   Results are kept in S.tz["<lesson id>-e"] and S.tz["<lesson id>-c"]. */
S.tz=S.tz||{};
const TZ_MODES={e:{n:3,name:"Easy",pairs:9},c:{n:4,name:"Challenge",pairs:18}};
const TZ_S=100,TZ_H=TZ_S*Math.sqrt(3)/2;
const tzHas=l=>!!(typeof TZP!=="undefined"&&TZP[l.id]);
const tzRes=(lid,m)=>S.tz[lid+"-"+m]||null;
/* a lesson's puzzle is "done" when either size has been solved */
const tzDone=lid=>!!(tzRes(lid,"e")||tzRes(lid,"c"));
const tzBest=lid=>Math.max(0,...["e","c"].map(m=>(tzRes(lid,m)||{}).best||0));

/* ---------- making a puzzle ---------- */
function tzPairs(l,count){const src=TZP[l.id];
  const all=typeof src==="function"?src(count):src.slice();
  return shuffle(all).slice(0,count)}
/* local side i of a piece (drawn pointing up) faces this direction (degrees, clockwise from →) */
const TZ_SIDE=[90,330,210];
const tzMod=a=>((a%360)+360)%360;
function tzSlots(n){const W=n*TZ_S,out=[],ix={};
  for(let r=0;r<n;r++)for(let k=0;k<=2*r;k++){const up=k%2===0,j=up?k/2:(k-1)/2;
    const cx=up?W/2-(r+1)*TZ_S/2+j*TZ_S+TZ_S/2:W/2-r*TZ_S/2+j*TZ_S+TZ_S/2,cy=up?r*TZ_H+2*TZ_H/3:r*TZ_H+TZ_H/3;
    ix[r+","+k]=out.length;out.push({r,k,j,up,cx,cy,edge:{}})}
  /* the edges two slots share: [slot, its edge direction, other slot, its edge direction] */
  const links=[];
  out.forEach((s,i)=>{if(!s.up)return;const {r,j}=s;
    if(r+1<n)links.push([i,90,ix[(r+1)+","+(2*j+1)],270]);
    if(j<r)links.push([i,330,ix[r+","+(2*j+1)],150]);
    if(j>0)links.push([i,210,ix[r+","+(2*j-1)],30])});
  return {slots:out,links,W,H:n*TZ_H}}
function tzMake(l,m){const M=TZ_MODES[m],G=tzSlots(M.n),pairs=tzPairs(l,M.pairs);
  G.links.forEach(([a,ea,b,eb],p)=>{const f=Math.random()<.5;G.slots[a].edge[ea]={p,h:f?0:1};G.slots[b].edge[eb]={p,h:f?1:0}});
  const pieces=G.slots.map((s,i)=>{const rot=s.up?2*Math.floor(Math.random()*3):2*Math.floor(Math.random()*3)+1;
    const sides=TZ_SIDE.map(a=>{const e=s.edge[tzMod(a+60*rot)];return e?{p:e.p,h:e.h,t:pairs[e.p][e.h]}:{p:-1,t:""}});
    return {sides,rot:0,at:null,home:0,sol:[i,rot]}});
  shuffle(pieces).forEach((pc,i)=>{pc.id=i;pc.home=i;pc.rot=Math.floor(Math.random()*6)});
  return {lid:l.id,m,n:M.n,G,pairs,pieces:pieces.sort((a,b)=>a.id-b.id),sel:null,checks:0,bad:0,start:Date.now(),secs:0,solved:false,marks:null,msg:""}}

/* which piece sits in a slot, and the text it shows on that slot's edge */
const tzIn=(P,si)=>P.pieces.find(p=>p.at===si);
function tzSideAt(pc,dir){for(let i=0;i<3;i++)if(tzMod(TZ_SIDE[i]+60*pc.rot)===dir)return pc.sides[i];return null}
function tzEdges(P){return P.G.links.map(([a,ea,b,eb])=>{const A=tzIn(P,a),B=tzIn(P,b);if(!A||!B)return null;
  const x=tzSideAt(A,ea),y=tzSideAt(B,eb);return !!(x&&y&&x.p>=0&&x.p===y.p&&x.h!==y.h)})}

/* ---------- drawing ---------- */
const tzW=t=>{let w=0;for(const c of t)w+=/[ilI1.,:;'|!]/.test(c)?.3:/[mwMW@]/.test(c)?.85:/[A-Z0-9]/.test(c)?.62:.53;return w};
/* fit a label into one or two lines along an edge: the line nearest the edge can be wider */
function tzFit(t){if(!t)return {f:0,lines:[]};
  for(const f of [9.5,9,8.4,7.8,7.2,6.6,6.1,5.7]){const w1=(TZ_S*.6)/f,w2=(TZ_S*.42)/f;
    if(tzW(t)<=w1)return {f,lines:[t]};
    const ws=t.split(" ");if(ws.length<2)continue;
    let best=null;for(let k=1;k<ws.length;k++){const a=ws.slice(0,k).join(" "),b=ws.slice(k).join(" ");
      /* outer line (b) sits nearer the edge */
      if(tzW(b)<=w1&&tzW(a)<=w2){const sc=Math.abs(tzW(a)-tzW(b));if(!best||sc<best.sc)best={sc,lines:[a,b]}}}
    if(best)return {f,lines:best.lines}}
  return {f:5.4,lines:[t]}}
const TZ_TRI=`0,${-2*TZ_H/3} ${TZ_S/2},${TZ_H/3} ${-TZ_S/2},${TZ_H/3}`;
function tzPieceSVG(pc){const base=TZ_H/3;
  const txt=pc.sides.map((sd,i)=>{if(!sd.t)return "";const {f,lines}=tzFit(sd.t);
    const y1=base-2.6-f*.16,y0=y1-f*1.05;
    return `<g transform="rotate(${[0,240,120][i]})" font-size="${f}">${lines.length===2?`<text x="0" y="${y0.toFixed(1)}">${esc(lines[0])}</text><text x="0" y="${y1.toFixed(1)}">${esc(lines[1])}</text>`:`<text x="0" y="${y1.toFixed(1)}">${esc(lines[0])}</text>`}</g>`}).join("");
  return `<polygon class="tzp" points="${TZ_TRI}"/><circle class="tzin" r="2.2"/>${txt}`}

let TZ=null;            // the puzzle open now
const TZKEEP={};        // unfinished puzzles, so closing and reopening carries on
function tzLayout(P){const st=$("#tzstage");const wide=st&&st.clientWidth>st.clientHeight*1.2;
  const n=P.pieces.length,sc=.72,cw=TZ_S*sc*1.04,ch=TZ_H*sc*1.06,gap=18;
  let cols,ox,oy;
  if(wide){const rows=Math.max(1,Math.floor((P.G.H+10)/ch));cols=Math.ceil(n/rows);ox=P.G.W+gap;oy=0}
  else{cols=Math.max(3,Math.floor((P.G.W+20)/cw));ox=-10;oy=P.G.H+gap}
  const rows=Math.ceil(n/cols);
  P.tray={sc,cw,ch,cols,ox,oy,wide,w:cols*cw,h:rows*ch};
  const W=wide?ox+P.tray.w:Math.max(P.G.W,cols*cw-10),H=wide?Math.max(P.G.H,rows*ch):oy+P.tray.h;
  P.vb=[-12,-12,W+24,H+24]}
/* a tray cell's centre; triangles pointing up or down are shifted so their outlines, not their centres, line up */
function tzHomeXY(P,pc){const T=P.tray,c=pc.home%T.cols,r=Math.floor(pc.home/T.cols),up=pc.rot%2===0;
  return [T.ox+c*T.cw+T.cw/2,T.oy+r*T.ch+T.ch/2+(up?1:-1)*TZ_H/6*T.sc]}
function tzPlace(P,pc,anim){const g=document.querySelector(`#tzsvg [data-pc="${pc.id}"]`);if(!g)return;
  let x,y,s=1;if(pc.at!=null){const sl=P.G.slots[pc.at];x=sl.cx;y=sl.cy}else{[x,y]=tzHomeXY(P,pc);s=P.tray.sc}
  if(pc.drag){x=pc.drag[0];y=pc.drag[1];s=1}
  g.classList.toggle("anim",!!anim);g.style.transform=`translate(${x}px,${y}px) rotate(${pc.rot*60}deg) scale(${s})`;
  g.classList.toggle("sel",P.sel===pc.id);g.classList.toggle("placed",pc.at!=null);
  g.setAttribute("aria-label",`Piece ${pc.id+1}${pc.at!=null?", on the board":""}: ${pc.sides.map(x=>x.t||"blank").join(", ")}`)}
function tzDraw(){const P=TZ,svg=$("#tzsvg");if(!P||!svg)return;tzLayout(P);svg.setAttribute("viewBox",P.vb.join(" "));
  const G=P.G;
  svg.innerHTML=`<g class="tzboard">${G.slots.map((s,i)=>`<polygon class="tzslot" data-slot="${i}" tabindex="0" role="button" aria-label="Space ${i+1}" points="${TZ_TRI}" transform="translate(${s.cx} ${s.cy}) rotate(${s.up?0:60})"/>`).join("")}
   <polygon class="tzframe" points="${G.W/2},0 ${G.W},${G.H} 0,${G.H}"/></g>
   ${P.tray.wide?"":`<text class="tztraylab" x="0" y="${P.tray.oy-8}">Pieces</text>`}
   <g class="tzpieces">${P.pieces.map(pc=>`<g class="tzpc" data-pc="${pc.id}" tabindex="0" role="button">${tzPieceSVG(pc)}</g>`).join("")}</g>
   <g class="tzmarks"></g>`;
  P.pieces.forEach(pc=>tzPlace(P,pc,false));tzMarks();tzStatus()}
/* green and red lines on shared edges after "Check" */
function tzMarks(){const P=TZ,g=$("#tzsvg .tzmarks");if(!P||!g)return;if(!P.marks){g.innerHTML="";return}
  g.innerHTML=P.G.links.map(([a],k)=>{const ok=P.marks[k];if(ok==null)return "";const [,ea]=P.G.links[k],s=P.G.slots[a];
    /* the edge of slot a facing direction ea */
    const vs=[[0,-2*TZ_H/3],[TZ_S/2,TZ_H/3],[-TZ_S/2,TZ_H/3]],pick={90:[1,2],330:[0,1],210:[0,2]}[ea];
    const [p,q]=pick.map(i=>[s.cx+vs[i][0],s.cy+vs[i][1]]);
    return `<line class="${ok?"ok":"no"}" x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}"/>`}).join("")}
function tzStatus(){const P=TZ;if(!P)return;const placed=P.pieces.filter(p=>p.at!=null).length,tot=P.pieces.length;
  const el=$("#tzplaced");if(el)el.textContent=`${placed}/${tot} placed`;
  const m=$("#tzmsg");if(m){m.innerHTML=P.msg||(P.solved?"":`Drag a piece onto the triangle, or tap a piece and then a space. Touching edges must make a matching pair. ${placed?"":"Corner pieces have two blank edges."}`);m.className="tzmsg"+(P.solved?" ok":P.msgBad?" bad":"")}
  const r=$("#tzread"),pc=P.sel!=null&&P.pieces[P.sel];
  if(r)r.innerHTML=pc?`<b>Selected piece</b>${pc.sides.map(x=>`<span>${x.t?esc(x.t):"<i>blank</i>"}</span>`).join("")}`:`<b>Tip</b><span>Tap a piece to read its edges here.</span><span>Turn it with ⟳, a double tap or the R key.</span>`;
  const rb=$("#tzrot");if(rb)rb.disabled=P.sel==null||P.solved;const cb=$("#tzcheck");if(cb)cb.disabled=P.solved||!placed}

/* ---------- moving pieces ---------- */
function tzSvgPt(e){const svg=$("#tzsvg"),pt=svg.createSVGPoint();pt.x=e.clientX;pt.y=e.clientY;return pt.matrixTransform(svg.getScreenCTM().inverse())}
function tzFit2Slot(pc,si){const up=TZ.G.slots[si].up;if((pc.rot%2===0)!==up)pc.rot+=1}
function tzMove(pc,si){const P=TZ;P.marks=null;P.msg="";P.msgBad=false;
  if(si==null){pc.at=null}
  else{const other=tzIn(P,si);if(other&&other!==pc){other.at=pc.at;if(other.at!=null)tzFit2Slot(other,other.at);tzPlace(P,other,true)}
    pc.at=si;tzFit2Slot(pc,si)}
  tzPlace(P,pc,true);tzMarks();tzAfter()}
function tzRotate(pc){if(!pc||TZ.solved)return;pc.rot+=2;TZ.marks=null;tzMarks();tzPlace(TZ,pc,true);tzAfter()}
function tzAfter(){const P=TZ,all=P.pieces.every(p=>p.at!=null);
  if(all){const ok=tzEdges(P);if(ok.every(Boolean))return tzWin();P.msg="Every piece is on the board, but some edges don't match yet. Press <b>Check</b> to see which.";P.msgBad=true}
  tzStatus()}
function tzCheck(){const P=TZ;if(!P||P.solved)return;const ok=tzEdges(P),k=ok.filter(x=>x!=null),bad=k.filter(x=>!x).length;
  P.marks=ok;P.checks++;if(bad)P.bad++;tzMarks();
  P.msg=!k.length?"Place two pieces side by side to check an edge.":bad?`${bad} of ${k.length} touching edge${k.length>1?"s":""} don't match (shown in red). Each check that finds a mistake costs 10 points.`:`All ${k.length} touching edge${k.length>1?"s":""} match so far.`;P.msgBad=!!bad;tzStatus()}
function tzWin(){const P=TZ;P.solved=true;P.sel=null;P.secs=Math.round((Date.now()-P.start)/1000);P.marks=tzEdges(P);tzMarks();
  const pct=Math.max(40,100-10*P.bad),key=P.lid+"-"+P.m,o=S.tz[key];
  S.tz[key]={best:Math.max(pct,o?o.best:0),last:pct,attempts:(o?o.attempts:0)+1,secs:o&&o.secs?Math.min(o.secs,P.secs):P.secs,date:new Date().toISOString()};save();
  delete TZKEEP[key];
  P.msg=`<b>Solved!</b> ${pct}% · ${tzTime(P.secs)}${P.bad?` · ${P.bad} check${P.bad>1?"s":""} found mistakes`:" · no mistakes"}. <button class="btn small primary" data-tz="again">New puzzle</button>${P.m==="e"?` <button class="btn small" data-tz="up">Try Challenge</button>`:""}`;
  tzStatus();$("#tzsvg")?.classList.add("won");if(typeof rwAfter==="function")rwAfter()}
const tzTime=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

let TZD=null; // a drag in progress
function tzDown(e){const g=e.target.closest(".tzpc");if(!g||!TZ||TZ.solved)return;const pc=TZ.pieces[+g.dataset.pc];
  e.preventDefault();const p=tzSvgPt(e);TZD={pc,x:p.x,y:p.y,moved:false,id:e.pointerId};$("#tzsvg").setPointerCapture(e.pointerId)}
function tzMoveEv(e){if(!TZD||e.pointerId!==TZD.id)return;const p=tzSvgPt(e);
  if(!TZD.moved&&Math.hypot(p.x-TZD.x,p.y-TZD.y)<4)return;
  if(!TZD.moved){TZD.moved=true;const g=$(`#tzsvg [data-pc="${TZD.pc.id}"]`);g.parentNode.append(g);g.classList.add("drag")}
  TZD.pc.drag=[p.x,p.y];tzPlace(TZ,TZD.pc,false)}
let TZTAP={id:null,t:0};
function tzUp(e){if(!TZD||e.pointerId!==TZD.id)return;const d=TZD;TZD=null;const pc=d.pc;
  $(`#tzsvg [data-pc="${pc.id}"]`)?.classList.remove("drag");
  if(d.moved){const p=pc.drag;delete pc.drag;let best=null,bd=TZ_S*.5;
    TZ.G.slots.forEach((s,i)=>{const dd=Math.hypot(s.cx-p[0],s.cy-p[1]);if(dd<bd){bd=dd;best=i}});
    TZ.sel=pc.id;tzMove(pc,best);return}
  /* a tap: select, or turn it on a quick second tap */
  const now=Date.now();if(TZTAP.id===pc.id&&now-TZTAP.t<350){tzRotate(pc);TZTAP={id:null,t:0};return}
  TZTAP={id:pc.id,t:now};TZ.sel=TZ.sel===pc.id&&pc.at==null?null:pc.id;TZ.pieces.forEach(x=>tzPlace(TZ,x,false));tzStatus()}
function tzSlotTap(si){const P=TZ;if(!P||P.solved||P.sel==null)return;const pc=P.pieces[P.sel];tzMove(pc,si)}

/* ---------- the full-screen puzzle ---------- */
function tzOpen(l,m){const key=l.id+"-"+m;TZ=TZKEEP[key]&&!TZKEEP[key].solved?TZKEEP[key]:(TZKEEP[key]=tzMake(l,m));
  document.getElementById("tzov")?.remove();
  const M=TZ_MODES[m],o=document.createElement("div");o.id="tzov";o.setAttribute("style",accent(l.topic.ch.paper));o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`Tarsia puzzle: ${l.title}`);
  o.innerHTML=`<div class="tzbar"><div class="tzttl"><span class="eyebrow">Tarsia puzzle · ${M.name} · ${M.n*M.n} pieces</span><b>${esc(l.title)}</b></div>
    <div class="tzstat"><span id="tztime" class="mono">0:00</span><span id="tzplaced" class="mono"></span></div>
    <div class="tzbtns"><button class="btn small" id="tzrot" data-tz="rot" title="Turn the selected piece (R)">⟳ Rotate</button><button class="btn small primary" id="tzcheck" data-tz="check">Check</button><button class="btn small" data-tz="again" title="Start a new puzzle">New</button><button class="btn small tzzoombtn" data-tz="zoom" aria-pressed="false" title="Make the pieces bigger">Zoom</button><button class="iconbtn" data-tz="close" aria-label="Close the puzzle" title="Close"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div></div>
   <p class="tzmsg" id="tzmsg" aria-live="polite"></p>
   <div class="tzstage" id="tzstage"><svg id="tzsvg" xmlns="http://www.w3.org/2000/svg"></svg></div>
   <div class="tzread" id="tzread" aria-live="polite"></div>`;
  document.body.append(o);document.documentElement.classList.add("tzopen");
  const svg=$("#tzsvg");svg.addEventListener("pointerdown",tzDown);
  /* pieces are dragged, so a touch on a piece mustn't scroll or zoom the page; elsewhere pinch and pan still work */
  svg.addEventListener("touchstart",e=>{if(e.target.closest(".tzpc"))e.preventDefault()},{passive:false});svg.addEventListener("pointermove",tzMoveEv);svg.addEventListener("pointerup",tzUp);svg.addEventListener("pointercancel",tzUp);
  svg.addEventListener("click",e=>{const s=e.target.closest(".tzslot");if(s)tzSlotTap(+s.dataset.slot)});
  tzDraw();$("#tzcheck").focus({preventScroll:true});tzClock()}
function tzClose(){document.getElementById("tzov")?.remove();document.documentElement.classList.remove("tzopen");
  if(TZ&&!TZ.solved)TZ.secs=Math.round((Date.now()-TZ.start)/1000);TZ=null;render()}
let TZTICK=0;function tzClock(){clearInterval(TZTICK);TZTICK=setInterval(()=>{const el=$("#tztime");if(!el||!TZ){clearInterval(TZTICK);return}
  el.textContent=tzTime(TZ.solved?TZ.secs:Math.round((Date.now()-TZ.start)/1000))},500)}
document.addEventListener("click",e=>{const b=e.target.closest("[data-tz]");if(!b)return;const a=b.dataset.tz;
  if(a==="open"){const l=ALL_LESSONS.find(x=>x.id===b.dataset.l);if(l)tzOpen(l,b.dataset.m);return}
  if(!TZ)return;const l=ALL_LESSONS.find(x=>x.id===TZ.lid);
  if(a==="rot")tzRotate(TZ.sel!=null&&TZ.pieces[TZ.sel]);
  else if(a==="check")tzCheck();
  else if(a==="again"){delete TZKEEP[TZ.lid+"-"+TZ.m];tzOpen(l,TZ.m)}
  else if(a==="up"){tzOpen(l,"c")}
  else if(a==="zoom"){const st=$("#tzstage"),on=!st.classList.contains("zoom");st.classList.toggle("zoom",on);b.setAttribute("aria-pressed",String(on));b.textContent=on?"Zoom out":"Zoom"}
  else if(a==="close")tzClose()});
document.addEventListener("keydown",e=>{if(!TZ||!$("#tzov"))return;
  if(e.key==="Escape"){e.preventDefault();tzClose();return}
  const g=e.target.closest&&e.target.closest(".tzpc"),s=e.target.closest&&e.target.closest(".tzslot");
  if((e.key==="r"||e.key==="R")&&TZ.sel!=null){e.preventDefault();tzRotate(TZ.pieces[TZ.sel]);return}
  if((e.key==="Enter"||e.key===" ")&&g){e.preventDefault();TZ.sel=+g.dataset.pc;TZ.pieces.forEach(x=>tzPlace(TZ,x,false));tzStatus();return}
  if((e.key==="Enter"||e.key===" ")&&s){e.preventDefault();tzSlotTap(+s.dataset.slot)}
  if(e.key==="Tab"){const f=[...$("#tzov").querySelectorAll("button:not([disabled]),[tabindex='0']")];if(!f.length)return;const i=f.indexOf(document.activeElement);
    if(e.shiftKey&&i<=0){e.preventDefault();f[f.length-1].focus()}else if(!e.shiftKey&&i===f.length-1){e.preventDefault();f[0].focus()}}});
addEventListener("resize",()=>{if(TZ&&$("#tzov"))tzDraw()});

/* ---------- the card on the lesson page ---------- */
function tzCard(l){const el=document.getElementById("tzcard");if(!el)return;
  const types=typeof pzTypesFor==="function"?pzTypesFor(l):tzHas(l)?["tarsia"]:[];if(!types.length){el.hidden=true;return}
  const need=typeof tzRequired==="function"&&tzRequired(l);
  const row=m=>{const r=tzRes(l.id,m),M=TZ_MODES[m],k=TZKEEP[l.id+"-"+m];
    return `<div class="tzmode"><div><b>Tarsia · ${M.name}${m==="e"&&need&&!tzDone(l.id)?` <span class="chip start">Set</span>`:""}</b><small>${M.n*M.n} pieces · ${M.pairs} pairs${m==="c"?" · more points":""}</small>
      <span class="sub">${r?`Best ${r.best}% · fastest ${tzTime(r.secs)} · solved ${r.attempts}×`:k&&!k.solved?"In progress":"Not solved yet"}</span></div>
     <button class="btn small${m==="e"&&!r?" primary":""}" data-tz="open" data-l="${l.id}" data-m="${m}">${k&&!k.solved?"Carry on":r?"Play again":"Play"}</button></div>`};
  const doneN=types.filter(t=>typeof pzDone==="function"?pzDone(l.id,t):tzDone(l.id)).length;
  const setN=typeof pzRequired==="function"?types.filter(t=>pzRequired(l,t)&&!pzDone(l.id,t)).length:need?1:0;
  el.innerHTML=`<div class="vhead tzh"><h3>Puzzles</h3>${setN?`<span class="chip start">Set by your teacher</span>`:doneN?`<span class="chip sec">${doneN} of ${types.length} solved</span>`:`<span class="chip none">Bonus</span>`}</div>
   <div class="vbody"><p class="vfoot" style="margin:0">Practise this lesson's key terms and ideas.${setN?" <b>Your teacher has included the puzzles marked Set in an assignment.</b>":""}</p>
   ${types.includes("tarsia")?row("e")+row("c"):""}${typeof pzRows==="function"?pzRows(l):""}</div>`}
