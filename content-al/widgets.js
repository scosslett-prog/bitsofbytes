/* ================= A-Level interactive widgets =================
   Built into the course files (content/al/content.js) by scripts/build-al.mjs, so this code only
   loads in A-Level mode. Theory HTML places <div class="alw" data-w="name" data-…></div>, and
   initWidgets (02-core.js) calls alWidgets() whenever a lesson is drawn.
   Diagrams use the theme-aware .dg classes from app.css, so they work in light and dark mode. */
const ALW={};
function alWidgets(root){(root||document).querySelectorAll(".alw[data-w]").forEach(el=>{if(el.dataset.on)return;el.dataset.on="1";const f=ALW[el.dataset.w];
  if(!f){el.remove();return}try{f(el)}catch(e){console.error("widget "+el.dataset.w,e);el.innerHTML=`<p class="vfoot">This demo couldn't start.</p>`}})}
const alH=(title,sub)=>`<div class="alwh"><b>${title}</b>${sub?`<span class="eyebrow">${sub}</span>`:""}</div>`;
const alBin=(v,n=8)=>((v%2**n)+2**n).toString(2).padStart(n,"0").slice(-n);
const alSp=b=>b.replace(/(.{4})(?=.)/g,"$1 ");
const alTC=(b)=>b[0]==="1"?parseInt(b,2)-2**b.length:parseInt(b,2);
const alRM=()=>matchMedia("(prefers-reduced-motion: reduce)").matches;
const alAlive=el=>el.isConnected;
const alMark=(id)=>`<defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10z" fill="currentColor"/></marker></defs>`;
let ALID=0;const alId=p=>p+(++ALID);
/* step-through controls: Back, Next, Play/Pause, Restart. go(k) draws step k. */
function alStepper(box,n,go,{ms=1300,label}={}){let k=0,t=null;
  box.innerHTML=`<button class="btn small" data-s="back">◀ Back</button><button class="btn small primary" data-s="next">Next step ▶</button><button class="btn small" data-s="play">▶ Play</button><button class="btn small" data-s="reset">↺ Restart</button><span class="sp"></span><span class="alstep"></span>`;
  const N=()=>typeof n==="function"?n():n,pb=()=>box.querySelector("[data-s=play]");
  const show=()=>{k=Math.max(0,Math.min(k,N()-1));go(k);box.querySelector(".alstep").textContent=label?label(k,N()):`Step ${k+1} of ${N()}`;
    box.querySelector("[data-s=back]").disabled=k===0;box.querySelector("[data-s=next]").disabled=k>=N()-1};
  const stop=()=>{clearInterval(t);t=null;pb().textContent="▶ Play"};
  box.addEventListener("click",e=>{const b=e.target.closest("[data-s]");if(!b)return;const a=b.dataset.s;
    if(a==="back"){stop();k--;show()}else if(a==="next"){stop();k++;show()}else if(a==="reset"){stop();k=0;show()}
    else if(a==="play"){if(t){stop();return}if(k>=N()-1)k=-1;b.textContent="❚❚ Pause";k++;show();
      t=setInterval(()=>{if(!alAlive(box)){stop();return}if(k>=N()-1){stop();return}k++;show()},ms)}});
  show();return {set:v=>{stop();k=v;show()},get:()=>k,refresh:show,stop}}
const alSeg=(name,opts,cur)=>`<div class="seg" role="group">${opts.map(([v,l])=>`<button type="button" data-${name}="${v}" aria-pressed="${String(v)===String(cur)}">${l}</button>`).join("")}</div>`;
const alSegSet=(el,name,v)=>el.querySelectorAll(`[data-${name}]`).forEach(b=>b.setAttribute("aria-pressed",String(b.dataset[name]===String(v))));
/* responsive diagrams: W is the viewBox width — 600 normally, 340 in narrow columns (phones), so text stays readable.
   paint(W) redraws the diagram; it runs again only when the layout changes. */
function alResp(el,paint){let W=0;const fit=()=>{const w=el.clientWidth<480?340:600;if(w!==W){W=w;paint(W)}};fit();
  if(window.ResizeObserver){const ro=new ResizeObserver(()=>{if(!alAlive(el)){ro.disconnect();return}fit()});ro.observe(el)}}

/* ======================= 1.1 Computer architecture ======================= */

/* von Neumann (one bus) vs Harvard (two buses): count the cycles for the same program */
ALW.vnbus=function(el){const P=["LDA 6","ADD 7","SUB 8","STO 9"],M=alId("vb");
  const vn=[];P.forEach((p,i)=>{vn.push({what:"I"+(i+1),txt:`fetch instruction ${i+1} (${p})`});vn.push({what:"D"+(i+1),txt:`read or write the data for instruction ${i+1}`})});
  const hv=[];for(let c=0;c<=P.length;c++){const s={};if(c<P.length)s.ins="I"+(c+1);if(c>0)s.dat="D"+c;hv.push(s)}
  const T=vn.length;let K=0,W=600;
  el.innerHTML=alH("Try it: the von Neumann bottleneck","4 instructions, each needing data")+`<div data-svg></div><div class="alg2e"><div class="alstats"><div><b data-c="vn">0</b><span>von Neumann cycles</span></div><div><b data-c="hv">0</b><span>Harvard cycles</span></div></div><div class="almsg" data-m></div></div><div class="alctl" data-ctl></div>`;
  const paint=w=>{W=w;const n=W<400,cx=n?75:115,mx=W-(n?110:170),mw=n?100:160;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 300" role="img" aria-label="A CPU fetching instructions and data over one shared bus, compared with separate instruction and data buses">${alMark(M)}
     <text x="6" y="20" class="h">von Neumann${n?"":": one memory, one bus"}</text>
     <rect x="6" y="36" width="${cx-6}" height="70" rx="10" class="b2"/><text x="${(cx+6)/2}" y="76" class="t c">CPU</text>
     <rect x="${mx}" y="36" width="${mw}" height="70" rx="10" class="b"/><text x="${mx+mw/2}" y="66" class="t c">Memory</text><text x="${mx+mw/2}" y="88" class="s c">${n?"shared":"instructions + data"}</text>
     <line x1="${cx}" y1="71" x2="${mx}" y2="71" class="l" data-bus="one" stroke-width="3"/><g data-tok="one"></g>
     <text x="6" y="146" class="h">Harvard${n?"":": separate memories and buses"}</text>
     <rect x="6" y="164" width="${cx-6}" height="120" rx="10" class="b2"/><text x="${(cx+6)/2}" y="229" class="t c">CPU</text>
     <rect x="${mx}" y="164" width="${mw}" height="52" rx="10" class="bi"/><text x="${mx+mw/2}" y="${n?186:195}" class="t c">Instruction</text>${n?`<text x="${mx+mw/2}" y="205" class="t c">memory</text>`:""}
     <rect x="${mx}" y="232" width="${mw}" height="52" rx="10" class="bw"/><text x="${mx+mw/2}" y="${n?254:263}" class="t c">Data</text><text x="${mx+mw/2}" y="${n?273:263}" class="t c">${n?"memory":""}</text>
     <line x1="${cx}" y1="190" x2="${mx}" y2="190" class="l" data-bus="ins" stroke-width="3"/><line x1="${cx}" y1="258" x2="${mx}" y2="258" class="l" data-bus="dat" stroke-width="3"/><g data-tok="ins"></g><g data-tok="dat"></g></svg>`;go(K)};
  const tok=(lab,y,cls)=>{const n=W<400,x=(n?75:115)+((W-(n?110:170))-(n?75:115))/2;return `<rect x="${x-28}" y="${y-14}" width="56" height="28" rx="14" class="${cls}"/><text x="${x}" y="${y+5}" class="v c">${lab}</text>`};
  const go=k=>{K=k;const v=vn[k],h=hv[k];if(!el.querySelector("[data-bus]"))return;
    el.querySelectorAll("[data-bus]").forEach(l=>l.setAttribute("class","l"));el.querySelectorAll("[data-tok]").forEach(g=>g.innerHTML="");
    el.querySelector("[data-bus=one]").setAttribute("class","la flow");el.querySelector("[data-tok=one]").innerHTML=tok(v.what,71,v.what[0]==="I"?"bi":"bw");
    if(h){if(h.ins){el.querySelector("[data-bus=ins]").setAttribute("class","li flow");el.querySelector("[data-tok=ins]").innerHTML=tok(h.ins,190,"bi")}
      if(h.dat){el.querySelector("[data-bus=dat]").setAttribute("class","lw flow");el.querySelector("[data-tok=dat]").innerHTML=tok(h.dat,258,"bw")}}
    el.querySelector("[data-c=vn]").textContent=k+1;el.querySelector("[data-c=hv]").textContent=Math.min(k+1,hv.length);
    el.querySelector("[data-m]").innerHTML=k>=T-1?`<b>Done.</b> With one shared bus, every instruction and every piece of data takes its own turn: <b>${T} cycles</b>. With separate buses, the next instruction is fetched <i>while</i> the current one's data moves: <b>${hv.length} cycles</b>.`
      :`<b>Cycle ${k+1}.</b> von Neumann: ${v.txt}. ${h?`Harvard: ${[h.ins&&"fetch "+h.ins.replace("I","instruction "),h.dat&&"data for "+h.dat.replace("D","instruction ")].filter(Boolean).join(" <b>and at the same time</b> ")}.`:"Harvard has already finished."}`};
  alResp(el,paint);alStepper(el.querySelector("[data-ctl]"),T,go,{label:k=>`Cycle ${k+1} of ${T}`})};

/* address bus width → number of locations and addressable memory */
ALW.addr=function(el){let n=+(el.dataset.n||16),w=1,W=600;
  const unit=b=>{const U=["bytes","KiB","MiB","GiB","TiB","PiB","EiB"];let i=0,x=b;while(x>=1024&&i<U.length-1){x/=1024;i++}return `${Number.isInteger(x)?x:x.toFixed(2)} ${U[i]}`};
  el.innerHTML=alH("Try it: how much memory can the CPU reach?","address bus width")+`<div class="alctl"><label>Address bus width <input type="range" min="4" max="40" value="${n}" data-n> <b class="mono" data-nv></b></label>
   <label>Each location holds <select data-w><option value="1">1 byte</option><option value="2">2 bytes</option><option value="4">4 bytes</option><option value="8">8 bytes</option></select></label></div>
   <div data-svg></div><div class="alstats"><div><b data-l></b><span>different addresses (2<sup data-e></sup>)</span></div><div><b data-m></b><span>addressable memory</span></div></div><p class="almsg" data-x></p>`;
  const paint=v=>{W=v;draw()};
  const draw=()=>{const locs=2n**BigInt(n),bytes=Number(locs)*w,shown=Math.min(n,32),gap=100/Math.max(shown,1),bw=W<400?70:100;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 150" role="img" aria-label="${n} address bus wires between the CPU and memory"><rect x="6" y="20" width="${bw}" height="110" rx="10" class="b2"/><text x="${6+bw/2}" y="74" class="t c">CPU</text><text x="${6+bw/2}" y="94" class="s c">MAR</text>
     <rect x="${W-6-bw}" y="20" width="${bw}" height="110" rx="10" class="b"/><text x="${W-6-bw/2}" y="80" class="t c">Memory</text>
     ${Array.from({length:shown},(_,i)=>{const y=25+gap*(i+.5);return `<line x1="${6+bw}" y1="${y}" x2="${W-6-bw}" y2="${y}" class="la" stroke-width="${shown>20?1.2:2}"/>`}).join("")}${n>32?`<text x="${W/2}" y="146" class="s c">(only 32 of the ${n} wires are drawn)</text>`:""}</svg>`;
    el.querySelector("[data-nv]").textContent=n+" wires";el.querySelector("[data-e]").textContent=n;
    el.querySelector("[data-l]").textContent=locs.toLocaleString("en-GB");el.querySelector("[data-m]").textContent=unit(bytes);
    el.querySelector("[data-x]").innerHTML=`2<sup>${n}</sup> × ${w} byte${w>1?"s":""} = <b>${unit(bytes)}</b>. Add one more wire and the number of addresses <b>doubles</b>${n<40?` to ${(2n**BigInt(n+1)).toLocaleString("en-GB")}`:""}.`};
  el.querySelector("[data-n]").addEventListener("input",e=>{n=+e.target.value;draw()});el.querySelector("[data-w]").addEventListener("change",e=>{w=+e.target.value;draw()});alResp(el,paint)};

/* the ALU and the status register flags */
ALW.alu=function(el){let A=100,B=60,op="ADD",M=alId("au"),W=600;
  const OPS=[["ADD","ADD"],["SUB","SUB"],["CMP","CMP"],["AND","AND"],["OR","OR"],["XOR","XOR"],["LSL","LSL 1"],["LSR","LSR 1"]];
  el.innerHTML=alH("Try it: the ALU and the status flags","8-bit")+`<div class="alctl"><label>A <input type="number" min="0" max="255" value="${A}" data-a></label><label>B <input type="number" min="0" max="255" value="${B}" data-b></label></div>
   <div class="alctl">${alSeg("op",OPS,op)}</div><div data-svg></div><p class="almsg" data-x></p>`;
  const calc=()=>{let r,c=0,v=0,store=true;const sa=alTC(alBin(A)),sb=alTC(alBin(B));
    if(op==="ADD"){r=A+B;c=r>255?1:0;const s=sa+sb;v=s>127||s<-128?1:0}
    else if(op==="SUB"||op==="CMP"){r=A-B;c=A<B?1:0;const s=sa-sb;v=s>127||s<-128?1:0;store=op==="SUB"}
    else if(op==="AND")r=A&B;else if(op==="OR")r=A|B;else if(op==="XOR")r=A^B;
    else if(op==="LSL"){r=A<<1;c=r>255?1:0}else if(op==="LSR"){c=A&1;r=A>>1}
    r=((r%256)+256)%256;return {r,c,v,n:r>>7,z:r===0?1:0,store}};
  const draw=()=>{const R=calc(),one=op==="LSL"||op==="LSR",c=W/2,bw=W<400?150:170;
    const F=[["N",R.n],["Z",R.z],["C",R.c],["V",R.v]],fx=c-2*56;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 300" role="img" aria-label="ALU with inputs A and B, an opcode, a result and the status flags">${alMark(M)}
     <rect x="${c-bw-8}" y="4" width="${bw}" height="34" rx="6" class="b"/><text x="${c-8-bw/2}" y="26" class="v c">A ${alSp(alBin(A))}</text>
     <rect x="${c+8}" y="4" width="${bw}" height="34" rx="6" class="b${one?" dim":""}"/><text x="${c+8+bw/2}" y="26" class="v c">${one?"(not used)":"B "+alSp(alBin(B))}</text>
     <line x1="${c-8-bw/2}" y1="38" x2="${c-8-bw/2}" y2="56" class="l" marker-end="url(#${M})"/><line x1="${c+8+bw/2}" y1="38" x2="${c+8+bw/2}" y2="56" class="l" marker-end="url(#${M})"/>
     <path d="M${c-bw-8} 58 L${c+bw+8} 58 L${c+70} 150 L${c-70} 150 Z" class="b2"/><text x="${c}" y="100" class="h c">ALU</text><text x="${c}" y="124" class="v c">${op}</text>
     <line x1="${c}" y1="150" x2="${c}" y2="172" class="l" marker-end="url(#${M})"/>
     <rect x="${c-110}" y="174" width="220" height="36" rx="6" class="b"/><text x="${c}" y="197" class="v c">${R.store?"result ":"(discarded) "}${alSp(alBin(R.r))}</text>
     <text x="${c}" y="236" class="s c">status register flags</text>
     ${F.map(([k,b],i)=>`<rect x="${fx+i*56}" y="244" width="50" height="44" rx="6" class="${b?"on":"b"}"/><text x="${fx+25+i*56}" y="262" class="t c">${k}</text><text x="${fx+25+i*56}" y="280" class="v c">${b}</text>`).join("")}</svg>`;
    const sg=x=>alTC(alBin(x)),exp=[];
    if(op==="ADD")exp.push(`Unsigned: ${A} + ${B} = ${A+B}${A+B>255?" — too big for 8 bits, so <b>C = 1</b> and the stored result wraps to "+R.r:""}. Signed: ${sg(A)} + ${sg(B)} = ${sg(A)+sg(B)}${R.v?" — outside −128 to +127, so <b>V = 1</b> (overflow)":""}.`);
    if(op==="SUB"||op==="CMP")exp.push(`${A} − ${B} = ${A-B}${A<B?" (a borrow, so <b>C = 1</b>)":""}. Signed: ${sg(A)} − ${sg(B)} = ${sg(A)-sg(B)}${R.v?" — overflow, so <b>V = 1</b>":""}.${op==="CMP"?" <b>CMP</b> subtracts but throws the result away: only the flags change, ready for a conditional branch (e.g. branch if Z = 1, meaning A = B).":""}`);
    if(["AND","OR","XOR"].includes(op))exp.push(`${op} works on each pair of bits separately. Logic operations never carry or overflow.`);
    if(op==="LSL")exp.push(`Shift left: every bit moves one place left (×2). The bit pushed out of the top goes into <b>C</b>.`);
    if(op==="LSR")exp.push(`Shift right: every bit moves one place right (÷2). The bit pushed out of the bottom goes into <b>C</b>.`);
    exp.push(`<b>N</b> copies the top bit of the result; <b>Z</b> is 1 when the result is zero.`);
    el.querySelector("[data-x]").innerHTML=exp.join(" ")};
  const num=v=>Math.max(0,Math.min(255,Math.round(+v||0)));
  el.querySelector("[data-a]").addEventListener("input",e=>{A=num(e.target.value);draw()});el.querySelector("[data-b]").addEventListener("input",e=>{B=num(e.target.value);draw()});
  el.addEventListener("click",e=>{const b=e.target.closest("[data-op]");if(!b)return;op=b.dataset.op;alSegSet(el,"op",op);draw()});alResp(el,w=>{W=w;draw()})};

/* the fetch-decode-execute cycle, one register transfer at a time */
ALW.fde=function(el){const M=alId("fd");let D6=25,D7=17,K=0,W=600;
  const build=()=>{const mem={0:"LDA 6",1:"ADD 7",2:"STO 8",3:"HLT",4:"",5:"",6:D6,7:D7,8:0},r={PC:0,MAR:"",MBR:"",CIR:"",ACC:0},S=[];
    const push=(st,rtn,txt,o={})=>S.push({st,rtn,txt,chg:o.chg||[],bus:o.bus||{},hi:o.hi,alu:!!o.alu,cu:!!o.cu,r:{...r},mem:{...mem}});
    for(let guard=0;guard<10;guard++){const a=r.PC;
      r.MAR=a;push("F","MAR ← [PC]",`The PC holds ${a}, the address of the next instruction. It is copied into the MAR.`,{chg:["MAR"]});
      r.MBR=mem[a];push("F",`MBR ← [Memory]<sub>${a}</sub>`,`The MAR puts address ${a} on the <b>address bus</b>, and the control unit sends a <b>memory read</b> signal on the control bus. The contents of address ${a}, <span class="mono">${mem[a]}</span>, travel along the <b>data bus</b> into the MBR.`,{chg:["MBR"],bus:{a:1,d:"in",c:"read"},hi:a});
      r.PC=a+1;push("F","PC ← [PC] + 1",`The PC is incremented to ${a+1}, so it points to the next instruction.`,{chg:["PC"]});
      r.CIR=r.MBR;push("F","CIR ← [MBR]",`The instruction is copied from the MBR into the CIR, ready to be decoded.`,{chg:["CIR"]});
      const [opc,opd]=String(r.CIR).split(" ");
      push("D","decode [CIR]",opc==="HLT"?`The control unit decodes <span class="mono">HLT</span>: stop the program.`:`The control unit decodes <span class="mono">${r.CIR}</span>: the opcode <b>${opc}</b> means ${({LDA:"load a value into the accumulator",ADD:"add a value to the accumulator",STO:"store the accumulator in memory"})[opc]}; the operand <b>${opd}</b> is a memory address.`,{cu:true});
      if(opc==="HLT"){push("E","stop","The program has finished. Address 8 now holds the answer, "+mem[8]+".",{hi:8});break}
      const ad=+opd;r.MAR=ad;
      if(opc==="LDA"||opc==="ADD"){push("E",`MAR ← ${ad}`,`The operand, address ${ad}, is copied into the MAR.`,{chg:["MAR"]});
        r.MBR=mem[ad];push("E",`MBR ← [Memory]<sub>${ad}</sub>`,`Another <b>memory read</b>: the value at address ${ad}, ${mem[ad]}, comes back on the data bus into the MBR.`,{chg:["MBR"],bus:{a:1,d:"in",c:"read"},hi:ad});
        if(opc==="LDA"){r.ACC=r.MBR;push("E","ACC ← [MBR]",`The value ${r.MBR} is copied into the accumulator.`,{chg:["ACC"]})}
        else{const old=r.ACC;r.ACC=old+r.MBR;push("E","ACC ← [ACC] + [MBR]",`The ALU adds ${old} and ${r.MBR}. The result, ${r.ACC}, goes into the accumulator.`,{chg:["ACC"],alu:true})}}
      else if(opc==="STO"){push("E",`MAR ← ${ad}`,`The operand, address ${ad}, is copied into the MAR.`,{chg:["MAR"]});
        r.MBR=r.ACC;push("E","MBR ← [ACC]",`The accumulator's value, ${r.ACC}, is copied into the MBR.`,{chg:["MBR"]});
        mem[ad]=r.MBR;push("E",`[Memory]<sub>${ad}</sub> ← [MBR]`,`The MAR puts ${ad} on the address bus, the MBR puts ${r.MBR} on the data bus, and the control unit sends a <b>memory write</b> signal. Address ${ad} now holds ${r.MBR}.`,{bus:{a:1,d:"out",c:"write"},hi:ad})}}
    return S};
  let S=build();
  const NAME={PC:"Program counter",MAR:"Memory address reg.",MBR:"Memory buffer reg.",CIR:"Current instruction reg.",ACC:"Accumulator"};
  /* two layouts: side by side (600 wide) or stacked (340 wide) */
  const LAY=w=>w>400?{W:600,H:420,cpu:[4,4,346,412],cu:[14,36,154,56],alu:[182,36,156,56],R:{PC:[14,112],CIR:[14,188],ACC:[182,112],MAR:[182,226],MBR:[182,322]},rw:154,mem:[430,4,166,412],rows:{x:438,y:44,w:150,h:38,cols:1},
      a:"M338 253 H430",d:"M338 349 H430",din:"M430 349 H338",c:"M120 36 V18 H372 V196 H430",la:[384,246],ld:[384,342],lc:[401,190]}
    :{W:340,H:620,cpu:[4,4,332,318],cu:[12,32,150,48],alu:[176,32,150,48],R:{PC:[12,98],ACC:[176,98],CIR:[12,170],MAR:[176,170],MBR:[176,242]},rw:150,mem:[4,394,332,222],rows:{x:12,y:426,w:100,h:44,cols:3},
      a:"M251 222 V394",d:"M300 294 V394",din:"M300 394 V294",c:"M60 80 V360 H200 V394",la:[244,350],ld:[306,350],lc:[66,350]};
  const reg=(L,k)=>{const [x,y]=L.R[k];return `<rect x="${x}" y="${y}" width="${L.rw}" height="52" rx="8" class="b" data-r="${k}"/><text x="${x+8}" y="${y+18}" class="s">${NAME[k]}</text><text x="${x+8}" y="${y+41}" class="t">${k}</text><text x="${x+L.rw-8}" y="${y+41}" class="v" text-anchor="end" data-rv="${k}"></text>`};
  el.innerHTML=alH("Try it: the fetch-decode-execute cycle","register transfer notation")+`<div class="alctl"><span class="alnote">The program adds the numbers at addresses 6 and 7 and stores the answer at address 8.</span><span class="sp"></span><label>Address 6 <input type="number" value="${D6}" min="0" max="99" data-d6></label><label>Address 7 <input type="number" value="${D7}" min="0" max="99" data-d7></label></div>
   <div data-svg></div><div class="alstages"><span data-st="F">Fetch</span><span data-st="D">Decode</span><span data-st="E">Execute</span></div>
   <div class="almsg"><span class="alrtn" data-rtn></span><span data-txt></span></div><div class="alctl" data-ctl></div>`;
  let L;
  const paint=w=>{W=w;L=LAY(w);const [cx,cy,cw,ch]=L.cpu,[ux,uy,uw,uh]=L.cu,[ax,ay,aw,ah]=L.alu,[mx,my,mw,mh]=L.mem;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${L.W} ${L.H}" role="img" aria-label="CPU registers, control unit and ALU connected to memory by address, data and control buses">${alMark(M)}
     <rect x="${cx}" y="${cy}" width="${cw}" height="${ch}" rx="14" class="b3"/><text x="${cx+12}" y="${cy+22}" class="h">CPU</text>
     <rect x="${ux}" y="${uy}" width="${uw}" height="${uh}" rx="8" class="b2" data-cu/><text x="${ux+uw/2}" y="${uy+uh/2+5}" class="t c">Control unit</text>
     <path d="M${ax} ${ay} L${ax+aw} ${ay} L${ax+aw-26} ${ay+ah} L${ax+26} ${ay+ah} Z" class="b2" data-alu/><text x="${ax+aw/2}" y="${ay+ah/2+5}" class="t c">ALU</text>
     ${["PC","CIR","ACC","MAR","MBR"].map(k=>reg(L,k)).join("")}
     <rect x="${mx}" y="${my}" width="${mw}" height="${mh}" rx="14" class="b3"/><text x="${mx+mw/2}" y="${my+24}" class="h c">Memory</text><g data-mem></g>
     <path d="${L.c}" class="l" data-bus="c" stroke-width="2"/><path d="${L.a}" class="l" data-bus="a" stroke-width="3"/><path d="${L.d}" class="l" data-bus="d" stroke-width="3"/>
     <text x="${L.la[0]}" y="${L.la[1]}" class="s c">address</text><text x="${L.ld[0]}" y="${L.ld[1]}" class="s c">data</text><text x="${L.lc[0]}" y="${L.lc[1]}" class="s${W>400?" c":""}" data-ct>control</text></svg>`;go(K)};
  const go=k=>{K=k;const s=S[k];if(!L||!el.querySelector("[data-mem]"))return;
    for(const key of ["PC","MAR","MBR","CIR","ACC"]){el.querySelector(`[data-rv=${key}]`).textContent=String(s.r[key]);el.querySelector(`[data-r=${key}]`).setAttribute("class",s.chg.includes(key)?"b chg":"b")}
    const R=L.rows;el.querySelector("[data-mem]").innerHTML=Object.keys(s.mem).map((a,i)=>{const col=i%R.cols,row=Math.floor(i/R.cols),x=R.x+col*(R.w+8),y=R.y+row*R.h,on=+a===s.hi;
      return `<rect x="${x}" y="${y}" width="${R.w}" height="${R.h-6}" rx="6" class="${on?"on":"b"}"/><text x="${x+8}" y="${y+R.h/2+2}" class="s">${a}</text><text x="${x+R.w-8}" y="${y+R.h/2+3}" class="v" text-anchor="end">${s.mem[a]}</text>`}).join("");
    const B=s.bus,ab=el.querySelector("[data-bus=a]"),db=el.querySelector("[data-bus=d]");
    ab.setAttribute("class",B.a?"la flow":"l");ab.setAttribute("marker-end",B.a?`url(#${M})`:"");
    db.setAttribute("class",B.d?"li flow":"l");db.setAttribute("d",B.d==="in"?L.din:L.d);db.setAttribute("marker-end",B.d?`url(#${M})`:"");
    el.querySelector("[data-bus=c]").setAttribute("class",B.c?"lw flow":"l");const ct=el.querySelector("[data-ct]");ct.textContent=B.c||"control";ct.setAttribute("class",(B.c?"tw t":"s")+(W>400?" c":""));
    el.querySelector("[data-cu]").setAttribute("class",s.cu||B.c?"on":"b2");el.querySelector("[data-alu]").setAttribute("class",s.alu?"on":"b2");
    el.querySelectorAll("[data-st]").forEach(x=>x.classList.toggle("on",x.dataset.st===s.st));
    el.querySelector("[data-rtn]").innerHTML=s.rtn;el.querySelector("[data-txt]").innerHTML=s.txt};
  alResp(el,paint);const ctl=alStepper(el.querySelector("[data-ctl]"),()=>S.length,go,{ms:2200});
  const upd=()=>{D6=Math.max(0,Math.min(99,+el.querySelector("[data-d6]").value||0));D7=Math.max(0,Math.min(99,+el.querySelector("[data-d7]").value||0));S=build();ctl.set(0)};
  el.querySelector("[data-d6]").addEventListener("change",upd);el.querySelector("[data-d7]").addEventListener("change",upd)};

/* how long each level of the memory hierarchy takes, scaled to human time */
ALW.memscale=function(el){const L=[["Register",0.3,"bytes"],["L1 cache",1,"32–128 KiB"],["L2 cache",4,"0.25–2 MiB"],["L3 cache",15,"8–64 MiB"],["RAM",80,"8–64 GiB"],["SSD",100000,"1–4 TB"],["Hard disk",8000000,"1–20 TB"]];
  const human=s=>s<60?`${s.toFixed(s<10?1:0)} seconds`:s<3600?`${(s/60).toFixed(1)} minutes`:s<86400?`${(s/3600).toFixed(1)} hours`:s<86400*60?`${(s/86400).toFixed(1)} days`:`${(s/86400/30.4).toFixed(1)} months`;
  const real=ns=>ns<1000?`${ns} ns`:ns<1e6?`${ns/1000} µs`:`${ns/1e6} ms`;
  el.innerHTML=alH("Try it: how long does each level take?","if a register took 1 second")+`<div class="alctl">${alSeg("ms",[["h","Human scale"],["r","Real times"]],"h")}</div><div data-rows style="display:flex;flex-direction:column;gap:6px"></div><p class="alnote">Approximate figures for a modern computer. The bars use a logarithmic scale: each step along is roughly ten times longer.</p>`;
  let mode="h";const draw=()=>{const mx=Math.log10(L[L.length-1][1]/0.3)+1;
    el.querySelector("[data-rows]").innerHTML=L.map(([n,ns,sz])=>{const w=Math.max(3,(Math.log10(ns/0.3)+1)/mx*100);
      return `<div style="display:grid;grid-template-columns:7.5em 1fr;gap:8px;align-items:center"><div><b>${n}</b><div class="alnote">${sz}</div></div><div style="background:var(--surface);border:1px solid var(--line);border-radius:6px;height:30px;position:relative"><div style="position:absolute;inset:0 auto 0 0;width:${w}%;background:var(--accent-soft);border-right:3px solid var(--accent);border-radius:5px 0 0 5px;transition:width .5s"></div><span class="mono" style="position:absolute;left:10px;top:5px;font-weight:700">${mode==="h"?human(ns/0.3):real(ns)}</span></div></div>`}).join("")};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-ms]");if(!b)return;mode=b.dataset.ms;alSegSet(el,"ms",mode);draw()});draw()};

/* serial vs parallel: watch the bits travel, and see skew corrupt a long parallel link */
ALW.serpar=function(el){let ch="K",far=false,raf=null,W=600;
  el.innerHTML=alH("Try it: serial and parallel transmission","watch the bits")+`<div class="alctl"><label>Character <input type="text" maxlength="1" value="${ch}" data-ch style="width:3em;text-align:center"></label>${alSeg("far",[["0","Short link"],["1","Long cable (5 m)"]],"0")}<button class="btn small primary" data-go>▶ Send</button></div>
   <div data-svg></div><div class="alg2e"><div class="alstats"><div><b data-st>–</b><span>serial: clock ticks</span></div><div><b data-pt>–</b><span>parallel: clock ticks</span></div></div><p class="almsg" data-m>Choose a character and press Send. Its 8-bit ASCII code is sent both ways at once.</p></div>`;
  let G;const paint=w=>{W=w;const n=W<400,bx=n?52:86;G={x0:6+bx,x1:W-6-bx,bx};
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 330" role="img" aria-label="Bits travelling one at a time on one wire, and eight at a time on eight wires"><text x="6" y="22" class="h">Serial</text>
     <rect x="6" y="34" width="${bx}" height="44" rx="8" class="b2"/><text x="${6+bx/2}" y="61" class="s c">${n?"send":"sender"}</text><rect x="${W-6-bx}" y="34" width="${bx}" height="44" rx="8" class="b2"/><text x="${W-6-bx/2}" y="61" class="s c">${n?"receive":"receiver"}</text>
     <line x1="${G.x0}" y1="56" x2="${G.x1}" y2="56" class="l"/><g data-sb></g><text x="${W-6-bx/2}" y="96" class="v c" data-sr></text>
     <text x="6" y="128" class="h">Parallel</text><rect x="6" y="140" width="${bx}" height="176" rx="8" class="b2"/><text x="${6+bx/2}" y="232" class="s c">${n?"send":"sender"}</text><rect x="${W-6-bx}" y="140" width="${bx}" height="176" rx="8" class="b2"/><text x="${W-6-bx/2}" y="132" class="s c">${n?"receive":"receiver"}</text>
     ${Array.from({length:8},(_,i)=>`<line x1="${G.x0}" y1="${152+i*21}" x2="${G.x1}" y2="${152+i*21}" class="l" stroke-width="1.5"/>`).join("")}<g data-pb></g><g data-pr></g></svg>`};
  const bits=()=>alBin((ch||"K").charCodeAt(0)&255);
  const send=()=>{cancelAnimationFrame(raf);const b=bits(),travel=far?2.4:1.2,tick=far?1:0.5;
    const skew=Array.from({length:8},(_,i)=>far?[0,.32,-.1,.42,.12,-.18,.5,.05][i]:[0,.03,-.02,.02,0,.01,-.01,.02][i]);
    const sample=travel*1.08,t0=performance.now(),dur=alRM()?0:1,TT=8*tick+travel+.4;
    const frame=now=>{if(!alAlive(el))return;const t=dur?Math.max(0,(now-t0)/1000):TT,len=G.x1-G.x0;
      el.querySelector("[data-sb]").innerHTML=[...b].reverse().map((v,i)=>{const p=(t-i*tick)/travel;if(p<0||p>1)return"";const x=G.x0+p*len;return `<circle cx="${x}" cy="56" r="11" class="${v==="1"?"bi":"b"}"/><text x="${x}" y="61" class="v c">${v}</text>`}).join("");
      el.querySelector("[data-sr]").textContent=[...b].reverse().map((v,i)=>t>=i*tick+travel?v:"·").reverse().join("");
      el.querySelector("[data-pb]").innerHTML=[...b].map((v,i)=>{const p=t/(travel*(1+skew[i]));if(p>1)return"";const x=G.x0+p*len,y=152+i*21;return `<circle cx="${x}" cy="${y}" r="9" class="${v==="1"?"bi":"b"}"/><text x="${x}" y="${y+5}" class="v c" style="font-size:11px">${v}</text>`}).join("");
      el.querySelector("[data-pr]").innerHTML=t>=sample?[...b].map((v,i)=>{const ok=travel*(1+skew[i])<=sample,y=152+i*21,x=W-6-G.bx/2;return `<rect x="${x-11}" y="${y-9}" width="22" height="18" rx="4" class="${ok?"bg":"bb"}"/><text x="${x}" y="${y+5}" class="v c" style="font-size:11px">${ok?v:"?"}</text>`}).join(""):"";
      el.querySelector("[data-st]").textContent=Math.min(8,Math.max(0,Math.ceil((t-travel)/tick+1e-9)));el.querySelector("[data-pt]").textContent=t>=sample?1:0;
      if(t<TT){raf=requestAnimationFrame(frame);return}
      const bad=skew.filter(s=>travel*(1+s)>sample).length;
      el.querySelector("[data-m]").innerHTML=`'${ch}' is <span class="mono">${alSp(b)}</span>. Serial sent the bits one after another along one wire: 8 ticks. Parallel sent all 8 at once: 1 tick. `+(bad?`<b>But on the long cable the wires don't carry signals at exactly the same speed (skew)</b>, so when the receiver read the byte, ${bad} bit${bad>1?"s hadn't":" hadn't"} arrived yet: the data is corrupted. To fix it, the parallel clock must be slowed right down, so serial — which can be clocked much faster — wins over distance.`:`Over a short distance the bits all arrive together, so parallel is fast and reliable. That's why buses inside the CPU and on the motherboard are parallel.`)};
    raf=requestAnimationFrame(frame)};
  alResp(el,paint);el.querySelector("[data-go]").addEventListener("click",send);el.querySelector("[data-ch]").addEventListener("input",e=>{ch=e.target.value||"K"});
  el.addEventListener("click",e=>{const b=e.target.closest("[data-far]");if(!b)return;far=b.dataset.far==="1";alSegSet(el,"far",b.dataset.far)})};

/* ======================= 1.2 The operating system ======================= */

/* what the OS does when you open an app: one role at a time */
ALW.osroles=function(el){const R=[["ui","User interface"],["user","User management"],["mem","Memory management"],["proc","Process management"],["per","Peripheral management"]];
  const S=[["ui","You double-click the Photo Editor icon. The <b>graphical user interface</b> turns the click into a request to start the program."],
    ["user","The OS checks <b>who is logged in</b> and whether that account is allowed to run the program and open files in the Pictures folder."],
    ["mem","The OS finds <b>free memory</b>, loads the program's code from the SSD into RAM, and marks that memory as belonging to the new program so others can't touch it."],
    ["proc","The OS creates a new <b>process</b> and puts it in the ready queue. The scheduler now shares the CPU between it, the music player and everything else."],
    ["per","The program asks to draw its window. The OS passes this to the <b>graphics card's device driver</b>, which turns it into commands the hardware understands."],
    ["per","You press Print. The pages go into a <b>buffer (print spool)</b>, so you can carry on working while the slower printer catches up."],
    ["mem","You open a huge photo and RAM fills up. The OS moves pages you haven't used lately into <b>virtual memory</b> on the SSD."],
    ["proc","You close the program. The OS <b>ends the process</b>, frees its memory and removes it from the scheduler."]];
  el.innerHTML=alH("Try it: opening an app, step by step","which role is the OS using?")+`<div class="alstages" data-r>${R.map(([k,n])=>`<span data-k="${k}">${n}</span>`).join("")}</div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  alStepper(el.querySelector("[data-ctl]"),S.length,k=>{el.querySelectorAll("[data-k]").forEach(x=>x.classList.toggle("on",x.dataset.k===S[k][0]));el.querySelector("[data-m]").innerHTML=S[k][1]},{ms:2600})};

/* interrupts: priorities, saving to the stack, nested interrupts */
ALW.irq=function(el){const MAIN=["LDA total","ADD price","STO total","LDA count","ADD one","STO count"];
  const IRQ={pwr:["Power failure",1,["Save all registers and open files","Shut down safely","Return from interrupt"]],tmr:["Timer",2,["Save the current process's state","Ask the scheduler for the next process","Return from interrupt"]],key:["Keyboard",3,["Read the key code from the keyboard","Put it in the keyboard buffer","Return from interrupt"]],prn:["Printer",4,["Send the next page to the printer","Update the print queue","Return from interrupt"]]};
  let cur,stack,pend,log,cyc;
  const reset=()=>{cur={name:"Main program",prog:MAIN,pc:0,prio:9,loop:true};stack=[];pend=new Set();log=["The main program is running. Raise an interrupt, then press Next cycle."];cyc=0;draw()};
  el.innerHTML=alH("Try it: handling interrupts","priority 1 is the most urgent")+`<div class="alctl"><span class="alnote">Raise:</span>${Object.entries(IRQ).map(([k,[n,p]])=>`<button class="btn small" data-raise="${k}">${n} <small>(priority ${p})</small></button>`).join("")}</div>
   <div class="alg2"><div class="alpanel"><span class="eyebrow">Running now</span><b data-name></b><ol class="alcode" data-code style="list-style:none;padding-left:0"></ol></div>
    <div style="display:flex;flex-direction:column;gap:12px"><div class="alpanel"><span class="eyebrow">Interrupt register</span><div class="alcells" data-ir></div></div><div class="alpanel"><span class="eyebrow">Stack (saved registers)</span><div class="alframes" data-stk></div></div></div></div>
   <p class="almsg" data-m></p><div class="alctl"><button class="btn small primary" data-cy>Next cycle ▶</button><button class="btn small" data-rs>↺ Restart</button><span class="sp"></span><span class="alstep" data-cyc></span></div>`;
  const draw=()=>{el.querySelector("[data-name]").textContent=cur.name+(cur.prio<9?` (priority ${cur.prio})`:"");
    el.querySelector("[data-code]").innerHTML=cur.prog.map((x,i)=>`<div class="${i===cur.pc?"cur":""}"><i>${i}</i>${x}</div>`).join("");
    el.querySelector("[data-ir]").innerHTML=Object.entries(IRQ).map(([k,[n,p]])=>`<div class="alcell ${pend.has(k)?"hi":""}"><small>${n}</small>${pend.has(k)?1:0}</div>`).join("");
    el.querySelector("[data-stk]").innerHTML=stack.length?stack.map((f,i)=>`<div class="alframe ${i===stack.length-1?"top":""}"><b>${f.name}</b> · PC = ${f.pc}, ACC and other registers</div>`).join(""):`<span class="alnote">empty</span>`;
    el.querySelector("[data-m]").innerHTML=log.join("<br>");el.querySelector("[data-cyc]").textContent=`Cycle ${cyc}`};
  const step=()=>{cyc++;log=[];const ins=cur.prog[cur.pc];log.push(`Execute <b>${ins}</b> (${cur.name}).`);
    const done=!cur.loop&&cur.pc===cur.prog.length-1;cur.pc++;if(cur.loop&&cur.pc>=cur.prog.length)cur.pc=0;
    if(done){const f=stack.pop();log.push(`The ISR has finished. The saved registers are <b>popped off the stack</b>, so the PC is ${f.pc} again and <b>${f.name}</b> carries on exactly where it stopped.`);cur=f}
    const ks=[...pend].sort((a,b)=>IRQ[a][1]-IRQ[b][1]);
    if(!ks.length){log.push("End of cycle: the CPU checks the interrupt register. Nothing waiting.");draw();return}
    const k=ks[0],[n,p,prog]=IRQ[k];
    if(p<cur.prio){pend.delete(k);stack.push({...cur});log.push(`End of cycle: the CPU finds a <b>${n}</b> interrupt (priority ${p}), more urgent than ${cur.name}. Its registers (PC = ${cur.pc}) are <b>pushed onto the stack</b> and the PC is loaded with the address of the ${n} ISR.`);
      cur={name:n+" ISR",prog,pc:0,prio:p,loop:false}}
    else log.push(`End of cycle: a ${n} interrupt (priority ${p}) is waiting, but it isn't more urgent than ${cur.name}, so it <b>waits</b>.`);draw()};
  el.addEventListener("click",e=>{const r=e.target.closest("[data-raise]");if(r){pend.add(r.dataset.raise);log=[`The ${IRQ[r.dataset.raise][0].toLowerCase()} sets its bit in the interrupt register. Nothing happens until the end of the current cycle.`];draw();return}
    if(e.target.closest("[data-cy]"))step();if(e.target.closest("[data-rs]"))reset()});reset()};

/* process states: try each event */
ALW.states=function(el){const M=alId("ps");let W=600,st="new",last=null;
  const E=[["admit","Admitted","new","ready","The OS has loaded the program and set up the process. It joins the ready queue."],["sched","Scheduled","ready","running","The scheduler picks this process and gives it the CPU."],
    ["slice","Time slice ends","running","ready","A timer interrupt ends its time slice. It goes back to the ready queue so another process can run."],["io","Waits for I/O","running","blocked","It asks to read from the disk. It can't continue until the data arrives, so it gives up the CPU."],
    ["done","I/O completes","blocked","ready","The data has arrived. The process goes back to the <b>ready</b> queue — not straight to running — and waits its turn."],["fin","Finishes","running","term","The process has finished. The OS frees its memory and resources."]];
  const NM={new:"New",ready:"Ready",running:"Running",blocked:"Blocked",term:"Terminated"};
  const pos=()=>W>400?{new:[60,50],ready:[300,50],running:[540,50],blocked:[420,220],term:[540,320]}:{new:[62,40],ready:[62,175],running:[272,175],blocked:[167,330],term:[272,40]};
  el.innerHTML=alH("Try it: process states","click an event")+`<div data-svg></div><div class="alctl">${E.map(([k,n])=>`<button class="btn small" data-ev="${k}">${n}</button>`).join("")}<button class="btn small" data-ev="reset">↺ New process</button></div><p class="almsg" data-m>A new process has just been created. Which event can happen next?</p>`;
  const edge=(a,b,P,off)=>{const [x1,y1]=P[a],[x2,y2]=P[b],dx=x2-x1,dy=y2-y1,L=Math.hypot(dx,dy),ux=dx/L,uy=dy/L,nx=-uy*off,ny=ux*off;
    const rx=56,ry=24,t=Math.min(Math.abs(rx/(ux||1e-9)),Math.abs(ry/(uy||1e-9)));return [x1+ux*t+nx,y1+uy*t+ny,x2-ux*t+nx,y2-uy*t+ny]};
  const draw=()=>{const P=pos(),H=W>400?360:370;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Process state diagram">${alMark(M)}
     ${E.map(([k,n,a,b])=>{const pair=(a==="running"&&b==="ready")||(a==="ready"&&b==="running"),[x1,y1,x2,y2]=edge(a,b,P,pair?14:0),hot=last===k,mx=(x1+x2)/2,my=(y1+y2)/2,horiz=Math.abs(y2-y1)<Math.abs(x2-x1);
       return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${hot?"la":"ld"}" marker-end="url(#${M})"/><text x="${mx+(horiz?0:6)}" y="${my+(horiz?(pair?(((P[b][0]-P[a][0])>0)?20:-8):-8):4)}" class="s${horiz?" c":""}">${n}</text>`}).join("")}
     ${Object.entries(P).map(([k,[x,y]])=>`<rect x="${x-56}" y="${y-24}" width="112" height="48" rx="24" class="${k===st?"on":"b"}"/><text x="${x}" y="${y+5}" class="t c">${NM[k]}</text>`).join("")}</svg>`;
    el.querySelectorAll("[data-ev]").forEach(b=>{const e=E.find(x=>x[0]===b.dataset.ev);b.classList.toggle("primary",!!e&&e[2]===st)})};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-ev]");if(!b)return;const k=b.dataset.ev,m=el.querySelector("[data-m]");
    if(k==="reset"){st="new";last=null;m.className="almsg";m.textContent="A new process has just been created. Which event can happen next?";draw();return}
    const ev=E.find(x=>x[0]===k);if(ev[2]!==st){m.className="almsg bad";m.innerHTML=`<b>${ev[1]}</b> can't happen to a process that is <b>${NM[st].toLowerCase()}</b>.${st==="blocked"&&k==="sched"?" A blocked process must become ready before it can be scheduled.":""}`;return}
    st=ev[3];last=k;m.className="almsg good";m.innerHTML=`<b>${NM[ev[2]]} → ${NM[ev[3]]}.</b> ${ev[4]}`;draw()});alResp(el,w=>{W=w;draw()})};

/* CPU scheduling: round robin, FCFS, SJF and a multi-level queue, drawn as a Gantt chart */
ALW.sched=function(el){const COL=["info","warn","good","bad"];let algo=el.dataset.algo||"RR",q=2;
  let P=[{n:"A",a:0,b:5,lv:2},{n:"B",a:0,b:2,lv:1},{n:"C",a:1,b:4,lv:2},{n:"D",a:3,b:1,lv:1}];
  const sim=()=>{const rem=P.map(p=>p.b),fin=Array(P.length).fill(null),seg=[],snaps=[];let t=0,cur=-1,used=0,rq=[],arrived=new Set(),cs=0;
    const arrive=()=>P.forEach((p,i)=>{if(p.a<=t&&!arrived.has(i)){arrived.add(i);rq.push(i)}});
    const pick=()=>{if(!rq.length)return -1;let j=0;
      if(algo==="SJF")rq.forEach((x,k)=>{if(rem[x]<rem[rq[j]]||(rem[x]===rem[rq[j]]&&P[x].a<P[rq[j]].a))j=k});
      if(algo==="MLQ"){const hi=rq.findIndex(x=>P[x].lv===1);j=hi>=0?hi:0}
      return rq.splice(j,1)[0]};
    for(let guard=0;guard<200;guard++){arrive();
      if(cur>=0){const pre=algo==="RR"&&used>=q||algo==="MLQ"&&(P[cur].lv===1?used>=q:rq.some(x=>P[x].lv===1));if(pre){rq.push(cur);cur=-1}}
      if(cur<0){const n=pick();if(n>=0){if(seg.length&&seg[seg.length-1].p!==n&&seg[seg.length-1].e===t)cs++;cur=n;used=0}}
      snaps.push({t,cur,rq:rq.slice(),fin:fin.slice()});
      if(cur<0){if(fin.every(x=>x!==null))break;t++;continue}
      const last=seg[seg.length-1];if(last&&last.p===cur&&last.e===t)last.e++;else seg.push({p:cur,s:t,e:t+1});
      rem[cur]--;used++;t++;if(rem[cur]===0){fin[cur]=t;cur=-1}}
    return {seg,snaps,fin,end:t,cs}};
  el.innerHTML=alH("Try it: scheduling algorithms","Gantt chart")+`<div class="alctl">${alSeg("al",[["RR","Round robin"],["FCFS","First-come, first-served"],["SJF","Shortest job first"],["MLQ","Multi-level queue"]],algo)}<label data-ql>Time slice <select data-q><option>1</option><option selected>2</option><option>3</option><option>4</option></select></label></div>
   <div class="tscroll"><table class="altab"><tr><th>Process</th><th>Arrives at</th><th>Burst time</th><th data-lvh>Queue</th><th>Finishes</th><th>Waiting time</th></tr><tbody data-pt></tbody></table></div>
   <div class="algantt" data-g></div><div class="alg2e"><div class="alpanel"><span class="eyebrow">Ready queue at this moment</span><div class="alcells" data-rq></div></div><p class="almsg" data-m></p></div><div class="alctl" data-ctl></div>`;
  let R,ctl;
  const rows=()=>{el.querySelector("[data-pt]").innerHTML=P.map((p,i)=>`<tr><td><span class="alkey"><i style="background:var(--${COL[i]}-soft);border:2px solid var(--${COL[i]})"></i><b>${p.n}</b></span></td><td><input type="number" min="0" max="9" value="${p.a}" data-pa="${i}" style="width:4em"></td><td><input type="number" min="1" max="9" value="${p.b}" data-pb="${i}" style="width:4em"></td>
     <td data-lv>${`<select data-pl="${i}"><option value="1"${p.lv===1?" selected":""}>1 · interactive (RR)</option><option value="2"${p.lv===2?" selected":""}>2 · batch (FCFS)</option></select>`}</td><td data-f="${i}">–</td><td data-w="${i}">–</td></tr>`).join("");
    el.querySelectorAll("[data-lv]").forEach(x=>x.hidden=algo!=="MLQ");el.querySelector("[data-lvh]").hidden=algo!=="MLQ";el.querySelector("[data-ql]").hidden=!(algo==="RR"||algo==="MLQ")};
  const go=k=>{const snap=R.snaps[Math.min(k,R.snaps.length-1)],t=snap.t,W=R.end||1,pct=x=>x/W*100;
    el.querySelector("[data-g]").innerHTML=`<div class="algrow"><b>CPU</b><div class="algtrack">${R.seg.filter(s=>s.s<t).map(s=>{const e=Math.min(s.e,t),c=COL[s.p];return `<div class="algseg" style="left:${pct(s.s)}%;width:calc(${pct(e-s.s)}% - 2px);background:var(--${c}-soft);border:2px solid var(--${c});color:var(--ink)">${P[s.p].n}</div>`}).join("")}<div class="algplay" style="left:${pct(t)}%"></div></div></div>
      <div class="algaxis"><i></i><div>${Array.from({length:W+1},(_,i)=>i%(W>10&&el.clientWidth<500?2:1)?"":`<span style="left:${pct(i)}%">${i}</span>`).join("")}</div></div>`;
    el.querySelector("[data-rq]").innerHTML=snap.rq.length?snap.rq.map(i=>`<div class="alcell" style="border-color:var(--${COL[i]})">${P[i].n}<small>${P[i].b-R.seg.filter(s=>s.p===i&&s.s<t).reduce((a,s)=>a+Math.min(s.e,t)-s.s,0)} left</small></div>`).join(""):`<span class="alnote">empty</span>`;
    const end=k>=R.snaps.length-1;
    P.forEach((p,i)=>{const f=R.fin[i];el.querySelector(`[data-f="${i}"]`).textContent=end?f:"–";el.querySelector(`[data-w="${i}"]`).textContent=end?f-p.a-p.b:"–"});
    const avg=P.reduce((a,p,i)=>a+R.fin[i]-p.a-p.b,0)/P.length;
    const why={RR:`Each process gets up to ${q} time unit${q>1?"s":""}, then goes to the back of the queue.`,FCFS:"Each process runs to completion in the order it arrived.",SJF:"Whenever the CPU is free, the waiting process with the shortest burst time runs next (non-pre-emptive).",MLQ:`Queue 1 (interactive) always goes first, using round robin with a slice of ${q}; queue 2 (batch) only runs when queue 1 is empty, first-come first-served.`}[algo];
    el.querySelector("[data-m]").innerHTML=end?`<b>Finished at time ${R.end}.</b> Average waiting time = <b>${+avg.toFixed(2)}</b>. Context switches between processes: ${R.cs}. Try the same processes with another algorithm and compare.`
      :`<b>Time ${t}:</b> ${snap.cur>=0?`<b>${P[snap.cur].n}</b> is running.`:"the CPU is idle."} ${why}`};
  const run=()=>{R=sim();rows();if(ctl)ctl.set(0);else ctl=alStepper(el.querySelector("[data-ctl]"),()=>R.snaps.length,go,{ms:900,label:(k,n)=>`Time ${R.snaps[k].t} of ${R.end}`})};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-al]");if(!b)return;algo=b.dataset.al;alSegSet(el,"al",algo);run()});
  el.addEventListener("change",e=>{const t=e.target,c=v=>Math.max(+t.min,Math.min(+t.max,Math.round(+v||0)));
    if(t.dataset.pa)P[+t.dataset.pa].a=c(t.value);else if(t.dataset.pb)P[+t.dataset.pb].b=c(t.value);else if(t.dataset.pl)P[+t.dataset.pl].lv=+t.value;else if(t.matches("[data-q]"))q=+t.value;else return;run()});run()};

/* paging and virtual memory */
ALW.paging=function(el){const PR={A:4,B:3,C:4},ORDER=[5,1,6,3,0,7,2,4],COL={A:"info",B:"warn",C:"good"};
  let ram,disk,open,use,clock,swaps,msg,sel;
  const reset=()=>{ram=Array(8).fill(null);disk=[];open=[];use={};clock=0;swaps=0;sel="A";msg="Open a program. Its pages are loaded into whichever frames are free.";draw()};
  const lru=()=>{let best=null;ram.forEach((p,f)=>{if(p&&(best===null||use[p]<use[ram[best]]))best=f});return best};
  const place=(pg)=>{let f=ORDER.find(x=>ram[x]===null);let out="";if(f===undefined){f=lru();const v=ram[f];disk.push(v);swaps++;out=` RAM was full, so <b>${v}</b> (the least recently used page) was swapped out to virtual memory.`}ram[f]=pg;use[pg]=++clock;disk=disk.filter(x=>x!==pg);return {f,out}};
  el.innerHTML=alH("Try it: paging and virtual memory","8 frames of RAM")+`<div class="alctl" data-open></div><div class="alg2"><div class="alpanel"><span class="eyebrow">Physical memory (RAM)</span><div class="alcells" data-ram></div><span class="eyebrow">Virtual memory (on the SSD)</span><div class="alcells" data-disk></div></div>
   <div class="alpanel"><span class="eyebrow" data-pth>Page table</span><div class="alctl" data-sel></div><table class="altab" data-pt></table></div></div>
   <div class="alctl" data-use></div><div class="alstats"><div><b data-sw>0</b><span>pages swapped</span></div></div><p class="almsg" data-m></p><div class="alctl"><button class="btn small" data-thrash>Use every page in turn, 3 times</button><button class="btn small" data-rs>↺ Restart</button></div>`;
  const draw=()=>{el.querySelector("[data-open]").innerHTML=Object.keys(PR).map(k=>open.includes(k)?`<button class="btn small" data-close="${k}">Close program ${k}</button>`:`<button class="btn small primary" data-op="${k}">Open program ${k} (${PR[k]} pages)</button>`).join("");
    const cell=(p,lab)=>p?`<div class="alcell" style="border-color:var(--${COL[p[0]]});background:var(--${COL[p[0]]}-soft)"><small>${lab}</small>${p}</div>`:`<div class="alcell empty"><small>${lab}</small>free</div>`;
    el.querySelector("[data-ram]").innerHTML=ram.map((p,f)=>cell(p,"frame "+f)).join("");
    el.querySelector("[data-disk]").innerHTML=disk.length?disk.map(p=>cell(p,"swap")).join(""):`<span class="alnote">empty</span>`;
    el.querySelector("[data-sel]").innerHTML=open.length?alSeg("ps",open.map(k=>[k,"Program "+k]),sel):"";
    el.querySelector("[data-pt]").innerHTML=open.includes(sel)?`<tr><th>Page</th><th>Where it is</th></tr>`+Array.from({length:PR[sel]},(_,i)=>{const pg=sel+i,f=ram.indexOf(pg);return `<tr><td>${i}</td><td class="${f<0?"bad":""}">${f>=0?"frame "+f:"on disk"}</td></tr>`}).join(""):`<tr><td class="l">Open a program to see its page table.</td></tr>`;
    el.querySelector("[data-use]").innerHTML=open.length?`<span class="alnote">Use a page:</span>`+open.map(k=>Array.from({length:PR[k]},(_,i)=>`<button class="btn small" data-use="${k}${i}">${k}${i}</button>`).join("")).join(""):"";
    el.querySelector("[data-sw]").textContent=swaps;el.querySelector("[data-m]").innerHTML=msg};
  const usePage=pg=>{const f=ram.indexOf(pg);if(f>=0){use[pg]=++clock;msg=`<b>${pg}</b> is in frame ${f}: the page table translates the address straight away.`}else{const r=place(pg);msg=`<b>${pg}</b> wasn't in RAM (a page fault), so it was swapped in from the SSD to frame ${r.f}.${r.out}`}};
  el.addEventListener("click",e=>{const b=e.target;
    if(b.dataset.op){const k=b.dataset.op;open.push(k);sel=k;const sw=[];for(let i=0;i<PR[k];i++){const r=place(k+i);if(r.out)sw.push(r.out.match(/<b>(\w+)<\/b>/)[1])}msg=`Program ${k}'s ${PR[k]} pages were loaded into free frames — not necessarily next to each other. The page table records where each one went.${sw.length?` RAM ran out, so the least recently used page${sw.length>1?"s":""} (<b>${sw.join(", ")}</b>) ${sw.length>1?"were":"was"} swapped out to virtual memory to make room.`:""}`}
    else if(b.dataset.close){const k=b.dataset.close;open=open.filter(x=>x!==k);ram=ram.map(p=>p&&p[0]===k?null:p);disk=disk.filter(p=>p[0]!==k);if(sel===k)sel=open[0]||"A";msg=`Program ${k} closed: its frames are free again.`}
    else if(b.dataset.use)usePage(b.dataset.use);
    else if(b.dataset.ps)sel=b.dataset.ps;
    else if(b.closest("[data-thrash]")){if(!open.length){msg="Open some programs first.";}else{const before=swaps,all=open.flatMap(k=>Array.from({length:PR[k]},(_,i)=>k+i));for(let r=0;r<3;r++)all.forEach(usePage);const n=swaps-before;
      msg=n>all.length?`${all.length} pages needed but only 8 frames: <b>${n} swaps</b> in three passes. Almost every page used has just been swapped out, so the computer spends its time moving pages instead of working. That is <b>disk thrashing</b>. More RAM is the fix.`:n?`${n} swaps. Some pages had to come from the SSD, which is far slower than RAM.`:`No swaps needed: everything fits in RAM.`}}
    else if(b.closest("[data-rs]")){reset();return}else return;draw()});reset()};

/* ======================= 2 Data representation ======================= */

/* an 8-bit register you can click: unsigned, two's complement, fixed point, hexadecimal */
ALW.bits=function(el){let mode=el.dataset.mode||"unsigned",b=alBin(+(el.dataset.v||181)),ip=+(el.dataset.int||4),busy=false;
  const FR={1:"½",2:"¼",3:"⅛",4:"1/16",5:"1/32",6:"1/64",7:"1/128"};
  const pv=()=>Array.from({length:8},(_,i)=>{if(mode==="fixed"){const e=ip-1-i;const v=2**e;return {v:i===0?-v:v,l:i===0?"−"+(e>=0?v:FR[-e]):e>=0?String(v):FR[-e]}}const v=2**(7-i);return {v:mode==="twos"&&i===0?-v:v,l:mode==="twos"&&i===0?"−128":String(v)}});
  const val=()=>pv().reduce((a,p,i)=>a+(b[i]==="1"?p.v:0),0);
  el.innerHTML=alH("Try it: click the bits",mode==="fixed"?"signed fixed point":"8-bit register")+`<div class="alctl">${alSeg("md",[["unsigned","Unsigned"],["hex","Hexadecimal"],["twos","Two's complement"],["fixed","Fixed point"]],mode)}</div>
   <div class="alctl" data-pc><label>Binary point after bit <input type="range" min="1" max="7" value="${ip}" data-ip> <b class="mono" data-ipv></b></label></div>
   <div data-row></div><div class="alstats" data-st></div><p class="almsg" data-m></p>
   <div class="alctl"><label>Set to <input type="text" data-set placeholder="e.g. 45" style="width:7em"></label><button class="btn small" data-do="set">Set</button><button class="btn small" data-do="neg" data-negb>Negate (flip and add 1)</button><button class="btn small" data-do="clr">Clear</button></div>`;
  const draw=(hl)=>{const P=pv(),v=val();el.querySelector("[data-pc]").hidden=mode!=="fixed";el.querySelector("[data-ipv]").textContent=ip+" (" +ip+" whole, "+(8-ip)+" fraction)";
    el.querySelector("[data-negb]").hidden=!(mode==="twos"||mode==="fixed");
    const cells=P.map((p,i)=>`<div class="albit"><small class="${p.v<0?"neg":""}">${p.l}</small><button data-bit="${i}" class="${b[i]==="1"?"on":""}${hl&&hl.includes(i)?" new":""}" aria-label="bit ${i}, worth ${p.l}">${b[i]}</button></div>`);
    if(mode==="fixed")cells.splice(ip,0,`<div class="alpt">.</div>`);
    el.querySelector("[data-row]").innerHTML=`<div class="albits" style="--n:${mode==="fixed"?9:8};${mode==="fixed"?`grid-template-columns:repeat(${ip},minmax(0,1fr)) 18px repeat(${8-ip},minmax(0,1fr))`:""}">${cells.join("")}</div>`
      +(mode==="hex"?`<div class="albits" style="--n:2;margin-top:6px">${[0,1].map(k=>{const n=b.slice(k*4,k*4+4),h=parseInt(n,2).toString(16).toUpperCase();return `<div class="albit"><span class="b on" style="max-width:none;aspect-ratio:auto;padding:8px">${h}</span><small>${n} = ${parseInt(n,2)}</small></div>`}).join("")}</div>`:"");
    const ones=P.filter((p,i)=>b[i]==="1").map(p=>p.l.replace("−","− "));
    const H=parseInt(b,2).toString(16).toUpperCase().padStart(2,"0");
    el.querySelector("[data-st]").innerHTML=`<div><b>${+v.toFixed(7)}</b><span>${mode==="twos"||mode==="fixed"?"signed denary":"denary"}</span></div>${mode==="hex"||mode==="unsigned"?`<div><b>${H}</b><span>hexadecimal</span></div>`:""}<div><b>${alSp(b)}</b><span>binary</span></div>`;
    const P0=P[0].v,lo=mode==="fixed"?P0:mode==="twos"?-128:0,hi=P.reduce((a,p)=>a+(p.v>0?p.v:0),0);
    el.querySelector("[data-m]").innerHTML=(ones.length?`${ones.join(" + ").replace(/\+ − /g,"− ")} = <b>${+v.toFixed(7)}</b>.`:"All bits are 0, so the value is 0.")+" "+
      ({unsigned:"Every bit adds its place value. Range: 0 to 255.",hex:"Each group of 4 bits (a nibble) is one hex digit: 0–9 then A (10) to F (15).",twos:"The top bit is worth −128, so if it's 1 the number is negative. Range: −128 to +127.",
        fixed:`The top bit is negative and the binary point is fixed after ${ip} bit${ip>1?"s":""}. Range: ${lo} to ${+hi.toFixed(7)}, in steps of ${FR[8-ip]||1}.`})[mode]};
  el.addEventListener("click",e=>{const t=e.target.closest("[data-bit],[data-md],[data-do]");if(!t||busy)return;
    if(t.dataset.bit){const i=+t.dataset.bit;b=b.slice(0,i)+(b[i]==="1"?"0":"1")+b.slice(i+1);draw();return}
    if(t.dataset.md){mode=t.dataset.md;alSegSet(el,"md",mode);el.querySelector(".alwh .eyebrow").textContent=mode==="fixed"?"signed fixed point":"8-bit register";draw();return}
    const a=t.dataset.do,m=el.querySelector("[data-m]");
    if(a==="clr"){b="00000000";draw()}
    if(a==="set"){const raw=el.querySelector("[data-set]").value.trim().replace("−","-");let x=Number(raw);const P=pv(),step=Math.abs(P[7].v),lo=mode==="twos"?-128:mode==="fixed"?P[0].v:0,hi=P.reduce((s,p)=>s+(p.v>0?p.v:0),0);
      if(mode==="hex"&&/^[0-9a-f]{1,2}$/i.test(raw))x=parseInt(raw,16);
      if(raw===""||isNaN(x)){m.innerHTML=`Type a ${mode==="hex"?"hex value (e.g. B6) or ":""}number first.`;return}
      if(x<lo||x>hi){m.innerHTML=`<b>${x}</b> is outside the range ${lo} to ${hi}, so it can't be stored. That would be <b>overflow</b>.`;return}
      const n=Math.round(x/step);if(Math.abs(n*step-x)>1e-9){m.innerHTML=`<b>${x}</b> can't be stored exactly: the nearest value is ${+(n*step).toFixed(7)}. That's a limit of precision.`}
      b=alBin(n);draw();return}
    if(a==="neg"){const orig=b,flip=[...b].map(c=>c==="1"?"0":"1").join("");busy=true;b=flip;draw([0,1,2,3,4,5,6,7]);
      el.querySelector("[data-m]").innerHTML=`<b>Step 1: flip every bit.</b> ${alSp(orig)} → ${alSp(flip)}`;
      setTimeout(()=>{if(!alAlive(el))return;const r=alBin(parseInt(flip,2)+1);b=r;busy=false;const ch=[...r].map((c,i)=>c!==flip[i]?i:-1).filter(i=>i>=0);draw(ch);
        el.querySelector("[data-m]").innerHTML+=`<br><b>Step 2: add 1</b> to the last bit. ${alSp(flip)} + 1 = ${alSp(r)}. The value has changed sign: <b>${+val().toFixed(7)}</b>.`+(orig==="10000000"?" (−128 has no positive partner in 8 bits, so negating it gives −128 again.)":"")},alRM()?50:1400)}});
  el.querySelector("[data-ip]").addEventListener("input",e=>{ip=+e.target.value;draw()});draw()};

/* units: convert between binary and decimal prefixes, and count states */
ALW.units=function(el){const U=[["b","bits",1/8],["B","bytes",1],["KiB","kibibytes",2**10],["kB","kilobytes",1e3],["MiB","mebibytes",2**20],["MB","megabytes",1e6],["GiB","gibibytes",2**30],["GB","gigabytes",1e9],["TiB","tebibytes",2**40],["TB","terabytes",1e12]];
  let amt=4,u="GiB",n=8;
  el.innerHTML=alH("Try it: units and prefixes","binary vs decimal")+`<div class="alctl"><label>Amount <input type="number" min="0" step="any" value="${amt}" data-a></label><label>Unit <select data-u>${U.map(([k,nm])=>`<option value="${k}"${k===u?" selected":""}>${k} · ${nm}</option>`).join("")}</select></label></div>
   <div class="tscroll"><table class="altab" data-t></table></div><div data-bar></div>
   <div class="alpanel"><span class="eyebrow">How many states?</span><div class="alctl"><label>Bits <input type="range" min="1" max="32" value="${n}" data-n> <b class="mono" data-nv></b></label></div><div class="albig" data-s></div><div class="alnote" data-sx></div></div>`;
  const fmt=x=>Number.isInteger(x)&&x<1e15?x.toLocaleString("en-GB"):x===0?"0":x>=1e15||x<1e-3?x.toExponential(3).replace("e+"," × 10^").replace("e-"," × 10^-"):(+x.toPrecision(6)).toLocaleString("en-GB",{maximumFractionDigits:6});
  const draw=()=>{const by=amt*U.find(x=>x[0]===u)[2];
    el.querySelector("[data-t]").innerHTML=`<tr><th class="l">Binary (IEC) units</th><th></th><th class="l">Decimal (SI) units</th><th></th></tr>`+[["b","B"],["KiB","kB"],["MiB","MB"],["GiB","GB"],["TiB","TB"]].map(([a,c])=>{const A=U.find(x=>x[0]===a),C=U.find(x=>x[0]===c);
      return `<tr><td class="l">${A[1]} (${a})</td><td>${fmt(by/A[2])}</td><td class="l">${C[1]} (${c})</td><td>${fmt(by/C[2])}</td></tr>`}).join("");
    const pr=[["Ki / k",2**10/1e3],["Mi / M",2**20/1e6],["Gi / G",2**30/1e9],["Ti / T",2**40/1e12]];
    el.querySelector("[data-bar]").innerHTML=`<div class="alnote" style="margin-bottom:4px">How much bigger the binary unit is:</div>`+pr.map(([l,r])=>`<div style="display:grid;grid-template-columns:5em 1fr 4em;gap:8px;align-items:center;margin:3px 0"><span class="mono">${l}</span><div style="height:14px;background:var(--surface);border:1px solid var(--line);border-radius:4px;overflow:hidden"><div style="height:100%;width:${(r-1)*100/0.1*0.95}%;background:var(--accent)"></div></div><span class="mono">+${((r-1)*100).toFixed(1)}%</span></div>`).join("");
    el.querySelector("[data-nv]").textContent=n;el.querySelector("[data-s]").textContent=`2^${n} = ${(2**n).toLocaleString("en-GB")}`;
    el.querySelector("[data-sx]").textContent=`${n} bits can make ${(2**n).toLocaleString("en-GB")} different patterns, from ${"0".repeat(Math.min(n,12))}${n>12?"…":""} to ${"1".repeat(Math.min(n,12))}${n>12?"…":""}. One more bit doubles it.`};
  el.querySelector("[data-a]").addEventListener("input",e=>{amt=Math.max(0,+e.target.value||0);draw()});el.querySelector("[data-u]").addEventListener("change",e=>{u=e.target.value;draw()});
  el.querySelector("[data-n]").addEventListener("input",e=>{n=+e.target.value;draw()});draw()};

/* binary addition and subtraction, one column at a time, with the flags */
ALW.add=function(el){let A=+(el.dataset.a||106),B=+(el.dataset.b||23),op=el.dataset.op||"+",signed=el.dataset.mode==="twos";
  el.innerHTML=alH("Try it: binary addition, column by column","8 bits")+`<div class="alctl"><label>First <input type="number" value="${A}" data-x></label>${alSeg("op",[["+","+"],["-","−"]],op)}<label>Second <input type="number" value="${B}" data-y></label>${alSeg("sg",[["0","Unsigned"],["1","Two's complement"]],signed?"1":"0")}</div>
   <div data-grid></div><div class="alstats" data-fl></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  let S=[],ctl;
  const build=()=>{const lo=signed?-128:0,hi=signed?127:255;A=Math.max(lo,Math.min(hi,A));B=Math.max(lo,Math.min(hi,B));
    const a=alBin(A),bb=alBin(B);let b2=bb,pre=[];
    if(op==="-"){const f=[...bb].map(c=>c==="1"?"0":"1").join("");b2=alBin(parseInt(f,2)+1);pre=[{b:bb,txt:`To subtract, add the <b>negative</b> of the second number. Start with ${alSp(bb)}.`},{b:f,txt:`Flip every bit: ${alSp(f)}.`},{b:b2,txt:`Add 1: ${alSp(b2)}. This is −${B} in two's complement (or, unsigned, 256 − ${B}). Now add.`}]}
    const steps=pre.map(p=>({phase:"neg",bot:p.b,txt:p.txt,res:"",car:"",col:-1}));
    let c=0,res="",car="";
    for(let i=7;i>=0;i--){const x=+a[i],y=+b2[i],s=x+y+c;res=(s%2)+res;const nc=s>1?1:0;
      steps.push({phase:"add",bot:b2,res,car:(nc?"1":" ")+car,col:i,txt:`Column ${7-i+1} (worth ${2**(7-i)}): ${x} + ${y}${c?" + carry 1":""} = ${s} → write <b>${s%2}</b>${nc?", <b>carry 1</b>":""}.`});car=(nc?"1":" ")+car;c=nc}
    const R=parseInt(res,2),sa=alTC(a),sb=alTC(b2),sr=alTC(res);
    const C=op==="+"?c:(A>=0&&B>=0?(A<B?1:0):c),V=(a[0]===b2[0])&&(res[0]!==a[0])?1:0;
    let fin;if(signed){fin=V?`<b>Overflow!</b> Two ${a[0]==="0"?"positive":"negative"} numbers gave a ${res[0]==="1"?"negative":"positive"} result. The true answer, ${op==="+"?A+B:A-B}, is outside −128 to +127, so <b>V = 1</b>.`:`The answer is <b>${sr}</b>${c?" (the carry out of the last column is ignored in two's complement)":""}. ${A} ${op==="+"?"+":"−"} ${B} = ${op==="+"?A+B:A-B} ✓`}
    else fin=op==="+"?(c?`<b>Overflow:</b> ${A} + ${B} = ${A+B}, more than 255, so a 1 is carried out of the 8th bit (C = 1) and the stored result is only ${R}.`:`The answer is <b>${R}</b>. ${A} + ${B} = ${A+B} ✓`)
      :(A<B?`${A} − ${B} is negative, which unsigned binary can't store: the result ${R} is wrong (a borrow, C = 1). Switch to two's complement to see it as ${A-B}.`:`The answer is <b>${R}</b> (ignore the carry out). ${A} − ${B} = ${A-B} ✓`);
    steps.push({phase:"done",bot:b2,res,car,col:-1,txt:fin,flags:{N:+res[0],Z:R===0?1:0,C,V}});return {a,steps}};
  let G;
  const go=k=>{const s=G.steps[k],cell=(ch,i,cls="")=>`<td class="${s.col===i?"chg":""} ${cls}">${ch===" "?"":ch}</td>`;
    const pad=(x)=>x.padStart(8," ");
    el.querySelector("[data-grid]").innerHTML=`<div class="tscroll"><table class="altab" style="max-width:520px;margin:0 auto"><tr><th class="l"></th>${Array.from({length:8},(_,i)=>`<th>${signed&&i===0?"−128":2**(7-i)}</th>`).join("")}</tr>
     <tr><td class="l alnote">carry</td>${[...pad(s.car.slice(1)+" ").slice(-8)].map((c,i)=>`<td style="color:var(--accent);font-weight:700">${c===" "?"":c}</td>`).join("")}</tr>
     <tr><td class="l">${A}</td>${[...G.a].map((c,i)=>cell(c,i)).join("")}</tr>
     <tr><td class="l">${s.phase==="neg"?"":op==="+"?"+ "+B:"+ (−"+B+")"}</td>${[...s.bot].map((c,i)=>cell(c,i,s.phase==="neg"?"ok":"")).join("")}</tr>
     <tr><td class="l"><b>=</b></td>${[...pad(s.res)].map((c,i)=>cell(c,i,"ok")).join("")}</tr></table></div>`;
    el.querySelector("[data-fl]").innerHTML=s.flags?Object.entries(s.flags).map(([k,v])=>`<div><b>${k} = ${v}</b><span>${({N:"negative",Z:"zero",C:"carry",V:"overflow"})[k]}</span></div>`).join(""):"";
    el.querySelector("[data-m]").innerHTML=s.txt};
  const run=()=>{G=build();el.querySelector("[data-x]").value=A;el.querySelector("[data-y]").value=B;if(ctl)ctl.set(0);else ctl=alStepper(el.querySelector("[data-ctl]"),()=>G.steps.length,go,{ms:1400})};
  el.addEventListener("change",e=>{if(e.target.matches("[data-x]"))A=Math.round(+e.target.value||0);else if(e.target.matches("[data-y]"))B=Math.round(+e.target.value||0);else return;run()});
  el.addEventListener("click",e=>{const o=e.target.closest("[data-op]"),g=e.target.closest("[data-sg]");if(o){op=o.dataset.op;alSegSet(el,"op",op);run()}if(g){signed=g.dataset.sg==="1";alSegSet(el,"sg",g.dataset.sg);run()}});run()};

/* shifts: watch the bits slide */
ALW.shift=function(el){let v=+(el.dataset.v||22),kind="LSL",n=1,busy=false;
  el.innerHTML=alH("Try it: shifting bits","logical and arithmetic")+`<div class="alctl"><label>Value (denary) <input type="number" min="-128" max="255" value="${v}" data-v></label>${alSeg("k",[["LSL","Logical left"],["LSR","Logical right"],["ASR","Arithmetic right"]],kind)}<label>Places <select data-n><option>1</option><option>2</option><option>3</option></select></label><button class="btn small primary" data-go>Shift ▶</button></div>
   <div data-row style="overflow:hidden;padding:4px 0"></div><p class="almsg" data-m></p>`;
  const signedView=()=>kind==="ASR"||v<0;
  const show=(b,hl=[],lost=[])=>{el.querySelector("[data-row]").innerHTML=`<div class="albits">${[...b].map((c,i)=>`<div class="albit"><small class="${signedView()&&i===0?"neg":""}">${signedView()&&i===0?"−128":2**(7-i)}</small><span class="b ${c==="1"?"on":""} ${hl.includes(i)?"new":""} ${lost.includes(i)?"lost":""}" data-c="${i}">${c}</span></div>`).join("")}</div>`};
  const cur=()=>alBin(v),denary=b=>signedView()?alTC(b):parseInt(b,2);
  const draw=()=>{show(cur());el.querySelector("[data-m]").innerHTML=`${alSp(cur())} = <b>${denary(cur())}</b>. Choose a shift and press Shift.`};
  const go=()=>{if(busy)return;const b=cur();let r;
    if(kind==="LSL")r=(b+"0".repeat(n)).slice(n);else if(kind==="LSR")r=("0".repeat(n)+b).slice(0,8);else r=(b[0].repeat(n)+b).slice(0,8);
    const lost=kind==="LSL"?Array.from({length:n},(_,i)=>i):Array.from({length:n},(_,i)=>7-i);busy=true;show(b,[],lost);
    const dx=(kind==="LSL"?-1:1)*n;el.querySelectorAll("[data-c]").forEach(s=>{s.style.transition=alRM()?"none":"transform .55s ease, opacity .55s";s.style.transform=`translateX(calc(${dx*100}% + ${dx*5}px))`;if(lost.includes(+s.dataset.c))s.style.opacity="0"});
    setTimeout(()=>{if(!alAlive(el))return;busy=false;const before=denary(b);v=signedView()?alTC(r):parseInt(r,2);const hl=kind==="LSL"?Array.from({length:n},(_,i)=>7-i):Array.from({length:n},(_,i)=>i);show(r,hl);
      const lostOnes=lost.some(i=>b[i]==="1"),after=denary(r);
      const txt={LSL:`Every bit moved ${n} place${n>1?"s":""} left and 0s filled the gap on the right. That multiplies by ${2**n}: ${before} × ${2**n} = ${before*2**n}${after!==before*2**n?` — <b>but a 1 fell off the left</b>, so the result is ${after}. That's overflow.`:"."}`,
        LSR:`Every bit moved ${n} place${n>1?"s":""} right and 0s filled the gap on the left. That divides by ${2**n}, rounding down: ${parseInt(b,2)} ÷ ${2**n} → ${after}${lostOnes?" (the 1s that fell off the right were the remainder)":""}.${b[0]==="1"?" As a signed number this would be wrong: the sign bit became 0. Use an arithmetic shift for signed values.":""}`,
        ASR:`Every bit moved ${n} place${n>1?"s":""} right, and the <b>sign bit was copied</b> into the gap, so the sign is kept: ${before} ÷ ${2**n} → ${after} (rounding down).`}[kind];
      el.querySelector("[data-m]").innerHTML=`${alSp(b)} → <b>${alSp(r)}</b>. ${txt}`;el.querySelector("[data-v]").value=v},alRM()?30:600)};
  el.addEventListener("click",e=>{const k=e.target.closest("[data-k]");if(k){kind=k.dataset.k;alSegSet(el,"k",kind);draw()}if(e.target.closest("[data-go]"))go()});
  el.querySelector("[data-v]").addEventListener("change",e=>{v=Math.max(-128,Math.min(255,Math.round(+e.target.value||0)));e.target.value=v;draw()});el.querySelector("[data-n]").addEventListener("change",e=>{n=+e.target.value});draw()};

/* bit masks: AND, OR and XOR */
ALW.mask=function(el){let v="11001010",m="00001111",op="AND";
  const PRE=[["Check bit 3","00001000","AND","AND with a single 1 picks out one bit: a non-zero result means that bit is set."],["Clear the top nibble","00001111","AND","AND with 0 clears a bit; AND with 1 keeps it."],["Set bits 0 and 2","00000101","OR","OR with 1 sets a bit; OR with 0 leaves it alone."],["Flip every bit","11111111","XOR","XOR with 1 flips a bit; XOR with 0 leaves it alone."]];
  el.innerHTML=alH("Try it: bit masks","click any bit")+`<div class="alctl">${PRE.map((p,i)=>`<button class="btn small" data-p="${i}">${p[0]}</button>`).join("")}</div><div class="alctl">${alSeg("op",[["AND","AND"],["OR","OR"],["XOR","XOR"]],op)}</div><div data-rows></div><p class="almsg" data-m></p>`;
  const calc=()=>[...v].map((c,i)=>{const a=+c,b=+m[i];return String(op==="AND"?a&b:op==="OR"?a|b:a^b)}).join("");
  const row=(lab,b,key,cls)=>`<div class="almrow"><b>${lab}</b><div class="albits">${[...b].map((c,i)=>`<div class="albit">${key?`<button data-${key}="${i}" class="${c==="1"?"on":""}">${c}</button>`:`<span class="b ${c==="1"?"on":""} ${cls&&cls[i]?"diff":""}">${c}</span>`}</div>`).join("")}</div><span class="mono">${parseInt(b,2)}</span></div>`;
  let note="";const draw=()=>{const r=calc(),chg=[...r].map((c,i)=>c!==v[i]);
    el.querySelector("[data-rows]").innerHTML=row("Value",v,"vb")+row(op==="AND"?"AND":op==="OR"?"OR":"XOR",m,"mb")+`<div style="border-top:2px solid var(--ink);margin:4px 0 0"></div>`+row("Result",r,null,chg);
    const k=chg.filter(Boolean).length;el.querySelector("[data-m]").innerHTML=(note?note+" ":"")+({AND:"AND gives 1 only where both bits are 1. Where the mask is 0 the bit is cleared.",OR:"OR gives 1 where either bit is 1. Where the mask is 1 the bit is set.",XOR:"XOR gives 1 where the bits differ. Where the mask is 1 the bit is flipped."})[op]+` ${k?`${k} bit${k>1?"s":""} changed (outlined).`:"No bits changed."}`+(m.split("1").length===2&&op==="AND"?` Result ${parseInt(r,2)?"is not zero, so the bit <b>is set</b>":"is zero, so the bit <b>is clear</b>"}.`:"")};
  el.addEventListener("click",e=>{const t=e.target.closest("[data-vb],[data-mb],[data-op],[data-p]");if(!t)return;note="";
    if(t.dataset.vb){const i=+t.dataset.vb;v=v.slice(0,i)+(v[i]==="1"?"0":"1")+v.slice(i+1)}
    else if(t.dataset.mb){const i=+t.dataset.mb;m=m.slice(0,i)+(m[i]==="1"?"0":"1")+m.slice(i+1)}
    else if(t.dataset.op){op=t.dataset.op}
    else{const p=PRE[+t.dataset.p];m=p[1];op=p[2];note=`<b>${p[0]}:</b> ${p[3]}`}
    alSegSet(el,"op",op);draw()});draw()};

/* text: code points and UTF-8 bytes */
ALW.utf8=function(el){let txt=el.dataset.text||"Hi é€😀";
  el.innerHTML=alH("Try it: how text is stored","ASCII and UTF-8")+`<div class="alctl"><label>Text <input type="text" value="${txt}" data-t style="width:14em"></label><span class="alnote">Try letters, accents, other alphabets or emoji.</span></div><div class="tscroll"><table class="altab" data-tab></table></div><div class="alstats" data-st></div>`;
  const enc=cp=>{const b=[...new TextEncoder().encode(String.fromCodePoint(cp))];return b.map(x=>x.toString(2).padStart(8,"0"))};
  const pretty=(bytes)=>{const n=bytes.length;return bytes.map((b,i)=>{const p=i===0?(n===1?1:n+1):2;return `<b style="color:var(--warn)">${b.slice(0,p)}</b>${b.slice(p)}`}).join(" ")};
  const draw=()=>{const cps=[...txt].slice(0,16).map(c=>c.codePointAt(0));
    el.querySelector("[data-tab]").innerHTML=`<tr><th>Character</th><th>Code point</th><th>ASCII (7 bits)</th><th class="l">UTF-8 bytes (prefix bits highlighted)</th><th>Bytes</th></tr>`+cps.map(cp=>{const ch=String.fromCodePoint(cp),e=enc(cp);
      return `<tr><td style="font-size:1.2em">${ch===" "?"␣":ch.replace(/[<>&]/g,c=>({"<":"&lt;",">":"&gt;","&":"&amp;"})[c])}</td><td>U+${cp.toString(16).toUpperCase().padStart(4,"0")}<br><small>${cp}</small></td><td class="${cp<128?"ok":"bad"}">${cp<128?cp.toString(2).padStart(7,"0"):"not in ASCII"}</td><td class="l mono" style="font-size:.85em">${pretty(e)}</td><td>${e.length}</td></tr>`}).join("");
    const u8=cps.reduce((a,cp)=>a+enc(cp).length,0),miss=cps.filter(cp=>cp>127).length;
    el.querySelector("[data-st]").innerHTML=`<div><b>${cps.length}</b><span>characters</span></div><div><b>${miss?"✗ "+miss+" missing":cps.length+" bytes"}</b><span>ASCII</span></div><div><b>${u8} bytes</b><span>UTF-8</span></div><div><b>${cps.length*4} bytes</b><span>if every character took 4 bytes</span></div>`};
  el.querySelector("[data-t]").addEventListener("input",e=>{txt=e.target.value;draw()});draw()};

/* ======================= 3 Networks and encryption ======================= */

/* a switch delivers frames by MAC address; a router forwards packets by IP address */
ALW.lan=function(el){const M=alId("ln");let W=600,raf=null,table={},fw=true;
  const D={A:{n:"Laptop A",mac:"3C:22:A1",ip:"192.168.1.10"},B:{n:"Laptop B",mac:"7E:9B:04",ip:"192.168.1.11"},P:{n:"Printer",mac:"D0:15:6F",ip:"192.168.1.20"},S:{n:"Phone",mac:"A8:40:C2",ip:"192.168.1.12"}};
  const pos=()=>W>400?{A:[70,60],B:[70,200],P:[250,270],S:[250,30],SW:[250,150],R:[430,150],NET:[555,150]}:{A:[50,60],B:[50,200],P:[170,272],S:[170,28],SW:[170,150],R:[290,150],NET:[290,272]};
  el.innerHTML=alH("Try it: switches and routers","frames and packets")+`<div class="alctl"><label>From <select data-f>${Object.entries(D).map(([k,d])=>`<option value="${k}">${d.n}</option>`).join("")}</select></label><label>To <select data-t>${Object.entries(D).map(([k,d])=>`<option value="${k}"${k==="P"?" selected":""}>${d.n}</option>`).join("")}<option value="NET">a website on the internet</option></select></label><button class="btn small primary" data-go>Send ▶</button></div>
   <div class="alctl"><button class="btn small" data-in>Unrequested traffic arrives from the internet</button><label><input type="checkbox" data-fw checked> Router firewall on</label><button class="btn small" data-clr>Clear the switch's table</button></div>
   <div class="alg2"><div data-svg></div><div class="alpanel"><span class="eyebrow">Switch's MAC address table</span><table class="altab" data-mt></table></div></div><p class="almsg" data-m>The switch starts knowing nothing. Send a frame and watch it learn.</p>`;
  const paint=w=>{W=w;const P=pos(),box=(k,x,y,lab,sub,cls="b")=>`<g data-n="${k}"><rect x="${x-46}" y="${y-22}" width="92" height="44" rx="8" class="${cls}"/><text x="${x}" y="${y-2}" class="t c" style="font-size:13px">${lab}</text><text x="${x}" y="${y+14}" class="s c" style="font-size:10.5px">${sub}</text></g>`;
    const line=(a,b)=>`<line x1="${P[a][0]}" y1="${P[a][1]}" x2="${P[b][0]}" y2="${P[b][1]}" class="l" stroke-width="2.5"/>`;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 300" role="img" aria-label="Four devices connected to a switch, which connects to a router and the internet">${["A","B","P","S","R"].map(k=>line(k,"SW")).join("")}${line("R","NET")}
     ${Object.entries(D).map(([k,d])=>box(k,P[k][0],P[k][1],d.n,d.mac)).join("")}${box("SW",P.SW[0],P.SW[1],"Switch","MAC addresses","b2")}${box("R",P.R[0],P.R[1],"Router","IP addresses","bi")}
     <g><ellipse cx="${P.NET[0]}" cy="${P.NET[1]}" rx="${W>400?44:40}" ry="26" class="b3"/><text x="${P.NET[0]}" y="${P.NET[1]+5}" class="t c" style="font-size:13px">Internet</text></g><g data-dot></g><g data-x></g></svg>`};
  const mt=()=>{el.querySelector("[data-mt]").innerHTML=`<tr><th>Port</th><th>MAC address</th></tr>`+(Object.keys(table).length?Object.entries(table).map(([k,mac])=>`<tr><td>${({A:1,B:2,P:3,S:4,R:5})[k]}</td><td>${mac}</td></tr>`).join(""):`<tr><td colspan="2" class="l alnote">empty</td></tr>`)};
  const anim=(paths,label,done)=>{cancelAnimationFrame(raf);const P=pos(),segs=paths.map(p=>p.map(k=>P[k])),t0=performance.now(),dur=alRM()?1:1500;
    const frame=now=>{if(!alAlive(el))return;const t=Math.max(0,Math.min(1,(now-t0)/dur));
      el.querySelector("[data-dot]").innerHTML=segs.map(pts=>{const n=pts.length-1,f=t*n,i=Math.min(n-1,Math.floor(f)),u=f-i,x=pts[i][0]+(pts[i+1][0]-pts[i][0])*u,y=pts[i][1]+(pts[i+1][1]-pts[i][1])*u;return `<rect x="${x-24}" y="${y-11}" width="48" height="22" rx="11" class="bw"/><text x="${x}" y="${y+4}" class="s c" style="font-size:10.5px;fill:var(--ink)">${label}</text>`}).join("");
      if(t<1)raf=requestAnimationFrame(frame);else{el.querySelector("[data-dot]").innerHTML="";done&&done()}};raf=requestAnimationFrame(frame)};
  const send=()=>{const f=el.querySelector("[data-f]").value,t=el.querySelector("[data-t]").value,m=el.querySelector("[data-m]");if(f===t){m.textContent="Choose two different devices.";return}
    const knew=t!=="NET"&&table[t];table[f]=D[f].mac;mt();
    if(t==="NET"){anim([[f,"SW","R","NET"]],"packet",()=>{m.innerHTML=`${D[f].n} sends the frame to the router's MAC address, because the website isn't on the local network. The switch delivers it to the router's port. The <b>router</b> reads the destination <b>IP address</b> and forwards the packet out to the internet, towards the network that address belongs to. (The switch also learned that ${D[f].mac} is on port ${({A:1,B:2,P:3,S:4})[f]}.)`});return}
    if(knew)anim([[f,"SW",t]],"frame",()=>{m.innerHTML=`The switch looked up <b>${D[t].mac}</b> in its table and sent the frame <b>only</b> to ${D[t].n}. The other devices never see it.`});
    else anim(Object.keys(D).filter(k=>k!==f).map(k=>[f,"SW",k]).concat([[f,"SW","R"]]),"frame",()=>{table[t]=table[t];m.innerHTML=`The switch learned that <b>${D[f].mac}</b> is on port ${({A:1,B:2,P:3,S:4})[f]}. It didn't yet know where <b>${D[t].mac}</b> was, so this once it sent the frame out of every port; only ${D[t].n} accepts it. When ${D[t].n} replies, the switch learns its port too. Send again to see the difference.`;table[t]=D[t].mac;mt()})};
  const incoming=()=>{const m=el.querySelector("[data-m]");fw=el.querySelector("[data-fw]").checked;
    if(fw){anim([["NET","R"]],"attack",()=>{m.className="almsg good";m.innerHTML=`The <b>firewall</b> in the router checked the incoming traffic against its rules. Nobody inside asked for it, so it was <b>blocked</b> before it reached any device.`})}
    else anim([["NET","R","SW","A"],["NET","R","SW","P"]],"attack",()=>{m.className="almsg bad";m.innerHTML=`With the firewall off, unrequested traffic from the internet reaches devices on the network. A hardware firewall protects every device at once; a software firewall protects the device it's installed on.`})};
  el.addEventListener("click",e=>{const m=el.querySelector("[data-m]");if(e.target.closest("[data-go]")){m.className="almsg";send()}if(e.target.closest("[data-in]"))incoming();if(e.target.closest("[data-clr]")){table={};mt();m.className="almsg";m.textContent="The switch's table is empty again."}});
  alResp(el,paint);mt()};

/* bandwidth vs latency */
ALW.bw=function(el){const C=[["Fibre broadband",500,8],["4G mobile",40,45],["Satellite",150,600]];
  const T=[["Download a 2 GB game",2000,1,"Big transfers depend mostly on <b>bandwidth</b>: the satellite's long delay hardly matters."],["Load a web page (3 MB, 25 round trips)",3,25,"A web page needs many small requests and replies, so <b>latency</b> adds up quickly."],["One move in an online game (tiny, needs a reply)",0.001,1,"Tiny messages that need an instant reply depend almost entirely on <b>latency</b>."]];
  let t=0;
  el.innerHTML=alH("Try it: bandwidth vs latency","time = delay + size ÷ rate")+`<div class="alctl">${alSeg("t",T.map((x,i)=>[i,x[0]]),0)}</div><div data-rows style="display:flex;flex-direction:column;gap:10px"></div><p class="almsg" data-m></p>`;
  const human=s=>s<1?`${Math.round(s*1000)} ms`:s<120?`${s.toFixed(1)} s`:`${(s/60).toFixed(1)} min`;
  const draw=()=>{const [nm,mb,rt]=T[t];const R=C.map(([n,mbps,ms])=>{const lat=rt*ms/1000,xfer=mb*8/mbps;return {n,mbps,ms,lat,xfer,tot:lat+xfer}}),mx=Math.max(...R.map(r=>r.tot));
    el.querySelector("[data-rows]").innerHTML=R.map(r=>`<div><div style="display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap"><b>${r.n}</b><span class="alnote">${r.mbps} Mbps · ${r.ms} ms latency</span></div>
      <div style="display:flex;height:28px;background:var(--surface);border:1px solid var(--line);border-radius:6px;overflow:hidden;margin-top:4px"><div title="waiting (latency)" style="width:${r.lat/mx*100}%;background:var(--warn-soft);border-right:${r.lat?"2px solid var(--warn)":"0"}"></div><div title="transferring" style="width:${r.xfer/mx*100}%;background:var(--info-soft)"></div></div>
      <div class="alnote mono">${human(r.lat)} waiting + ${human(r.xfer)} transferring = <b>${human(r.tot)}</b></div></div>`).join("")+`<div class="alctl"><span class="alkey"><i style="background:var(--warn-soft);border:1px solid var(--warn)"></i>latency (waiting for replies)</span><span class="alkey"><i style="background:var(--info-soft);border:1px solid var(--info)"></i>transfer (size ÷ bandwidth)</span></div>`;
    el.querySelector("[data-m]").innerHTML=T[t][3]};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-t]");if(!b)return;t=+b.dataset.t;alSegSet(el,"t",t);draw()});draw()};

/* IP addresses, subnet masks and network addresses */
ALW.subnet=function(el){let ip=el.dataset.ip||"192.168.1.20",pre=24,ip2="192.168.1.77";
  el.innerHTML=alH("Try it: network and host parts","IPv4")+`<div class="alctl"><label>IP address <input type="text" value="${ip}" data-ip style="width:10em"></label><label>Network bits <input type="range" min="8" max="30" value="${pre}" data-p> <b class="mono" data-pv></b></label></div>
   <div class="tscroll" data-bits></div><div class="alstats" data-st></div><div class="alctl"><label>Is this on the same network? <input type="text" value="${ip2}" data-ip2 style="width:10em"></label></div><p class="almsg" data-m></p>`;
  const parse=s=>{const p=s.trim().split(".").map(Number);return p.length===4&&p.every(x=>Number.isInteger(x)&&x>=0&&x<=255)?p:null};
  const toB=p=>p.map(x=>alBin(x)).join(""),toD=b=>[0,1,2,3].map(i=>parseInt(b.slice(i*8,i*8+8),2)).join(".");
  const draw=()=>{const P=parse(ip),m=el.querySelector("[data-m]");el.querySelector("[data-pv]").textContent="/"+pre;
    if(!P){el.querySelector("[data-bits]").innerHTML="";el.querySelector("[data-st]").innerHTML="";m.className="almsg bad";m.textContent="That isn't a valid IPv4 address: four numbers from 0 to 255 separated by dots.";return}
    const b=toB(P),mk="1".repeat(pre)+"0".repeat(32-pre),net=[...b].map((c,i)=>mk[i]==="1"?c:"0").join(""),bc=[...b].map((c,i)=>mk[i]==="1"?c:"1").join("");
    const row=(lab,bits,d)=>`<tr><td class="l"><b>${lab}</b></td>${[...bits].map((c,i)=>`<td style="padding:3px 1px;${i%8===0&&i?"border-left:3px solid var(--ink);":""}background:${mk[i]==="1"?"var(--accent-soft)":"var(--surface)"};font-size:.78rem">${c}</td>`).join("")}<td class="l mono">${d}</td></tr>`;
    el.querySelector("[data-bits]").innerHTML=`<table class="altab" style="min-width:640px">${row("IP address",b,P.join("."))}${row("Mask",mk,toD(mk))}${row("AND → network",net,toD(net))}</table>`;
    el.querySelector("[data-st]").innerHTML=`<div><b>${toD(net)}</b><span>network address</span></div><div><b>${toD(bc)}</b><span>broadcast address</span></div><div><b>${(2**(32-pre)-2).toLocaleString("en-GB")}</b><span>usable host addresses (2<sup>${32-pre}</sup> − 2)</span></div>`;
    const Q=parse(ip2);if(!Q){m.className="almsg";m.innerHTML=`Shaded bits are the <b>network part</b> (mask bits = 1); the rest are the <b>host part</b>. Type a second address to compare.`;return}
    const same=toB(Q).slice(0,pre)===b.slice(0,pre);m.className="almsg "+(same?"good":"warn");
    m.innerHTML=`Shaded bits are the <b>network part</b>; the rest identify the host. ${Q.join(".")} AND ${toD(mk)} = ${toD([...toB(Q)].map((c,i)=>mk[i]==="1"?c:"0").join(""))}. ${same?"Same network address, so the two devices are on the <b>same network</b> and can talk directly through a switch.":"Different network address, so traffic between them must go through a <b>router</b>."}`};
  el.querySelector("[data-ip]").addEventListener("input",e=>{ip=e.target.value;draw()});el.querySelector("[data-ip2]").addEventListener("input",e=>{ip2=e.target.value;draw()});el.querySelector("[data-p]").addEventListener("input",e=>{pre=+e.target.value;draw()});draw()};

/* symmetric vs asymmetric encryption, as a story with an eavesdropper */
ALW.keys=function(el){let mode="sym",W=600;
  const KEY=(x,y,cls,lab)=>`<g><circle cx="${x}" cy="${y}" r="9" class="${cls}"/><rect x="${x+8}" y="${y-3}" width="22" height="6" class="${cls}"/><rect x="${x+22}" y="${y+3}" width="4" height="6" class="${cls}"/><text x="${x+10}" y="${y+24}" class="s c">${lab}</text></g>`;
  const S={sym:[
    {txt:"Ana wants to send Ben a private message. With <b>symmetric</b> encryption they must both have the <b>same secret key</b>.",ak:"shared key",bk:"",ek:"",msg:null},
    {txt:"Ana has to get the key to Ben first. If she sends it over the network, <b>Eve can copy it</b> on the way. This is the <b>key exchange problem</b>.",ak:"shared key",bk:"shared key",ek:"shared key",msg:{lab:"key",cls:"bw",at:.5}},
    {txt:"Ana encrypts her message with the shared key. <span class='mono'>Meet at 4</span> becomes <span class='mono'>X7#qL9!e2</span>.",ak:"shared key",bk:"shared key",ek:"shared key",msg:{lab:"X7#qL9!e2",cls:"bb",at:0}},
    {txt:"The ciphertext crosses the network. Eve copies it — and because she copied the key earlier, <b>she can decrypt it</b>. Symmetric encryption is only as safe as the way the key was shared.",ak:"shared key",bk:"shared key",ek:"shared key",msg:{lab:"X7#qL9!e2",cls:"bb",at:.5},eve:"Meet at 4"},
    {txt:"Ben decrypts it with the same key. Symmetric encryption is <b>fast</b>, so it's used for most data — once the key has been exchanged safely.",ak:"shared key",bk:"shared key",ek:"shared key",msg:{lab:"Meet at 4",cls:"bg",at:1}}],
   asym:[
    {txt:"With <b>asymmetric</b> encryption, Ben makes a <b>key pair</b>: a <b>public key</b> he can give to anyone, and a <b>private key</b> he never shares.",ak:"",bk:"pair",ek:"",msg:null},
    {txt:"Ben sends his public key openly. Eve copies it. <b>That doesn't matter</b>: the public key can only lock (encrypt), not unlock.",ak:"Ben's public",bk:"pair",ek:"Ben's public",msg:{lab:"public key",cls:"bg",at:.5}},
    {txt:"Ana encrypts her message with <b>Ben's public key</b>. Now only Ben's private key can decrypt it — not even Ana can.",ak:"Ben's public",bk:"pair",ek:"Ben's public",msg:{lab:"Q2&zR8%k",cls:"bb",at:0}},
    {txt:"Eve copies the ciphertext, but she only has the public key, so it stays unreadable. <b>No secret was ever sent across the network.</b>",ak:"Ben's public",bk:"pair",ek:"Ben's public",msg:{lab:"Q2&zR8%k",cls:"bb",at:.5},eve:"???"},
    {txt:"Ben decrypts it with his <b>private key</b>. Asymmetric encryption is slower, so in practice (e.g. HTTPS) it's used to share a symmetric key safely, and the data is then sent with fast symmetric encryption.",ak:"Ben's public",bk:"pair",ek:"Ben's public",msg:{lab:"Meet at 4",cls:"bg",at:1}}]};
  el.innerHTML=alH("Try it: sharing a secret","Ana, Ben and Eve")+`<div class="alctl">${alSeg("md",[["sym","Symmetric"],["asym","Asymmetric"]],mode)}</div><div data-svg></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  let ctl,K=0;
  const go=k=>{K=k;const s=S[mode][k],n=W<400,ax=n?50:80,bx=W-(n?50:80),ex=W/2;
    const keyset=(x,v,who)=>v==="pair"?KEY(x-30,112,"bg","public")+KEY(x+6,112,"bb","private"):v?KEY(x-14,112,v.includes("public")?"bg":"bw",v):"";
    const mx=s.msg?ax+(bx-ax)*s.msg.at:0,mw=Math.max(70,s.msg?s.msg.lab.length*9+16:0);
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 250" role="img" aria-label="Ana sends a message to Ben while Eve listens">
     <circle cx="${ax}" cy="40" r="22" class="b2"/><text x="${ax}" y="46" class="t c">Ana</text><circle cx="${bx}" cy="40" r="22" class="b2"/><text x="${bx}" y="46" class="t c">Ben</text>
     <line x1="${ax+24}" y1="40" x2="${bx-24}" y2="40" class="ld"/><text x="${ex}" y="30" class="s c">the internet</text>
     <circle cx="${ex}" cy="195" r="22" class="bb"/><text x="${ex}" y="201" class="t c">Eve</text><line x1="${ex}" y1="44" x2="${ex}" y2="172" class="ld"/><text x="${ex+30}" y="200" class="s">${s.eve?"reads: "+s.eve:"listening"}</text>
     ${keyset(ax,s.ak)}${keyset(bx,s.bk)}${s.ek?KEY(ex-104,190,s.ek.includes("public")?"bg":"bw",s.ek):""}
     ${s.msg?`<rect x="${Math.max(4,Math.min(W-mw-4,mx-mw/2))}" y="54" width="${mw}" height="28" rx="6" class="${s.msg.cls}"/><text x="${Math.max(4+mw/2,Math.min(W-mw/2-4,mx))}" y="73" class="v c">${s.msg.lab}</text>`:""}</svg>`;
    el.querySelector("[data-m]").innerHTML=s.txt};
  alResp(el,w=>{W=w;go(K)});ctl=alStepper(el.querySelector("[data-ctl]"),()=>S[mode].length,go,{ms:3200});
  el.addEventListener("click",e=>{const b=e.target.closest("[data-md]");if(!b)return;mode=b.dataset.md;alSegSet(el,"md",mode);ctl.set(0)})};

/* monoalphabetic substitution and frequency analysis */
ALW.subst=function(el){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ",ENG="ETAOINSHRDLU";
  const TEXT="THE CENTRAL PROCESSING UNIT FETCHES EACH INSTRUCTION FROM MAIN MEMORY THEN THE CONTROL UNIT DECODES IT AND THE INSTRUCTION IS EXECUTED THE PROGRAM COUNTER THEN POINTS TO THE NEXT INSTRUCTION SO THE CYCLE REPEATS MANY MILLIONS OF TIMES EVERY SECOND WHILE THE COMPUTER IS SWITCHED ON";
  let key=[...A],pt="CACHE",guess=0;const shuffle=()=>{key=[...A];for(let i=25;i>0;i--){const j=Math.floor(Math.random()*(i+1));[key[i],key[j]]=[key[j],key[i]]}guess=0};shuffle();
  const enc=s=>[...s.toUpperCase()].map(c=>{const i=A.indexOf(c);return i<0?c:key[i]}).join("");
  el.innerHTML=alH("Try it: substitution and frequency analysis","monoalphabetic cipher")+`<div class="alctl"><button class="btn small" data-new>New random key</button><span class="alnote">26! ≈ 4 × 10<sup>26</sup> possible keys</span></div><div class="tscroll" data-k></div>
   <div class="alctl"><label>Plaintext <input type="text" value="${pt}" data-pt style="width:12em"></label><b>→</b><span class="albig" data-ct></span></div>
   <div class="alpanel"><span class="eyebrow">Frequency analysis on a longer ciphertext</span><div data-fq></div><div class="alctl"><button class="btn small primary" data-g>Guess the next most common letter</button><button class="btn small" data-g0>Start again</button></div><p class="alout" data-txt style="white-space:normal;word-break:break-word"></p></div><p class="almsg" data-m></p>`;
  const draw=()=>{el.querySelector("[data-k]").innerHTML=`<table class="altab subtab"><tr><th>Plain</th>${A.split("").map(c=>`<td>${c}</td>`).join("")}</tr><tr><th>Cipher</th>${key.map(c=>`<td><b>${c}</b></td>`).join("")}</tr></table>`;
    el.querySelector("[data-ct]").textContent=enc(pt)||"…";
    const ct=enc(TEXT),cnt={};[...ct].forEach(c=>{if(A.includes(c))cnt[c]=(cnt[c]||0)+1});const top=Object.entries(cnt).sort((a,b)=>b[1]-a[1]).slice(0,12),mx=top[0][1];
    const map={};top.slice(0,guess).forEach(([c],i)=>map[c]=ENG[i]);
    el.querySelector("[data-fq]").innerHTML=`<div style="display:flex;gap:4px;align-items:flex-end;height:110px">${top.map(([c,n],i)=>`<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:100%"><span class="mono" style="font-size:.7rem">${n}</span><div style="width:100%;height:${n/mx*70}%;background:${i<guess?"var(--accent)":"var(--info-soft)"};border:1px solid var(--info);border-radius:4px 4px 0 0"></div><b class="mono">${c}</b><span class="mono alnote">${i<guess?"→"+ENG[i]:"&nbsp;"}</span></div>`).join("")}</div><div class="alnote">Most common letters in English: ${ENG.split("").join(" ")}</div>`;
    el.querySelector("[data-txt]").innerHTML=[...ct].map(c=>map[c]?`<b style="color:#7FE0C8">${map[c]}</b>`:c===" "?" ":c).join("");
    const right=top.slice(0,guess).filter(([c],i)=>A[key.indexOf(c)]===ENG[i]).length;
    el.querySelector("[data-m]").innerHTML=guess?`${guess} guess${guess>1?"es":""} made, ${right} correct. Even when a guess is wrong, the partly decrypted words (like <b>TH_</b>) show how to fix it. Because each letter always becomes the same cipher letter, the language's letter frequencies leak through — that's why this cipher is weak despite the huge number of keys.`:"Each plaintext letter always becomes the same ciphertext letter. Press the button to match the most common cipher letters with the most common English letters."};
  el.addEventListener("click",e=>{if(e.target.closest("[data-new]"))shuffle();else if(e.target.closest("[data-g]"))guess=Math.min(12,guess+1);else if(e.target.closest("[data-g0]"))guess=0;else return;draw()});
  el.querySelector("[data-pt]").addEventListener("input",e=>{pt=e.target.value;draw()});draw()};

/* the Vernam cipher: XOR each bit with a one-time pad */
ALW.vernam=function(el){let msg="HI",msg2="NO",key=[],reuse=false;const newKey=()=>{key=Array.from({length:8},()=>Math.floor(Math.random()*256))};newKey();
  el.innerHTML=alH("Try it: the Vernam cipher","XOR with a one-time pad")+`<div class="alctl"><label>Message <input type="text" maxlength="6" value="${msg}" data-m1 style="width:7em"></label><button class="btn small" data-nk>New random key</button><label><input type="checkbox" data-r> Reuse the key for a second message</label><label data-m2l hidden>Second message <input type="text" maxlength="6" value="${msg2}" data-m2 style="width:7em"></label></div>
   <div class="tscroll" data-t></div><p class="almsg" data-x></p>`;
  const row=(lab,arr,cls="")=>`<tr><td class="l"><b>${lab}</b></td>${arr.map(v=>`<td class="${cls}"><span class="mono">${alSp(alBin(v))}</span></td>`).join("")}</tr>`;
  const draw=()=>{const P=[...msg].map(c=>c.charCodeAt(0)&255),K=key.slice(0,P.length),C=P.map((p,i)=>p^K[i]);
    let h=`<table class="altab"><tr><th></th>${[...msg].map(c=>`<th>${c===" "?"␣":c}</th>`).join("")}</tr>${row("Plaintext",P)}${row("Key (random)",K,"")}${row("Ciphertext = P XOR K",C,"chg")}${row("Ciphertext XOR K",C.map((c,i)=>c^K[i]),"ok")}<tr><td class="l">decrypted</td>${C.map((c,i)=>`<td><b>${String.fromCharCode(c^K[i])}</b></td>`).join("")}</tr></table>`;
    let x=`XOR gives 1 where the bits differ. Encrypting and decrypting are the same operation: XOR with the key twice gives back the original, because a XOR k XOR k = a. With a truly random key, used once, as long as the message and kept secret, the ciphertext gives away nothing at all.`;
    if(reuse){const P2=[...msg2.padEnd(msg.length," ")].slice(0,P.length).map(c=>c.charCodeAt(0)&255),C2=P2.map((p,i)=>p^K[i]),X=C.map((c,i)=>c^C2[i]);
      h+=`<table class="altab" style="margin-top:8px"><tr><th></th>${P2.map(v=>`<th>${String.fromCharCode(v)}</th>`).join("")}</tr>${row("Second ciphertext",C2)}${row("Cipher 1 XOR cipher 2",X,"bad")}${row("Plain 1 XOR plain 2",P.map((p,i)=>p^P2[i]),"bad")}</table>`;
      x=`<b>Why the key must never be reused:</b> an eavesdropper who XORs the two ciphertexts gets exactly the same bits as XORing the two plaintexts — the key cancels out. Patterns in the messages then leak, and guessing one message reveals the other.`}
    el.querySelector("[data-t]").innerHTML=h;el.querySelector("[data-x]").innerHTML=x};
  el.addEventListener("input",e=>{if(e.target.matches("[data-m1]"))msg=e.target.value||"A";if(e.target.matches("[data-m2]"))msg2=e.target.value||"B";draw()});
  el.addEventListener("change",e=>{if(e.target.matches("[data-r]")){reuse=e.target.checked;el.querySelector("[data-m2l]").hidden=!reuse;draw()}});
  el.addEventListener("click",e=>{if(e.target.closest("[data-nk]")){newKey();draw()}});draw()};

/* ======================= 4 Structuring data ======================= */

/* ERDs: 1:1, 1:M and M:M, and resolving M:M with a link table */
ALW.erd=function(el){let sc="1m",res=false,W=600,M=alId("er");
  const SC={"11":{a:"Country",b:"Capital",txt:"Each country has exactly one capital city, and each capital belongs to one country: <b>one-to-one</b>. Either table could hold the other's key as a foreign key.",
      ta:["Country",["CountryID","Name","Population"],[["FR","France","68 m"],["JP","Japan","124 m"]]],tb:["Capital",["CapitalID","Name","CountryID*"],[["C1","Paris","FR"],["C2","Tokyo","JP"]]]},
    "1m":{a:"Customer",b:"Order",txt:"One customer can place many orders, but each order belongs to one customer: <b>one-to-many</b>. The crow's foot is at the <b>many</b> end, and the foreign key goes in the table at the many end (Order).",
      ta:["Customer",["CustomerID","Name"],[["C1","Ana"],["C2","Ben"]]],tb:["Order",["OrderID","Date","CustomerID*"],[["O1","3 Mar","C1"],["O2","5 Mar","C1"],["O3","9 Mar","C2"]]]},
    "mm":{a:"Student",b:"Course",txt:"A student takes many courses and a course has many students: <b>many-to-many</b>. A relational database can't store this directly — where would the foreign key go? Press <b>Resolve</b>.",
      ta:["Student",["StudentID","Name"],[["S1","Ana"],["S2","Ben"]]],tb:["Course",["CourseID","Title"],[["C1","Maths"],["C2","Physics"]]],
      link:["Enrolment",["StudentID*","CourseID*","Joined"],[["S1","C1","Sep"],["S1","C2","Sep"],["S2","C1","Jan"]]]}};
  el.innerHTML=alH("Try it: entity-relationship diagrams","crow's foot notation")+`<div class="alctl">${alSeg("sc",[["11","Country – Capital"],["1m","Customer – Order"],["mm","Student – Course"]],sc)}<button class="btn small primary" data-res hidden>Resolve with a link table</button></div><div data-svg></div><div class="alg2e" data-tabs></div><p class="almsg" data-m></p>`;
  const foot=(x,y,dir)=>`<path d="M${x+dir*18} ${y} L${x} ${y-12} M${x+dir*18} ${y} L${x} ${y+12} M${x+dir*18} ${y} L${x} ${y}" class="l"/>`;
  const draw=()=>{const s=SC[sc],n=W<400,bw=n?96:130,y=50,L=6,R=W-6-bw;el.querySelector("[data-res]").hidden=sc!=="mm";
    let g=`<rect x="${L}" y="${y-24}" width="${bw}" height="48" rx="4" class="b"/><text x="${L+bw/2}" y="${y+5}" class="t c">${s.a}</text><rect x="${R}" y="${y-24}" width="${bw}" height="48" rx="4" class="b"/><text x="${R+bw/2}" y="${y+5}" class="t c">${s.b}</text>`;
    if(sc==="mm"&&res){const mx=W/2-bw/2;g+=`<rect x="${mx}" y="${y-24}" width="${bw}" height="48" rx="4" class="bw"/><text x="${mx+bw/2}" y="${y+5}" class="t c">${s.link[0]}</text><line x1="${L+bw}" y1="${y}" x2="${mx}" y2="${y}" class="l"/>${foot(mx,y,-1)}<line x1="${mx+bw}" y1="${y}" x2="${R}" y2="${y}" class="l"/>${foot(mx+bw,y,1)}`}
    else{g+=`<line x1="${L+bw}" y1="${y}" x2="${R}" y2="${y}" class="l"/>`;if(sc!=="11")g+=foot(R,y,-1);if(sc==="mm")g+=foot(L+bw,y,1);g+=`<text x="${W/2}" y="${y-10}" class="s c">${({"11":"1 : 1","1m":"1 : M","mm":"M : M"})[sc]}</text>`}
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 100" role="img" aria-label="Entity-relationship diagram">${g}</svg>`;
    const tab=([nm,f,rows])=>`<div class="alpanel"><span class="eyebrow">${nm}(${f.map((x,i)=>i===0||nm==="Enrolment"&&i<2?`<u>${x}</u>`:x).join(", ")})</span><table class="altab"><tr>${f.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`;
    el.querySelector("[data-tabs]").innerHTML=sc==="mm"&&!res?tab(s.ta)+tab(s.tb):sc==="mm"?tab(s.ta)+tab(s.tb)+tab(s.link):tab(s.ta)+tab(s.tb);
    el.querySelector("[data-m]").innerHTML=sc==="mm"&&res?`The <b>link table</b> Enrolment turns one M:M relationship into two 1:M relationships. Each row records one student on one course, and its primary key is the <b>composite key</b> (StudentID, CourseID) — both foreign keys. Primary keys are underlined; * marks a foreign key.`:s.txt+" Primary keys are underlined in the notation; * marks a foreign key."};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-sc]");if(b){sc=b.dataset.sc;res=false;alSegSet(el,"sc",sc);draw()}if(e.target.closest("[data-res]")){res=!res;e.target.closest("[data-res]").textContent=res?"Show the M:M version":"Resolve with a link table";draw()}});
  alResp(el,w=>{W=w;draw()})};

/* integrity rules: try to add bad data */
ALW.integrity=function(el){let S,C,E,last;const reset=()=>{S=[["S1","Ana",16],["S2","Ben",17]];C=[["C1","Maths"],["C2","Physics"]];E=[["S1","C1"]];last=null};
  const ACT=[["Add student S3 Kai, age 16",()=>add(S,["S3","Kai",16])],["Add student S1 Mia, age 15",()=>add(S,["S1","Mia",15])],["Add a student with no ID",()=>add(S,["","Zac",15])],["Add student S4 Leo, age 42",()=>add(S,["S4","Leo",42])],
    ["Enrol S2 on course C2",()=>enrol(["S2","C2"])],["Enrol S2 on course C9",()=>enrol(["S2","C9"])],["Delete course C1",()=>delC("C1")]];
  const add=(T,r)=>{if(!r[0])return ["bad","Entity integrity",`Every record needs a primary key, and it can't be empty (null).`,"Student",r];
    if(T.some(x=>x[0]===r[0]))return ["bad","Entity integrity",`StudentID ${r[0]} is already used. Primary key values must be <b>unique</b>, or two records couldn't be told apart.`,"Student",r];
    if(r[2]<11||r[2]>19)return ["bad","Domain integrity",`Age must be a whole number from 11 to 19 (the column's domain). ${r[2]} is outside it.`,"Student",r];T.push(r);return ["good","Accepted",`${r[1]} was added: unique key, valid age.`,"Student",r]};
  const enrol=r=>{if(!C.some(x=>x[0]===r[1]))return ["bad","Referential integrity",`There's no course ${r[1]}. A foreign key must match a primary key that <b>exists</b> in the linked table.`,"Enrolment",r];
    if(E.some(x=>x[0]===r[0]&&x[1]===r[1]))return ["bad","Entity integrity","That enrolment already exists: the composite key must be unique.","Enrolment",r];E.push(r);return ["good","Accepted",`${r[0]} is now enrolled on ${r[1]}: both foreign keys match real records.`,"Enrolment",r]};
  const delC=id=>{if(E.some(x=>x[1]===id))return ["bad","Referential integrity",`Enrolments still refer to ${id}. Deleting it would leave foreign keys pointing at nothing, so the database refuses.`,"Course",[id,"(deleted)"]];
    C=C.filter(x=>x[0]!==id);return ["good","Accepted",`${id} deleted: nothing referred to it.`,"Course",[id]]};
  el.innerHTML=alH("Try it: integrity rules","the database checks every change")+`<div class="alctl">${ACT.map((a,i)=>`<button class="btn small" data-a="${i}">${a[0]}</button>`).join("")}<button class="btn small" data-rs>↺ Reset</button></div><div class="alg2e" data-t></div><p class="almsg" data-m>Try each change. Which ones will the database accept?</p>`;
  const tab=(nm,f,rows,hl)=>`<div class="alpanel"><span class="eyebrow">${nm}</span><table class="altab"><tr>${f.map(x=>`<th>${x}</th>`).join("")}</tr>${rows.map(r=>`<tr>${r.map(c=>`<td class="${hl&&hl===r?"ok":""}">${c}</td>`).join("")}</tr>`).join("")}${last&&last[0]==="bad"&&last[3]===nm?`<tr>${last[4].map(c=>`<td class="bad">${c===""?"(null)":c}</td>`).join("")}</tr>`:""}</table></div>`;
  const draw=()=>{const hl=last&&last[0]==="good"?last[4]:null;el.querySelector("[data-t]").innerHTML=tab("Student",["StudentID","Name","Age (11–19)"],S,hl)+tab("Course",["CourseID","Title"],C,hl)+tab("Enrolment",["StudentID*","CourseID*"],E,hl)};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-a]"),m=el.querySelector("[data-m]");if(e.target.closest("[data-rs]")){reset();draw();m.className="almsg";m.textContent="Reset.";return}if(!b)return;
    last=ACT[+b.dataset.a][1]();m.className="almsg "+last[0];m.innerHTML=`<b>${last[0]==="bad"?"Rejected — "+last[1]:"Accepted"}.</b> ${last[2]}`;draw()});reset();draw()};

/* a Python list: indexes, negative indexes and the list methods */
ALW.list=function(el){let L=[14,17,12,19],hl=-1;
  el.innerHTML=alH("Try it: Python lists","operations")+`<div class="alctl"><label>Value <input type="number" value="20" data-v></label><label>Index <input type="number" value="1" data-i></label></div>
   <div class="alctl">${[["append","append(value)"],["insert","insert(index, value)"],["pop","pop()"],["popi","pop(index)"],["del","del lst[index]"],["set","lst[index] = value"],["get","lst[index]"],["remove","remove(value)"],["in","value in lst"],["sort","sort()"]].map(([k,l])=>`<button class="btn small" data-op="${k}">${l}</button>`).join("")}</div>
   <div data-cells></div><pre class="alout" data-o></pre>`;
  const draw=()=>{el.querySelector("[data-cells]").innerHTML=L.length?`<div class="alcells">${L.map((v,i)=>`<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><span class="alptr">${i}</span><div class="alcell ${i===hl?"hi":""}">${v}</div><span class="alptr" style="color:var(--muted)">${i-L.length}</span></div>`).join("")}</div><div class="alnote">index above, negative index below · len(lst) = ${L.length}</div>`:`<span class="alnote">The list is empty: [ ]</span>`};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-op]");if(!b)return;const v=Math.round(+el.querySelector("[data-v]").value||0),i=Math.round(+el.querySelector("[data-i]").value||0),op=b.dataset.op,o=el.querySelector("[data-o]");
    const ok=i>=-L.length&&i<L.length,ix=i<0?L.length+i:i,err=`IndexError: list index out of range (valid indexes are ${-L.length} to ${L.length-1})`;let line="",out="";hl=-1;
    if(op==="append"){line=`lst.append(${v})`;L.push(v);hl=L.length-1}
    else if(op==="insert"){line=`lst.insert(${i}, ${v})`;const p=Math.max(0,Math.min(L.length,i<0?L.length+i:i));L.splice(p,0,v);hl=p}
    else if(op==="pop"){line="lst.pop()";if(!L.length)out="IndexError: pop from empty list";else out=String(L.pop())}
    else if(op==="popi"){line=`lst.pop(${i})`;if(!ok)out=err;else out=String(L.splice(ix,1)[0])}
    else if(op==="del"){line=`del lst[${i}]`;if(!ok)out=err;else L.splice(ix,1)}
    else if(op==="set"){line=`lst[${i}] = ${v}`;if(!ok)out=err;else{L[ix]=v;hl=ix}}
    else if(op==="get"){line=`lst[${i}]`;out=ok?String(L[ix]):err;if(ok)hl=ix}
    else if(op==="remove"){line=`lst.remove(${v})`;const p=L.indexOf(v);if(p<0)out="ValueError: list.remove(x): x not in list";else L.splice(p,1)}
    else if(op==="in"){line=`${v} in lst`;out=String(L.includes(v)?"True":"False")}
    else if(op==="sort"){line="lst.sort()";L.sort((a,b)=>a-b)}
    o.textContent=`>>> ${line}${out?"\n"+out:""}\n>>> lst\n[${L.join(", ")}]`;draw()});draw();el.querySelector("[data-o]").textContent=">>> lst\n[14, 17, 12, 19]"};

/* sets and Venn diagrams */
ALW.sets=function(el){let A="Maths, Physics, Computing, Art",B="Computing, Music, Maths, Drama",op="and",W=600,id=alId("vn");
  const OPS=[["or","a | b (union)"],["and","a &amp; b (intersection)"],["sub","a - b (difference)"],["bsub","b - a"],["xor","a ^ b (symmetric difference)"]];
  el.innerHTML=alH("Try it: sets","Venn diagram")+`<div class="alctl"><label>a = <input type="text" value="${A}" data-a style="width:16em"></label><label>b = <input type="text" value="${B}" data-b style="width:16em"></label></div><div class="alctl">${alSeg("op",OPS,op)}</div><div data-svg></div><pre class="alout" data-o></pre>`;
  const P=s=>[...new Set(s.split(",").map(x=>x.trim()).filter(Boolean))];
  const draw=()=>{const a=P(A),b=P(B),both=a.filter(x=>b.includes(x)),onlyA=a.filter(x=>!b.includes(x)),onlyB=b.filter(x=>!a.includes(x));
    const on={or:[1,1,1],and:[0,1,0],sub:[1,0,0],bsub:[0,0,1],xor:[1,0,1]}[op];const res=[on[0]?onlyA:[],on[1]?both:[],on[2]?onlyB:[]].flat();
    const n=W<400,r=n?92:118,cx1=W/2-r*.55,cx2=W/2+r*.55,cy=r+14,H=2*r+30;
    const fill=k=>on[k]?"var(--accent-soft)":"var(--surface)";
    const words=(arr,x)=>arr.map((w,i)=>`<text x="${x}" y="${cy-(arr.length-1)*9+i*18+4}" class="c" style="font-size:${n?12:13}px">${w.replace(/</g,"&lt;")}</text>`).join("");
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Venn diagram of sets a and b"><defs><clipPath id="${id}a"><circle cx="${cx1}" cy="${cy}" r="${r}"/></clipPath><mask id="${id}m1"><rect width="${W}" height="${H}" fill="white"/><circle cx="${cx2}" cy="${cy}" r="${r}" fill="black"/></mask><mask id="${id}m2"><rect width="${W}" height="${H}" fill="white"/><circle cx="${cx1}" cy="${cy}" r="${r}" fill="black"/></mask></defs>
     <circle cx="${cx1}" cy="${cy}" r="${r}" style="fill:${fill(0)}" mask="url(#${id}m1)"/><circle cx="${cx2}" cy="${cy}" r="${r}" style="fill:${fill(2)}" mask="url(#${id}m2)"/><circle cx="${cx2}" cy="${cy}" r="${r}" style="fill:${fill(1)}" clip-path="url(#${id}a)"/>
     <circle cx="${cx1}" cy="${cy}" r="${r}" class="l"/><circle cx="${cx2}" cy="${cy}" r="${r}" class="l"/><text x="${cx1-r*.75}" y="${cy-r*.8}" class="h">a</text><text x="${cx2+r*.7}" y="${cy-r*.8}" class="h">b</text>
     ${words(onlyA,cx1-r*.5)}${words(both,W/2)}${words(onlyB,cx2+r*.5)}</svg>`;
    const sym={or:"a | b",and:"a & b",sub:"a - b",bsub:"b - a",xor:"a ^ b"}[op];
    el.querySelector("[data-o]").textContent=`>>> ${sym}\n{${res.map(x=>`'${x}'`).join(", ")||""}}${res.length?"":"   # set() — empty"}\n>>> len(${sym.includes(" ")?"("+sym+")":sym})\n${res.length}`};
  el.addEventListener("input",e=>{if(e.target.matches("[data-a]"))A=e.target.value;if(e.target.matches("[data-b]"))B=e.target.value;draw()});
  el.addEventListener("click",e=>{const b=e.target.closest("[data-op]");if(!b)return;op=b.dataset.op;alSegSet(el,"op",op);draw()});alResp(el,w=>{W=w;draw()})};

/* a stack in a fixed-length list */
ALW.stack=function(el){const N=5;let S=[],hl=null,nx=3;
  el.innerHTML=alH("Try it: a stack","fixed length 5")+`<div class="alctl"><label>Value <input type="number" value="${nx}" data-v></label><button class="btn small primary" data-op="push">push(value)</button><button class="btn small" data-op="pop">pop()</button><button class="btn small" data-op="peek">peek()</button><button class="btn small" data-op="empty">isEmpty()</button><button class="btn small" data-op="full">isFull()</button></div>
   <div class="alg2e"><div data-st style="display:flex;flex-direction:column-reverse;gap:4px;max-width:260px"></div><div style="display:flex;flex-direction:column;gap:8px"><pre class="alout" data-o></pre><p class="almsg" data-m></p></div></div>`;
  const draw=()=>{el.querySelector("[data-st]").innerHTML=Array.from({length:N},(_,i)=>`<div style="display:grid;grid-template-columns:2.2em 1fr 4.5em;gap:6px;align-items:center"><span class="alnote mono">[${i}]</span><div class="alcell ${i<S.length?(i===hl?"hi":""):"empty"}">${i<S.length?S[i]:"&nbsp;"}</div><span class="alptr">${i===S.length-1?"← top":""}</span></div>`).join("")+`<div class="alnote mono">top = ${S.length-1}${S.length?"":" (empty)"}</div>`};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-op]");if(!b)return;const v=Math.round(+el.querySelector("[data-v]").value||0),op=b.dataset.op,o=el.querySelector("[data-o]"),m=el.querySelector("[data-m]");hl=null;m.className="almsg";
    if(op==="push"){o.textContent=`push(${v})`;if(S.length===N){m.className="almsg bad";m.innerHTML="<b>Stack overflow:</b> the stack is full, so nothing can be pushed. Check isFull() first."}else{S.push(v);hl=S.length-1;m.innerHTML=`The top pointer moved up to ${S.length-1} and ${v} was stored there.`;el.querySelector("[data-v]").value=v+Math.ceil(Math.random()*5)}}
    if(op==="pop"){o.textContent="pop()";if(!S.length){m.className="almsg bad";m.innerHTML="<b>Stack underflow:</b> the stack is empty, so there's nothing to pop. Check isEmpty() first."}else{const x=S.pop();o.textContent+=`\n${x}`;m.innerHTML=`${x} was returned and the top pointer moved down to ${S.length-1}. Last in, first out.`}}
    if(op==="peek"){o.textContent="peek()\n"+(S.length?S[S.length-1]:"(nothing: the stack is empty)");if(S.length)hl=S.length-1;m.innerHTML="peek() returns the top item without removing it."}
    if(op==="empty"){o.textContent=`isEmpty()\n${S.length===0?"True":"False"}`;m.innerHTML="The stack is empty when top = −1."}
    if(op==="full"){o.textContent=`isFull()\n${S.length===N?"True":"False"}`;m.innerHTML=`The stack is full when top = ${N-1}, the last index.`}draw()});
  draw();el.querySelector("[data-o]").textContent="stack = [None] * 5\ntop = -1";el.querySelector("[data-m]").textContent="Push some values, then pop them. Which comes out first?"};

/* a queue in a fixed-length list: linear or circular */
ALW.queue=function(el){const N=6;let Q,front,rear,count,circ=el.dataset.mode==="circ",nx="J1",k=1;
  const reset=()=>{Q=Array(N).fill(null);front=0;rear=-1;count=0;k=1};reset();
  el.innerHTML=alH("Try it: a queue","fixed length 6")+`<div class="alctl">${alSeg("md",[["lin","Linear queue"],["circ","Circular queue"]],circ?"circ":"lin")}<button class="btn small primary" data-op="enq">enqueue</button><button class="btn small" data-op="deq">dequeue()</button><button class="btn small" data-op="rs">↺ Reset</button></div>
   <div data-q></div><div class="alg2e"><pre class="alout" data-o></pre><p class="almsg" data-m>Enqueue some print jobs, then dequeue them. Which comes out first?</p></div>`;
  const draw=()=>{el.querySelector("[data-q]").innerHTML=`<div class="alcells">${Q.map((v,i)=>{const inQ=count>0&&(circ?((i-front+N)%N)<count:i>=front&&i<=rear);
      return `<div style="display:flex;flex-direction:column;align-items:center;gap:2px"><span class="alnote mono">[${i}]</span><div class="alcell ${inQ?"hi":v!==null?"dim":"empty"}">${v===null?"&nbsp;":v}</div><span class="alptr">${[i===front&&count?"front":"",i===rear&&count?"rear":""].filter(Boolean).join("/")||"&nbsp;"}</span></div>`}).join("")}</div><div class="alnote mono">front = ${front} · rear = ${rear} · count = ${count}${circ?"":` · free spaces at the end: ${N-1-rear}`}</div>`};
  el.addEventListener("click",e=>{const s=e.target.closest("[data-md]");if(s){circ=s.dataset.md==="circ";alSegSet(el,"md",s.dataset.md);reset();draw();el.querySelector("[data-m]").textContent=circ?"Circular: when rear reaches the end it wraps round to index 0.":"Linear: front and rear only ever move forward.";el.querySelector("[data-o]").textContent="";return}
    const b=e.target.closest("[data-op]");if(!b)return;const o=el.querySelector("[data-o]"),m=el.querySelector("[data-m]");m.className="almsg";
    if(b.dataset.op==="rs"){reset();draw();o.textContent="";m.textContent="Empty queue.";return}
    if(b.dataset.op==="enq"){const job="J"+k;o.textContent=`enqueue("${job}")`;
      if(circ?count===N:rear===N-1){m.className="almsg bad";m.innerHTML=circ?"<b>Full:</b> all 6 spaces are in use.":count<N?`<b>Can't add:</b> rear has reached the end of the list, even though ${N-count} space${N-count>1?"s are":" is"} free at the front. Those spaces are wasted in a linear queue — a circular queue fixes this.`:"<b>Full:</b> all 6 spaces are in use."}
      else{rear=circ?(rear+1)%N:rear+1;Q[rear]=job;count++;k++;m.innerHTML=circ&&rear===0&&count>1?`rear wrapped round to index 0: rear = (rear + 1) % ${N}.`:`${job} joined at the rear (index ${rear}).`}}
    if(b.dataset.op==="deq"){o.textContent="dequeue()";if(!count){m.className="almsg bad";m.innerHTML="<b>Empty:</b> there's nothing to dequeue."}
      else{const x=Q[front];o.textContent+=`\n'${x}'`;m.innerHTML=`${x} left from the front — first in, first out. front moved on to ${circ?(front+1)%N:front+1}.`;front=circ?(front+1)%N:front+1;count--;if(!count&&!circ){}}}draw()});draw()};

/* ======================= 5 Problem solving ======================= */

/* flowchart: add up numbers until 0 */
ALW.flow=function(el){const M=alId("fl");let IN=[5,3,8,0],W=600;
  const N={s:[150,22,"term","Start"],z:[150,78,"proc","total ← 0"],i:[150,134,"io","INPUT x"],d:[150,196,"dec","x = 0?"],p:[150,262,"proc","total ← total + x"],o:[150,330,"io","OUTPUT total"],e:[150,390,"term","Stop"]};
  const build=()=>{const S=[];let total=null,x=null,q=IN.slice(),out="";const p=(n,t)=>S.push({n,total,x,q:q.slice(),out,t});
    p("s","The algorithm starts.");total=0;p("z","total is set to 0.");
    for(let g=0;g<20;g++){x=q.length?q.shift():0;p("i",`The next input, ${x}, is stored in x.`);const z=x===0;p("d",`Is x = 0? ${z?"<b>Yes</b>, so leave the loop.":"<b>No</b>, so carry on."}`);if(z)break;total+=x;p("p",`total = ${total-x} + ${x} = ${total}. Then back to the input.`)}
    out=String(total);p("o",`The total, ${total}, is output.`);p("e","The algorithm stops.");return S};
  let S=build(),K=0,ctl;
  el.innerHTML=alH("Try it: follow the flowchart","step by step")+`<div class="alctl"><label>Inputs <input type="text" value="${IN.join(", ")}" data-in style="width:10em"></label><span class="alnote">the last one should be 0</span></div><div class="alg2"><div data-svg></div><div style="display:flex;flex-direction:column;gap:8px"><div class="alpanel"><span class="eyebrow">Variables</span><table class="altab" data-v></table></div><div class="alpanel"><span class="eyebrow">Input still to come</span><div class="alcells" data-q></div></div><div class="alpanel"><span class="eyebrow">Output</span><pre class="alout" data-o></pre></div></div></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  const shape=([x,y,t,txt],on)=>{const c=on?"on":t==="dec"?"bi":t==="io"?"bw":t==="term"?"b3":"b";
    if(t==="term")return `<rect x="${x-55}" y="${y-17}" width="110" height="34" rx="17" class="${c}"/><text x="${x}" y="${y+5}" class="s c" style="fill:var(--ink)">${txt}</text>`;
    if(t==="io")return `<path d="M${x-62} ${y-17} L${x+74} ${y-17} L${x+62} ${y+17} L${x-74} ${y+17} Z" class="${c}"/><text x="${x}" y="${y+5}" class="s c" style="fill:var(--ink)">${txt}</text>`;
    if(t==="dec")return `<path d="M${x} ${y-28} L${x+64} ${y} L${x} ${y+28} L${x-64} ${y} Z" class="${c}"/><text x="${x}" y="${y+5}" class="s c" style="fill:var(--ink)">${txt}</text>`;
    return `<rect x="${x-74}" y="${y-17}" width="148" height="34" class="${c}"/><text x="${x}" y="${y+5}" class="s c" style="fill:var(--ink)">${txt}</text>`};
  const go=k=>{K=k;const s=S[k];
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 300 410" style="max-width:340px" role="img" aria-label="Flowchart that totals numbers until 0 is input">${alMark(M)}
     ${[["s","z"],["z","i"],["i","d"],["o","e"]].map(([a,b])=>`<line x1="150" y1="${N[a][1]+17}" x2="150" y2="${N[b][1]-(b==="d"?28:17)}" class="l" marker-end="url(#${M})"/>`).join("")}
     <line x1="150" y1="224" x2="150" y2="245" class="l" marker-end="url(#${M})"/><text x="158" y="240" class="s">No</text>
     <path d="M76 262 H30 V134 H74" class="l" marker-end="url(#${M})"/>
     <path d="M214 196 H262 V330 H226" class="l" marker-end="url(#${M})"/><text x="222" y="188" class="s">Yes</text>
     ${Object.entries(N).map(([k2,n])=>shape(n,k2===s.n)).join("")}</svg>`;
    el.querySelector("[data-v]").innerHTML=`<tr><th>total</th><th>x</th></tr><tr><td>${s.total===null?"–":s.total}</td><td>${s.x===null?"–":s.x}</td></tr>`;
    el.querySelector("[data-q]").innerHTML=s.q.length?s.q.map(v=>`<div class="alcell">${v}</div>`).join(""):`<span class="alnote">none</span>`;el.querySelector("[data-o]").textContent=s.out||"";el.querySelector("[data-m]").innerHTML=s.t};
  ctl=alStepper(el.querySelector("[data-ctl]"),()=>S.length,go,{ms:1300});
  el.querySelector("[data-in]").addEventListener("change",e=>{const v=e.target.value.split(/[,\s]+/).map(Number).filter(x=>Number.isFinite(x)).slice(0,8);IN=v.length?v:[0];S=build();ctl.set(0)})};

/* step through Python one line at a time. The steps are recorded by scripts/build-al.mjs, which runs the
   code under Python's tracer and stores them in data-steps, so nothing runs in the browser.
   data-vars: variables for the trace table · data-stack: show stack frames · data-bp: breakpoints */
ALW.trace=function(el){const code=(el.querySelector("pre")||{}).textContent||"",steps=JSON.parse(el.dataset.steps||"[]"),vars=(el.dataset.vars||"").split(",").map(s=>s.trim()).filter(Boolean),stk="stack" in el.dataset,bp="bp" in el.dataset,BP=new Set((el.dataset.bpl||"").split(",").filter(Boolean).map(Number));
  if(!steps.length){el.innerHTML=`<p class="vfoot">This trace hasn't been built.</p>`;return}
  const lines=code.replace(/\n$/,"").split("\n");
  el.innerHTML=alH(el.dataset.title||"Try it: step through the code",bp?"debugger":stk?"call stack":"trace table")+`<div class="alg2"><div style="display:flex;flex-direction:column;gap:8px"><div class="alcode${bp?" bpable":""}" data-code></div><pre class="alout" data-o></pre></div>
   <div style="display:flex;flex-direction:column;gap:8px">${stk?`<div class="alpanel"><span class="eyebrow">Call stack (top frame is running)</span><div class="alframes" data-f></div></div>`:""}${vars.length?`<div class="alpanel"><span class="eyebrow">${bp?"Watch":"Trace table"}</span><div class="tscroll" style="max-height:260px;overflow:auto" data-t></div></div>`:""}</div></div>
   <p class="almsg" data-m></p><div class="alctl" data-ctl></div>${bp?`<div class="alctl"><button class="btn small primary" data-cont>▶ Continue to next breakpoint</button><span class="alnote">Click a line number to add or remove a breakpoint.</span></div>`:""}`;
  const loc=s=>{const f=s.stack[s.stack.length-1];return f?f.loc:{}};
  /* trace table rows: a new row whenever a watched variable changes or something is printed */
  const rowsUpTo=k=>{const R=[];let prev={},po="";for(let i=0;i<=k;i++){const s=steps[i],g=Object.assign({},s.stack[0]?s.stack[0].loc:{},loc(s)),cur={};vars.forEach(v=>{if(v in g)cur[v]=g[v]});
      const ch=vars.filter(v=>cur[v]!==prev[v]&&cur[v]!==undefined),newOut=s.out.slice(po.length).replace(/\n$/,"");
      if(ch.length||newOut){R.push({vals:Object.fromEntries(ch.map(v=>[v,cur[v]])),out:newOut,i})}prev=cur;po=s.out}return R};
  const go=k=>{const s=steps[k];
    el.querySelector("[data-code]").innerHTML=lines.map((l,i)=>`<div class="${s.line===i+1?"cur":""} ${BP.has(i+1)?"bp":""}"><i data-ln="${i+1}">${i+1}</i>${l.replace(/&/g,"&amp;").replace(/</g,"&lt;")||" "}</div>`).join("");
    el.querySelector("[data-o]").textContent=s.out||"";
    if(stk)el.querySelector("[data-f]").innerHTML=s.stack.map((f,i)=>`<div class="alframe ${i===s.stack.length-1?"top":""}"><b>${f.fn==="<module>"?"main program":f.fn+"()"}</b>${Object.entries(f.loc).filter(([k2])=>f.fn!=="<module>"||vars.includes(k2)).map(([k2,v])=>` · ${k2} = ${v}`).join("")}</div>`).join("")||`<span class="alnote">empty</span>`;
    if(vars.length){const R=rowsUpTo(k);el.querySelector("[data-t]").innerHTML=`<table class="altab"><tr>${vars.map(v=>`<th>${v}</th>`).join("")}<th>output</th></tr>${R.map((r,j)=>`<tr class="${j===R.length-1?"cur":""}">${vars.map(v=>`<td>${v in r.vals?r.vals[v]:""}</td>`).join("")}<td>${(r.out||"").replace(/</g,"&lt;").replace(/\n/g,"<br>")}</td></tr>`).join("")}</table>`;const t=el.querySelector("[data-t]");t.scrollTop=t.scrollHeight}
    el.querySelector("[data-m]").innerHTML=s.e==="end"?"<b>Finished.</b>":s.e==="return"?`<b>${s.stack[s.stack.length-1].fn}</b> returns <span class="mono">${s.ret}</span>${s.stack.length>1?" to the frame below, and its stack frame is removed.":"."}`:`Line ${s.line} is about to run.${stk&&s.stack.length>1?` Depth: ${s.stack.length-1} call${s.stack.length>2?"s":""} deep.`:""}`};
  const ctl=alStepper(el.querySelector("[data-ctl]"),steps.length,go,{ms:+(el.dataset.ms||900)});
  if(bp){el.querySelector("[data-code]").addEventListener("click",e=>{const n=e.target.closest("[data-ln]");if(!n)return;const l=+n.dataset.ln;BP.has(l)?BP.delete(l):BP.add(l);ctl.refresh()});
    el.querySelector("[data-cont]").addEventListener("click",()=>{const k=ctl.get();let j=k+1;while(j<steps.length-1&&!(steps[j].e==="line"&&BP.has(steps[j].line)))j++;ctl.set(Math.min(j,steps.length-1))})}};

/* linear and binary search side by side */
ALW.search=function(el){const A=[3,8,12,15,21,27,34,42,49,57,63,70,78,85,91];let t=57,ctl;
  el.innerHTML=alH("Try it: linear vs binary search","15 sorted items")+`<div class="alctl"><label>Search for <select data-t>${A.concat([50]).sort((a,b)=>a-b).map(v=>`<option${v===t?" selected":""}>${v}</option>`).join("")}</select></label><span class="alnote">50 isn't in the list</span></div>
   <div class="alpanel"><span class="eyebrow">Linear search</span><div data-l></div><div class="alnote" data-lc></div></div><div class="alpanel"><span class="eyebrow">Binary search · mid = (low + high) // 2</span><div data-b></div><div class="alnote" data-bc></div></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  let L,B;const build=()=>{L=[];for(let i=0;i<A.length;i++){L.push({i,found:A[i]===t});if(A[i]===t)break}if(!L[L.length-1].found)L.push({i:-1,done:true});
    B=[];let lo=0,hi=A.length-1;while(lo<=hi){const m=Math.floor((lo+hi)/2);const r={lo,hi,m,v:A[m]};B.push(r);if(A[m]===t){r.found=true;break}if(A[m]<t)lo=m+1;else hi=m-1}if(!B[B.length-1].found)B.push({lo,hi,m:-1,done:true})};
  const go=k=>{const l=L[Math.min(k,L.length-1)],b=B[Math.min(k,B.length-1)],lc=Math.min(k+1,L.filter(x=>!x.done).length),bc=Math.min(k+1,B.filter(x=>!x.done).length);
    el.querySelector("[data-l]").innerHTML=`<div class="alcells">${A.map((v,i)=>`<div class="alcell ${l.i===i?(l.found?"ok":"mid"):i<(l.i<0?A.length:l.i)?"dim":""}">${v}<small>${i}</small></div>`).join("")}</div>`;
    el.querySelector("[data-lc]").textContent=`${lc} comparison${lc>1?"s":""}${l.found?" — found at index "+l.i:l.done?" — reached the end: not found":""}`;
    el.querySelector("[data-b]").innerHTML=`<div class="alcells">${A.map((v,i)=>{const inR=b.done?false:i>=b.lo&&i<=b.hi;return `<div style="display:flex;flex-direction:column;align-items:center"><div class="alcell ${i===b.m?(b.found?"ok":"mid"):inR?"":"dim"}">${v}<small>${i}</small></div><span class="alptr">${[!b.done&&i===b.lo?"low":"",i===b.m?"mid":"",!b.done&&i===b.hi?"high":""].filter(Boolean).join(" ")||"&nbsp;"}</span></div>`}).join("")}</div>`;
    el.querySelector("[data-bc]").textContent=`${bc} comparison${bc>1?"s":""}${b.found?" — found at index "+b.m:b.done?" — low passed high: not found":` (low = ${b.lo}, high = ${b.hi}, mid = ${b.m})`}`;
    el.querySelector("[data-m]").innerHTML=b.done||b.found?(l.found||l.done?`Linear search needed <b>${L.filter(x=>!x.done).length}</b> comparisons; binary search needed <b>${B.filter(x=>!x.done).length}</b>. Binary search halves the remaining items each time, so even a million sorted items need only about 20 comparisons.`:`Binary search has finished. Linear search is still going, one item at a time…`)
      :`Binary search compares ${t} with the middle item, ${b.v}: ${t<b.v?`${t} is smaller, so everything from mid upwards is discarded (high = mid − 1).`:t>b.v?`${t} is bigger, so everything from mid downwards is discarded (low = mid + 1).`:"found!"}`};
  const run=()=>{build();if(ctl)ctl.set(0);else ctl=alStepper(el.querySelector("[data-ctl]"),()=>Math.max(L.length,B.length),go,{ms:1000})};
  el.querySelector("[data-t]").addEventListener("change",e=>{t=+e.target.value;run()});run()};

/* sorting animations: bubble sort and insertion sort */
ALW.sort=function(el){const kind=el.dataset.kind||"bubble";let base=[31,12,47,8,25,19,40],early=true,ctl;
  const PRE={random:[31,12,47,8,25,19,40],nearly:[8,12,19,31,25,40,47],reversed:[47,40,31,25,19,12,8]};
  el.innerHTML=alH(kind==="bubble"?"Try it: bubble sort":"Try it: insertion sort","step by step")+`<div class="alctl">${alSeg("pr",[["random","Random"],["nearly","Nearly sorted"],["reversed","Reversed"]],"random")}${kind==="bubble"?`<label><input type="checkbox" data-early checked> Stop when a pass makes no swaps</label>`:""}<button class="btn small" data-shuf>Shuffle</button></div>
   <div class="albars" data-bars></div><div class="alstats" data-st></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  let S;const build=()=>{const a=base.slice(),st=[];let comps=0,swaps=0;
    if(kind==="bubble"){let n=a.length,pass=0;st.push({a:a.slice(),txt:"Press Next step. Each pass compares neighbouring pairs and swaps them if they're in the wrong order.",comps,swaps,pass,done:[]});
      while(true){pass++;let sw=false;for(let j=0;j<n-1;j++){comps++;const doSwap=a[j]>a[j+1];st.push({a:a.slice(),cmp:[j,j+1],txt:`Pass ${pass}: compare ${a[j]} and ${a[j+1]}. ${doSwap?"Wrong order, so swap them.":"Already in order, so leave them."}`,comps,swaps,pass,done:range(n,a.length)});
          if(doSwap){[a[j],a[j+1]]=[a[j+1],a[j]];swaps++;sw=true;st.push({a:a.slice(),swap:[j,j+1],txt:`Swapped: ${a[j]} now comes before ${a[j+1]}.`,comps,swaps,pass,done:range(n,a.length)})}}
        n--;st.push({a:a.slice(),txt:`End of pass ${pass}. ${sw?`The largest unsorted item, ${a[n]}, has bubbled up to its final place.`:"<b>No swaps in this pass</b>, so the list must be sorted."}`,comps,swaps,pass,done:range(n,a.length)});
        if((!sw&&early)||n<=1)break}
      st.push({a:a.slice(),txt:`Sorted after ${pass} pass${pass>1?"es":""}, ${comps} comparisons and ${swaps} swaps.${!early?" Without the early stop, it carries on making passes even when the list is already sorted.":""}`,comps,swaps,pass,done:range(0,a.length)})}
    else{st.push({a:a.slice(),txt:"The first item on its own counts as sorted. Each pass takes the next item and inserts it into the sorted part.",comps,swaps,pass:0,sorted:1});
      for(let i=1;i<a.length;i++){const cur=a[i];let j=i-1;st.push({a:a.slice(),key:i,txt:`Pass ${i}: take ${cur} out and insert it into the sorted part on the left.`,comps,swaps,pass:i,sorted:i});
        while(j>=0){comps++;if(a[j]>cur){a[j+1]=a[j];swaps++;st.push({a:a.slice(),cmp:[j,j+1],hole:j,txt:`${a[j]} is bigger than ${cur}, so shift it one place right.`,comps,swaps,pass:i,sorted:i+1,cur});j--}
          else{st.push({a:a.slice(),cmp:[j],txt:`${a[j]} is not bigger than ${cur}, so stop: the gap is in the right place.`,comps,swaps,pass:i,sorted:i+1,hole:j+1,cur});break}}
        a[j+1]=cur;st.push({a:a.slice(),key:j+1,txt:`Insert ${cur} at index ${j+1}. The first ${i+1} items are now sorted.`,comps,swaps,pass:i,sorted:i+1})}
      st.push({a:a.slice(),txt:`Sorted after ${a.length-1} passes, ${comps} comparisons and ${swaps} shifts.`,comps,swaps,pass:a.length-1,sorted:a.length})}
    return st};
  const range=(a,b)=>Array.from({length:b-a},(_,i)=>a+i);
  const go=k=>{const s=S[k],mx=Math.max(...s.a);
    el.querySelector("[data-bars]").innerHTML=s.a.map((v,i)=>{let c="";if(kind==="bubble"){if(s.done&&s.done.includes(i))c="done";if(s.cmp&&s.cmp.includes(i))c="cmp";if(s.swap&&s.swap.includes(i))c="swap"}
      else{if(i<(s.sorted||0))c="done";if(s.cmp&&s.cmp.includes(i))c="cmp";if(s.key===i)c="key"}
      const hole=s.hole===i&&s.cur!==undefined;return `<div class="albar ${c} ${s.key===i&&kind!=="bubble"?"lift":""}"><i style="height:${(hole?s.cur:v)/mx*80}%;${hole?"opacity:.35;border-style:dashed":""}"></i><b>${hole?s.cur:v}</b></div>`}).join("");
    el.querySelector("[data-st]").innerHTML=`<div><b>${s.pass}</b><span>pass</span></div><div><b>${s.comps}</b><span>comparisons</span></div><div><b>${s.swaps}</b><span>${kind==="bubble"?"swaps":"shifts"}</span></div>`;
    el.querySelector("[data-m]").innerHTML=s.txt};
  const run=()=>{S=build();if(ctl)ctl.set(0);else ctl=alStepper(el.querySelector("[data-ctl]"),()=>S.length,go,{ms:800})};
  el.addEventListener("click",e=>{const p=e.target.closest("[data-pr]");if(p){base=PRE[p.dataset.pr].slice();alSegSet(el,"pr",p.dataset.pr);run()}
    if(e.target.closest("[data-shuf]")){base=base.slice().sort(()=>Math.random()-.5);alSegSet(el,"pr","");run()}});
  el.addEventListener("change",e=>{if(e.target.matches("[data-early]")){early=e.target.checked;run()}});run()};

/* Boolean expressions and truth tables */
ALW.logic=function(el){const EX=(el.dataset.ex||"A AND NOT B|(A AND NOT B) OR (B AND C)|NOT A OR B AND C|(A OR B) AND NOT (A AND B)|NOT (A AND B)|NOT A OR NOT B|A XOR B|NOT (A OR B) NAND C").split("|");
  let ex=EX[0],inp={A:1,B:0,C:1};
  /* parser: precedence NOT > AND/NAND > XOR > OR/NOR */
  const parse=s=>{const T=s.toUpperCase().match(/\(|\)|AND|NAND|NOR|XOR|OR|NOT|[A-C]|[01]/g)||[];let p=0;const peek=()=>T[p],take=()=>T[p++];
    const prim=()=>{const t=take();if(t==="NOT")return {op:"NOT",a:prim()};if(t==="("){const e=orE();if(take()!==")")throw Error("missing )");return {op:"()",a:e}}if(/^[A-C]$/.test(t))return {v:t};if(t==="0"||t==="1")return {k:+t};throw Error("unexpected "+(t||"end"))};
    const lvl=(next,ops)=>()=>{let l=next();while(ops.includes(peek())){const o=take();l={op:o,a:l,b:next()}}return l};
    const andE=lvl(prim,["AND","NAND"]),xorE=lvl(andE,["XOR"]),orE=lvl(xorE,["OR","NOR"]);const r=orE();if(p<T.length)throw Error("unexpected "+T[p]);return r};
  const txt=n=>n.v||n.k!==undefined?String(n.v||n.k):n.op==="()"?"("+txt(n.a)+")":n.op==="NOT"?"NOT "+txt(n.a):txt(n.a)+" "+n.op+" "+txt(n.b);
  const ev=(n,I)=>n.v?I[n.v]:n.k!==undefined?n.k:n.op==="()"?ev(n.a,I):n.op==="NOT"?1-ev(n.a,I):(()=>{const a=ev(n.a,I),b=ev(n.b,I);return {AND:a&b,OR:a|b,XOR:a^b,NAND:1-(a&b),NOR:1-(a|b)}[n.op]})();
  const subs=(n,out=[])=>{if(n.v||n.k!==undefined)return out;if(n.op==="()"){subs(n.a,out);return out}subs(n.a,out);if(n.b)subs(n.b,out);out.push(n);return out};
  const varsOf=s=>["A","B","C"].filter(v=>s.toUpperCase().includes(v));
  el.innerHTML=alH(el.dataset.title||"Try it: Boolean expressions and truth tables","click a row or an input")+`<div class="alctl"><label>Expression <select data-x>${EX.map(x=>`<option>${x}</option>`).join("")}</select></label><label>or type one <input type="text" data-own placeholder="e.g. A NOR (B AND C)" style="width:13em"></label></div>
   <div class="alctl" data-in></div><div class="alpanel"><span class="eyebrow">Evaluation order</span><ol data-ord style="margin:0;padding-left:1.4em;font-family:var(--mono);font-size:.9rem;line-height:1.7"></ol></div><div class="tscroll" data-tt></div><p class="almsg" data-m></p>`;
  const draw=()=>{const m=el.querySelector("[data-m]");let T;try{T=parse(ex)}catch(e){m.className="almsg bad";m.textContent="Can't read that expression: "+e.message+". Use A, B, C, AND, OR, NOT, XOR, NAND, NOR and brackets.";return}
    m.className="almsg";const V=varsOf(ex),S=subs(T),label=n=>txt(n).replace(/^\((.*)\)$/,"$1");
    el.querySelector("[data-in]").innerHTML=V.map(v=>`<button class="btn small" data-v="${v}" aria-pressed="${inp[v]===1}">${v} = ${inp[v]}</button>`).join("");
    el.querySelector("[data-ord]").innerHTML=S.map(n=>`<li>${label(n)} = <b>${ev(n,inp)}</b></li>`).join("");
    const rows=Array.from({length:2**V.length},(_,r)=>Object.fromEntries(V.map((v,i)=>[v,(r>>(V.length-1-i))&1])));
    el.querySelector("[data-tt]").innerHTML=`<table class="altab"><tr>${V.map(v=>`<th>${v}</th>`).join("")}${S.map((n,i)=>`<th style="${i===S.length-1?"":"font-weight:500;color:var(--muted)"}">${label(n)}</th>`).join("")}</tr>${rows.map(R=>{const cur=V.every(v=>R[v]===inp[v]);return `<tr class="${cur?"cur":""}" data-row='${JSON.stringify(R)}' style="cursor:pointer">${V.map(v=>`<td>${R[v]}</td>`).join("")}${S.map((n,i)=>`<td style="${i===S.length-1?"font-weight:800":""}">${ev(n,R)}</td>`).join("")}</tr>`}).join("")}</table>`;
    m.innerHTML=`${V.length} input${V.length>1?"s":""}, so 2<sup>${V.length}</sup> = ${rows.length} rows. Work out brackets first, then NOT, then AND, then OR. Grey columns are the intermediate steps; the last column is the output.`};
  el.addEventListener("click",e=>{const v=e.target.closest("[data-v]"),r=e.target.closest("[data-row]");if(v){inp[v.dataset.v]=1-inp[v.dataset.v];draw()}if(r){Object.assign(inp,JSON.parse(r.dataset.row));draw()}});
  el.querySelector("[data-x]").addEventListener("change",e=>{ex=e.target.value;el.querySelector("[data-own]").value="";draw()});
  el.querySelector("[data-own]").addEventListener("change",e=>{if(e.target.value.trim()){ex=e.target.value.trim();draw()}});draw()};

/* the same task, procedural and declarative */
ALW.paradigm=function(el){const R=[["Ana",17],["Ben",16],["Cai",18],["Dev",15],["Eve",17]];
  const PY=["result = []","for name, age in students:","    if age > 16:","        result.append(name)","print(result)"];
  el.innerHTML=alH("Try it: procedural vs declarative","the same question")+`<p class="alnote">Question: which students are older than 16?</p><div class="alg2e"><div class="alpanel"><span class="eyebrow">Procedural (Python): you say how</span><div class="alcode" data-py></div></div><div class="alpanel"><span class="eyebrow">Declarative (SQL): you say what</span><div class="alcode" data-sql><div><i>1</i>SELECT Name FROM Student</div><div><i>2</i>WHERE Age &gt; 16;</div></div></div></div>
   <div class="alg2e"><table class="altab" data-t></table><pre class="alout" data-o></pre></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  const S=[{l:0,row:-1,res:[],t:"The Python programmer must write every step: start with an empty list…"}];R.forEach((r,i)=>{const prev=S[S.length-1].res;S.push({l:1,row:i,res:prev,t:`…take the next record (${r[0]}, ${r[1]})…`});S.push({l:2,row:i,res:prev,t:`…check whether ${r[1]} > 16: ${r[1]>16?"yes":"no"}…`});if(r[1]>16)S.push({l:3,row:i,res:prev.concat([r[0]]),t:`…and add ${r[0]} to the result.`})});
  S.push({l:4,row:-1,res:S[S.length-1].res,t:"…and print it.",out:true});S.push({l:-1,row:-1,res:S[S.length-1].res,sql:true,t:"The SQL query just describes the result wanted. The <b>database management system</b> decides how to find it — it might check every row like the loop, or use an index to jump straight to the right rows. The programmer doesn't control (or need to know) the steps."});
  const go=k=>{const s=S[k];el.querySelector("[data-py]").innerHTML=PY.map((l,i)=>`<div class="${s.l===i?"cur":""}"><i>${i+1}</i>${l.replace(/>/g,"&gt;")}</div>`).join("");
    el.querySelector("[data-sql]").querySelectorAll("div").forEach(d=>d.classList.toggle("cur",!!s.sql));
    el.querySelector("[data-t]").innerHTML=`<tr><th>Name</th><th>Age</th></tr>${R.map((r,i)=>`<tr class="${i===s.row?"cur":""}"><td>${r[0]}</td><td class="${s.sql&&r[1]>16?"ok":""}">${r[1]}</td></tr>`).join("")}`;
    el.querySelector("[data-o]").textContent=s.out||s.sql?`['${s.res.join("', '")}']`:`result = [${s.res.map(x=>`'${x}'`).join(", ")}]`;el.querySelector("[data-m]").innerHTML=s.t};
  alStepper(el.querySelector("[data-ctl]"),S.length,go,{ms:900})};

/* ======================= 6 Enabling technologies ======================= */

/* distributed processing: split a big job across servers */
ALW.distrib=function(el){const N=48;let sv=4,fail=false,raf=null;const COL=["info","warn","good","bad","accent"];
  el.innerHTML=alH("Try it: distributed processing","one big job, many servers")+`<div class="alctl"><label>Servers <input type="range" min="1" max="16" value="${sv}" data-s> <b class="mono" data-sv></b></label><label><input type="checkbox" data-f> A server fails halfway</label><button class="btn small primary" data-go>▶ Process the data</button></div>
   <div class="alcells" data-c style="gap:3px"></div><div class="alstats" data-st></div><p class="almsg" data-m>The data set is split into ${N} chunks. Each server processes one chunk per second, all at the same time.</p>`;
  const cells=(own,done)=>{el.querySelector("[data-c]").innerHTML=Array.from({length:N},(_,i)=>{const o=own[i];return `<div class="alcell${done[i]?"":" empty"}" style="min-width:30px;padding:4px 2px;${o>=0&&done[i]?`background:var(--${["info","warn","good","bad"][o%4]}-soft);border-color:var(--${["info","warn","good","bad"][o%4]})`:""}"><small>${o>=0?"S"+(o+1):"·"}</small></div>`}).join("")};
  const run=()=>{cancelAnimationFrame(raf);let own=Array(N).fill(-1),done=Array(N).fill(false),t=0,alive=Array.from({length:sv},(_,i)=>i),queue=Array.from({length:N},(_,i)=>i),failed=false,last=0;
    const tick=()=>{t++;if(fail&&!failed&&sv>1&&done.filter(Boolean).length>=N/2){failed=true;const dead=alive.pop();}
      alive.forEach(s=>{const c=queue.shift();if(c!==undefined){own[c]=s;done[c]=true}});cells(own,done);
      el.querySelector("[data-st]").innerHTML=`<div><b>${t} s</b><span>time so far</span></div><div><b>${done.filter(Boolean).length}/${N}</b><span>chunks done</span></div><div><b>${alive.length}</b><span>servers working</span></div>`;
      if(queue.length){const go=now=>{if(!alAlive(el))return;if(now-last>(alRM()?0:220)){last=now;tick()}else raf=requestAnimationFrame(go)};raf=requestAnimationFrame(go)}
      else{const t1=N;el.querySelector("[data-m]").innerHTML=`Finished in <b>${t} seconds</b> with ${sv} server${sv>1?"s":""} (one server would take ${t1} s).${failed?" One server failed halfway, but the others picked up its remaining chunks, so the job still finished — another benefit of spreading the work.":""} In practice there's some extra time for splitting the data and combining the results, so doubling the servers doesn't quite halve the time.`}};
    cells(own,done);tick()};
  el.querySelector("[data-s]").addEventListener("input",e=>{sv=+e.target.value;el.querySelector("[data-sv]").textContent=sv});el.querySelector("[data-sv]").textContent=sv;
  el.querySelector("[data-f]").addEventListener("change",e=>{fail=e.target.checked});el.querySelector("[data-go]").addEventListener("click",run);cells(Array(N).fill(-1),Array(N).fill(false))};

/* data cleaning */
ALW.clean=function(el){const RAW=[["Ana","17","London","03/09/2025"],["Ben","16","leeds","2025-09-04"],["Cai","","London","04/09/2025"],["Ana","17","London","03/09/2025"],["Dev","250","Leeds","05/09/2025"],["Eve","15","LONDON ","2025-09-05"],["Fin","16","York","06/09/2025"],["Gia","17","york","06/09/2025"],["Hal","16","Leeds","2025-09-08"],["Ivy","18","London","08/09/2025"]];
  let rows,applied;const reset=()=>{rows=RAW.map((r,i)=>({id:i,c:r.slice(),chg:[],gone:false}));applied=new Set()};reset();
  const STEPS=[["dup","Remove duplicates","Ana's record appeared twice, which would count her twice."],["fmt","Make dates consistent","Dates were in two formats (03/09/2025 and 2025-09-04), so they couldn't be sorted or compared."],["txt","Tidy the text","london, LONDON and London were counted as different towns."],["miss","Deal with missing values","Cai's age is blank. Here the record is kept but the age is marked as missing, so it's left out of the average."],["out","Check outliers","An age of 250 is impossible — probably a typing error for 25 or 15. It's removed from the analysis until it can be checked."]];
  el.innerHTML=alH("Try it: cleaning data","a messy survey")+`<div class="alctl">${STEPS.map(([k,l])=>`<button class="btn small" data-c="${k}">${l}</button>`).join("")}<button class="btn small" data-rs>↺ Messy again</button></div><div class="alg2"><div class="tscroll"><table class="altab" data-t></table></div><div style="display:flex;flex-direction:column;gap:8px"><div class="alstats" data-st></div><div class="alpanel"><span class="eyebrow">Students per town</span><div data-ch></div></div></div></div><p class="almsg" data-m>This data has five problems. Analyse it now and the results will be wrong. Clean it one step at a time.</p>`;
  const valid=r=>!r.gone;
  const draw=()=>{el.querySelector("[data-t]").innerHTML=`<tr><th>Name</th><th>Age</th><th>Town</th><th>Joined</th></tr>`+rows.filter(valid).map(r=>`<tr>${r.c.map((v,i)=>`<td class="${r.chg.includes(i)?"chg":""} ${v===""||v==="250"?"bad":""}">${v===""?"(blank)":v}</td>`).join("")}</tr>`).join("");
    const ages=rows.filter(valid).map(r=>r.c[1]).filter(v=>v!==""&&v!=="missing"&&v!=="250 ?"&&!isNaN(+v)).map(Number),mean=ages.reduce((a,b)=>a+b,0)/(ages.length||1);
    const towns={};rows.filter(valid).forEach(r=>{towns[r.c[2]]=(towns[r.c[2]]||0)+1});const mx=Math.max(...Object.values(towns));
    el.querySelector("[data-st]").innerHTML=`<div><b>${rows.filter(valid).length}</b><span>records</span></div><div><b>${mean.toFixed(1)}</b><span>mean age</span></div>`;
    el.querySelector("[data-ch]").innerHTML=Object.entries(towns).sort((a,b)=>b[1]-a[1]).map(([t,n])=>`<div style="display:grid;grid-template-columns:6.5em 1fr 1.5em;gap:6px;align-items:center;margin:2px 0"><span class="mono" style="white-space:pre">${t.replace(/ /g,"·")}</span><div style="height:14px;width:${n/mx*100}%;background:var(--accent);border-radius:3px"></div><span class="mono">${n}</span></div>`).join("")};
  const apply=k=>{rows.forEach(r=>r.chg=[]);
    if(k==="dup"){const seen=new Set();rows.forEach(r=>{const key=r.c.join("|");if(seen.has(key)&&!r.gone){r.gone=true}seen.add(key)})}
    if(k==="fmt")rows.forEach(r=>{if(/^\d{2}\/\d{2}\/\d{4}$/.test(r.c[3])){const [d,m,y]=r.c[3].split("/");r.c[3]=`${y}-${m}-${d}`;r.chg.push(3)}});
    if(k==="txt")rows.forEach(r=>{const t=r.c[2].trim().toLowerCase().replace(/^./,c=>c.toUpperCase());if(t!==r.c[2]){r.c[2]=t;r.chg.push(2)}});
    if(k==="miss")rows.forEach(r=>{if(r.c[1]===""){r.c[1]="missing";r.chg.push(1)}});
    if(k==="out")rows.forEach(r=>{if(r.c[1]==="250"){r.c[1]="250 ?";r.chg.push(1)}});applied.add(k)};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-c]");const m=el.querySelector("[data-m]");if(e.target.closest("[data-rs]")){reset();draw();m.textContent="Back to the messy data.";return}if(!b)return;
    const k=b.dataset.c,s=STEPS.find(x=>x[0]===k);if(applied.has(k)){m.innerHTML=`Already done: ${s[1].toLowerCase()}.`;return}apply(k);draw();m.innerHTML=`<b>${s[1]}.</b> ${s[2]} ${applied.size===STEPS.length?"<br><b>All five problems fixed.</b> Compare the mean age and the town counts with the messy version.":""}`});draw()};

/* unsupervised learning: k-means clustering */
ALW.cluster=function(el){let W=600,P,C,asg,phase,it;const COL=["info","warn","good"];
  const gen=()=>{const centres=[[.25,.3],[.7,.25],[.5,.75]],r=[];centres.forEach(([x,y])=>{for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,d=Math.random()*.13;r.push([x+Math.cos(a)*d,y+Math.sin(a)*d])}});P=r;C=null;asg=null;phase=0;it=0};gen();
  el.innerHTML=alH("Try it: unsupervised learning","k-means clustering, k = 3")+`<div class="alctl"><button class="btn small primary" data-st>Next step ▶</button><button class="btn small" data-run>Run to the end</button><button class="btn small" data-new>New data</button></div><div data-svg></div><p class="almsg" data-m>36 customers, plotted by how often they shop (across) and how much they spend (down). Nobody has labelled them. Can the computer find groups by itself?</p>`;
  const d2=(a,b)=>(a[0]-b[0])**2+(a[1]-b[1])**2;
  const step=()=>{const m=el.querySelector("[data-m]");
    if(phase===0){C=[0,1,2].map(()=>P[Math.floor(Math.random()*P.length)].slice());phase=1;m.innerHTML="<b>Step 1:</b> place 3 cluster centres at random points.";}
    else if(phase===1){const old=asg&&asg.join();asg=P.map(p=>[0,1,2].reduce((b,k)=>d2(p,C[k])<d2(p,C[b])?k:b,0));it++;phase=2;m.innerHTML=old===asg.join()?"<b>Assign:</b> no point changed group, so the clusters are stable. <b>Done!</b> The computer found the groups without being told what they were — that's <b>unsupervised</b> learning. A person still has to decide what each group means (for example 'frequent big spenders').":`<b>Assign (round ${it}):</b> each point joins the group of its nearest centre.`;if(old===asg.join())phase=3}
    else if(phase===2){C=[0,1,2].map(k=>{const g=P.filter((_,i)=>asg[i]===k);return g.length?[g.reduce((a,p)=>a+p[0],0)/g.length,g.reduce((a,p)=>a+p[1],0)/g.length]:C[k]});phase=1;m.innerHTML="<b>Update:</b> each centre moves to the middle (mean) of its group. Then the points are assigned again."}
    draw()};
  const draw=()=>{const H=W>400?300:260,sx=x=>20+x*(W-40),sy=y=>14+y*(H-28);
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Scatter plot of unlabelled points being grouped into clusters">${P.map((p,i)=>`<circle cx="${sx(p[0])}" cy="${sy(p[1])}" r="7" class="${asg?["bi","bw","bg"][asg[i]]:"b"}"/>`).join("")}${C?C.map((c,k)=>`<g><path d="M${sx(c[0])-9} ${sy(c[1])-9} L${sx(c[0])+9} ${sy(c[1])+9} M${sx(c[0])+9} ${sy(c[1])-9} L${sx(c[0])-9} ${sy(c[1])+9}" style="stroke:var(--${COL[k]});stroke-width:4"/></g>`).join(""):""}</svg>`};
  el.addEventListener("click",e=>{if(e.target.closest("[data-st]")&&phase<3)step();if(e.target.closest("[data-run]")){let g=0;while(phase<3&&g++<40)step()}if(e.target.closest("[data-new]")){gen();draw();el.querySelector("[data-m]").textContent="New unlabelled data. Press Next step."}});alResp(el,w=>{W=w;draw()})};

/* a toy language model: predict the next word */
ALW.llm=function(el){const TREE={
  "The CPU fetches the":[["next",46],["instruction",31],["data",14],["program",9]],"The CPU fetches the next":[["instruction",78],["value",12],["byte",10]],"The CPU fetches the instruction":[["from",70],["and",22],["into",8]],
  "The CPU fetches the next instruction":[["from",84],["and",16]],"The CPU fetches the instruction from":[["memory",76],["RAM",19],["the",5]],"The CPU fetches the next instruction from":[["memory",81],["RAM",19]],
  "The CPU fetches the data":[["from",60],["it",25],["and",15]],"The CPU fetches the program":[["from",55],["counter",45]],"The CPU fetches the next value":[["from",90],["and",10]],"The CPU fetches the next byte":[["from",88],["and",12]],
  "The first person to walk on Mars was":[["Neil",38],["astronaut",27],["Elon",21],["nobody",14]],"The first person to walk on Mars was Neil":[["Armstrong",91],["Patel",9]],"The first person to walk on Mars was astronaut":[["Sarah",44],["James",40],["Li",16]],
  "The first person to walk on Mars was Elon":[["Musk",95],["Grant",5]],"The first person to walk on Mars was nobody":[["yet",62],["—",38]],
  "Once upon a":[["time",88],["hill",6],["Tuesday",6]],"Once upon a time":[["there",61],["in",29],[",",10]],"Once upon a time there":[["was",80],["lived",20]],"Once upon a time in":[["a",72],["the",28]]};
  const START=["The CPU fetches the","Once upon a","The first person to walk on Mars was"];let text=START[0],temp=0.2;
  el.innerHTML=alH("Try it: predicting the next word","a toy language model")+`<div class="alctl"><label>Prompt <select data-p>${START.map(s=>`<option>${s}</option>`).join("")}</select></label><label>Temperature <input type="range" min="0" max="1" step="0.1" value="${temp}" data-t> <b class="mono" data-tv></b></label></div>
   <p class="alout" data-txt style="font-size:1rem"></p><div data-bars></div><div class="alctl"><button class="btn small primary" data-go>Pick the next word ▶</button><button class="btn small" data-rs>↺ Start again</button></div><p class="almsg" data-m></p><p class="alnote">A real LLM chooses from tens of thousands of tokens using a neural network with billions of parameters. These probabilities are made up for illustration, but the process — predict, pick, repeat — is the same.</p>`;
  const opts=()=>{const o=TREE[text];if(!o)return null;const w=o.map(([t,p])=>[t,Math.pow(p,1/Math.max(temp,.05))]),s=w.reduce((a,x)=>a+x[1],0);return w.map(([t,p])=>[t,p/s*100])};
  const draw=(note)=>{el.querySelector("[data-tv]").textContent=temp.toFixed(1);el.querySelector("[data-txt]").textContent=text+" ▌";const o=opts();
    el.querySelector("[data-bars]").innerHTML=o?o.map(([t,p])=>`<div style="display:grid;grid-template-columns:7em 1fr 3.5em;gap:8px;align-items:center;margin:3px 0"><b class="mono">${t}</b><div style="height:18px;background:var(--surface);border:1px solid var(--line);border-radius:4px;overflow:hidden"><div style="height:100%;width:${p}%;background:var(--accent-soft);border-right:2px solid var(--accent)"></div></div><span class="mono">${p.toFixed(0)}%</span></div>`).join(""):`<span class="alnote">(no more predictions in this toy model)</span>`;
    el.querySelector("[data-go]").disabled=!o;
    el.querySelector("[data-m]").innerHTML=note||`The model gives every possible next word a probability, based on patterns in its training text. Low temperature: it almost always picks the most likely word. High temperature: less likely words get more chances, so the output is more varied.`};
  el.addEventListener("click",e=>{if(e.target.closest("[data-go]")){const o=opts();if(!o)return;let r=Math.random()*100,pick=o[0][0];for(const [t,p] of o){if(r<p){pick=t;break}r-=p}text+=" "+pick;
      let note="";if(text.startsWith("The first person to walk on Mars")&&!text.includes("nobody")&&TREE[text]===undefined)note=`<b>That sounds confident — and it's false.</b> No one has walked on Mars. The model only predicts likely-sounding words; it doesn't check facts. This is a <b>hallucination</b>.`;draw(note)}
    if(e.target.closest("[data-rs]")){text=el.querySelector("[data-p]").value;draw()}});
  el.querySelector("[data-p]").addEventListener("change",e=>{text=e.target.value;draw()});el.querySelector("[data-t]").addEventListener("input",e=>{temp=+e.target.value;draw()});draw()};

/* version control: commits, branches and merges */
ALW.git=function(el){let W=600,C,head,br,n,log;const reset=()=>{C=[{id:1,b:"main",msg:"Start the project",par:[]}];br={main:1};head="main";n=1;log="A repository with one commit on the main branch."};reset();
  el.innerHTML=alH("Try it: version control","commits, branches, merges")+`<div class="alctl"><button class="btn small primary" data-a="commit">Commit a change</button><button class="btn small" data-a="branch">Create branch "feature"</button><button class="btn small" data-a="switch">Switch branch</button><button class="btn small" data-a="merge">Merge feature into main</button><button class="btn small" data-a="revert">Roll back main</button><button class="btn small" data-a="rs">↺ Reset</button></div><div data-svg></div><p class="almsg" data-m></p>`;
  const MSG=["Add login page","Fix typo","Add scoring","Improve layout","Add sound","Speed up search","Add help screen"];
  const draw=()=>{const lane={main:50,feature:120},xs={};C.forEach((c,i)=>xs[c.id]=40+i*(Math.min(80,(W-80)/Math.max(C.length-1,1))));const H=170;
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Commit graph">
     <text x="4" y="${lane.main-18}" class="s">main</text>${br.feature?`<text x="4" y="${lane.feature+34}" class="s">feature</text>`:""}
     ${C.flatMap(c=>c.par.map(p=>{const a=C.find(x=>x.id===p);return `<line x1="${xs[a.id]}" y1="${lane[a.b]}" x2="${xs[c.id]}" y2="${lane[c.b]}" class="${c.merge&&p===c.par[1]?"la":"l"}" stroke-width="3"/>`})).join("")}
     ${C.map(c=>`<circle cx="${xs[c.id]}" cy="${lane[c.b]}" r="12" class="${c.merge?"bg":c.revert?"bw":c.b==="main"?"bi":"b2"}"/><text x="${xs[c.id]}" y="${lane[c.b]+4}" class="s c" style="fill:var(--ink);font-size:10px">${c.id}</text>`).join("")}
     ${Object.entries(br).map(([b,id])=>`<text x="${xs[id]}" y="${lane[C.find(c=>c.id===id).b]+(b==="main"?-20:32)}" class="c" style="font-size:11px;font-weight:700;fill:var(--${head===b?"accent":"muted"})">${head===b?"HEAD → ":""}${b}</text>`).join("")}
     <text x="${W-6}" y="${H-6}" text-anchor="end" class="s">latest: ${C[C.length-1].msg}</text></svg>`;el.querySelector("[data-m]").innerHTML=log};
  el.addEventListener("click",e=>{const b=e.target.closest("[data-a]");if(!b)return;const a=b.dataset.a;
    if(a==="rs")reset();
    if(a==="commit"){n++;const m=MSG[(n-2)%MSG.length];C.push({id:n,b:head,msg:m,par:[br[head]]});br[head]=n;log=`Commit ${n} on <b>${head}</b>: "${m}". A commit is a saved snapshot with a message, so you can always get back to it.`}
    if(a==="branch"){if(br.feature){log="The feature branch already exists."}else{br.feature=br.main;head="feature";n++;C.push({id:n,b:"feature",msg:"Start new feature",par:[br.main]});br.feature=n;log="Created a <b>feature</b> branch and switched to it. Changes here won't affect main until they're merged — so main keeps working while the feature is developed."}}
    if(a==="switch"){if(!br.feature)log="There's only one branch. Create a feature branch first.";else{head=head==="main"?"feature":"main";log=`Switched to <b>${head}</b>. New commits will go on this branch.`}}
    if(a==="merge"){if(!br.feature)log="There's no feature branch to merge.";else{n++;C.push({id:n,b:"main",msg:"Merge feature",par:[br.main,br.feature],merge:true});br.main=n;delete br.feature;head="main";log=`<b>Merged.</b> The feature's changes are combined into main in a merge commit. If both branches had changed the same lines, there would be a <b>merge conflict</b> for a person to sort out.`}}
    if(a==="revert"){const cur=C.find(c=>c.id===br.main),prev=cur.par[0];if(!prev)log="There's nothing earlier to roll back to.";else{n++;C.push({id:n,b:"main",msg:`Roll back to ${prev}`,par:[br.main],revert:true});br.main=n;head="main";log=`Something broke, so main was rolled back to the state of commit ${prev}. The history keeps every commit, so nothing is lost.`}}
    draw()});alResp(el,w=>{W=w;draw()})};

/* refactoring walk-through: data-ex picks the example; changed lines are highlighted at each stage */
const AL_REFACTOR={
 clean:{t:"Try it: cleaning up code",s:"refactoring",st:[
  ["Messy but working",`def f(l):
 c=0
 for i in l:
  if i>=40:c=c+1
 return c/len(l)*100
print(f([35,62,48,20,71]))`,"This works, and prints 60.0, but it's hard to read: one-space indents, cramped operators, two statements on one line, and names that say nothing."],
  ["Consistent layout",`def f(l):
    c = 0
    for i in l:
        if i >= 40:
            c = c + 1
    return c / len(l) * 100

print(f([35, 62, 48, 20, 71]))`,"Four-space indents, spaces around operators and after commas, one statement per line, and a blank line between the function and the main program. Nothing about what it does has changed."],
  ["Meaningful identifiers",`def pass_rate(marks):
    passes = 0
    for mark in marks:
        if mark >= 40:
            passes = passes + 1
    return passes / len(marks) * 100

print(pass_rate([35, 62, 48, 20, 71]))`,"<b>f</b>, <b>l</b>, <b>c</b> and <b>i</b> become pass_rate, marks, passes and mark. Now the code explains itself: a reader can see what it's for without tracing it."],
  ["A named constant",`PASS_MARK = 40

def pass_rate(marks):
    passes = 0
    for mark in marks:
        if mark >= PASS_MARK:
            passes = passes + 1
    return passes / len(marks) * 100

print(pass_rate([35, 62, 48, 20, 71]))`,"The 'magic number' 40 becomes the constant PASS_MARK, in capitals to show it shouldn't change. If the pass mark changes, there's one place to edit, and the condition now reads like English."],
  ["Comments and a guard",`PASS_MARK = 40

def pass_rate(marks):
    """Return the percentage of marks at or above PASS_MARK."""
    if len(marks) == 0:     # avoid dividing by zero
        return 0
    passes = 0
    for mark in marks:
        if mark >= PASS_MARK:
            passes = passes + 1
    return passes / len(marks) * 100

print(pass_rate([35, 62, 48, 20, 71]))`,"A docstring says what the function returns, and a <b>guard clause</b> deals with an empty list, which would have crashed with ZeroDivisionError. Comments explain <i>why</i>, not what each line does."]]},
 guard:{t:"Try it: flattening nested ifs",s:"guard clauses",st:[
  ["Deeply nested",`def withdraw(balance, amount):
    if amount > 0:
        if amount <= balance:
            if amount <= 500:
                balance = balance - amount
                print("Done")
            else:
                print("Over the daily limit")
        else:
            print("Not enough money")
    else:
        print("Invalid amount")
    return balance`,"Three levels of nesting. The real work is buried in the middle, and each error message is far from the check that causes it."],
  ["First guard clause",`def withdraw(balance, amount):
    if amount <= 0:
        print("Invalid amount")
        return balance
    if amount <= balance:
        if amount <= 500:
            balance = balance - amount
            print("Done")
        else:
            print("Over the daily limit")
    else:
        print("Not enough money")
    return balance`,"Reverse the first condition and leave the function straight away. This is a <b>guard clause</b>: the invalid case is handled and dealt with at the top."],
  ["All guard clauses",`def withdraw(balance, amount):
    if amount <= 0:
        print("Invalid amount")
        return balance
    if amount > balance:
        print("Not enough money")
        return balance
    if amount > 500:
        print("Over the daily limit")
        return balance
    balance = balance - amount
    print("Done")
    return balance`,"Every check is now a guard with its message next to it. No nesting at all: the normal path runs straight down the bottom of the function."],
  ["Named constant",`DAILY_LIMIT = 500

def withdraw(balance, amount):
    if amount <= 0:
        print("Invalid amount")
        return balance
    if amount > balance:
        print("Not enough money")
        return balance
    if amount > DAILY_LIMIT:
        print("Over the daily limit")
        return balance
    balance = balance - amount
    print("Done")
    return balance`,"Finally the magic number 500 becomes DAILY_LIMIT. The behaviour is identical to the first version: refactoring changes the structure, never the result."]]},
 modular:{t:"Try it: making code modular",s:"decomposition",st:[
  ["One long block",`marks = []
for i in range(3):
    marks.append(int(input("Mark: ")))
total = 0
for m in marks:
    total = total + m
avg = total / len(marks)
print("Average:", round(avg, 1))
if avg >= 50:
    print("Pass")
else:
    print("Fail")`,"Input, processing and output are all mixed together. None of it can be reused or tested on its own."],
  ["Extract a function",`def mean(values):
    total = 0
    for v in values:
        total = total + v
    return total / len(values)

marks = []
for i in range(3):
    marks.append(int(input("Mark: ")))
avg = mean(marks)
print("Average:", round(avg, 1))
if avg >= 50:
    print("Pass")
else:
    print("Fail")`,"The calculation becomes a <b>function</b>. It takes a parameter, returns a value, and uses only local variables, so it has <b>no side effects</b> and can be tested by itself: mean([2, 4]) should be 3.0."],
  ["Separate input and output",`def mean(values):
    total = 0
    for v in values:
        total = total + v
    return total / len(values)

def get_marks(n):
    marks = []
    for i in range(n):
        marks.append(int(input("Mark: ")))
    return marks

def report(avg):
    print("Average:", round(avg, 1))
    print("Pass" if avg >= 50 else "Fail")

marks = get_marks(3)
report(mean(marks))`,"Input and output get their own subprograms. This is <b>separation of concerns</b>: each part has one job. get_marks(3) is also <b>generalised</b>, since it works for any number of marks."],
  ["The main program",`PASS_MARK = 50

def mean(values):
    total = 0
    for v in values:
        total = total + v
    return total / len(values)

def get_marks(n):
    marks = []
    for i in range(n):
        marks.append(int(input("Mark: ")))
    return marks

def report(avg):
    print("Average:", round(avg, 1))
    print("Pass" if avg >= PASS_MARK else "Fail")

def main():
    marks = get_marks(3)
    report(mean(marks))

main()`,"A main() procedure reads like a summary of the program. Each function could be changed, or replaced with a library function such as statistics.mean, without touching the others."]]}};
ALW.refactor=function(el){const X=AL_REFACTOR[el.dataset.ex||"clean"]||AL_REFACTOR.clean,S=X.st;
  el.innerHTML=alH(X.t,X.s)+`<div class="alctl alrftabs" data-tabs>${S.map(([n],i)=>`<button class="btn small" data-k="${i}">${i+1}. ${n}</button>`).join("")}</div><div class="alcode" data-code></div><p class="almsg" data-m></p><div class="alctl" data-ctl></div>`;
  const esc2=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const go=k=>{const cur=S[k][1].split("\n"),prev=k?new Set(S[k-1][1].split("\n")):null;
    el.querySelector("[data-code]").innerHTML=cur.map((l,i)=>`<div class="${prev&&!prev.has(l)&&l.trim()?"cur":""}"><i>${i+1}</i>${esc2(l)}</div>`).join("");
    el.querySelector("[data-m]").innerHTML=`<b>${S[k][0]}.</b> ${S[k][2]}${k?` <span class="alnote">Highlighted lines changed.</span>`:""}`;
    el.querySelectorAll("[data-k]").forEach(b=>b.classList.toggle("primary",+b.dataset.k===k))};
  const st=alStepper(el.querySelector("[data-ctl]"),S.length,go,{ms:3500,label:(k,n)=>`Stage ${k+1} of ${n}`});
  el.querySelector("[data-tabs]").addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(b)st.set(+b.dataset.k)})};

/* boundary value analysis: build a test plan for a range check */
ALW.bva=function(el){const P=[["age","Age","whole number from 11 to 18",11,18],["mark","Mark","whole number from 0 to 100",0,100],["qty","Quantity","whole number from 1 to 12",1,12]];
  let p=P[0],rows=[],W=600;
  el.innerHTML=alH("Try it: choosing test data","boundary value analysis")+`<div class="alctl">${alSeg("bv",P.map(x=>[x[0],x[1]]),p[0])}</div><p class="alnote" data-q></p><div data-svg></div><div class="alctl" data-ch></div><div class="tscroll"><table class="altab" style="font-family:inherit" data-t></table></div><p class="almsg" data-m></p>`;
  const kind=v=>{if(typeof v==="string")return["Erroneous","Rejected",v===""+(p[3]+0.5)?"not a whole number":"wrong type of data"];const [lo,hi]=[p[3],p[4]];
    if(v===lo||v===hi)return["Boundary","Accepted","the "+(v===lo?"smallest":"largest")+" valid value"];
    if(v===lo-1||v===hi+1)return["Boundary","Rejected","just outside the range"];
    if(v>lo&&v<hi)return["Normal","Accepted","a typical valid value"];return["Erroneous","Rejected","well outside the range"]};
  const chips=()=>{const [lo,hi]=[p[3],p[4]],mid=Math.round((lo+hi)/2);return[lo-5,lo-1,lo,lo+1,mid,hi-1,hi,hi+1,hi+10,"ten",""+(lo+0.5)]};
  const draw=()=>{const [lo,hi]=[p[3],p[4]],a=lo-6,b=hi+11,x=v=>30+(v-a)/(b-a)*(W-60),Y=46;
    el.querySelector("[data-q]").innerHTML=`Validation rule: <b>${p[1]}</b> must be a ${p[2]}. Click values to add them to the test plan.`;
    const pts=rows.filter(r=>typeof r.v==="number");
    el.querySelector("[data-svg]").innerHTML=`<svg class="dg" viewBox="0 0 ${W} 90" role="img" aria-label="Number line of the valid range">
     <line x1="20" y1="${Y}" x2="${W-20}" y2="${Y}" class="l"/>
     <rect x="${x(lo)}" y="${Y-10}" width="${x(hi)-x(lo)}" height="20" rx="4" class="bg" style="opacity:.55"/>
     <text x="${x(lo)}" y="${Y+30}" class="s c">${lo}</text><text x="${x(hi)}" y="${Y+30}" class="s c">${hi}</text>
     <text x="${(x(lo)+x(hi))/2}" y="${Y-16}" class="s c">valid</text>
     ${pts.map(r=>{const k=kind(r.v)[0];return `<circle cx="${x(Math.max(a,Math.min(b,r.v)))}" cy="${Y}" r="6" class="${k==="Normal"?"bi":k==="Boundary"?"b2":"bw"}"/>`}).join("")}</svg>`;
    el.querySelector("[data-ch]").innerHTML=chips().map(c=>`<button class="btn small${rows.some(r=>String(r.v)===String(c))?" primary":""}" data-v="${c}">${typeof c==="string"?`"${c}"`:c}</button>`).join("")+`<button class="btn small" data-all>Fill the whole plan</button><button class="btn small" data-rs>↺ Clear</button>`;
    el.querySelector("[data-t]").innerHTML=`<tr><th>Test data</th><th>Type</th><th>Expected${W>=480?" result":""}</th>${W>=480?"<th>Reason</th>":""}</tr>`+(rows.length?rows.map(r=>{const k=kind(r.v);return `<tr><td class="mono">${typeof r.v==="string"?`"${r.v}"`:r.v}</td><td>${k[0]}</td><td>${k[1]}</td>${W>=480?`<td>${k[2]}</td>`:""}</tr>`}).join(""):`<tr><td colspan="4" class="alnote">No tests yet.</td></tr>`);
    const has=t=>rows.some(r=>kind(r.v)[0]===t),need=["Normal","Boundary","Erroneous"].filter(t=>!has(t)),nb=rows.filter(r=>kind(r.v)[0]==="Boundary").length;
    el.querySelector("[data-m]").innerHTML=!rows.length?"A good test plan has <b>normal</b>, <b>boundary</b> and <b>erroneous</b> data.":need.length?`Still missing: <b>${need.join(", ")}</b> data.`:nb<4?`All three types are covered. For a range check, test all four boundary values: ${p[3]-1}, ${p[3]}, ${p[4]} and ${p[4]+1}. Bugs such as &lt; instead of &lt;= only show up there.`:"A thorough test plan: every boundary on both sides, typical values, and data that must be rejected."};
  const parse=s=>{const n=Number(s);return s!==""&&Number.isInteger(n)?n:s};
  el.addEventListener("click",e=>{const s=e.target.closest("[data-bv]");if(s){p=P.find(x=>x[0]===s.dataset.bv);rows=[];alSegSet(el,"bv",p[0]);draw();return}
    const b=e.target.closest("[data-v],[data-all],[data-rs]");if(!b)return;
    if("rs" in b.dataset)rows=[];else if("all" in b.dataset)rows=chips().map(c=>({v:parse(String(c))}));
    else{const v=parse(b.dataset.v),i=rows.findIndex(r=>String(r.v)===String(v));if(i>=0)rows.splice(i,1);else rows.push({v})}draw()});
  alResp(el,w=>{W=w;draw()})};
