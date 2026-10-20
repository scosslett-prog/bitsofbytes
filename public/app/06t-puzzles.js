/* ================= more puzzles: pairs match, memory pairs and crossword, one of each per lesson =================
   Both sit beside the tarsia puzzle (06q-tarsia.js) in each lesson's Puzzles group, and teachers can
   choose which puzzle types an assignment includes (04-school.js).
   Pairs match: tap a term, then its meaning. Pairs come from the lesson's tarsia pairs (06p-tarsia-pairs.js).
   Memory pairs: the same pairs on face-down cards; turn two over at a time to find a term and its meaning.
   Crossword: answers are the lesson's key terms (l.v) and any tarsia pair with a one-to-three word term.
   Results are kept beside the tarsia ones: S.tz["<lesson id>-m"] (pairs match), "-g" (memory pairs) and S.tz["<lesson id>-x"]
   (crossword), as {best, last, attempts, secs, date}. */
const PZ_TYPES=[["tarsia","Tarsia puzzle"],["match","Pairs match"],["memory","Memory pairs"],["cross","Crossword"]];
const PZ_NAME=Object.fromEntries(PZ_TYPES);
const PZ_KEY={match:"m",memory:"g",cross:"x"};
const PZ_MEM_N=6;
const PZ_MATCH_N=8;
const pzRes=(lid,t)=>t==="tarsia"?null:S.tz[lid+"-"+PZ_KEY[t]]||null;
const pzDone=(lid,t)=>t==="tarsia"?tzDone(lid):!!pzRes(lid,t);
const pzBest=(lid,t)=>t==="tarsia"?tzBest(lid):(pzRes(lid,t)||{}).best||0;
/* the results that count as "done since a date" (for reassigned work) */
const pzResults=(lid,t)=>t==="tarsia"?["e","c"].map(m=>S.tz[lid+"-"+m]).filter(Boolean):[pzRes(lid,t)].filter(Boolean);
function pzHas(l,t){if(!l)return false;if(t==="tarsia"||t==="match"||t==="memory")return tzHas(l);if(t==="cross")return pzWords(l).length>=4&&!!pzCrossOK(l);return false}
/* a crossword needs at least 4 words that actually cross; checked once per lesson */
const pzCrossOK=l=>l._pzok!=null?l._pzok:(l._pzok=!!pzBuild(pzWords(l)));
const pzTypesFor=l=>PZ_TYPES.map(x=>x[0]).filter(t=>pzHas(l,t));
const pzTime=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
function pzSave(lid,t,pct,secs){const key=lid+"-"+PZ_KEY[t],o=S.tz[key];
  S.tz[key]={best:Math.max(pct,o?o.best:0),last:pct,attempts:(o?o.attempts:0)+1,secs:o&&o.secs?Math.min(o.secs,secs):secs,date:new Date().toISOString()};save();
  if(typeof rwAfter==="function")rwAfter()}

/* ---------- crossword words ---------- */
const pzStrip=s=>String(s==null?"":s).replace(/<[^>]*>/g,"").replace(/&[a-z]+;/g," ").replace(/\s+/g," ").trim();
const pzWordy=s=>/^[A-Za-z][A-Za-z' -]*[A-Za-z]$/.test(s)&&s.split(/[ -]+/).length<=3;
/* tarsia halves that read as part of a sentence ("Speaker needs", "Why use hex") don't make good answers */
const pzTermy=s=>pzWordy(s)&&!/^(the|a|an|why|how|what|which|when|who|is|are|does|do|can)\b/i.test(s)&&!/\b(needs|need|is|are|uses|use|has|have|of|for|to|the|a|an|in|on|by|and|or|with|from|than|vs|means|gives|makes|stores|holds|was|be)$/i.test(s);
function pzWords(l){if(l._pzw)return l._pzw;const out=[],seen=new Set();
  const add=(ans,clue)=>{ans=pzStrip(ans);clue=pzStrip(clue);if(!pzWordy(ans)||!clue||clue.length<3)return;
    const letters=ans.replace(/[^A-Za-z]/g,"").toUpperCase();if(letters.length<3||letters.length>13||seen.has(letters))return;
    /* don't let the clue give the answer away */
    const words=ans.split(/[ -]+/).filter(w=>w.length>=4);
    words.forEach(w=>{clue=clue.replace(new RegExp("\\b"+w.replace(/[^A-Za-z]/g,"").slice(0,Math.max(4,w.length-2))+"[A-Za-z]*","gi"),"___")});
    if(clue.toUpperCase().replace(/[^A-Z]/g,"").includes(letters)||/^_+$/.test(clue.replace(/\W/g,"")))return;
    seen.add(letters);out.push({ans,letters,clue,en:ans.split(/[ -]+/).map(w=>w.replace(/[^A-Za-z]/g,"").length).join(",")})};
  (l.v||[]).forEach(([t,d])=>add(t,d));
  const txt=(typeof TZTXT!=="undefined"&&TZTXT[l.id])||(typeof TZP!=="undefined"&&Array.isArray(TZP[l.id])?TZP[l.id]:[]);
  (txt||[]).forEach(([a,b])=>{if(pzTermy(pzStrip(a)))add(a,b);else if(pzTermy(pzStrip(b))&&!/\?$/.test(a))add(b,a+(/ (the|a|an|is|are|of|for|to|by|in|called)$/i.test(a)?" …":""))});
  return l._pzw=out}

/* place words on a grid: each new word crosses one already placed; the best of many tries is kept */
function pzBuild(words,max=10,lim=13){let best=null;
  for(let tr=0;tr<60;tr++){const pool=shuffle(words.slice()).slice(0,Math.min(words.length,16)).sort((a,b)=>b.letters.length-a.letters.length+(Math.random()-.5)*4);
    const g=new Map(),K=(r,c)=>r+","+c,placed=[];let r0=0,r1=0,c0=0,c1=0;
    const fits=(L,r,c,d)=>{const dr=d==="d"?1:0,dc=d==="a"?1:0;let x=0;
      if(g.has(K(r-dr,c-dc))||g.has(K(r+dr*L.length,c+dc*L.length)))return -1;
      const nr0=Math.min(r0,r),nr1=Math.max(r1,r+dr*(L.length-1)),nc0=Math.min(c0,c),nc1=Math.max(c1,c+dc*(L.length-1));
      if(nr1-nr0+1>lim||nc1-nc0+1>lim)return -1;
      for(let i=0;i<L.length;i++){const rr=r+dr*i,cc=c+dc*i,cell=g.get(K(rr,cc));
        if(cell){if(cell.ch!==L[i]||cell[d])return -1;x++}
        else if(g.has(K(rr+dc,cc+dr))||g.has(K(rr-dc,cc-dr)))return -1}
      return x};
    const put=(w,r,c,d)=>{const dr=d==="d"?1:0,dc=d==="a"?1:0;
      for(let i=0;i<w.letters.length;i++){const k=K(r+dr*i,c+dc*i),cell=g.get(k)||{ch:w.letters[i]};cell[d]=true;g.set(k,cell)}
      r0=Math.min(r0,r);r1=Math.max(r1,r+dr*(w.letters.length-1));c0=Math.min(c0,c);c1=Math.max(c1,c+dc*(w.letters.length-1));placed.push({w,r,c,d})};
    if(!pool.length||pool[0].letters.length>lim)continue;
    put(pool[0],0,0,Math.random()<.5?"a":"d");
    for(const w of pool.slice(1)){if(placed.length>=max)break;const cand=[];
      for(const [k,cell] of g){const [gr,gc]=k.split(",").map(Number);
        for(let i=0;i<w.letters.length;i++){if(w.letters[i]!==cell.ch)continue;
          for(const d of ["a","d"]){if(cell[d])continue;const r=d==="d"?gr-i:gr,c=d==="a"?gc-i:gc,x=fits(w.letters,r,c,d);if(x>0)cand.push({r,c,d,x})}}}
      if(!cand.length)continue;
      const area=o=>{const dr=o.d==="d",L=w.letters.length;return (Math.max(r1,o.r+(dr?L-1:0))-Math.min(r0,o.r)+1)*(Math.max(c1,o.c+(dr?0:L-1))-Math.min(c0,o.c)+1)};
      cand.forEach(o=>o.s=o.x*30-area(o)+Math.random()*8);cand.sort((a,b)=>b.s-a.s);put(w,cand[0].r,cand[0].c,cand[0].d)}
    const h=r1-r0+1,wd=c1-c0+1,sc=placed.length*100-h*wd-Math.abs(h-wd)*3;
    if(!best||sc>best.sc)best={sc,placed:placed.map(p=>({...p,r:p.r-r0,c:p.c-c0})),h,w:wd}}
  if(!best||best.placed.length<4)return null;
  /* number the starts, top to bottom then left to right */
  const starts=[...new Set(best.placed.map(p=>p.r+","+p.c))].map(s=>s.split(",").map(Number)).sort((a,b)=>a[0]-b[0]||a[1]-b[1]);
  const num={};starts.forEach(([r,c],i)=>num[r+","+c]=i+1);
  const cells={};best.placed.forEach((p,wi)=>{p.n=num[p.r+","+p.c];p.i=wi;for(let i=0;i<p.w.letters.length;i++){const r=p.r+(p.d==="d"?i:0),c=p.c+(p.d==="a"?i:0),k=r+","+c;
    (cells[k]=cells[k]||{r,c,ch:p.w.letters[i],v:"",words:{}}).words[p.d]=wi}});
  Object.keys(num).forEach(k=>cells[k].n=num[k]);
  return {h:best.h,w:best.w,words:best.placed.sort((a,b)=>a.d.localeCompare(b.d)||a.n-b.n),cells}}

/* ---------- making each puzzle ---------- */
function pzMake(l,t){const base={lid:l.id,t,start:Date.now(),secs:0,bad:0,solved:false,msg:"",msgBad:false};
  if(t==="memory"){const pairs=tzPairs(l,PZ_MEM_N).map((p,i)=>({i,a:pzStrip(p[0]),b:pzStrip(p[1])}));
    return {...base,pairs,cards:shuffle(pairs.flatMap(p=>[{i:p.i,s:"a"},{i:p.i,s:"b"}])),up:[],got:new Set(),seen:new Set(),moves:0,lock:false}}
  if(t==="match"){const pairs=tzPairs(l,PZ_MATCH_N).map((p,i)=>({i,a:pzStrip(p[0]),b:pzStrip(p[1])}));
    return {...base,pairs,left:shuffle(pairs.map(p=>p.i)),right:shuffle(pairs.map(p=>p.i)),got:new Set(),sel:null,wrong:null}}
  let X=null;for(let i=0;i<8&&!X;i++)X=pzBuild(pzWords(l));return X?{...base,X,cur:null,dir:"a",reveals:0}:null}

let PZ=null;const PZKEEP={};
function pzOpen(l,t){const key=l.id+"-"+t;let P=PZKEEP[key];if(!P||P.solved)P=PZKEEP[key]=pzMake(l,t);if(!P)return;PZ=P;
  document.getElementById("tzov")?.remove();
  const o=document.createElement("div");o.id="tzov";o.className="pzov pz-"+t;o.setAttribute("style",accent(l.topic.ch.paper));o.setAttribute("role","dialog");o.setAttribute("aria-modal","true");o.setAttribute("aria-label",`${PZ_NAME[t]}: ${l.title}`);
  o.innerHTML=`<div class="tzbar"><div class="tzttl"><span class="eyebrow">${PZ_NAME[t]}${P.pairs?` · ${P.pairs.length} pairs`:` · ${P.X.words.length} words`}</span><b>${esc(l.title)}</b></div>
    <div class="tzstat"><span id="pztime" class="mono">0:00</span><span id="pzcount" class="mono"></span></div>
    <div class="tzbtns">${t==="cross"?`<button class="btn small" data-pz="reveal" id="pzreveal" title="Show the selected word (costs 10 points)">Reveal word</button><button class="btn small primary" data-pz="check" id="pzcheck">Check</button>`:""}<button class="btn small" data-pz="again" title="Start a new puzzle">New</button><button class="iconbtn" data-pz="close" aria-label="Close the puzzle" title="Close"><svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg></button></div></div>
   <p class="tzmsg" id="pzmsg" aria-live="polite"></p>
   <div class="pzstage" id="pzstage"></div>`;
  document.body.append(o);document.documentElement.classList.add("tzopen");
  pzDraw();clearInterval(pzOpen.tick);pzOpen.tick=setInterval(()=>{const el=$("#pztime");if(!el||!PZ){clearInterval(pzOpen.tick);return}el.textContent=pzTime(PZ.solved?PZ.secs:Math.round((Date.now()-PZ.start)/1000))},500);
  if(t==="cross"){const first=P.cur||Object.keys(P.X.cells).sort((a,b)=>{const A=P.X.cells[a],B=P.X.cells[b];return (A.n||99)-(B.n||99)})[0];pzSelect(first,P.dir)}
  else o.querySelector(".pzm button:not([disabled])")?.focus({preventScroll:true})}
function pzClose(){document.getElementById("tzov")?.remove();document.documentElement.classList.remove("tzopen");
  if(PZ&&!PZ.solved)PZ.secs=Math.round((Date.now()-PZ.start)/1000);PZ=null;clearInterval(pzOpen.tick);render()}
function pzMsg(){const P=PZ,m=$("#pzmsg");if(!P||!m)return;
  m.innerHTML=P.msg||(P.t==="memory"?"Turn over two cards. If one is a term and the other is its meaning, they stay face up. Remember where things are: missing a pair you've already seen costs 10 points.":P.t==="match"?"Tap a term, then the meaning that goes with it. Each wrong match costs 10 points.":"Tap a square or a clue, then type. Tap the same square again to switch between across and down.");
  m.className="tzmsg"+(P.solved?" ok":P.msgBad?" bad":"")}
function pzDraw(){const P=PZ,st=$("#pzstage");if(!P||!st)return;if(P.t==="match")pzDrawMatch(st);else if(P.t==="memory")pzDrawMem(st);else pzDrawCross(st);pzMsg()}
function pzWin(){const P=PZ;P.solved=true;P.secs=Math.round((Date.now()-P.start)/1000);
  /* memory: only avoidable misses cost points (see pzFlip) */
  const pct=P.t==="memory"?Math.max(30,100-10*P.bad):P.t==="match"?Math.max(30,100-10*P.bad):Math.max(30,100-10*P.bad-10*P.reveals);
  pzSave(P.lid,P.t,pct,P.secs);delete PZKEEP[P.lid+"-"+P.t];
  P.msg=`<b>Solved!</b> ${pct}% · ${pzTime(P.secs)}${P.t==="memory"?` · ${P.moves} turn${P.moves===1?"":"s"}${P.bad?` · ${P.bad} avoidable miss${P.bad>1?"es":""}`:" · no avoidable misses"}`:P.bad?` · ${P.bad} ${P.t==="match"?"wrong match":"check"}${P.bad>1?"es":""}${P.t==="cross"?" found mistakes":""}`:" · no mistakes"}${P.reveals?` · ${P.reveals} word${P.reveals>1?"s":""} revealed`:""}. <button class="btn small primary" data-pz="again">New puzzle</button>`;
  P.msgBad=false;pzDraw();$("#tzov")?.classList.add("won")}

/* ---------- pairs match ---------- */
function pzDrawMatch(st){const P=PZ,b=(side,i)=>{const p=P.pairs[i],got=P.got.has(i),sel=P.sel&&P.sel.side===side&&P.sel.i===i,bad=P.wrong&&P.wrong[side]===i;
    return `<button class="pzcard${got?" got":""}${sel?" sel":""}${bad?" bad":""}" data-pz="pick" data-side="${side}" data-i="${i}"${got||P.solved?" disabled":""} aria-pressed="${sel}">${esc(side==="l"?p.a:p.b)}</button>`};
  st.innerHTML=`<div class="pzm"><div class="pzcol"><span class="eyebrow">Terms</span>${P.left.map(i=>b("l",i)).join("")}</div><div class="pzcol"><span class="eyebrow">Meanings</span>${P.right.map(i=>b("r",i)).join("")}</div></div>`;
  const c=$("#pzcount");if(c)c.textContent=`${P.got.size}/${P.pairs.length} matched`}
function pzPick(side,i){const P=PZ;if(!P||P.solved||P.got.has(i))return;P.wrong=null;
  if(!P.sel||P.sel.side===side){P.sel=P.sel&&P.sel.side===side&&P.sel.i===i?null:{side,i};P.msg="";pzDraw();return}
  const other=P.sel;P.sel=null;
  if(other.i===i){P.got.add(i);P.msg=`<b>Match:</b> ${esc(P.pairs[i].a)} → ${esc(P.pairs[i].b)}`;P.msgBad=false;if(P.got.size===P.pairs.length)return pzWin()}
  else{P.bad++;P.wrong={[other.side]:other.i,[side]:i};P.msg=`Not a pair. ${P.bad} wrong match${P.bad>1?"es":""} so far.`;P.msgBad=true;
    setTimeout(()=>{if(PZ===P&&P.wrong&&P.wrong[side]===i){P.wrong=null;pzDraw()}},700)}
  pzDraw()}

/* ---------- memory pairs ---------- */
function pzDrawMem(st){const P=PZ;
  st.innerHTML=`<div class="pzmem" style="--pzcols:${P.cards.length>12?5:4}">${P.cards.map((c,k)=>{const p=P.pairs[c.i],face=P.got.has(c.i)||P.up.includes(k);
    return `<button class="pzmc${face?" up":""}${P.got.has(c.i)?" got":""}${P.miss&&P.miss.includes(k)?" bad":""}" data-pz="flip" data-k="${k}"${P.got.has(c.i)||P.solved?" disabled":""} aria-label="${face?`${c.s==="a"?"Term":"Meaning"}: ${esc(c.s==="a"?p.a:p.b)}`:`Card ${k+1}, face down`}">
     <span class="pzmback" aria-hidden="true"></span><span class="pzmface"><small>${c.s==="a"?"Term":"Meaning"}</small>${esc(c.s==="a"?p.a:p.b)}</span></button>`}).join("")}</div>`;
  const c=$("#pzcount");if(c)c.textContent=`${P.got.size}/${P.pairs.length} found · ${P.moves} turn${P.moves===1?"":"s"}`}
function pzFlip(k){const P=PZ;if(!P||P.solved||P.lock)return;const c=P.cards[k];if(!c||P.got.has(c.i)||P.up.includes(k))return;
  P.miss=null;P.up.push(k);
  if(P.up.length<2){P.msg="";P.msgBad=false;pzDraw();return}
  P.moves++;const [x,y]=P.up.map(j=>P.cards[j]);
  if(x.i===y.i&&x.s!==y.s){P.got.add(x.i);P.up=[];P.msg=`<b>Pair found:</b> ${esc(P.pairs[x.i].a)} → ${esc(P.pairs[x.i].b)}`;P.msgBad=false;
    if(P.got.size===P.pairs.length)return pzWin();pzDraw();return}
  /* not a pair: it only counts as a mistake if it could have been avoided, i.e. the first card's partner
     had already been turned over earlier, so the student could have found it */
  const j1=P.up[0],mate=P.cards.findIndex((c,j)=>j!==j1&&c.i===P.cards[j1].i);if(P.seen.has(mate))P.bad++;P.up.forEach(j=>P.seen.add(j));
  P.miss=P.up.slice();P.lock=true;P.msg="Not a pair. They'll turn back over.";P.msgBad=true;pzDraw();
  setTimeout(()=>{if(PZ!==P)return;P.up=[];P.miss=null;P.lock=false;P.msg="";P.msgBad=false;pzDraw()},1100)}

/* ---------- crossword ---------- */
function pzDrawCross(st){const P=PZ,X=P.X;
  const sz=Math.max(22,Math.min(42,Math.floor(((st.clientWidth||600)>760?Math.min(st.clientWidth*.55,560):(st.clientWidth||360)-8)/X.w)));
  const cw=P.cur&&X.cells[P.cur],wi=cw?cw.words[P.dir]??cw.words[P.dir==="a"?"d":"a"]:null,word=wi!=null?X.words.find(w=>w.i===wi):null;
  const inWord=k=>{if(!word)return false;const c=X.cells[k];return c.words[word.d]===word.i};
  let grid="";for(let r=0;r<X.h;r++)for(let c=0;c<X.w;c++){const k=r+","+c,cell=X.cells[k];
    if(!cell){grid+=`<i class="pzx0"></i>`;continue}
    grid+=`<label class="pzx${k===P.cur?" cur":inWord(k)?" word":""}${cell.bad?" bad":""}${P.solved?" ok":""}">${cell.n?`<b>${cell.n}</b>`:""}<input data-k="${k}" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="${cell.n?cell.n+" ":""}row ${r+1} column ${c+1}" value="${cell.v}"${P.solved?" readonly":""}></label>`}
  const clues=d=>X.words.filter(w=>w.d===d).map(w=>`<li class="${word&&word.i===w.i?"on":""}${pzWordDone(w)?" done":""}" data-pz="clue" data-w="${w.i}"><b>${w.n}</b><span>${esc(w.w.clue)} <small>(${w.w.en})</small></span></li>`).join("");
  st.innerHTML=`<div class="pzc"><div class="pzgridwrap"><div class="pzgrid" style="--pzs:${sz}px;grid-template-columns:repeat(${X.w},var(--pzs))">${grid}</div>
    ${word?`<p class="pzcur"><b>${word.n} ${word.d==="a"?"across":"down"}</b> ${esc(word.w.clue)} <small>(${word.w.en})</small></p>`:""}</div>
    <div class="pzclues"><div><h4>Across</h4><ol>${clues("a")}</ol></div><div><h4>Down</h4><ol>${clues("d")}</ol></div></div></div>`;
  const filled=Object.values(X.cells).filter(c=>c.v).length,tot=Object.keys(X.cells).length;const cn=$("#pzcount");if(cn)cn.textContent=`${filled}/${tot} letters`;
  const rv=$("#pzreveal");if(rv)rv.disabled=P.solved||!word;const ck=$("#pzcheck");if(ck)ck.disabled=P.solved||!filled;
  if(P.cur&&!P.solved){const inp=st.querySelector(`input[data-k="${P.cur}"]`);if(inp&&document.activeElement!==inp)inp.focus({preventScroll:true})}}
const pzWordDone=w=>{const X=PZ.X;for(let i=0;i<w.w.letters.length;i++){const c=X.cells[(w.r+(w.d==="d"?i:0))+","+(w.c+(w.d==="a"?i:0))];if(c.v!==c.ch)return false}return true};
const pzWordCells=w=>Array.from({length:w.w.letters.length},(_,i)=>(w.r+(w.d==="d"?i:0))+","+(w.c+(w.d==="a"?i:0)));
function pzCurWord(){const P=PZ,c=P.cur&&P.X.cells[P.cur];if(!c)return null;const wi=c.words[P.dir]??c.words[P.dir==="a"?"d":"a"];return P.X.words.find(w=>w.i===wi)}
function pzSelect(k,dir){const P=PZ,c=P.X.cells[k];if(!c)return;P.cur=k;P.dir=dir&&c.words[dir]!=null?dir:c.words[P.dir]!=null?P.dir:(c.words.a!=null?"a":"d");pzDraw()}
function pzType(k,ch){const P=PZ;if(!P||P.solved)return;const X=P.X,c=X.cells[k];if(!c)return;
  c.v=ch.toUpperCase();c.bad=false;P.msg="";P.msgBad=false;
  if(Object.values(X.cells).every(x=>x.v===x.ch))return pzWin();
  if(ch){const w=pzCurWord(),ks=w?pzWordCells(w):[],i=ks.indexOf(k);const nx=ks.slice(i+1).find(x=>!X.cells[x].v)||ks[i+1];if(nx)P.cur=nx}
  if(Object.values(X.cells).every(x=>x.v))P.msg="Every square is filled, but some letters are wrong. Press <b>Check</b> to see which.",P.msgBad=true;
  pzDraw()}
function pzMoveCur(dr,dc){const P=PZ,[r,c]=P.cur.split(",").map(Number);for(let s=1;s<15;s++){const k=(r+dr*s)+","+(c+dc*s);if(P.X.cells[k]){P.cur=k;if(dr)P.dir="d";if(dc)P.dir="a";pzDraw();return}}}
function pzCheck(){const P=PZ;if(!P||P.solved)return;const cs=Object.values(P.X.cells).filter(c=>c.v);let bad=0;cs.forEach(c=>{c.bad=c.v!==c.ch;if(c.bad)bad++});
  if(bad)P.bad++;P.msg=bad?`${bad} letter${bad>1?"s are":" is"} wrong (shown in red). Each check that finds a mistake costs 10 points.`:`All ${cs.length} letter${cs.length>1?"s":""} so far are right.`;P.msgBad=!!bad;pzDraw()}
function pzReveal(){const P=PZ,w=pzCurWord();if(!P||P.solved||!w)return;if(pzWordDone(w))return;P.reveals++;pzWordCells(w).forEach(k=>{const c=P.X.cells[k];c.v=c.ch;c.bad=false});
  if(Object.values(P.X.cells).every(x=>x.v===x.ch))return pzWin();P.msg=`Revealed ${w.n} ${w.d==="a"?"across":"down"}. Each revealed word costs 10 points.`;P.msgBad=false;pzDraw()}

/* ---------- events ---------- */
document.addEventListener("click",e=>{const b=e.target.closest("[data-pz]");if(!b)return;const a=b.dataset.pz;
  if(a==="open"){const l=ALL_LESSONS.find(x=>x.id===b.dataset.l);if(l)pzOpen(l,b.dataset.t);return}
  if(!PZ)return;const l=ALL_LESSONS.find(x=>x.id===PZ.lid);
  if(a==="close")pzClose();
  else if(a==="again"){delete PZKEEP[PZ.lid+"-"+PZ.t];pzOpen(l,PZ.t)}
  else if(a==="pick")pzPick(b.dataset.side,+b.dataset.i);
  else if(a==="flip")pzFlip(+b.dataset.k);
  else if(a==="check")pzCheck();
  else if(a==="reveal")pzReveal();
  else if(a==="clue"){const w=PZ.X.words.find(x=>x.i===+b.dataset.w);if(w){const ks=pzWordCells(w);PZ.cur=ks.find(k=>!PZ.X.cells[k].v)||ks[0];PZ.dir=w.d;pzDraw()}}});
/* crossword squares: tapping the selected square again switches direction */
document.addEventListener("pointerdown",e=>{const inp=e.target.closest&&e.target.closest(".pzx input");if(!inp||!PZ||PZ.t!=="cross")return;e.preventDefault();
  const k=inp.dataset.k;if(k===PZ.cur){const c=PZ.X.cells[k],o=PZ.dir==="a"?"d":"a";if(c.words[o]!=null)PZ.dir=o;pzDraw()}else pzSelect(k)});
document.addEventListener("input",e=>{const inp=e.target.closest&&e.target.closest(".pzx input");if(!inp||!PZ||PZ.t!=="cross")return;
  const ch=(inp.value.match(/[A-Za-z]/g)||[]).pop()||"";PZ.cur=inp.dataset.k;pzType(inp.dataset.k,ch)});
document.addEventListener("keydown",e=>{if(!PZ||!$("#tzov.pzov"))return;
  if(e.key==="Escape"){e.preventDefault();pzClose();return}
  if(PZ.t!=="cross"||!e.target.closest||!e.target.closest(".pzx input"))return;const P=PZ;
  if(e.key==="Backspace"){e.preventDefault();const c=P.X.cells[P.cur];if(c.v){c.v="";c.bad=false;pzDraw();return}
    const w=pzCurWord(),ks=w?pzWordCells(w):[],i=ks.indexOf(P.cur);if(i>0){P.cur=ks[i-1];P.X.cells[P.cur].v="";P.X.cells[P.cur].bad=false}pzDraw();return}
  const mv={ArrowRight:[0,1],ArrowLeft:[0,-1],ArrowDown:[1,0],ArrowUp:[-1,0]}[e.key];if(mv){e.preventDefault();pzMoveCur(...mv);return}
  if(e.key==="Enter"||e.key===" "){e.preventDefault();const c=P.X.cells[P.cur],o=P.dir==="a"?"d":"a";if(c.words[o]!=null)P.dir=o;pzDraw();return}
  if(/^[a-zA-Z]$/.test(e.key)&&!e.ctrlKey&&!e.metaKey&&!e.altKey){e.preventDefault();pzType(P.cur,e.key)}});
addEventListener("resize",()=>{if(PZ&&PZ.t==="cross"&&$("#tzov.pzov"))pzDraw()});

/* ---------- rows for the lesson's Puzzles card ---------- */
function pzRows(l){return ["match","memory","cross"].filter(t=>pzHas(l,t)).map(t=>{const r=pzRes(l.id,t),k=PZKEEP[l.id+"-"+t],need=typeof pzRequired==="function"&&pzRequired(l,t)&&!r;
  const sub=t==="match"?`Match ${PZ_MATCH_N} terms to their meanings`:t==="memory"?`Find ${PZ_MEM_N} pairs on face-down cards`:`Up to 10 key terms from the lesson`;
  return `<div class="tzmode"><div><b>${PZ_NAME[t]}${need?` <span class="chip start">Set</span>`:""}</b><small>${sub}</small>
    <span class="sub">${r?`Best ${r.best}% · fastest ${pzTime(r.secs)} · solved ${r.attempts}×`:k&&!k.solved?"In progress":"Not solved yet"}</span></div>
   <button class="btn small${!r&&need?" primary":""}" data-pz="open" data-l="${l.id}" data-t="${t}">${k&&!k.solved?"Carry on":r?"Play again":"Play"}</button></div>`}).join("")}
