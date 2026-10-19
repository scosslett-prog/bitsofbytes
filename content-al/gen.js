/* ---------- A-Level activity generators (merged into GEN by 02-core.js) ----------
   Each returns a fresh set of questions for a "mixed" activity: multiple choice ({kind:"mc"}) or a typed
   answer ({kind:"typed"}, base 2 / 10 / "text"). New numbers every try. */
const AL_GEN=(()=>{
const R=(a,b)=>a+Math.floor(Math.random()*(b-a+1)),pick=a=>a[Math.floor(Math.random()*a.length)];
const mc=(q,a,w,x={})=>Object.assign({kind:"mc",t:"mc",q,a,opts:shuffle([a,...w])},x);
const ty=(prompt,show,sub,base,ans,working,x={})=>Object.assign({kind:"typed",prompt,show,sub,base,ansStr:String(ans),val:typeof ans==="number"?ans:undefined,working},x);
const bin=(v,n=8)=>(v>>>0).toString(2).padStart(n,"0").slice(-n),sp=s=>s.replace(/(.{4})(?=.)/g,"$1 ");
const tc=(v,n=8)=>bin(v<0?(1<<n)+v:v,n);
const uniq=(make,n)=>{const out=[],seen=new Set();let k=0;while(out.length<n&&k++<500){const q=make();const key=q.prompt+q.show+q.q;if(seen.has(key))continue;seen.add(key);out.push(q)}return out};
const pow2=n=>Math.pow(2,n).toLocaleString("en-GB");
const G={};

/* 1.1.3 addressable memory */
G.addrmem=function(){const qs=[];
  uniq(()=>{const n=R(8,20);return ty("How many memory locations can an address bus of this width address?",`${n}-bit address bus`,"Give a whole number","10" ,Math.pow(2,n),`2<sup>${n}</sup> = ${pow2(n)} locations`,{base:10})},3).forEach(q=>qs.push(q));
  uniq(()=>{const n=R(10,16),w=pick([1,2,4]);const bytes=Math.pow(2,n)*w;return ty(`How many bytes of memory can be addressed, if each location holds ${w} byte${w>1?"s":""}?`,`${n}-bit address bus`,"Give a whole number of bytes","10",bytes,`2<sup>${n}</sup> × ${w} = ${bytes.toLocaleString("en-GB")} bytes`,{base:10})},2).forEach(q=>qs.push(q));
  const n=R(12,24);qs.push(mc(`An address bus has ${n} lines. Which expression gives the number of addressable memory locations?`,`2^${n}`,[`${n}^2`,`2 × ${n}`,`${n} × 8`],{why:`Each line carries one bit of the address, so ${n} bits can make 2<sup>${n}</sup> different addresses.`}));
  qs.push(mc("A computer's address bus is widened from 16 to 17 lines. What happens to the number of addressable locations?","It doubles",["It goes up by 1","It goes up by 16","It stays the same"],{why:"Each extra bit doubles the number of possible addresses."}));
  qs.push(mc("Which bus carries the address of the memory location being read from or written to?","Address bus",["Data bus","Control bus","Clock bus"],{why:"The address bus is one-way: the CPU sends the address out to memory."}));
  qs.push(mc("Which bus carries the read and write signals?","Control bus",["Address bus","Data bus","Serial bus"],{why:"The control bus carries control and timing signals such as memory read and memory write."}));
  return shuffle(qs).slice(0,8)};

/* 2.1.1 unsigned conversions, up to 16 bits */
G.albase=function(){const H=v=>v.toString(16).toUpperCase();
  const make=[()=>{const v=R(16,255);return ty("Convert this unsigned binary number to denary","<span class='mono'>"+sp(bin(v))+"</span>","binary","10",v,`${sp(bin(v))} = ${v}`,{base:10})},
   ()=>{const v=R(16,255);return ty("Convert this denary number to 8-bit binary",String(v),"denary",2,bin(v),`${v} = ${sp(bin(v))}`,{exact8:true,val:v})},
   ()=>{const v=R(16,255);return ty("Convert this binary number to hexadecimal","<span class='mono'>"+sp(bin(v))+"</span>","binary","text",H(v),`${sp(bin(v))}: each nibble is one hex digit → ${H(v)}`,{ph:"e.g. 3F"})},
   ()=>{const v=R(16,255);return ty("Convert this hexadecimal number to denary",H(v),"hexadecimal","10",v,`${H(v)} = ${parseInt(H(v)[0],16)} × 16 + ${parseInt(H(v).slice(-1),16)} = ${v}`,{base:10})},
   ()=>{const v=R(256,4095);return ty("Convert this hexadecimal number to denary",H(v),"hexadecimal","10",v,`${H(v)}: place values 256, 16, 1 → ${v}`,{base:10})},
   ()=>{const v=R(4096,65535);return ty("Convert this 16-bit binary number to hexadecimal","<span class='mono'>"+sp(bin(v,16))+"</span>","binary","text",H(v),`Split into nibbles: ${sp(bin(v,16))} → ${H(v)}`,{ph:"e.g. 3FA2"})},
   ()=>{const v=R(256,65535);return ty("Convert this hexadecimal number to binary",H(v),"hexadecimal","text",bin(v,H(v).length*4),`Each hex digit becomes 4 bits: ${sp(bin(v,H(v).length*4))}`,{ph:"e.g. 0011 1010",alt:bin(v,16)})}];
  return [0,1,2,3,4,5,6,1].map(i=>{let q=make[i]();q.base=q.base==="10"?10:q.base;return q})};

/* 2.1.2 units of measurement */
G.alunits=function(){const qs=[],P=["Ki","Mi","Gi","Ti"],S=["k","M","G","T"];
  for(let i=0;i<3;i++){const k=R(0,2),n=R(2,9);const bytes=n*Math.pow(1024,k+1);qs.push(ty(`How many bytes are there in ${n} ${P[k]}B?`,`${n} ${P[k]}B`,"binary prefix: ×1024 for each step","10",bytes,`${n} × 1024${k?"<sup>"+(k+1)+"</sup>":""} = ${bytes.toLocaleString("en-GB")} bytes`,{base:10}))}
  {const n=R(2,9),k=R(0,1),bits=n*Math.pow(1000,k+1);qs.push(ty(`How many bits per second is ${n} ${S[k]}bps?`,`${n} ${S[k]}bps`,"decimal prefix: ×1000 for each step","10",bits,`${n} × 1000${k?"<sup>2</sup>":""} = ${bits.toLocaleString("en-GB")} bps`,{base:10}))}
  {const n=R(3,12);qs.push(ty("How many different states can this many bits represent?",`${n} bits`,"","10",Math.pow(2,n),`2<sup>${n}</sup> = ${pow2(n)}`,{base:10}))}
  qs.push(mc("Which list is in order from smallest to largest?","nibble, byte, KiB, MiB",["byte, nibble, KiB, MiB","KiB, byte, MiB, GiB","bit, byte, GiB, MiB"]));
  qs.push(mc("Which prefix should be used for a transmission speed?","Mega (M), meaning 1,000,000",["Mebi (Mi), meaning 1,048,576","Kibi (Ki), meaning 1024","Tebi (Ti), meaning 1024⁴"],{why:"Transmission speeds use SI decimal prefixes (powers of 1000)."}));
  qs.push(mc("How many bytes are there in 1 MiB?","1,048,576",["1,000,000","1024","8,388,608"],{why:"1 MiB = 1024 × 1024 = 2<sup>20</sup> bytes."}));
  {const n=R(3,9);qs.push(mc(`A file is ${n * 8} Mib. How big is it in MiB?`,`${n} MiB`,[`${n*64} MiB`,`${n*8} MiB`,`${n*1024} MiB`],{why:"There are 8 bits in a byte, so divide the number of mebibits by 8."}))}
  return shuffle(qs).slice(0,8)};

/* 2.1.3 two's complement */
G.altc=function(){const qs=[];
  uniq(()=>{const v=-R(1,128);return ty("Represent this denary number in 8-bit two's complement",String(v).replace("-","−"),"denary",2,tc(v),`${-v} = ${sp(bin(-v))} → flip the bits and add 1 → ${sp(tc(v))}`,{exact8:true,val:parseInt(tc(v),2)})},3).forEach(q=>qs.push(q));
  uniq(()=>{const v=-R(1,128);return ty("Convert this 8-bit two's complement number to denary","<span class='mono'>"+sp(tc(v))+"</span>","two's complement","10",v,`The MSB is worth −128: ${sp(tc(v))} = ${v}`,{base:10,neg:true,ansStr:String(v)})},3).forEach(q=>qs.push(q));
  {const v=R(1,127);qs.push(ty("Negate this number: write −x in 8-bit two's complement","<span class='mono'>"+sp(bin(v))+"</span>",`= ${v}`,2,tc(-v),`Flip the bits (${sp(bin(~v&255))}) and add 1 → ${sp(tc(-v))}`,{exact8:true,val:parseInt(tc(-v),2)}))}
  qs.push(mc("What is the range of 8-bit two's complement?","−128 to +127",["−127 to +127","0 to 255","−128 to +128"],{why:"The most significant bit is worth −128 and the other bits add up to at most 127."}));
  return shuffle(qs).slice(0,8)};

/* 2.1.4 fixed point: 8 bits, two's complement, binary point after 5 bits (3 fraction bits) or 4 */
G.alfixed=function(){const qs=[];const fmt=v=>(v<0?"−":"")+String(Math.abs(v));
  const mk=()=>{const fb=pick([3,4]),ib=8-fb,raw=R(-128,127);if(raw%2===0&&Math.random()<.5)return null;const v=raw/Math.pow(2,fb);
    const b=tc(raw),shown=b.slice(0,ib)+"."+b.slice(ib);return {fb,ib,v,shown,raw}};
  for(let k=0;k<4;){const x=mk();if(!x)continue;k++;
    qs.push(ty(`Convert this 8-bit fixed-point two's complement number (${x.ib} integer bits, ${x.fb} fraction bits) to denary`,`<span class='mono'>${x.shown}</span>`,"place values: −"+Math.pow(2,x.ib-1)+" … 1 . ½ ¼ ⅛"+(x.fb===4?" 1/16":""),"text",String(x.v),`${x.shown} = ${fmt(x.v)}`,{ph:"e.g. −2.375",alt:String(x.v).replace(/^0\./,".")}))}
  for(let k=0;k<3;){const fb=3,ib=5,v=R(-15,15)+pick([0,.5,.25,.75,.125,.375,.625,.875]);if(v<-16||v>=16)continue;k++;const raw=Math.round(v*8),b=tc(raw);
    qs.push(ty("Write this number in 8-bit fixed-point two's complement with 5 integer bits and 3 fraction bits (type the 8 bits without the point)",fmt(v),"denary",2,b,`${fmt(v)} → ${b.slice(0,5)}.${b.slice(5)}`,{exact8:true,val:parseInt(b,2)}))}
  qs.push(mc("Why can't 0.1 be stored exactly in fixed-point binary?","It isn't a sum of halves, quarters, eighths and so on",["It's negative","It needs more integer bits","Binary can only store whole numbers"],{why:"Fraction bits are worth ½, ¼, ⅛, … and no finite set of these adds up to exactly 0.1."}));
  return shuffle(qs).slice(0,8)};

/* 2.2.1 binary addition and subtraction (8-bit two's complement) */
G.alarith=function(){const qs=[];
  for(let k=0;k<3;k++){const a=R(10,120),b=R(10,120),s=a+b,ov=s>127;
    qs.push(ty(`Add these 8-bit numbers${ov?" (unsigned)":""}`,`<span class='mono'>${sp(bin(a))}<br>+ ${sp(bin(b))}</span>`,"give the 8-bit result",2,bin(s&255),`${a} + ${b} = ${s}${s>255?" (a 9th bit is carried out: overflow)":""}`,{exact8:true,val:s&255}))}
  for(let k=0;k<3;k++){const a=R(5,100),b=R(5,100),d=a-b;
    qs.push(ty("Work out A − B by adding the two's complement of B. Give the 8-bit result",`<span class='mono'>A = ${sp(bin(a))}<br>B = ${sp(bin(b))}</span>`,`${a} − ${b}`,2,tc(d),`−B = ${sp(tc(-b))}; ${sp(bin(a))} + ${sp(tc(-b))} = ${sp(tc(d))} (ignore the carry out) = ${d}`,{exact8:true,val:parseInt(tc(d),2)}))}
  {const a=R(70,120),b=R(70,120);qs.push(mc(`In 8-bit two's complement, ${a} + ${b} gives a negative-looking answer. What has happened?`,"Overflow: the result is too big for the register",["Underflow: the result is too small","A carry error in the ALU","Nothing: the answer is correct"],{why:`${a+b} is more than 127, the largest positive 8-bit two's complement number, so the sign bit is overwritten.`}))}
  qs.push(mc("Which describes underflow?","A result is too close to zero (or too negative) for the number format to represent",["A result is bigger than the register","A carry out of the least significant bit","A negative number in two's complement"],{why:"Underflow happens when a result is smaller than the format can hold, e.g. a tiny fraction or a value below the minimum."}));
  return shuffle(qs).slice(0,8)};

/* 2.2.2 shifts and masks */
G.alshift=function(){const qs=[];
  {const v=R(1,63),n=R(1,2);qs.push(ty(`Logical shift left by ${n}`,`<span class='mono'>${sp(bin(v))}</span>`,"8 bits",2,bin(v<<n),`${sp(bin(v))} → ${sp(bin((v<<n)&255))} (×${1<<n})`,{exact8:true,val:(v<<n)&255}))}
  {const v=R(16,255),n=R(1,3);qs.push(ty(`Logical shift right by ${n}`,`<span class='mono'>${sp(bin(v))}</span>`,"8 bits, fill with 0s",2,bin(v>>n),`${sp(bin(v))} → ${sp(bin(v>>n))}`,{exact8:true,val:v>>n}))}
  {const v=-R(8,100),n=R(1,2),r=v>>n;qs.push(ty(`Arithmetic shift right by ${n} (two's complement)`,`<span class='mono'>${sp(tc(v))}</span>`,`= ${v}; keep the sign bit`,2,tc(r),`The sign bit is copied in from the left: ${sp(tc(r))} = ${r}`,{exact8:true,val:parseInt(tc(r),2)}))}
  {const v=R(1,255),m=R(1,255);qs.push(ty("Apply this AND mask",`<span class='mono'>${sp(bin(v))}<br>AND ${sp(bin(m))}</span>`,"",2,bin(v&m),`1 only where both bits are 1`,{exact8:true,val:v&m}))}
  {const v=R(1,255),m=R(1,255);qs.push(ty("Apply this OR mask",`<span class='mono'>${sp(bin(v))}<br>OR ${sp(bin(m))}</span>`,"",2,bin(v|m),`1 where either bit is 1`,{exact8:true,val:v|m}))}
  {const v=R(1,255),m=R(1,255);qs.push(ty("Apply this XOR mask",`<span class='mono'>${sp(bin(v))}<br>XOR ${sp(bin(m))}</span>`,"",2,bin(v^m),`1 where the bits are different`,{exact8:true,val:v^m}))}
  {const b=R(0,7);qs.push(mc(`Which mask and operation checks whether bit ${b} (counting from 0 on the right) is set?`,`AND with ${sp(bin(1<<b))}`,[`OR with ${sp(bin(1<<b))}`,`XOR with ${sp(bin(1<<b))}`,`AND with ${sp(bin(255^(1<<b)))}`],{why:"AND keeps only the bit you're interested in; the result is non-zero if that bit is 1."}))}
  qs.push(mc("Which operation toggles (flips) chosen bits?","XOR with 1s in those positions",["AND with 1s in those positions","OR with 0s in those positions","Logical shift left"],{why:"x XOR 1 = NOT x, and x XOR 0 = x."}));
  qs.push(mc("Which operation sets chosen bits to 1 without changing the others?","OR with 1s in those positions",["AND with 0s in those positions","XOR with 0s","Logical shift right"]));
  return shuffle(qs).slice(0,8)};

/* 3.2.3 monoalphabetic substitution */
G.almono=function(){const A="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""),key=shuffle(A),enc=w=>w.split("").map(c=>key[A.indexOf(c)]).join(""),dec=w=>w.split("").map(c=>A[key.indexOf(c)]).join("");
  const table=`<div class="tscroll"><table class="pvt mono subtab"><tr><th>Plain</th>${A.map(c=>`<td>${c}</td>`).join("")}</tr><tr><th>Cipher</th>${key.map(c=>`<td><b>${c}</b></td>`).join("")}</tr></table></div>`;
  const W=shuffle(["BINARY","PACKET","ROUTER","CIPHER","BUFFER","SWITCH","MODEM","QUEUE","STACK","TUPLE","ARRAY","KERNEL","CACHE","PIXEL"]);
  const qs=[];for(let i=0;i<3;i++)qs.push(ty("Encrypt this word with the substitution key above",W[i],"plaintext","text",enc(W[i]),`${W[i]} → ${enc(W[i])}`,{html:table,ph:"ciphertext"}));
  for(let i=3;i<6;i++)qs.push(ty("Decrypt this word with the substitution key above",enc(W[i]),"ciphertext","text",W[i],`${enc(W[i])} → ${W[i]}`,{html:table,ph:"plaintext"}));
  qs.push(mc("How many possible keys does a monoalphabetic substitution cipher have?","26! (about 4 × 10²⁶)",["25","26","2²⁶"],{why:"Any letter can map to any unused letter: 26 × 25 × 24 × … × 1."}));
  qs.push(mc("Why is a monoalphabetic cipher still easy to break?","Letter frequencies stay the same, so frequency analysis reveals the key",["It only has 25 keys","The key is sent with the message","It uses binary"]));
  return qs};

/* 3.2.4 Vernam (XOR one-time pad) */
G.alvernam=function(){const qs=[];
  for(let i=0;i<3;i++){const p=R(65,90),k=R(0,255),c=p^k;qs.push(ty(`Encrypt the character ${String.fromCharCode(p)} (ASCII ${p}) by XORing it with the key byte`,`<span class='mono'>plaintext ${sp(bin(p))}<br>key&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${sp(bin(k))}</span>`,"ciphertext = plaintext XOR key",2,bin(c),`${sp(bin(p))} XOR ${sp(bin(k))} = ${sp(bin(c))}`,{exact8:true,val:c}))}
  for(let i=0;i<3;i++){const p=R(65,90),k=R(0,255),c=p^k;qs.push(ty("Decrypt by XORing the ciphertext with the same key. Give the plaintext letter",`<span class='mono'>cipher ${sp(bin(c))}<br>key&nbsp;&nbsp;&nbsp;&nbsp;${sp(bin(k))}</span>`,"then convert the ASCII code to a letter","text",String.fromCharCode(p),`${sp(bin(c))} XOR ${sp(bin(k))} = ${sp(bin(p))} = ${p} = ${String.fromCharCode(p)}`,{ph:"e.g. Q"}))}
  qs.push(mc("Which is NOT a rule for a Vernam cipher to be unbreakable?","The key must be shorter than the message",["The key must be truly random","The key must be used only once","The key must be at least as long as the message"],{why:"The key must be at least as long as the plaintext, random, kept secret and never reused."}));
  qs.push(mc("Why is the Vernam cipher said to be unbreakable?","With a random one-time key, every possible plaintext of that length is equally likely",["The key is 2048 bits long","It uses public and private keys","It hides the length of the message"]));
  return shuffle(qs).slice(0,8)};

/* 3.1.2 transfer time */
G.alxfer=function(){const qs=[];
  for(let i=0;i<4;i++){const rate=pick([2,4,5,8,10,20,25,40,50,100]),t=pick([2,4,5,8,10,16,20,30,40,60,80]),size=rate*t/8;if(size%1){i--;continue}
    qs.push(ty("How long does the transfer take? Use 1 MB = 1,000,000 bytes and 1 Mbps = 1,000,000 bits per second",`${size} MB at ${rate} Mbps`,"time = size in bits ÷ rate","10",t,`${size} MB × 8 = ${size*8} Mb; ${size*8} ÷ ${rate} = ${t} s`,{base:10,unit:"seconds"}))}
  for(let i=0;i<2;i++){const rate=pick([10,20,50,100]),t=pick([4,8,16,20]);qs.push(ty("What size file, in megabytes (MB), can be sent in this time?",`${t} s at ${rate} Mbps`,"size = rate × time ÷ 8","10",rate*t/8,`${rate} × ${t} = ${rate*t} Mb ÷ 8 = ${rate*t/8} MB`,{base:10,unit:"MB"}))}
  qs.push(mc("What is latency?","The delay between data being sent and it arriving",["The amount of data sent per second","The distance a signal can travel","The number of devices on a network"]));
  qs.push(mc("Which unit is used for latency?","Milliseconds (ms)",["Megabits per second (Mbps)","Mebibytes (MiB)","Hertz (Hz)"]));
  return shuffle(qs).slice(0,8)};

/* 1.2.3 scheduling */
G.alsched=function(){const qs=[];
  for(let k=0;k<4;k++){const N=shuffle(["A","B","C","D"]).slice(0,R(3,4)).sort(),bt=N.map(()=>R(2,9));
    if(new Set(bt).size<bt.length){k--;continue}
    const tab=`<div class="tscroll"><table class="pvt"><tr><th>Process</th>${N.map(n=>`<td><b>${n}</b></td>`).join("")}</tr><tr><th>Arrives</th>${N.map(()=>`<td>0</td>`).join("")}</tr><tr><th>Burst time</th>${bt.map(b=>`<td>${b}</td>`).join("")}</tr></table></div><p class="vfoot" style="text-align:center">Processes arrived in the order ${N.join(", ")}.</p>`;
    const algo=k%2?"SJF":"FCFS",order=algo==="FCFS"?N.slice():N.map((n,i)=>[n,bt[i]]).sort((a,b)=>a[1]-b[1]).map(x=>x[0]);
    const ask=k<2?"order":"wait";
    if(ask==="order")qs.push(ty(`In which order does ${algo==="FCFS"?"first-come, first-served":"shortest job first (non-pre-emptive)"} run these processes?`,"","",
      "text",order.join(", "),`${algo==="FCFS"?"In arrival order":"Shortest burst time first"}: ${order.join(", ")}`,{html:tab,ph:"e.g. B, A, C"}));
    else{let t=0,w=0;order.forEach(n=>{w+=t;t+=bt[N.indexOf(n)]});const avg=w/order.length;if(avg%1&&(avg*4)%1){k--;continue}
      qs.push(ty(`What is the average waiting time with ${algo==="FCFS"?"first-come, first-served":"shortest job first"}?`,"","","text",String(avg),`Waiting times add up to ${w}; ${w} ÷ ${order.length} = ${avg}`,{html:tab,ph:"e.g. 4.5"}))}}
  qs.push(mc("Which algorithm gives every process an equal time slice in turn?","Round robin",["First-come, first-served","Shortest job first","Multi-level queue"]));
  qs.push(mc("Which algorithm can leave a long process waiting forever (starvation)?","Shortest job first",["Round robin","First-come, first-served","Time sharing"]));
  qs.push(mc("A process is waiting for a key press. Which state is it in?","Blocked",["Running","Ready","New"]));
  qs.push(mc("A process's time slice ends. Which state does it go to?","Ready",["Blocked","Terminated","New"]));
  return shuffle(qs).slice(0,8)};

/* 4.3 stacks and queues */
G.alstack=function(){const qs=[];
  for(let k=0;k<4;k++){const isQ=k%2===1,st=[],ops=[],pops=[];let next=R(2,9);
    for(let i=0;i<R(5,7);i++){if(st.length&&Math.random()<.35){const v=isQ?st.shift():st.pop();pops.push(v);ops.push(isQ?"dequeue()":"pop()")}else{const v=next;next+=R(1,4);st.push(v);ops.push((isQ?"enqueue(":"push(")+v+")")}}
    if(!pops.length||!st.length){k--;continue}
    const ask=Math.random()<.5;
    qs.push(ty(ask?`The ${isQ?"queue":"stack"} starts empty. Which item${pops.length>1?"s are":" is"} removed, in order?`:`The ${isQ?"queue":"stack"} starts empty. What does it contain afterwards, from ${isQ?"front to rear":"bottom to top"}?`,`<span class='mono'>${ops.join("<br>")}</span>`,"separate items with commas","text",(ask?pops:st).join(", "),`${isQ?"A queue is first in, first out":"A stack is last in, first out"}: ${ask?"removed "+pops.join(", "):"left "+st.join(", ")}`,{ph:"e.g. 4, 7"}))}
  qs.push(mc("Which data structure is last in, first out?","Stack",["Queue","Array","Set"]));
  qs.push(mc("A stack is full and another item is pushed. What is this called?","Stack overflow",["Stack underflow","Queue overflow","A collision"]));
  qs.push(mc("What does a queue's front pointer point to?","The next item to be removed",["The last item added","The first empty space","The middle of the queue"]));
  qs.push(mc("Which operation looks at the top of a stack without removing it?","peek",["pop","push","dequeue"]));
  return shuffle(qs).slice(0,8)};

/* 5.2 searching and sorting traces */
G.alsearch=function(){const qs=[];
  for(let k=0;k<3;k++){const n=R(7,12),a=[...new Set(Array.from({length:n+4},()=>R(1,60)))].slice(0,n).sort((x,y)=>x-y),t=Math.random()<.8?pick(a):R(1,60);
    let lo=0,hi=a.length-1,mids=[];while(lo<=hi){const m=Math.floor((lo+hi)/2);mids.push(a[m]);if(a[m]===t)break;if(a[m]<t)lo=m+1;else hi=m-1}
    qs.push(ty(`Binary search for ${t}. List the values checked, in order (mid = (low + high) // 2)`,`<span class='mono'>${a.map((v,i)=>`[${i}] ${v}`).join("&nbsp; ")}</span>`,"separate with commas","text",mids.join(", "),`Checked ${mids.join(", ")}${a.includes(t)?"":" – not found"}`,{ph:"e.g. 23, 41"}))}
  for(let k=0;k<2;k++){const a=Array.from({length:R(6,9)},()=>R(1,50)),t=Math.random()<.7?pick(a):51+R(0,9);const i=a.indexOf(t);
    qs.push(ty(`A linear search looks for ${t}. How many comparisons does it make?`,`<span class='mono'>${a.join(", ")}</span>`,"it stops as soon as it finds the item","10",i<0?a.length:i+1,i<0?`Not found: all ${a.length} items are checked`:`Found at position ${i}, after ${i+1} comparisons`,{base:10}))}
  qs.push(mc("What must be true before a binary search can be used?","The data must be sorted",["The data must be numbers","The list must have an even length","The item must be in the list"]));
  qs.push(mc("A sorted list has 1000 items. About how many comparisons does a binary search need at most?","10",["500","1000","100"],{why:"Each comparison halves what's left: 2¹⁰ = 1024."}));
  qs.push(mc("On a sorted list, a linear search can stop early when…","it passes the point where the item would be",["it reaches the middle","it finds a duplicate","the list is empty"]));
  return shuffle(qs).slice(0,8)};
G.alsort=function(){const qs=[];
  for(let k=0;k<3;k++){const a=Array.from({length:R(5,6)},()=>R(1,40));const b=a.slice();for(let i=0;i<b.length-1;i++)if(b[i]>b[i+1])[b[i],b[i+1]]=[b[i+1],b[i]];
    qs.push(ty("Write the list after the first pass of an ascending bubble sort",`<span class='mono'>${a.join(", ")}</span>`,"separate with commas","text",b.join(", "),`Compare neighbours and swap if needed: ${b.join(", ")}`,{ph:"e.g. 3, 8, 12"}))}
  for(let k=0;k<3;k++){const a=Array.from({length:R(5,6)},()=>R(1,40)),p=R(2,3);const b=a.slice();for(let i=1;i<=p;i++){const v=b[i];let j=i-1;while(j>=0&&b[j]>v){b[j+1]=b[j];j--}b[j+1]=v}
    qs.push(ty(`Write the list after ${p} passes of an insertion sort (each pass inserts the next item into the sorted part)`,`<span class='mono'>${a.join(", ")}</span>`,"separate with commas","text",b.join(", "),`After ${p} passes the first ${p+1} items are sorted: ${b.join(", ")}`,{ph:"e.g. 3, 8, 12"}))}
  qs.push(mc("When can a bubble sort stop early?","When a pass makes no swaps",["When it reaches the middle","After one pass","When the first two items are in order"]));
  qs.push(mc("What is the worst case for a bubble sort?","The list is in reverse order",["The list is already sorted","The list has one item","Every item is the same"]));
  return shuffle(qs).slice(0,8)};

/* generic: put steps in order (AL_ORDERS) and sort items into groups (AL_SORTS) */
G.alorder=function(){const D=AL_ORDERS[this.bank],n=D.steps.length;let st;do{st=shuffle([...Array(n).keys()])}while((D.valid||[[...Array(n).keys()]]).some(v=>v.filter((x,i)=>st[i]===x).length>1));
  return D.steps.map((text,pos)=>({kind:"order",pos,text,start:st,valid:D.valid}))};
G.alsortg=function(){const D=AL_SORTS[this.bank],Z=Object.keys(D.zones),per=D.per||Math.max(2,Math.min(4,Math.floor(12/Z.length))),zl={},keys=Z.map((_,i)=>"g"+i),it=[];
  Z.forEach((z,i)=>zl[keys[i]]=z);Z.forEach((z,i)=>shuffle(D.zones[z]).slice(0,per).forEach(text=>it.push({kind:"sort",text,z:keys[i],zones:keys,zl})));return shuffle(it)};

/* 5.3 truth tables */
G.altruth=function(){const E=[["A AND B",(a,b)=>a&b],["A OR B",(a,b)=>a|b],["A XOR B",(a,b)=>a^b],["NOT (A AND B)",(a,b)=>1-(a&b)],["NOT (A OR B)",(a,b)=>1-(a|b)],["A AND NOT B",(a,b)=>a&(1-b)],["NOT A OR B",(a,b)=>(1-a)|b],["(A OR B) AND NOT (A AND B)",(a,b)=>(a|b)&(1-(a&b))]];
  const E3=[["(A AND B) OR C",(a,b,c)=>(a&b)|c],["A AND (B OR C)",(a,b,c)=>a&(b|c)],["(A XOR B) AND C",(a,b,c)=>(a^b)&c],["NOT A AND (B OR C)",(a,b,c)=>(1-a)&(b|c)],["(A OR B) XOR C",(a,b,c)=>(a|b)^c]];
  const qs=shuffle(E).slice(0,4).map(([e,f])=>{const out=[[0,0],[0,1],[1,0],[1,1]].map(([a,b])=>f(a,b)).join("");
    return ty("Give the output column for A B = 00, 01, 10, 11, top to bottom",`<span class='mono'>${e}</span>`,"e.g. 0110","text",out,`Rows 00, 01, 10, 11 → ${out.split("").join(", ")}`,{ph:"e.g. 0110"})});
  shuffle(E3).slice(0,2).forEach(([e,f])=>{const rows=[];for(let i=0;i<8;i++)rows.push(f(i>>2&1,i>>1&1,i&1));const out=rows.join("");
    qs.push(ty("Give the output column for A B C = 000 to 111, top to bottom",`<span class='mono'>${e}</span>`,"8 bits, e.g. 00010111","text",out,`Output: ${out}`,{ph:"e.g. 00010111"}))});
  qs.push(mc("Which operator is evaluated first in A OR B AND C?","AND",["OR","They're evaluated left to right","It depends on A"],{why:"The order of precedence is brackets, NOT, AND, then OR."}));
  qs.push(mc("Which operator gives 1 only when both inputs are 0?","NOR",["NAND","XOR","AND"]));
  return shuffle(qs).slice(0,8)};

return G})();
