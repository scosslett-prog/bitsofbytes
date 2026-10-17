/* exam questions */
const EXDATA=window.__EXDATA;
const EXAMS=EXDATA.EXAMS,EXQ=EXDATA.Q;
S.ex=S.ex||{};S.exh=S.exh||[];
const exPap=id=>+String(id)[3]||1;
const EX={paper:S.exPaper||1,sel:{},xs:new Set(EXAMS.map(x=>x.id)),n:"10",order:"rand",fresh:false,big:false,mode:"setup"};
const exL=id=>ALL_LESSONS.find(l=>l.id===id);
const exPool=(lids,xs,o={})=>EXQ.filter(q=>q.l.some(l=>lids.includes(l))&&(!xs||xs.has(q.x))&&(o.big!==false||!q.big));
const exX=id=>EXAMS.find(x=>x.id===id);
const exPLessons=p=>ALL_LESSONS.filter(l=>l.topic.ch.paper===p&&exPool([l.id]).length);
const exSel=()=>{const p=EX.paper;if(!EX.sel[p])EX.sel[p]=new Set(exPLessons(p).map(l=>l.id));return EX.sel[p]};
const exXs=()=>new Set([...EX.xs].filter(id=>exPap(id)===EX.paper));
const exSetupPool=()=>{let pool=exPool([...exSel()],exXs(),{big:EX.paper===2?EX.big:true});if(EX.fresh)pool=pool.filter(q=>!S.ex[q.id]||S.ex[q.id].b<q.m);return pool};
function exNorm(v,nm,strip){v=String(v||"").trim();
  if(nm==="bin")return v.replace(/\s/g,"");
  if(nm==="hexraw")return v.replace(/\s/g,"").toUpperCase().replace(/^(0X|#)/,"");
  if(nm==="ipv4"){if(v==="OK")return "OK";const p=v.trim().split(".");return p.length===4&&p.every(x=>/^\d{1,3}$/.test(x)&&+x<=255)?"OK":"✗"}
  if(nm==="hex")return v.replace(/\s/g,"").toUpperCase().replace(/^(0X|#)/,"").replace(/^0+(?=.)/,"");
  if(nm==="num"){const t=v.replace(/[−–]/g,"-").replace(/[,\s]/g,"").replace(/[a-z]+$/i,"");return /^-?\d+(\.\d+)?$/.test(t)?String(parseFloat(t)):"✗"+t}
  if(nm==="code")return v.replace(/<-|←/g,"←").replace(/[“”]/g,'"').replace(/[‘’]/g,"'").replace(/\s+/g,"").toLowerCase().replace(/;$/,"");
  let t=v.toLowerCase().replace(/[’'`]/g,"").replace(/[^a-z0-9]+/g," ").trim().replace(/^(a|an|the) /,"");
  (strip||[]).forEach(w=>{t=t.replace(new RegExp("\\b"+w+"\\b","g"),"").replace(/\s+/g," ").trim()});return t}
const exPer=(v,acc,nm,per)=>{const a=exNorm(v,nm),b=exNorm(acc[0],nm);if(!per||a.length!==b.length)return 0;let n=0;for(let i=0;i<b.length;i+=per)if(a.slice(i,i+per)===b.slice(i,i+per))n++;return n};
const exMatch=(v,acc,nm,strip)=>{const n=exNorm(v,nm,strip);return !!n&&acc.some(a=>exNorm(a,nm,strip)===n)};
const exBand=(n,tot,q)=>{if(q.band){for(const [t,mk] of q.band)if(n>=t)return mk;return 0}return Math.floor(n*q.m/tot)};
const exCell=(a,b)=>{const x=String(a==null?"":a).trim(),y=String(b==null?"":b).trim();if(!y)return !x;return trEq(x,y)||exNorm(x,"text")===exNorm(y,"text")&&!!exNorm(y,"text")};
const exSeq=(rows,ci)=>rows.map(r=>r[ci]).filter(v=>String(v==null?"":v).trim()!=="");
const exNR=q=>Math.max(q.nr||0,(exRows(q)||[]).length);
function exGrid(q,c){return [...Array(exNR(q))].map((_,r)=>q.cols.map((_,ci)=>(c.tb||{})[r+"-"+ci]||""))}
function exTraceCols(q,c){const g=exGrid(q,c);return q.cols.map((_,ci)=>{const got=exSeq(g,ci),ok=want=>want.length===got.length&&want.every((w,k)=>exCell(got[k],w));return ok(exSeq(q.rows,ci))||!!(q.alt&&q.alt[ci]&&ok(q.alt[ci]))})}
function exSqlRun(q,src){const nm=q.db.name;DBT[nm]={name:nm,f:q.db.f.map(f=>[f[0].replace(/\$/g,""),f[1]||"text"]),r:q.db.r,key:q.db.f[0][0]};
  let s=String(src||"").replace(/(=|<>)\s*(yes|no|true|false|y|n)\b(?!\s*")/gi,(m,o,w)=>`${o} "${w}"`);const yes=q.db.yes;if(yes)s=s.replace(/"(true|yes|y)"/gi,`"${yes[0]}"`).replace(/"(false|no|n)"/gi,`"${yes[1]}"`).replace(/'(true|yes|y)'/gi,`"${yes[0]}"`).replace(/'(false|no|n)'/gi,`"${yes[1]}"`);return s}
function exRows(q){if(!q.rows&&q.autor){let V;if(q.fc){const st=flState(q.vin),T=trBuild(q.cols);let cur=q.fc.start||"s",n=0;while(cur&&n++<5000){const r=flStep(q.fc,st,cur);T.flush(st);if(!r){if(q.vrep&&st.inq.length){cur=q.fc.start||"s";continue}break}cur=r.node}V=T.view()}else V=psTrace(q.vpc||q.pc,q.vin,{cols:q.cols});q.rows=V.rows.map(r=>q.cols.map(cn=>{const k=V.cols.indexOf(cn);return k<0?"":r[k]})).filter(r=>r.some(x=>x!==""))}return q.rows}
function exAuto(q,c){exRows(q);const R={marks:0,f:[]};
  if(q.t==="mc"){const ok=c.sel===q.a;R.marks=ok?1:0;R.f=[ok]}
  else if(q.t==="ans"){const ok=exMatch(c.v[0],q.acc,q.nm,q.strip);R.marks=ok?q.m:exPer(c.v[0],q.acc,q.nm,q.per);if(!ok&&q.band){const n=R.marks;R.marks=0;for(const [t,mk] of q.band)if(n>=t){R.marks=mk;break}}R.f=[ok]}
  else if(q.t==="multi"){q.f.forEach((f,i)=>{const ok=exMatch(c.v[i],f.acc,f.nm,f.strip);R.f.push(ok);R.marks+=ok?(f.per?exNorm(f.acc[0],f.nm).length/f.per:(f.mk||1)):exPer(c.v[i],f.acc,f.nm,f.per)});if(q.band){const n=R.f.filter(Boolean).length;R.marks=exBand(n,q.f.length,q)}}
  else if(q.t==="set"){const used=new Set();for(let i=0;i<q.f;i++){const g=q.grp.findIndex((G,gi)=>!used.has(gi)&&G.some(a=>exMatch(c.v[i],[a],q.nm||"text",q.strip)));R.f.push(g>=0);if(g>=0){used.add(g);R.marks++}}if(q.band)R.marks=exBand(R.marks,q.f,q);R.marks=Math.min(R.marks,q.m)}
  else if(q.t==="pick"){const P=[...(c.pick||[])];P.forEach(i=>{if(q.a.includes(i))R.marks++});R.f=P}
  else if(q.t==="cloze"){q.a.forEach((a,i)=>R.f.push(Array.isArray(a)?a.includes(c.v[i]):c.v[i]===a));(q.diff||[]).forEach(([x,y])=>{if(R.f[x]&&R.f[y]&&c.v[x]===c.v[y])R.f[y]=false});R.marks=R.f.filter(Boolean).length}
  else if(q.t==="match"){q.a.forEach((a,i)=>R.f.push(String(c.v[i])===String(a)));const n=R.f.filter(Boolean).length;R.marks=q.band?exBand(n,q.a.length,q):n}
  else if(q.t==="trace"){R.f=exTraceCols(q,c);const mk=q.mk||q.cols.map((_,i)=>[i]);R.marks=mk.filter(g=>g.every(i=>R.f[i])).length}
  else if(q.t==="grid"){const g=exGrid(q,c),used=new Set();let n=0;q.rows.forEach((w,ri)=>{const k=q.uo?g.findIndex((r,gi)=>!used.has(gi)&&r.every((x,ci)=>exCell(x,w[ci]))):ri;const ok=k>=0&&g[k]&&g[k].every((x,ci)=>exCell(x,w[ci]));if(ok){used.add(k);n++}R.f.push(ok)});
    const extra=g.filter((r,gi)=>!used.has(gi)&&r.some(x=>String(x).trim())).length;if(q.ex0&&extra)n=Math.max(0,n-extra);R.marks=exBand(n,q.rows.length,q)}
  else if(q.t==="tt"){const o=q.a.length/ (lgRowsOf(q.ins.length).length);let n=0;for(let i=0;i<q.a.length;i++){const ok=String((c.tt||[])[i])===q.a[i];R.f.push(ok);if(ok)n++}R.marks=exBand(n,q.a.length,q)}
  else if(q.t==="err"){const used=new Set();for(let i=0;i<(q.ne||q.e.length);i++){const ln=String(c.v[2*i]||"").replace(/\D/g,""),cor=c.v[2*i+1]||"";const k=q.e.findIndex((E,ei)=>!used.has(ei)&&E[0].map(String).includes(String(+ln)));
      const ok=k>=0&&(!E2(q.e[k])||q.e[k][1].some(a=>exNorm(cor,"code")===exNorm(a,"code")));R.f.push(k>=0?(ok?1:0.5):0);if(k>=0)used.add(k);if(ok)R.marks+=q.e[k][2]||1}R.marks=Math.min(R.marks,q.m)}
  else if(q.t==="expr"){let ok=false;try{const t=String(c.v[0]||"").replace(/^\s*[A-Z]\s*=\s*/i,"").replace(/[·.]/g," AND ").replace(/\+/g," OR ");if(/^[\sA-Za-z()]+$/.test(t)&&t.trim()){const T=lgParse(t),bad=lgInsOf(T).some(n=>!q.ins.includes(n));ok=!bad&&exLgTT(T,q.ins)===exLgTT(q.vx,q.ins)}}catch(e){}R.f=[ok];R.marks=ok?q.m:0;if(!ok)R.msg="Your expression doesn't give the same truth table as the mark scheme answer."}
  else if(q.t==="wr"&&q.auto){const src=c.code||"";let fail=null;if(!src.replace(/\/\/.*$/gm,"").trim())fail="You haven't written any code yet.";else for(const k of exChecks(q)){let r;try{r=k.f(null,null,src)}catch(e){r=e.ln>=0?`Your code gave an error on line ${e.ln+1}: ${e.message}`:e.message}if(r!==true){fail=`${k.l}: ${r}`;break}}R.f=[!fail];R.marks=fail?0:q.m;R.msg=fail?`Not all the tests passed. ${fail}`:"All the tests passed."}
  else if(q.t==="sql"){try{const r=dbSameResult(exSqlRun(q,c.v[0]),exSqlRun(q,q.ans));R.f=[r[0]];R.msg=r[0]?"":r[1];R.marks=r[0]?q.m:0}catch(e){R.f=[false];R.msg=String(e)}}
  R.marks=Math.min(R.marks,q.m);return R}
const E2=E=>E[1]&&E[1].length;
const EX_SELF=new Set(["self","wr","big","circ"]);
const exIsAuto=q=>!EX_SELF.has(q.t)||q.t==="wr"&&!!q.auto;
function exAnswerText(q){if(q.t==="mc")return String.fromCharCode(65+q.a)+": "+q.o[q.a];if(q.t==="ans")return q.acc[0];if(q.t==="multi")return q.wide?q.why:q.f.map(f=>f.lab.replace(/^_/,"")+" → "+f.acc[0]).join(" · ");if(q.t==="set")return q.why||q.grp.map(g=>g[0]).join(", ");if(q.t==="pick")return q.a.map(i=>q.o[i]).join(", ");if(q.t==="cloze")return q.a.map((a,i)=>`(${i+1}) ${Array.isArray(a)?a.join(" / "):a}`).join(" · ");
  if(q.t==="match")return q.L.map((l,i)=>`${l} → ${q.o[q.a[i]]}`).join(" · ");if(q.t==="err")return q.e.map(E=>`Line ${E[0].join(" or ")}${E2(E)?`: ${E[1][0]}`:""}`).join(" · ");if(q.t==="sql")return q.ans;if(q.t==="expr")return q.ms&&q.ms.ans||q.vx;return ""}
function exTableHTML(cols,rows,mark){return `<div class="tscroll"><table class="extab extr"><tr>${cols.map((h,i)=>`<th${mark?` class="${mark[i]?"ok":"no"}"`:""}>${esc(h)}${mark?(mark[i]?" ✓":" ✗"):""}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(x=>`<td class="mono">${esc(String(x==null?"":x))}</td>`).join("")}</tr>`).join("")}</table></div>`}
function exAnswerHTML(q){exRows(q);if(q.t==="trace"||q.t==="grid")return exTableHTML(q.cols,q.rows);
  if(q.t==="tt"){const R=lgRowsOf(q.ins.length),no=q.out.length;return exTableHTML(q.ins.concat(q.out),R.map((r,i)=>[...r].concat(q.out.map((_,k)=>q.a[i*no+k]))))}
  if(q.t==="sql")return `<pre class="sqlcode">${sqlHL(q.ans)}</pre>`;if(q.t==="wr")return q.ms&&q.ms.code?pcBox(q.ms.code):"";return `<p style="margin:2px 0 0;font-weight:700">${esc(exAnswerText(q))}</p>`}
function exEditor(q,c,ro){if(c.code==null)c.code=q.st||"";PSPROGS._exq={t:ro?"Your answer":"Write your answer",code:c.code,inputs:true,io:1,files:q.files,tdata:q.td,check:q.ck&&q.ck.length?exChecks(q):null};return `<div class="lgwid psrun exed" data-p="_exq"${ro?"":" data-edit=\"1\""}></div>${q.ck&&q.ck.length&&!ro?`<p class="vfoot" style="margin:0">Press <b>Run</b> to test your code, and <b>Check my answer</b> to run it against ${q.ck.length} test${q.ck.length>1?"s":""}. Then show the mark scheme to award your marks.</p>`:""}`}
function exInputs(q,c,R){const dis=R?" disabled":"",cls=i=>R&&R.f?(R.f[i]?" ok":" no"):"",val=i=>esc(c.v[i]||"");
  const mono=nm=>nm==="bin"||nm==="hex"||nm==="num"||nm==="code"?" mono":"";
  if(q.t==="mc")return `<div class="exmc">${q.o.map((o,i)=>`<button data-ex="mc" data-i="${i}" aria-pressed="${c.sel===i}"${dis} class="${R?(i===q.a?"ok":c.sel===i?"no":""):""}"><b>${String.fromCharCode(65+i)}</b><span>${esc(o)}</span></button>`).join("")}</div>`;
  if(q.t==="ans")return `<label class="exl">Your answer<input type="text" class="${mono(q.nm)}${cls(0)}" data-exv="0" value="${val(0)}" autocomplete="off" spellcheck="false"${dis}></label>`;
  if(q.t==="multi"&&q.wide)return q.f.map((f,i)=>`<label class="exl" style="color:var(--ink);font-weight:600;font-size:.92rem">${esc(f.lab)}<input type="text" class="${mono(f.nm)}${cls(i)}" data-exv="${i}" value="${val(i)}" autocomplete="off" spellcheck="false"${dis}></label>`).join("");
  if(q.t==="multi")return q.f.map((f,i)=>{const pre=f.lab.startsWith("_");return `<div class="exfield">${pre?`<span>parity bit</span><input type="text" class="mono${cls(i)}" data-exv="${i}" value="${val(i)}" maxlength="3" style="flex:0 0 70px;min-width:0" aria-label="Parity bit for ${f.lab.slice(1)}"${dis}><span>${f.lab.slice(1)}</span>`:`<span>${esc(f.lab)}</span><input type="text" class="${mono(f.nm)}${cls(i)}" data-exv="${i}" value="${val(i)}" autocomplete="off" spellcheck="false" aria-label="Answer for ${esc(f.lab)}"${dis}>`}</div>`}).join("");
  if(q.t==="set")return Array.from({length:q.f},(_,i)=>`<label class="exl">${q.f>1?(q.lines?q.lines[i]:i+1):"Your answer"}<input type="text" class="${mono(q.nm)}${cls(i)}" data-exv="${i}" value="${val(i)}" autocomplete="off"${dis}></label>`).join("");
  if(q.t==="pick"){const P=c.pick||[];return `<p class="vfoot" style="margin:0">Choose ${q.k}.</p><div class="expick">${q.o.map((o,i)=>`<label class="${R?(q.a.includes(i)?(P.includes(i)?"ok":""):(P.includes(i)?"no":"")):""}"><input type="checkbox" data-expick="${i}"${P.includes(i)?" checked":""}${dis||(!P.includes(i)&&P.length>=q.k?" disabled":"")}> ${esc(o)}</label>`).join("")}</div>`}
  if(q.t==="cloze"){const sel=k=>`<select data-exv="${k}" class="${cls(k)}"${dis} aria-label="Gap ${k+1}"><option value="">(${k+1}) choose…</option>${q.w.map(w=>`<option${c.v[k]===w?" selected":""}>${esc(w)}</option>`).join("")}</select>`;
    return `<div class="exwords">${q.w.map(w=>`<span>${esc(w)}</span>`).join("")}</div><div class="excloze">${q.txt.replace(/\{(\d+)\}/g,(_,k)=>sel(+k))}</div>`}
  if(q.t==="match")return `<div class="exmatch">${q.L.map((l,i)=>`<div class="exmrow"><span>${esc(l)}</span><select data-exv="${i}" class="${cls(i)}"${dis} aria-label="Match for ${esc(l)}"><option value="">choose…</option>${q.o.map((o,k)=>`<option value="${k}"${String(c.v[i])===String(k)?" selected":""}>${esc(o)}</option>`).join("")}</select></div>`).join("")}</div>`;
  if(q.t==="trace"||q.t==="grid"){const nr=exNR(q),mark=R&&q.t==="trace"?R.f:null;return `<div class="tscroll"><table class="extab extr"><tr>${q.cols.map((h,i)=>`<th${mark?` class="${mark[i]?"ok":"no"}"`:""}>${esc(h)}${mark?(mark[i]?" ✓":" ✗"):""}</th>`).join("")}</tr>${[...Array(nr)].map((_,r)=>`<tr>${q.cols.map((h,ci)=>`<td><input type="text" class="mono" data-extb="${r}-${ci}" value="${esc((c.tb||{})[r+"-"+ci]||"")}" aria-label="${esc(h)}, row ${r+1}" autocomplete="off" spellcheck="false"${dis}></td>`).join("")}</tr>`).join("")}</table></div>${q.t==="trace"&&!R?`<p class="vfoot" style="margin:0">Each column is marked on its values in order, so your rows don't need to line up exactly with the mark scheme.</p>`:""}`}
  if(q.t==="tt"){const rows=lgRowsOf(q.ins.length),no=q.out.length,T=c.tt||[];return `<div class="tscroll"><table class="extab extt"><tr>${q.ins.map(h=>`<th>${h}</th>`).join("")}${q.out.map(h=>`<th class="o">${h}</th>`).join("")}</tr>${rows.map((r,ri)=>`<tr>${[...r].map(b=>`<td>${b}</td>`).join("")}${q.out.map((_,k)=>{const i=ri*no+k,v=T[i];return `<td><button class="extb${R?(R.f[i]?" ok":" no"):""}" data-ex="tt" data-i="${i}"${dis} aria-label="${q.out[k]} for row ${ri+1}: ${v==null||v===""?"blank":v}">${v==null?"":v}</button></td>`}).join("")}</tr>`).join("")}</table></div><p class="vfoot" style="margin:0">Click a cell to switch between 0 and 1.</p>`}
  if(q.t==="err")return `<div class="exerr">${Array.from({length:q.ne||q.e.length},(_,i)=>`<div class="exerow${R?(R.f[i]===1?" ok":R.f[i]?" part":" no"):""}"><label>Line<input type="text" class="mono" data-exv="${2*i}" value="${val(2*i)}" inputmode="numeric" autocomplete="off"${dis}></label><label>Correction<input type="text" class="mono" data-exv="${2*i+1}" value="${val(2*i+1)}" autocomplete="off" spellcheck="false"${dis}></label></div>`).join("")}</div>`;
  if(q.t==="expr")return `<label class="exl">Your logic expression<input type="text" class="mono${cls(0)}" data-exv="0" value="${val(0)}" placeholder="e.g. X = (A AND B) OR NOT C" autocomplete="off" spellcheck="false"${dis}></label><p class="vfoot" style="margin:0">Use AND, OR, NOT, NAND, NOR, XOR and brackets.</p>`;
  if(q.t==="sql")return `<label class="exl">Your SQL<textarea class="mono sqlin" data-exv="0" rows="4" spellcheck="false" autocapitalize="off"${dis}>${val(0)}</textarea></label>${R?"":`<div class="fcrow"><button class="btn small" data-ex="sqlrun">▶ Run my query</button></div>`}${c.sqlres||""}`;
  if(q.t==="wr"||q.t==="big")return exEditor(q,c,!!R);
  // self / circ
  let h="";if(q.pre)h+=`<pre class="expre">${esc(q.pre)}</pre>`;
  if(q.tb)h+=`<div class="tscroll"><table class="extab"><tr>${q.tb.h.map(x=>`<th>${esc(x)}</th>`).join("")}</tr>${q.tb.r.map((r,ri)=>`<tr>${r.map((cell,ci)=>cell==null?`<td><textarea data-extb="${ri}-${ci}" rows="2" aria-label="${esc(q.tb.h[ci])} for row ${ri+1}"${dis}>${esc((c.tb||{})[ri+"-"+ci]||"")}</textarea></td>`:`<td>${esc(cell)}</td>`).join("")}</tr>`).join("")}</table></div>`;
  if(q.lines)h+=q.lines.map((lb,i)=>`<label class="exl">${esc(lb)}<textarea data-exv="${i}" rows="2"${dis}>${val(i)}</textarea></label>`).join("");
  else if(!q.tb||q.pre)h+=`<label class="exl">${q.t==="circ"?"Describe your circuit, or draw it on paper":"Your answer"}<textarea data-exv="0" rows="${Math.min(8,Math.max(2,q.m+1))}"${dis}>${val(0)}</textarea></label>`;
  return h}
function exMS(q,c){const M=q.ms,T=c.ticks||[],got=Math.min(T.length,q.m);
  return `<div class="exms"><h4>Mark scheme · ${q.m} mark${q.m>1?"s":""}</h4>${M.h?`<span style="font-size:.9rem;font-weight:600">${esc(M.h)}</span>`:""}
   <p class="vfoot" style="margin:0">Tick each point your answer makes. Each point is worth 1 mark, up to ${q.m}.</p>
   <div class="pts">${M.pts.map((p,i)=>`<label class="${T.includes(i)?"on":""}"><input type="checkbox" data-extick="${i}"${T.includes(i)?" checked":""}${c.done?" disabled":""}> <span>${esc(p)}</span></label>`).join("")}</div>
   ${q.t==="circ"&&q.ex?`<div><span class="vfoot">Model circuit</span>${lgDraw(q.ex,{label:"Model answer circuit",out:q.lco})}</div>`:""}
   ${q.msfc?`<div><span class="vfoot">Model flowchart</span><div class="lgcard flcard exfc">${flSVG(q.msfc)}</div></div>`:""}${M.ex?`<div><span class="vfoot">Example answer</span>${M.ex}</div>`:""}${M.code?`<div><span class="vfoot">Example answer</span>${pcBox(M.code)}</div>`:""}
   ${M.g?`<details><summary>Examiner guidance</summary><ul>${M.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:""}
   <p class="exscore" style="margin:0" aria-live="polite">Your mark: ${got} / ${q.m}</p></div>`}
function exBigMS(q,c){const L=c.lv||{},lv=(k,D,max)=>`<div class="exlv"><b>${k} <small>(up to ${max} marks)</small></b>${D.map(([a,b,d])=>`<div class="exlvb"><div class="exlvd"><span class="exlvr">${a===b?a:`${a}–${b}`}</span><span>${esc(d)}</span></div><div class="exlvm">${[...Array(b-a+1)].map((_,i)=>a+i).map(n=>`<button class="btn small${L[k]===n?" primary":""}" data-ex="lv" data-k="${k}" data-v="${n}" aria-pressed="${L[k]===n}"${c.done?" disabled":""}>${n}</button>`).join("")}</div></div>`).join("")}</div>`;
  const tot=(L.AO2||0)+(L.AO3||0);
  return `<div class="exms"><h4>Mark scheme · 15 marks</h4><p style="margin:0">This question is marked in levels. First check your program against each requirement, then choose a mark for AO2 (the techniques and data structures you used) and AO3 (comments, identifiers, logic and accuracy).</p>
   ${q.ms&&q.ms.pts?`<span class="eyebrow">Requirements</span><div class="pts">${q.ms.pts.map((p,i)=>`<label class="${(c.ticks||[]).includes(i)?"on":""}"><input type="checkbox" data-extick="${i}"${(c.ticks||[]).includes(i)?" checked":""}${c.done?" disabled":""}> <span>${esc(p)}</span></label>`).join("")}</div>`:""}
   ${lv("AO2",EX_AO2,9)}${lv("AO3",EX_AO3,6)}
   ${q.ms&&q.ms.code?`<details><summary>Example 15-mark answer</summary>${pcBox(q.ms.code)}</details>`:""}${q.ms&&q.ms.g?`<details><summary>Examiner guidance</summary><ul>${q.ms.g.map(x=>`<li>${esc(x)}</li>`).join("")}</ul></details>`:""}
   <p class="exscore" style="margin:0" aria-live="polite">Your mark: ${tot} / 15</p></div>`}
const exSelfMark=(q,c)=>q.t==="big"?((c.lv||{}).AO2||0)+((c.lv||{}).AO3||0):Math.min((c.ticks||[]).length,q.m);
function exMine(q,c){if(q.t==="wr"||q.t==="big")return `<div><span class="vfoot">Your answer</span>${c.code&&c.code.trim()?pcBox(c.code):'<p class="vfoot">(no answer)</p>'}</div>`;
  const parts=[];if(q.tb)q.tb.r.forEach((r,ri)=>r.forEach((cell,ci)=>{if(cell==null)parts.push([`${q.tb.h[ci]} (row ${ri+1})`,(c.tb||{})[ri+"-"+ci]])}));
  if(q.lines)q.lines.forEach((lb,i)=>parts.push([lb,c.v[i]]));else if(!q.tb||q.pre)parts.push(["Your answer",c.v[0]]);
  return `<div class="exmine">${parts.map(([a,b])=>`<b>${esc(a)}</b>${b?esc(b):'<span class="vfoot">(no answer)</span>'}`).join("<br>")}</div>`}
function exStart(ids){EX.list=ids;EX.i=0;EX.res={};EX.mode="run";exNew()}
function exNew(){EX.c={v:[],tb:{},tt:[],pick:[],ticks:[],sel:null,phase:"answer",R:null,done:false,code:null,lv:{}}}
/* award marks one answer at a time when a student's wording means the same as the mark scheme */
const exOvOK=(q,R,i)=>q.t==="err"?R.f[i]===1:!!R.f[i];
function exOvMarks(q,c){const ov=c.ov||[];let m;
  if(q.band){const n=c.R.f.filter((_,i)=>exOvOK(q,c.R,i)||ov.includes(i)).length;m=exBand(n,q.t==="set"?q.f:c.R.f.length,q)}
  else m=c.R.base+ov.reduce((a,i)=>a+(q.t==="multi"?(q.f[i].mk||1):1),0);
  return Math.min(q.m,Math.max(c.R.base,m))}
function exOvHTML(q,c,full){if(!(q.t==="set"||q.t==="err"||q.t==="multi")||!c.R||!c.R.f)return "";const ov=c.ov||[],rows=[];
  c.R.f.forEach((_,i)=>{if(exOvOK(q,c.R,i))return;const v=q.t==="err"?[c.v[2*i],c.v[2*i+1]]:[c.v[i]];if(!v.some(x=>String(x||"").trim()))return;
    const lab=q.t==="err"?`Error ${i+1}: line ${esc(c.v[2*i]||"?")}`:q.t==="set"?(q.lines?esc(q.lines[i]):`Answer ${i+1}`):esc(q.f[i].lab.replace(/^_/,""));
    const ans=q.t==="err"?esc(c.v[2*i+1]||""):esc(c.v[i]||"");
    rows.push(`<div class="exov"><span>${lab}${ans?`: <b class="mono">${ans}</b>`:""}</span>${ov.includes(i)?`<span class="vfoot">✓ counted</span>`:full?"":`<button class="btn small" data-ex="ov1" data-i="${i}">Means the same: count it</button>`}</div>`)});
  return rows.length?`<div class="exovs"><span class="vfoot">If one of your answers means the same as the mark scheme, count just that one:</span>${rows.join("")}</div>`:""}
function exRecord(q,mark){EX.res[q.id]=mark;const r=S.ex[q.id]||{b:0,n:0};r.b=Math.max(r.b,mark);r.l=mark;r.m=q.m;r.n=(r.n||0)+1;r.t=Date.now();S.ex[q.id]=r;save()}
function exRunHTML(){const q=EXQ.find(x=>x.id===EX.list[EX.i]),c=EX.c,X=exX(q.x),N=EX.list.length;exRows(q);
  const sc=EX.list.slice(0,EX.i).reduce((a,id)=>a+(EX.res[id]||0),0),mx=EX.list.slice(0,EX.i).reduce((a,id)=>a+EXQ.find(x=>x.id===id).m,0);
  let h=`<div class="fcmeta"><span>Question ${EX.i+1} of ${N}</span><span>${mx?`${sc}/${mx} marks so far`:""}</span></div><div class="fcprog"><i style="width:${EX.i/N*100}%;background:var(--ex)"></i></div>
   <div class="exhead"><span class="exsrc">${X.s} · ${X.code} · Question ${q.n}</span><span class="exmk">[${q.m} mark${q.m>1?"s":""}]</span></div>
   <div class="extags">${q.l.map(id=>{const L=exL(id);return L?`<a href="#l-${id}">${L.topic.code} · ${esc(L.title)}</a>`:""}).join("")}</div>
   ${q.c?`<div class="exctx">${q.c}</div>`:""}${exFigs(q)}<div class="exqt">${q.q}</div>`;
  if(EX_SELF.has(q.t)&&!(q.t==="wr"&&q.auto)&&c.phase!=="answer"){if(q.tb&&!q.lines&&!q.pre)h+=`<div class="tscroll"><table class="extab"><tr>${q.tb.h.map(x=>`<th>${esc(x)}</th>`).join("")}</tr>${q.tb.r.map((r,ri)=>`<tr>${r.map((cell,ci)=>`<td>${cell==null?`<em>${esc((c.tb||{})[ri+"-"+ci]||"(no answer)")}</em>`:esc(cell)}</td>`).join("")}</tr>`).join("")}</table></div>`;else{if(q.tb)h+=exInputs(q,c,{});h+=exMine(q,c)}h+=q.t==="big"?exBigMS(q,c):exMS(q,c)}
  else h+=`<div class="exans">${exInputs(q,c,c.R)}</div>`;
  if(c.R){const full=c.R.marks===q.m;h+=`<div class="exms"><p class="exscore" style="margin:0">${full?"✅":c.R.marks?"🟡":"❌"} ${c.R.marks} / ${q.m} mark${q.m>1?"s":""}</p>${c.R.msg?`<p style="margin:0;font-size:.92rem">${esc(c.R.msg)}</p>`:""}<div><span class="vfoot">Mark scheme answer</span>${exAnswerHTML(q)}</div>${q.why?`<p style="margin:0;font-size:.92rem">${esc(q.why)}</p>`:""}
    ${exOvHTML(q,c,full)}${!full&&(q.t==="ans"&&(q.nm==="text"||q.nm==="code")||(q.t==="sql"||q.t==="expr")&&!q.ms)&&!c.over?`<button class="btn small" data-ex="over" style="align-self:flex-start">My answer means the same as the mark scheme: award ${q.m>1?"the marks":"the mark"}</button>`:""}${c.over?`<p class="vfoot" style="margin:0">You awarded yourself the marks.</p>`:""}
    ${!full&&(q.t==="sql"||q.t==="expr"||q.t==="wr")&&q.ms?(c.part?exMS(q,c):`<button class="btn small" data-ex="part" style="align-self:flex-start">Use the mark scheme to award part marks</button>`):""}</div>`}
  const last=EX.i===N-1;
  if(c.phase==="answer")h+=`<div class="fcrow">${exIsAuto(q)?`<button class="btn primary" data-ex="mark">Mark my answer</button>`:`<button class="btn primary" data-ex="reveal">Show the mark scheme</button>`}<button class="btn" data-ex="skip">Skip</button><button class="btn" data-ex="quit">End round</button></div>`;
  else h+=`<div class="fcrow"><button class="btn primary" data-ex="next">${last?"See my results":"Next question →"}</button><button class="btn" data-ex="quit">End round</button></div>`;
  return h}
function exDoneHTML(){const ids=EX.list.filter(id=>id in EX.res),qs=ids.map(id=>EXQ.find(x=>x.id===id)),sc=ids.reduce((a,id)=>a+EX.res[id],0),mx=qs.reduce((a,q)=>a+q.m,0);
  const weak={};qs.forEach(q=>{if(EX.res[q.id]<q.m)q.l.forEach(l=>{weak[l]=(weak[l]||0)+(q.m-EX.res[q.id])})});const wl=Object.entries(weak).sort((a,b)=>b[1]-a[1]).slice(0,4);
  return `<div class="fcstat"><div><b>${mx?Math.round(sc/mx*100):0}%</b><span>score</span></div><div><b>${sc}/${mx}</b><span>marks</span></div><div><b>${ids.length}</b><span>questions answered</span></div></div>
   ${wl.length?`<div><span class="eyebrow">Lessons to revise</span><div class="extags" style="margin-top:6px">${wl.map(([l])=>{const L=exL(l);return L?`<a href="#l-${l}">${L.topic.code} · ${esc(L.title)}</a>`:""}).join("")}</div></div>`:`<p class="msg ok" style="margin:0">Full marks on everything. Brilliant!</p>`}
   <div class="exres">${qs.map(q=>{const m=EX.res[q.id],X=exX(q.x);return `<div><span>${X.code} Q${q.n} · ${esc(exL(q.l[0])?.title||"")}</span><b class="${m===q.m?"full":m?"part":"zero"}">${m}/${q.m}</b></div>`}).join("")}</div>
   <div class="fcrow"><button class="btn primary" data-ex="again">Try these questions again</button><button class="btn" data-ex="new">New round</button></div>`}
function exPapersHTML(){const xs=EXAMS.filter(x=>exPap(x.id)===EX.paper),on=xs.filter(x=>EX.xs.has(x.id)).length;
  return `<details class="exppick"${EX.popen?" open":""}><summary><span>Exam papers</span><small>${on===xs.length?`All ${xs.length} papers`:`${on} of ${xs.length} papers`} · change</small></summary>
   <div class="expn"><button data-ex="xall" data-v="1">Select all</button> · <button data-ex="xall" data-v="0">Clear</button></div><div class="expapers">${[["m","March"],["s","June"],["w","November"]].map(([k,mo])=>{const ks=xs.filter(x=>x.id[2]===k),yrs=[...new Set(ks.map(x=>x.id.slice(0,2)))];if(!ks.length)return"";
     return `<div><button class="exmo" data-ex="xg" data-v="${k}" title="Select or clear every ${mo} paper">${mo}</button>${yrs.map(y=>`<div class="exyr"><button data-ex="xg" data-v="${y+k}" title="Select or clear every ${mo} 20${y} paper">20${y}</button>${ks.filter(x=>x.id.startsWith(y+k)).map(x=>`<label class="excb" title="${x.s} · ${x.code}"><input type="checkbox" data-ex="x" data-v="${x.id}"${EX.xs.has(x.id)?" checked":""}><span>${x.v}</span></label>`).join("")}</div>`).join("")}</div>`}).join("")}</div></details>`}
function exSetupHTML(){const pool=exSetupPool(),mk=pool.reduce((a,q)=>a+q.m,0),nb=EX.paper===2?exPool([...exSel()],exXs()).filter(q=>q.big).length:0;
  return `${exPapersHTML()}
   ${EX.paper===2?`<label class="fcchk exbig"><input type="checkbox" data-ex="big"${EX.big?" checked":""}> <span><b>Include the 15-mark programming questions</b><small>The long scenario question at the end of each paper. ${nb} available. They take around 20 to 25 minutes each.</small></span></label>`:""}
   <div class="fcopt"><span>How many questions?</span><div class="fcseg">${["5","10","20","all"].map(k=>`<button data-ex="n" data-v="${k}" aria-pressed="${EX.n===k}"${k!=="all"&&k!=="5"&&+k>pool.length?" disabled":""}>${k==="all"?`All (${pool.length})`:k}</button>`).join("")}</div></div>
   <div class="fcopt"><span>Order</span><div class="fcseg"><button data-ex="ord" data-v="rand" aria-pressed="${EX.order==="rand"}">Mixed up</button><button data-ex="ord" data-v="paper" aria-pressed="${EX.order==="paper"}">As in the paper</button></div></div>
   <label class="fcchk"><input type="checkbox" data-ex="fresh"${EX.fresh?" checked":""}> Only questions I haven't got full marks on yet</label>
   <p class="vfoot" style="margin:0">${pool.length} question${pool.length===1?"":"s"} available · ${mk} marks</p>
   ${pool.length?"":`<p class="msg bad" style="margin:0">${exSel().size?"No questions match. Try choosing more topics or papers.":"Choose at least one topic."}</p>`}
   <div class="fcrow"><button class="btn primary" data-ex="start"${pool.length?"":" disabled"}>Start</button></div>`}
function exDraw(){const el=$("#exw");if(!el)return;el.innerHTML=EX.mode==="run"?exRunHTML():EX.mode==="done"?exDoneHTML():exSetupHTML();
  el.querySelectorAll(".psrun").forEach(psRun);el.querySelectorAll("pre.pc").forEach(pcDecorate);
  const h=$("#exh2");if(h)h.textContent=EX.mode==="run"?"Answer the questions":EX.mode==="done"?"Round complete":"2 · Set up your round"}
function exLessonStats(lids){const qs=exPool(lids),att=qs.filter(q=>S.ex[q.id]),b=att.reduce((a,q)=>a+S.ex[q.id].b,0),m=att.reduce((a,q)=>a+q.m,0);return {n:qs.length,att:att.length,b,m,tot:qs.reduce((a,q)=>a+q.m,0)}}
function exPage(){const P=EX.paper,sel=exSel();
  const tops=TOPICS.filter(t=>t.ch.paper===P&&t.lessons&&t.lessons.some(l=>exPool([l.id]).length));
  const tree=tops.map(t=>{const ls=t.lessons.filter(l=>exPool([l.id]).length),on=ls.filter(l=>sel.has(l.id)).length;
    return `<details${on&&on<ls.length?" open":""}><summary><input type="checkbox" data-exsec="${t.id}"${on===ls.length?" checked":""} aria-label="Select all of ${t.code} ${esc(t.title)}"> ${t.code} ${esc(t.title)}<small>${on}/${ls.length}</small></summary><div class="fcls ls">${ls.map(l=>`<label><input type="checkbox" data-exl="${l.id}"${sel.has(l.id)?" checked":""}> ${esc(l.title)}<small>${exPool([l.id]).length}</small></label>`).join("")}</div></details>`}).join("");
  const QP=EXQ.filter(q=>exPap(q.x)===P),att=QP.filter(q=>S.ex[q.id]),b=att.reduce((a,q)=>a+S.ex[q.id].b,0),m=att.reduce((a,q)=>a+q.m,0);
  const studied=ALL_LESSONS.filter(l=>l.topic.ch.paper===P&&exPool([l.id]).some(q=>S.ex[q.id]));
  const nP=EXAMS.filter(x=>exPap(x.id)===P).length;
  return `<div class="crumbs"><a href="#home">Home</a><span>/</span><span>Exam questions</span></div>
  <div class="lhead"><div class="eyebrow">Revision</div><h1>Exam questions</h1><p class="lead" style="max-width:64ch">Practise real past paper questions, sorted by topic. Most answers are marked for you, including truth tables, trace tables and SQL. For written answers and code, you'll compare your answer with the mark scheme and award your own marks.</p></div>
  <div class="extabs"><a href="#exams" class="on">Practise</a><a href="#exam-insights">Insights</a></div>
  <div class="expaper" role="group" aria-label="Choose a paper">${[1,2].map(p=>`<button data-expaper="${p}" aria-pressed="${P===p}"><b>Paper ${p}</b><span>${p===1?"Computer systems":"Algorithms, programming and logic"}</span></button>`).join("")}</div>
  <div class="fcstat fcpagestat" style="margin:6px 0 18px"><div><b>${att.length}/${QP.length}</b><span>questions attempted</span></div><div><b>${m?Math.round(b/m*100)+"%":"–"}</b><span>best marks on those</span></div><div><b>${S.exh.length}</b><span>rounds played</span></div><div><b>${nP}</b><span>Paper ${P} papers</span></div></div>
  <div class="fcpage${EX.mode!=="setup"?" exfull":""}">
   <div class="fcpanel"${EX.mode!=="setup"?' style="display:none"':""}><h2>1 · Choose topics</h2><div class="fcrow"><button class="btn small" data-exall="1">Select all</button><button class="btn small" data-exall="0">Clear</button></div><div class="fctree">${tree}</div></div>
   <div class="fcpanel"><h2 id="exh2"></h2><div class="exrun" id="exw"></div></div>
  </div>
  <div class="fcpanel" style="margin-top:20px"><h2>Progress by lesson · Paper ${P}</h2>${studied.length?`<div class="tscroll"><table class="pvt fctable"><tr><th>Lesson</th><th>Attempted</th><th>Best marks</th></tr>${studied.map(l=>{const st=exLessonStats([l.id]);return `<tr><td style="text-align:left"><a href="#l-${l.id}">${l.topic.code} · ${esc(l.title)}</a></td><td>${st.att}/${st.n}</td><td>${st.b}/${st.m} (${st.m?Math.round(st.b/st.m*100):0}%)</td></tr>`}).join("")}</table></div>`:`<p class="vfoot" style="margin:0">Answer some questions and your progress for each lesson will appear here.</p>`}</div>`}
const exRefresh=()=>{const y=window.scrollY;$("#app").innerHTML=exPage();exDraw();window.scrollTo(0,y)};
function exLessonCard(l){const el=$("#exlesson");if(!el)return;const st=exLessonStats([l.id]);if(!st.n){el.hidden=true;return}
  el.innerHTML=`<div class="vhead exh"><h3>Exam questions<small>${st.n} past paper question${st.n>1?"s":""} · ${st.tot} marks</small></h3></div><div class="vbody"><div class="fcw"><p style="margin:0">Try real exam questions on this lesson, and check your answers against the mark scheme.</p>${st.att?`<div class="fcstat"><div><b>${st.att}/${st.n}</b><span>attempted</span></div><div><b>${st.b}/${st.m}</b><span>best marks</span></div></div>`:""}<div class="fcrow"><button class="btn primary" data-exlesson="${l.id}" style="background:var(--ex);border-color:var(--ex)">Practise these questions</button></div></div></div>`}
document.addEventListener("click",e=>{const t=e.target;let b;
  if(b=t.closest("[data-exlesson]")){const L=exL(b.dataset.exlesson);EX.paper=L.topic.ch.paper;EX.sel[EX.paper]=new Set([b.dataset.exlesson]);EX.big=true;EX.mode="setup";EX.n="all";EX.fresh=false;location.hash="exams";return}
  if(b=t.closest("[data-expaper]")){EX.paper=+b.dataset.expaper;S.exPaper=EX.paper;save();EX.mode="setup";exRefresh();return}
  if(b=t.closest("[data-exall]")){EX.sel[EX.paper]=new Set(b.dataset.exall==="1"?exPLessons(EX.paper).map(l=>l.id):[]);exRefresh();return}
  if(!(b=t.closest("[data-ex]"))||!t.closest("#exw"))return;const a=b.dataset.ex,c=EX.c;
  if(a==="x"){EX.xs.has(b.dataset.v)?EX.xs.delete(b.dataset.v):EX.xs.add(b.dataset.v);EX.popen=true}
  else if(a==="xall"){const ids=EXAMS.filter(x=>exPap(x.id)===EX.paper).map(x=>x.id);ids.forEach(i=>b.dataset.v==="1"?EX.xs.add(i):EX.xs.delete(i));EX.popen=true}
  else if(a==="xg"){const v=b.dataset.v,ids=EXAMS.filter(x=>exPap(x.id)===EX.paper&&(v.length===1?x.id[2]===v:x.id.startsWith(v))).map(x=>x.id),all=ids.every(i=>EX.xs.has(i));ids.forEach(i=>all?EX.xs.delete(i):EX.xs.add(i));EX.popen=true}
  else if(a==="n")EX.n=b.dataset.v;else if(a==="ord")EX.order=b.dataset.v;else if(a==="fresh")EX.fresh=t.checked;else if(a==="big")EX.big=t.checked;
  else if(a==="start"){const pool=exSetupPool();let ids=shuffle(pool.map(q=>q.id));if(EX.n!=="all")ids=ids.slice(0,+EX.n);if(EX.order==="paper")ids.sort((x,y)=>EXQ.findIndex(q=>q.id===x)-EXQ.findIndex(q=>q.id===y));exStart(ids);exRefresh();const f=$("#exw [data-exv],#exw [data-ex=mc]");if(f)f.focus();return}
  else if(a==="mc"){c.sel=+b.dataset.i}
  else if(a==="tt"){const i=+b.dataset.i,v=c.tt[i];c.tt[i]=v==null||v===""?"0":v==="0"?"1":"";exDraw();const f=$(`#exw [data-ex=tt][data-i="${i}"]`);if(f)f.focus();return}
  else if(a==="sqlrun"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);try{const R=sqlRun(exSqlRun(q,c.v[0]));c.sqlres=`<span class="vfoot">Result of your query</span>${sqlTable(R.cols,R.types,R.rows,{sm:true})}`}catch(err){c.sqlres=`<p class="msg bad" style="margin:0">⚠️ ${esc(String(err))}</p>`}}
  else if(a==="mark"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);c.R=exAuto(q,c);c.phase="marked";exRecord(q,c.R.marks)}
  else if(a==="ov1"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);c.ov=c.ov||[];if(c.R.base==null)c.R.base=c.R.marks;const i=+b.dataset.i;if(!c.ov.includes(i))c.ov.push(i);c.R.marks=exOvMarks(q,c);exRecord(q,c.R.marks);S.ex[q.id].n--;save()}
  else if(a==="over"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);c.over=true;c.R.marks=q.m;exRecord(q,q.m);S.ex[q.id].n--;save()}
  else if(a==="part"){c.part=true;c.phase="part"}
  else if(a==="lv"){c.lv[b.dataset.k]=+b.dataset.v}
  else if(a==="reveal"){c.phase="assess"}
  else if(a==="skip"||a==="next"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);if(c.phase==="assess"&&!c.done)exRecord(q,exSelfMark(q,c));if(c.phase==="part"&&!c.done)exRecord(q,Math.max(c.R.marks,exSelfMark(q,c)));
    if(EX.i<EX.list.length-1){EX.i++;exNew();exDraw();window.scrollTo({top:$("#exw").getBoundingClientRect().top+window.scrollY-90});const g=$("#exw [data-exv],#exw [data-ex=mc],#exw [data-extb],#exw [data-expick],#exw .psedit,#exw [data-ex=tt]");if(g)g.focus({preventScroll:true});return}
    EX.mode="done";const ids=Object.keys(EX.res);S.exh.push({t:Date.now(),n:ids.length,sc:ids.reduce((x,id)=>x+EX.res[id],0),mx:ids.reduce((x,id)=>x+EXQ.find(q=>q.id===id).m,0)});save();exRefresh();return}
  else if(a==="quit"){const q=EXQ.find(x=>x.id===EX.list[EX.i]);if(c.phase==="assess")exRecord(q,exSelfMark(q,c));if(Object.keys(EX.res).length){EX.mode="done";const ids=Object.keys(EX.res);S.exh.push({t:Date.now(),n:ids.length,sc:ids.reduce((x,id)=>x+EX.res[id],0),mx:ids.reduce((x,id)=>x+EXQ.find(q=>q.id===id).m,0)});save()}else EX.mode="setup";exRefresh();return}
  else if(a==="again"){exStart(EX.list);exRefresh();return}
  else if(a==="new"){EX.mode="setup";exRefresh();return}
  else return;
  exDraw()});
document.addEventListener("toggle",e=>{const d=e.target;if(d.classList&&d.classList.contains("exppick"))EX.popen=d.open},true);
document.addEventListener("input",e=>{const t=e.target;if(!t.closest||!t.closest("#exw")||!EX.c)return;
  if(t.classList.contains("psedit")){EX.c.code=t.value.replace(/<-/g,"←");return}
  if(t.dataset.exv!=null)EX.c.v[+t.dataset.exv]=t.value;else if(t.dataset.extb)EX.c.tb[t.dataset.extb]=t.value});
document.addEventListener("change",e=>{const t=e.target;
  if(t.matches("[data-exl]")){t.checked?exSel().add(t.dataset.exl):exSel().delete(t.dataset.exl);exRefresh();return}
  if(t.matches("[data-exsec]")){const T=TOPICS.find(x=>x.id===t.dataset.exsec);T.lessons.filter(l=>exPool([l.id]).length).forEach(l=>t.checked?exSel().add(l.id):exSel().delete(l.id));exRefresh();return}
  if(!t.closest||!t.closest("#exw")||!EX.c)return;
  if(t.matches("select[data-exv]")){EX.c.v[+t.dataset.exv]=t.value}
  else if(t.dataset.expick!=null){const i=+t.dataset.expick,P=EX.c.pick;t.checked?P.includes(i)||P.push(i):P.splice(P.indexOf(i),1);exDraw()}
  else if(t.dataset.extick!=null){const i=+t.dataset.extick,T=EX.c.ticks;t.checked?T.includes(i)||T.push(i):T.splice(T.indexOf(i),1);exDraw()}});

const EX_PAT=[
 ["Denary ↔ binary conversion","1-1-binary",/(convert|give)[^.]*(denary|binary)[^.]*(to|into|for)[^.]*(binary|denary)|binary number (that would be|for the)|denary number (that|for)|highest denary|largest denary/],
 ["Hexadecimal conversions","1-1-hex",/hexadecimal (number|code|ticket|error)|to hexadecimal|into hexadecimal|hexadecimal to|from hexadecimal|in hexadecimal\b/],
 ["Why hexadecimal is used","1-1-hexuses",/(why|reason|benefit)[^.]*hexadecimal|uses? of hexadecimal|ways that hexadecimal|hexadecimal is used/],
 ["Binary addition","1-1-addition",/binary addition/],
 ["Overflow","1-1-addition",/overflow/],
 ["Logical shifts","1-1-shifts",/logical (left|right)? ?shift|logic right shift|right shift|left shift/],
 ["Two’s complement","1-1-negative",/two’s complement|two's complement|negative (denary|binary)/],
 ["Units of data storage","1-3-measurement",/kibibyte|mebibyte|gibibyte|tebibyte|pebibyte|exbibyte|nibble|bits are equal|bits there are|smallest unit/],
 ["File size calculations","1-3-filesize",/calculate the file size|file size of the (image|sound)/],
 ["Lossy and lossless compression","1-3-compression",/lossy|lossless|compress/],
 ["Character sets (ASCII and Unicode)","1-2-charsets",/ascii|unicode|character set|text is converted|represents the text|text the student writes/],
 ["Sound: sampling","1-2-sound",/sample rate|sample resolution|sampling|analogue sound|sound sample/],
 ["Images: resolution and colour depth","1-2-images",/colour depth|resolution of the image|image resolution|pixel|image is converted/],
 ["Data packets and their structure","2-1-packets",/packet header|structure of a (data )?packet|parts of a packet|sections of the packet|other elements of a packet|three sections/],
 ["Packet switching and routers","2-1-packets",/packet switching|reordered|controls which path|control the path|forwards the data|forward the packet|router in packet/],
 ["Serial, parallel, simplex and duplex","2-1-transmission",/serial|parallel|duplex|simplex/],
 ["USB","2-1-usb",/universal serial bus|\busb\b(?! drive| flash)/],
 ["Parity checks","2-2-parity",/parity/],
 ["Checksums","2-2-checksums",/checksum/],
 ["Echo checks","2-2-echo",/echo check|copy of the data (is )?sent back|copy of the data received/],
 ["ARQ","2-2-arq",/automatic repeat|\barq\b|acknowledgement/],
 ["Check digits","2-2-checkdigits",/check digit/],
 ["How errors occur in transmission","2-2-parity",/how (the data might have errors|errors may occur|an error can occur)|reason an error may occur/],
 ["Encryption (symmetric and asymmetric)","2-3-encryption",/encrypt|cipher|encryption key/],
 ["The FDE cycle and registers","3-1-vonneumann",/fetch|registers?\b|\bmar\b|\bmdr\b|program counter|accumulator|\bcir\b/],
 ["Cores, clock speed and cache","3-1-cores",/core|clock speed|ghz|cache|performance of the cpu/],
 ["Buses","3-1-buses",/\bbus(es)?\b/],
 ["Instruction sets","3-1-instructions",/instruction set|list of (all )?the (machine code )?commands|uses a list to decode/],
 ["Embedded systems","3-1-embedded",/embedded system|general.purpose computer/],
 ["Input and output devices","3-2-input",/input device|output device|input, output|built into the (smartphone|tablet|portable|mobile|smartwatch)|keypad is|microphone is/],
 ["Sensors","3-2-sensors",/sensor/],
 ["Primary storage: RAM, ROM and firmware","3-3-primary",/random access memory|\bram\b|read only memory|\brom\b|firmware|primary storage/],
 ["Virtual memory","3-3-primary",/virtual memory|ram becomes full|ram is full|partitioned section/],
 ["Secondary storage: magnetic, optical, solid-state","3-3-secondary",/secondary storage|magnetic|optical|solid.state|hard disk|platter/],
 ["Cloud storage","3-3-cloud",/cloud/],
 ["NIC and MAC addresses","3-4-nicmac",/mac address|media access control|network interface card|\bnic\b/],
 ["IP addresses (IPv4, IPv6)","3-4-iprouter",/ip address|ipv4|ipv6|internet protocol/],
 ["System and application software","4-1-software",/system software|application software|utility software|types of software|sound editing software/],
 ["Operating system functions","4-1-osjobs",/operating system|managing memory|manage memory|functions? of an operating system/],
 ["Interrupts","4-1-interrupts",/interrupt/],
 ["High- and low-level languages","4-2-levels",/high.level|low.level/],
 ["Compilers and interpreters","4-2-translators",/compiler|interpreter|translator/],
 ["Assembly language and assemblers","4-2-assembly",/assembly language|assembler/],
 ["IDE functions","4-2-ides",/integrated development environment|\bide\b/],
 ["Internet vs world wide web","5-1-web",/world wide web|difference between the internet/],
 ["URLs","5-1-web",/uniform resource locator|\burl\b/],
 ["Web browser functions","5-1-web",/web browser/],
 ["Locating and retrieving web pages (DNS)","5-1-pages",/domain name server|\bdns\b|located, retrieved|locating and retrieving|requested and displayed|located and retrieved/],
 ["HTTPS and SSL","5-3-solutions",/secure socket layer|\bssl\b|https/],
 ["Cookies","5-1-cookies",/cookie/],
 ["Digital currency and blockchain","5-2-crypto",/digital currency|digital currencies|blockchain|digital ledger/],
 ["Brute-force attacks","5-3-threats",/brute.force/],
 ["Data interception","5-3-threats",/data interception|intercept/],
 ["DDoS attacks","5-3-threats",/denial of service|ddos/],
 ["Malware","5-3-threats",/malware|virus|worm|trojan|spyware|adware|ransomware/],
 ["Phishing and pharming","5-3-threats",/phishing|pharming/],
 ["Social engineering","5-3-threats",/social engineering/],
 ["Hacking","5-3-threats",/hacker|hacking/],
 ["Firewalls and proxy servers","5-3-solutions",/firewall|proxy/],
 ["Authentication, access levels and other solutions","5-3-solutions",/access level|access right|biometric|two.step|security solution|login system|anti-malware/],
 ["Automated systems: sensor + microprocessor","6-1-auto",/microprocessor|automated|automatically refill|automate this/],
 ["Robots and robotics","6-2-robots",/robot/],
 ["Artificial intelligence","6-3-ai",/artificial intelligence|\bai\b/],
 ["Expert systems","6-3-expert",/expert system|inference engine|rule base|knowledge base/],
 ["Machine learning","6-3-ml",/machine learning|automatically adapt/]];

const EX_PAT2=[
 ["Program development life cycle","7-1-pdlc",/development life cycle|\banalysis\b|design stage|coding stage/],
 ["Decomposition and structure diagrams","7-1-pdlc",/decompos|structure diagram|sub-?system/],
 ["Abstraction","7-1-pdlc",/abstraction/],
 ["Flowcharts","7-1-flowcharts",/flowchart/],
 ["Stating the purpose of an algorithm","7-1-flowcharts",/purpose of (the|this) (algorithm|pseudocode|flowchart|program)|describe the purpose|state the purpose of the algorithm|what the algorithm does/],
 ["Totalling and counting","7-1-standard",/totalling|counting|total (number|of)|running total/],
 ["Maximum, minimum and average","7-1-standard",/highest|lowest|maximum|minimum|average|largest|smallest/],
 ["Linear search","7-1-standard",/linear search|\bsearch/],
 ["Bubble sort","7-1-bubble",/bubble sort|\bsort/],
 ["Validation checks","7-1-valver",/validation|validate|range check|length check|type check|presence check|format check|check digit/],
 ["Verification checks","7-1-valver",/verification|double entry|visual check/],
 ["Test data","7-1-testing",/test data|normal data|abnormal|extreme data|boundary data/],
 ["Types of error","7-1-testing",/syntax error|logic error|runtime error|type of error/],
 ["Finding and correcting errors","7-1-testing",/identify the line numbers|suggest a correction|line numbers? of the|errors? in the (pseudocode|algorithm|program)/],
 ["Trace tables","7-1-trace",/trace table/],
 ["Declaring variables and constants","8-1-variables",/declare|constant/],
 ["Data types","8-1-variables",/data type/],
 ["Selection: IF and CASE","8-1-selection",/\bcase\b|\bif statement|selection/],
 ["Loops (iteration)","8-1-iteration",/\bloop|iteration|repeat|while/],
 ["String handling","8-1-strings",/length\(|substring|ucase|lcase|string handling|upper case|lower case/],
 ["Library routines (MOD, DIV, ROUND, RANDOM)","8-1-strings",/\bmod\b|\bdiv\b|round\(|random\(|library routine/],
 ["Procedures and functions","8-1-maintain",/procedure|function|parameter/],
 ["Local and global variables","8-1-maintain",/local variable|global variable/],
 ["Maintainable programs","8-1-maintain",/maintainab|meaningful identifier/],
 ["Arrays (1D and 2D)","8-2-onedim",/\barray/],
 ["File handling","8-3-files",/\bfile\b|text file/],
 ["Databases: fields, records and keys","9-1-intro",/primary key|number of (fields|records)|how many (fields|records)/],
 ["SQL queries","9-1-sql",/\bsql\b/],
 ["Logic circuits","10-1-circuits",/logic circuit/],
 ["Truth tables","10-1-tables",/truth table/],
 ["Logic expressions","10-1-circuits",/logic expression/],
 ["The 15-mark programming scenario","7-1-writing",/add comments to explain how your code works/]];
const exPlain=q=>((q.c||"")+" "+q.q).replace(/<[^>]+>/g," ").toLowerCase();
const exAnsText=q=>[q.acc,q.why,q.ms&&q.ms.pts,q.grp,q.a&&q.w?[].concat(q.a):null,q.f&&q.f.map&&q.f.map(f=>f.acc)].flat(3).filter(x=>typeof x==="string").join(" ").toLowerCase();
const EX_ANS=new Set(["Assembly language and assemblers","ARQ","Check digits","Echo checks","Checksums","Overflow","Social engineering","Brute-force attacks","Data interception","NIC and MAC addresses","Two’s complement","Character sets (ASCII and Unicode)","Instruction sets","Virtual memory","Locating and retrieving web pages (DNS)","Phishing and pharming","Digital currency and blockchain","Machine learning","Expert systems","USB"]);
const exSer=id=>{const m={m:"Mar",s:"Jun",w:"Nov"}[id[2]];return m+" 20"+id.slice(0,2)};
const EXI={sec:"all",paper:1};
const has7=(q,re)=>q.l.some(l=>re.test(l));
const EX_TYPES=[
 ["big","15-mark programming task","The final question on every Paper 2: write a complete program for a scenario, with validation, loops, arrays and comments. Marked in levels.",q=>!!q.big,2],
 ["wr","Write or amend code","Write a short algorithm, rewrite one using a different loop, define a procedure or function, or add a feature to given pseudocode.",q=>q.t==="wr",2],
 ["trace","Trace tables","Dry-run a flowchart or pseudocode with test data, recording every variable change and output.",q=>q.t==="trace",2],
 ["tt","Truth tables","Complete the truth table for a logic circuit, expression or problem statement.",q=>q.t==="tt",2],
 ["circ","Logic circuits and expressions","Draw a logic circuit, or write a logic expression, from a statement, expression or truth table.",q=>q.t==="circ"||q.t==="expr"||q.t==="self"&&has7(q,/^10-1/),2],
 ["sql","Databases and SQL","Read a table, choose data types and keys, complete SQL statements and give the output of a query.",q=>q.t==="sql"||q.t==="grid"||has7(q,/^9-1/),2],
 ["err","Find and correct errors","Identify the lines with errors in an algorithm and write the corrections.",q=>q.t==="err",2],
 ["lines","Match with lines","Draw a line from each item to the matching description, check or term.",q=>q.t==="match",2],
 ["diagram","Diagrams","Draw and annotate a diagram, or complete one that's given, e.g. a DDoS attack, data interception, packet switching or the parts of a packet.",q=>/\bdraw\b|annotate|complete the diagram/i.test(q.q),0],
 ["cloze","Fill in the blanks","Complete a paragraph or set of statements using terms from a list. Not every term in the list is used.",q=>q.t==="cloze",0],
 ["match","Missing terms and descriptions","A table of terms and descriptions with gaps. Write the missing term for each description, or the description for each term.",q=>q.t==="self"&&!q.pre&&(!!q.tb||/missing (word|term)/i.test(q.q))||q.t==="multi"&&!!q.wide&&q.f[0].nm==="text",0],
 ["mc","Tick one box","Multiple choice: tick the one correct answer or statement.",q=>q.t==="mc",0],
 ["pick","Choose from a list","Choose two or three correct items from a list.",q=>q.t==="pick",0],
 ["add","Binary addition","Add two binary numbers, show the carries, and spot overflow.",q=>exPap(q.x)===1&&!!q.pre,1],
 ["conv","Conversions and calculations","Convert between binary, denary and hexadecimal, two's complement, parity bits, file sizes and storage units.",q=>exPap(q.x)===1&&(q.t==="ans"&&q.nm!=="text"||q.t==="multi"&&q.f.every(f=>f.nm!=="text")),1],
 ["recall","Short recall","Give, state or identify a term, value or example. One or two words per mark.",q=>q.t==="ans"||q.t==="set"||q.t==="multi",0],
 ["long","Longer explanations (4+ marks)","Explain or describe a process or a scenario in detail. Each mark needs a separate, developed point.",q=>q.t==="self"&&q.m>=4,0],
 ["short","Short written answers (1 to 3 marks)","Describe, explain or give a reason in a sentence or two.",q=>q.t==="self",0]];
const exType=q=>(EX_TYPES.find(T=>T[3](q))||EX_TYPES[EX_TYPES.length-1])[0];
const EXTI={open:null};
function exTypesHTML(NP,tot,QS,XS){
  const by={};QS.forEach(q=>{(by[exType(q)]=by[exType(q)]||[]).push(q)});
  const card=([k,lab,desc])=>{const qs=by[k]||[];if(!qs.length)return"";const m=qs.reduce((a,q)=>a+q.m,0),xs=new Set(qs.map(q=>q.x)),ls={};
    qs.forEach(q=>q.l.forEach(l=>{ls[l]=(ls[l]||0)+1/q.l.length}));const top=Object.entries(ls).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return `<div class="intype"><div class="intop"><h3>${lab}</h3><button class="btn small" data-exq="${k}">Practise these</button></div><p>${desc}</p>
     <div class="innums"><div><b>${qs.length}</b><span>question part${qs.length===1?"":"s"}</span></div><div><b>${m}</b><span>marks (${Math.round(m/tot*100)}%)</span></div><div><b>${xs.size}/${NP}</b><span>papers</span></div></div>
     <span class="eyebrow">Most common topics</span><div class="extags">${top.map(([l,n])=>{const L=exL(l);return L?`<a href="#l-${l}">${L.topic.code} · ${esc(L.title)} <b style="color:var(--ex)">${Math.round(n)}</b></a>`:""}).join("")}</div>
     <details${EXTI.open===k?" open":""} data-ext="${k}"><summary>List all ${qs.length} questions</summary><ul class="inqlist">${qs.slice().sort((a,b)=>XS.findIndex(x=>x.id===a.x)-XS.findIndex(x=>x.id===b.x)).map(q=>{const X=exX(q.x),L=exL(q.l[0]);return `<li><span>${exSer(q.x)} · ${X.code.slice(5)} · Q${q.n}</span><span>${L?esc(L.title):""}</span><b>${q.m}</b></li>`}).join("")}</ul></details></div>`};
  return `<div class="fcpanel" style="margin-top:20px"><h2>Question types</h2><p class="vfoot" style="margin:0">Every question part is sorted into one type. Choose <b>Practise these</b> to try a round of just that type.</p><div class="intypes">${EX_TYPES.map(card).join("")}</div></div>`}
document.addEventListener("click",e=>{const b=e.target.closest("[data-exq]");if(!b)return;const k=b.dataset.exq;const ids=shuffle(EXQ.filter(q=>exPap(q.x)===EXI.paper&&exType(q)===k).map(q=>q.id));EX.paper=EXI.paper;EX.n="all";exStart(ids);location.hash="exams";window.scrollTo(0,0)});
document.addEventListener("click",e=>{const b=e.target.closest("[data-inp]");if(!b)return;EXI.paper=+b.dataset.inp;EXI.sec="all";const y=window.scrollY;$("#app").innerHTML=exInsights();window.scrollTo(0,y)});
document.addEventListener("toggle",e=>{const d=e.target;if(d.dataset&&d.dataset.ext)EXTI.open=d.open?d.dataset.ext:(EXTI.open===d.dataset.ext?null:EXTI.open)},true);
function exInsights(){const P=EXI.paper,XS=EXAMS.filter(x=>exPap(x.id)===P),QS=EXQ.filter(q=>exPap(q.x)===P),NP=XS.length,tot=QS.reduce((a,q)=>a+q.m,0),series=[...new Set(XS.map(x=>x.id.slice(0,3)))];
  const toggle=`<div class="expaper" role="group" aria-label="Choose a paper">${[1,2].map(p=>`<button data-inp="${p}" aria-pressed="${P===p}"><b>Paper ${p}</b><span>${p===1?"Computer systems":"Algorithms, programming and logic"}</span></button>`).join("")}</div>`;
  const head=`<div class="crumbs"><a href="#home">Home</a><span>/</span><a href="#exams">Exam questions</a><span>/</span><span>Insights</span></div>
  <div class="lhead"><div class="eyebrow">Revision</div><h1>Exam insights</h1><p class="lead" style="max-width:64ch">What comes up, how often, and how many marks it's worth, based on every Paper ${P} in the question bank.</p></div>
  <div class="extabs"><a href="#exams">Practise</a><a href="#exam-insights" class="on">Insights</a></div>${toggle}`;
  if(!NP)return head+`<p class="msg" style="margin:0">There are no Paper ${P} questions yet.</p>`;
  const tops=TOPICS.filter(t=>t.lessons&&t.ch.paper===P);
  const secM={},lesM={},lesP={},secP={};QS.forEach(q=>{const w=q.m/q.l.length;q.l.forEach(l=>{const L=exL(l);if(!L)return;const sid=L.topic.id;secM[sid]=(secM[sid]||0)+w;lesM[l]=(lesM[l]||0)+w;(lesP[l]=lesP[l]||new Set).add(q.x);(secP[sid]=secP[sid]||new Set).add(q.x)})});
  const secs=tops.map(t=>({t,m:secM[t.id]||0,p:(secP[t.id]||new Set()).size})).sort((a,b)=>b.m-a.m),maxS=Math.max(1,...secs.map(x=>x.m));
  const PAT=P===1?EX_PAT:EX_PAT2;
  const pats=PAT.map(([label,lid,re])=>{const qs=QS.filter(q=>re.test(exPlain(q))||P===1&&EX_ANS.has(label)&&re.test(exAnsText(q)));const xs=new Set(qs.map(q=>q.x));const last=[...xs].sort((a,b)=>XS.findIndex(x=>x.id===a)-XS.findIndex(x=>x.id===b)).pop();return {label,lid,n:qs.length,m:qs.reduce((a,q)=>a+q.m,0),p:xs.size,last}});
  const common=pats.slice().sort((a,b)=>b.p-a.p||b.m-a.m).slice(0,12),rare=pats.slice().sort((a,b)=>a.p-b.p||a.m-b.m).slice(0,10);
  const heat=tops.map(t=>({t,v:series.map(sr=>{const xs=XS.filter(x=>x.id.startsWith(sr));let m=0;QS.forEach(q=>{if(!q.x.startsWith(sr))return;const w=q.m/q.l.length;q.l.forEach(l=>{const L=exL(l);if(L&&L.topic.id===t.id)m+=w})});return m/xs.length})}));
  const hmax=Math.max(1,...heat.flatMap(h=>h.v));
  const CW=["Tick","Give","State","Identify","Describe","Explain","Convert","Calculate","Complete","Draw","Write","Rewrite","Amend","Circle","Choose","Add","Define","Suggest","Show"];const cw={};
  QS.forEach(q=>{const t=q.q.replace(/<[^>]+>/g," ");const w=CW.find(k=>new RegExp("(^|\\.\\s|>|\\s)"+k+"\\b").test(t))||"Other";cw[w]=(cw[w]||0)+q.m});
  const cws=Object.entries(cw).sort((a,b)=>b[1]-a[1]),cwmax=cws[0][1];
  const auto=QS.filter(q=>exIsAuto(q)).reduce((a,q)=>a+q.m,0);
  const lessons=ALL_LESSONS.filter(l=>l.topic.ch.paper===P&&(EXI.sec==="all"||l.topic.id===EXI.sec)).map(l=>({l,m:lesM[l.id]||0,p:(lesP[l.id]||new Set()).size})).sort((a,b)=>b.m-a.m),lmax=Math.max(1,...lessons.map(x=>x.m));
  const bar=(lab,v,max,txt)=>`<div class="inbar"><span>${lab}</span><span class="tr"><i style="width:${Math.max(2,v/max*100)}%"></i></span><span class="v">${txt}</span></div>`;
  const pl=x=>`<li><b class="n">${x.p}</b><span>${x.lid&&exL(x.lid)?`<a href="#l-${x.lid}" style="color:var(--ink)">${esc(x.label)}</a>`:esc(x.label)}<small>${x.n} question part${x.n===1?"":"s"} · ${x.m} marks${x.last?` · last seen ${exSer(x.last)}`:" · never asked"}</small></span><span class="pill">${Math.round(x.p/NP*100)}% of papers</span></li>`;
  return head+`
  <div class="fcstat fcpagestat" style="margin:0 0 18px"><div><b>${NP}</b><span>papers analysed (${exSer(XS[0].id)} to ${exSer(XS[NP-1].id)})</span></div><div><b>${QS.length}</b><span>question parts</span></div><div><b>${tot}</b><span>marks in total</span></div><div><b>${Math.round(auto/tot*100)}%</b><span>of marks are marked automatically here</span></div></div>
  <div class="ingrid">
   <div class="fcpanel"><h2>Most common topics</h2><p class="vfoot" style="margin:0">The number on the left is how many of the ${NP} papers asked about it.</p><ul class="inlist">${common.map(pl).join("")}</ul></div>
   <div class="fcpanel"><h2>Least common topics</h2><p class="vfoot" style="margin:0">Rarely examined so far. Don't skip them: the syllabus can still test them!</p><ul class="inlist">${rare.map(pl).join("")}</ul></div>
  </div>
  ${exTypesHTML(NP,tot,QS,XS)}
  <div class="fcpanel" style="margin-top:20px"><h2>Marks by syllabus section</h2><p class="vfoot" style="margin:0">Total marks across all ${NP} papers, and the average per paper.</p><div class="inbars">${secs.map(x=>bar(`<a href="#t-${x.t.id}">${x.t.code} ${esc(x.t.title)}</a>`,x.m,maxS,`${Math.round(x.m)} · ${(x.m/NP).toFixed(1)}`)).join("")}</div></div>
  <div class="fcpanel" style="margin-top:20px"><h2>Marks by lesson</h2><div class="insel">Show <select data-inx="sec"><option value="all">all sections</option>${tops.map(t=>`<option value="${t.id}"${EXI.sec===t.id?" selected":""}>${t.code} ${esc(t.title)}</option>`).join("")}</select></div>
   <div class="inbars">${lessons.map(x=>bar(`<a href="#l-${x.l.id}">${x.l.topic.code} · ${esc(x.l.title)}</a>`,x.m,lmax,`${Math.round(x.m)} · ${x.p}/${NP}`)).join("")}</div><p class="vfoot" style="margin:0">Total marks · number of papers it appeared in</p></div>
  <div class="fcpanel" style="margin-top:20px"><h2>How each section has changed over time</h2><p class="vfoot" style="margin:0">Average marks per paper in each exam series. Darker means more marks.</p>
   <div class="tscroll"><table class="inheat"><tr><th></th>${series.map(s=>`<th class="rot">${exSer(s)}</th>`).join("")}</tr>${heat.map(h=>`<tr><td class="lab"><a href="#t-${h.t.id}" style="color:var(--ink)">${h.t.code} ${esc(h.t.title)}</a></td>${h.v.map(v=>`<td style="background:color-mix(in srgb, var(--ex) ${Math.round(v/hmax*85)}%, var(--bg));color:${v/hmax>.5?"#fff":"var(--ink)"}" title="${v.toFixed(1)} marks">${v?Math.round(v):"·"}</td>`).join("")}</tr>`).join("")}<tr><td class="lab" style="border-top:2px solid var(--line)"><b>Total marks per paper</b></td>${series.map((s,i)=>{const t=heat.reduce((x,hh)=>x+hh.v[i],0);return `<td style="border-top:2px solid var(--line);background:var(--sunk);color:var(--ink)" title="${t.toFixed(2)}">${Math.round(t*100)/100}</td>`}).join("")}</tr></table></div><p class="vfoot" style="margin:0">Each cell is rounded to the nearest whole mark, so a column of cells may not add up exactly. The total row uses the unrounded values.</p></div>
  <div class="fcpanel" style="margin-top:20px"><h2>Command words</h2><p class="vfoot" style="margin:0">Marks for each command word at the start of a question. "Explain" and "Describe" need developed answers; "Give", "State" and "Identify" need short ones.</p><div class="inbars">${cws.map(([w,m])=>bar(w,m,cwmax,`${m} (${Math.round(m/tot*100)}%)`)).join("")}</div></div>`}
document.addEventListener("change",e=>{const t=e.target;if(t.matches("[data-inx=sec]")){EXI.sec=t.value;const y=window.scrollY;$("#app").innerHTML=exInsights();window.scrollTo(0,y)}});

