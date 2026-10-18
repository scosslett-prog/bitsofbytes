/* ================= Python in the browser =================
   Real Python 3 (Pyodide) runs in a background worker, loaded the first time a student presses Run,
   so a runaway loop can be stopped without freezing the page. The local test server (tests/devserver.py)
   runs the same harness with the computer's own python3 instead, so tests don't need the download.
   Used by runnable examples in lessons (<pre class="pc py" data-run>) and by "Code it" activities
   (acts with type "py"), which check each task with hidden tests. */
const PY_VER="0.26.4",PY_URL=`https://cdn.jsdelivr.net/pyodide/v${PY_VER}/full/`;
/* runs the student's code, then each test, in the same namespace. input() reads from the given lines. */
const PY_HARNESS=String.raw`
import sys, io, json, traceback
def _bob_where(e, tb_list):
    if isinstance(e, SyntaxError) and e.filename == 'main.py':
        return e.lineno
    ln = [f.lineno for f in tb_list if f.filename == 'main.py']
    return ln[-1] if ln else None
def _bob_err(e):
    tb = traceback.extract_tb(e.__traceback__)
    ln = _bob_where(e, tb)
    msg = e.msg if isinstance(e, SyntaxError) else str(e)
    return (f"Line {ln}: " if ln else "") + type(e).__name__ + (f": {msg}" if msg else "")
def _bob_run(payload):
    payload = json.loads(payload)
    lines = list(payload.get('stdin') or [])
    for name, body in (payload.get('files') or {}).items():
        with open(name, 'w') as f:
            f.write(body)
    out = io.StringIO()
    def _input(prompt=''):
        out.write(str(prompt))
        if not lines:
            raise EOFError('the program asked for more input than was given')
        v = str(lines.pop(0))
        out.write(v + '\n')
        return v
    g = {'__name__': '__main__', 'input': _input, '__code__': payload['code']}
    old = sys.stdout
    sys.stdout = out
    err = ''
    try:
        exec(compile(payload['code'], 'main.py', 'exec'), g)
    except SystemExit:
        pass
    except BaseException as e:
        err = _bob_err(e)
    finally:
        sys.stdout = old
    res = []
    for t in payload.get('tests') or []:
        sys.stdout = io.StringIO()
        try:
            exec(compile(t, 'test.py', 'exec'), g)
            res.append({'ok': True})
        except AssertionError as e:
            res.append({'ok': False, 'msg': str(e)})
        except BaseException as e:
            res.append({'ok': False, 'msg': type(e).__name__ + (': ' + str(e) if str(e) else '')})
        finally:
            sys.stdout = old
    after = {}
    for name in payload.get('readFiles') or []:
        try:
            with open(name) as f:
                after[name] = f.read()
        except Exception:
            after[name] = None
    o = out.getvalue()
    if len(o) > 20000:
        o = o[:20000] + '\n… (output cut short)'
    return json.dumps({'out': o, 'err': err, 'tests': res, 'files': after})
`;
const PY_WORKER=`importScripts("${PY_URL}pyodide.js");
let py=null;const ready=loadPyodide({indexURL:"${PY_URL}"}).then(async p=>{py=p;p.runPython(${JSON.stringify(PY_HARNESS)});return p});
onmessage=async e=>{const {id,payload}=e.data;
  try{await ready;const code=JSON.parse(payload).code||"";try{await py.loadPackagesFromImports(code)}catch(x){}
    const r=py.globals.get("_bob_run")(payload);postMessage({id,r})}
  catch(x){postMessage({id,fail:String(x&&x.message||x)})}};
ready.then(()=>postMessage({ready:true}),x=>postMessage({loadfail:String(x)}));`;

const PY={worker:null,ready:null,seq:0,wait:{},state:"idle"};
function pyWorker(){if(PY.worker)return PY.ready;
  PY.state="loading";pyStatus();
  const w=new Worker(URL.createObjectURL(new Blob([PY_WORKER],{type:"text/javascript"})));PY.worker=w;
  PY.ready=new Promise((ok,fail)=>{w.onmessage=e=>{const d=e.data;
    if(d.ready){PY.state="ready";pyStatus();ok()}
    else if(d.loadfail){PY.state="failed";pyStatus();fail(new Error("Python couldn't load. Check your internet connection and try again."))}
    else if(d.id&&PY.wait[d.id]){const W=PY.wait[d.id];delete PY.wait[d.id];clearTimeout(W.t);d.fail?W.fail(new Error(d.fail)):W.ok(JSON.parse(d.r))}};
    w.onerror=()=>{PY.state="failed";pyStatus();fail(new Error("Python couldn't load. Check your internet connection and try again."))}});
  PY.ready.catch(()=>{PY.worker=null});return PY.ready}
function pyKill(){if(PY.worker)PY.worker.terminate();PY.worker=null;PY.ready=null;PY.state="idle";
  for(const k in PY.wait){PY.wait[k].fail(new Error("stopped"));delete PY.wait[k]}}
/* one run: {code, stdin:[lines], files:{name:text}, tests:[python], readFiles:[names]} → {out, err, tests, files} */
async function pyRun(job,ms=8000){const payload=JSON.stringify(job);
  /* the local test server runs Python itself */
  if(BOB.mode==="dev"){const r=await fetch("/__py",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({harness:PY_HARNESS,payload})});
    if(!r.ok)throw new Error(await r.text());return r.json()}
  await pyWorker();
  return new Promise((ok,fail)=>{const id=++PY.seq;
    const t=setTimeout(()=>{delete PY.wait[id];pyKill();fail(new Error("Your program ran for too long and was stopped. Is there a loop that never ends, or an input() waiting for more lines?"))},ms+(PY.state==="ready"?0:4000));
    PY.wait[id]={ok,fail,t};PY.worker.postMessage({id,payload})})}
function pyStatus(){document.querySelectorAll("[data-pystat]").forEach(el=>{el.textContent=PY.state==="loading"?"Loading Python… (first run only, about 10 MB)":PY.state==="failed"?"Python couldn't load":""})}

/* ---------- a small code editor: a textarea that indents with Tab and keeps indentation on Enter ---------- */
document.addEventListener("keydown",e=>{const ta=e.target;if(!ta.matches||!ta.matches("textarea.pyed"))return;
  const v=ta.value,a=ta.selectionStart,b=ta.selectionEnd;
  if(e.key==="Tab"){e.preventDefault();
    if(a===b&&!e.shiftKey){ta.setRangeText("    ",a,b,"end");ta.dispatchEvent(new Event("input",{bubbles:true}));return}
    const s=v.lastIndexOf("\n",a-1)+1,blk=v.slice(s,b),nb=e.shiftKey?blk.replace(/^ {1,4}/gm,""):blk.replace(/^/gm,"    ");
    ta.setRangeText(nb,s,b,"select");ta.dispatchEvent(new Event("input",{bubbles:true}));return}
  if(e.key==="Enter"&&!e.ctrlKey&&!e.metaKey){const s=v.lastIndexOf("\n",a-1)+1,line=v.slice(s,a),ind=(line.match(/^ */)||[""])[0]+(/:\s*(#.*)?$/.test(line)?"    ":"");
    e.preventDefault();ta.setRangeText("\n"+ind,a,b,"end");ta.dispatchEvent(new Event("input",{bubbles:true}));return}
  if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();const run=ta.closest("[data-pybox]")?.querySelector("[data-py=run]");if(run)run.click()}});
const pyLines=s=>String(s||"").replace(/\r/g,"").split("\n").filter((x,i,a)=>i<a.length-1||x!=="");
function pyOutHTML(r){return `${r.out?esc(r.out):""}${r.err?`<span class="pyerr">${esc(r.err)}</span>`:""}${!r.out&&!r.err?`<span class="pymuted">(no output)</span>`:""}`}

/* ---------- runnable examples in lesson text ---------- */
function pyInitRunnable(root){(root||document).querySelectorAll("pre.pc.py[data-run]:not([data-ready])").forEach(pre=>{pre.dataset.ready="1";
  const code=pre.textContent,needs=/input\s*\(/.test(code),box=document.createElement("div");box.className="pyrun";box.dataset.pybox="1";
  pre.replaceWith(box);
  box.innerHTML=`<div class="pyhead"><span>${esc(pre.dataset.t||"Python")}</span><span class="pybtns"><button class="btn small" data-py="edit">Edit</button><button class="btn small primary" data-py="run">▶ Run</button></span></div>
   <pre class="pc py pyview">${esc(code)}</pre><textarea class="pyed" spellcheck="false" hidden aria-label="Python code">${esc(code)}</textarea>
   ${needs?`<label class="pyinp"><span>Input, one line each time input() asks</span><textarea rows="2" data-py="stdin">${esc((pre.dataset.stdin||"").split("|").join("\n"))}</textarea></label>`:""}
   <div class="pyout" hidden aria-live="polite"><span class="eyebrow">Output</span><pre></pre><small data-pystat></small></div>`;
  box._orig=code})}
document.addEventListener("click",async e=>{const b=e.target.closest("[data-pybox] [data-py]");if(!b||b.tagName==="TEXTAREA")return;const box=b.closest("[data-pybox]"),a=b.dataset.py;
  if(!box.classList.contains("pyrun"))return;
  const ta=box.querySelector("textarea.pyed"),view=box.querySelector(".pyview");
  if(a==="edit"){const on=ta.hidden;ta.hidden=!on;view.hidden=on;b.textContent=on?"Reset":"Edit";if(!on){ta.value=box._orig;view.textContent=box._orig}else{ta.style.height=Math.max(80,view.offsetHeight)+"px";ta.focus()}return}
  if(a==="run"){const code=ta.hidden?box._orig:ta.value,out=box.querySelector(".pyout"),pre=out.querySelector("pre");out.hidden=false;pre.innerHTML=`<span class="pymuted">Running…</span>`;pyStatus();
    b.disabled=true;try{const r=await pyRun({code,stdin:pyLines(box.querySelector("[data-py=stdin]")?.value)});pre.innerHTML=pyOutHTML(r)}catch(x){pre.innerHTML=`<span class="pyerr">${esc(x.message)}</span>`}finally{b.disabled=false;pyStatus()}}});

/* ---------- "Code it" activities: a list of tasks, an editor and hidden tests ----------
   act: {id, title, desc, type:"py", explain, tasks:[{title, brief(html), starter, stdin:[], files:{}, tests:[{name, py}|{name, stdin:[], expect}], hint, solution}]} */
const PYS={};
function pyKey(l,a){return l.id+"-"+a.id}
function pyState(l,a){const k=pyKey(l,a);return PYS[k]||(PYS[k]={i:0,code:{},res:{},fails:{},hint:{},sol:{},out:null})}
function pyRecord(l,a){const r=S.acts[pyKey(l,a)];return r&&r.tasks?r:null}
function pyCard(l,a){const el=document.getElementById("act-"+a.id);if(!el)return;const P=pyState(l,a),rec=pyRecord(l,a),T=a.tasks,big=el.classList.contains("focus");
  const nDone=T.filter((_,i)=>rec&&rec.tasks[i]).length;
  const head=`<div class="vhead act"><h3>${a.title}<small>${a.desc}</small></h3><div class="vtools">${rec?`<span class="chip ${nDone===T.length?"sec":nDone?"dev":"start"}">${nDone}/${T.length} tasks</span>`:`<span class="chip none">Not started</span>`}
   <button class="iconbtn" data-act="afocus" aria-label="${big?"Close full screen view":"Open in full screen view"}" title="${big?"Close":"Enlarge"}">${big?`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" fill="none"/></svg>`:`<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>`}</button></div></div>`;
  if(!big){el.innerHTML=`${head}<div class="vbody"><p>${a.explain}</p><button class="btn primary" data-act="afocus">${rec?"Carry on coding":"Start coding"}</button>${rec?`<p class="vfoot">${nDone} of ${T.length} tasks passed.</p>`:""}</div>`;return}
  const i=P.i,t=T[i],code=P.code[i]!=null?P.code[i]:t.starter||"",res=P.res[i];
  el.innerHTML=`${head}<div class="vbody pytask" data-pybox="1" data-l="${l.id}" data-a="${a.id}">
   <div class="pytabs" role="tablist">${T.map((x,k)=>`<button role="tab" aria-selected="${k===i}" data-pyt="${k}" class="${rec&&rec.tasks[k]?"ok":""}"><span>${rec&&rec.tasks[k]?"✓":k+1}</span>${esc(x.title)}</button>`).join("")}</div>
   <div class="pybrief">${t.brief}</div>
   <div class="pyedwrap"><div class="pyhead"><span>main.py</span><span class="pybtns"><button class="btn small" data-pyc="reset" title="Put the starting code back">Reset</button><button class="btn small" data-pyc="run">▶ Run</button><button class="btn small primary" data-pyc="check">Check my code</button></span></div>
    <textarea class="pyed" spellcheck="false" aria-label="Your Python code" data-pyc="code" rows="${Math.min(22,Math.max(8,code.split("\n").length+3))}">${esc(code)}</textarea></div>
   ${t.stdin||/input\s*\(/.test(t.starter||"")?`<label class="pyinp"><span>Input for ▶ Run, one line each time input() asks</span><textarea rows="2" data-pyc="stdin">${esc((P.stdin&&P.stdin[i]!=null?P.stdin[i]:(t.stdin||[]).join("\n")))}</textarea></label>`:""}
   <div class="pyout"${P.out&&P.out.i===i?"":" hidden"} aria-live="polite"><span class="eyebrow">Output</span><pre>${P.out&&P.out.i===i?P.out.html:""}</pre><small data-pystat></small></div>
   ${res?`<div class="pyres ${res.every(x=>x.ok)?"ok":"bad"}" aria-live="polite"><b>${res.every(x=>x.ok)?"All tests passed. Well done!":`${res.filter(x=>x.ok).length} of ${res.length} tests passed`}</b><ul>${res.map((x,k)=>`<li class="${x.ok?"ok":"no"}"><span>${x.ok?"✓":"✗"}</span>${esc(t.tests[k].name)}${!x.ok&&x.msg?`<small>${esc(x.msg)}</small>`:""}</li>`).join("")}</ul></div>`:""}
   <div class="pymore">${t.hint?`<button class="btn small" data-pyc="hint" aria-expanded="${!!P.hint[i]}">${P.hint[i]?"Hide hint":"Show a hint"}</button>`:""}${t.solution&&(P.fails[i]||0)>=2||P.sol[i]?`<button class="btn small" data-pyc="sol" aria-expanded="${!!P.sol[i]}">${P.sol[i]?"Hide a model answer":"Show a model answer"}</button>`:""}${i<T.length-1?`<button class="btn small" data-pyt="${i+1}">Next task →</button>`:""}</div>
   ${P.hint[i]?`<div class="callout tip"><span class="k">Hint</span><p>${t.hint}</p></div>`:""}
   ${P.sol[i]?`<div class="pysol"><span class="eyebrow">One possible answer</span><pre class="pc py">${esc(t.solution)}</pre></div>`:""}
   <p class="vfoot">Ctrl + Enter runs your code. Tab indents. ${nDone} of ${T.length} tasks passed.</p></div>`}
/* the activity system calls actCard for every activity; "Code it" activities draw themselves */
{const base=actCard;actCard=function(l,a){return a&&a.type==="py"?pyCard(l,a):base(l,a)}}
document.addEventListener("input",e=>{const ta=e.target;if(!ta.matches)return;const box=ta.closest(".pytask[data-pybox]");if(!box)return;
  const l=ALL_LESSONS.find(x=>x.id===box.dataset.l),a=l&&l.acts.find(x=>x.id===box.dataset.a);if(!a)return;const P=pyState(l,a);
  if(ta.dataset.pyc==="code")P.code[P.i]=ta.value;if(ta.dataset.pyc==="stdin")(P.stdin||(P.stdin={}))[P.i]=ta.value});
document.addEventListener("click",async e=>{const b=e.target.closest(".pytask [data-pyc],.pytask [data-pyt]");if(!b)return;const box=b.closest(".pytask");
  const l=ALL_LESSONS.find(x=>x.id===box.dataset.l),a=l.acts.find(x=>x.id===box.dataset.a),P=pyState(l,a),t=a.tasks[P.i];
  if(b.dataset.pyt!=null){P.i=+b.dataset.pyt;pyCard(l,a);box.closest(".check")?.querySelector(".pyed")?.focus({preventScroll:true});return}
  const c=b.dataset.pyc,code=box.querySelector("textarea.pyed").value;
  if(c==="reset"){P.code[P.i]=t.starter||"";P.res[P.i]=null;pyCard(l,a);return}
  if(c==="hint"){P.hint[P.i]=!P.hint[P.i];pyCard(l,a);return}
  if(c==="sol"){P.sol[P.i]=!P.sol[P.i];pyCard(l,a);return}
  if(c==="run"){const out=box.querySelector(".pyout"),pre=out.querySelector("pre");out.hidden=false;pre.innerHTML=`<span class="pymuted">Running…</span>`;b.disabled=true;pyStatus();
    try{const r=await pyRun({code,stdin:pyLines(box.querySelector("[data-pyc=stdin]")?.value),files:t.files});P.out={i:P.i,html:pyOutHTML(r)}}catch(x){P.out={i:P.i,html:`<span class="pyerr">${esc(x.message)}</span>`}}
    pre.innerHTML=P.out.html;b.disabled=false;pyStatus();return}
  if(c==="check"){b.disabled=true;b.textContent="Checking…";const out=box.querySelector(".pyout");out.hidden=false;out.querySelector("pre").innerHTML=`<span class="pymuted">Running the tests…</span>`;pyStatus();
    let res;try{res=await pyCheck(t,code)}catch(x){res=t.tests.map(()=>({ok:false,msg:x.message}))}
    P.res[P.i]=res;const ok=res.every(x=>x.ok);if(!ok)P.fails[P.i]=(P.fails[P.i]||0)+1;
    if(res.last)P.out={i:P.i,html:pyOutHTML(res.last)};
    pySave(l,a,P.i,ok);pyCard(l,a)}});
/* run the hidden tests: assert tests share one run; input/output tests get a run each */
async function pyCheck(t,code){const asserts=t.tests.map((x,k)=>x.py?k:-1).filter(k=>k>=0),res=[];let last=null;
  if(asserts.length){const r=await pyRun({code,stdin:t.stdin||[],files:t.files,tests:asserts.map(k=>t.tests[k].py)});last=r;
    asserts.forEach((k,j)=>{res[k]=r.err?{ok:false,msg:"Your code stopped with an error: "+r.err}:r.tests[j]})}
  for(let k=0;k<t.tests.length;k++){const x=t.tests[k];if(x.py)continue;
    const r=await pyRun({code,stdin:x.stdin||[],files:t.files});last=r;const norm=s=>String(s).replace(/\s+/g," ").trim().toLowerCase();
    const want=[].concat(x.expect),got=norm(r.out),miss=want.filter(w=>!got.includes(norm(w)));
    res[k]=r.err?{ok:false,msg:r.err}:miss.length?{ok:false,msg:`Expected the output to include "${miss[0]}"`+(x.stdin&&x.stdin.length?` when the input is ${x.stdin.join(", ")}`:"")}:{ok:true}}
  res.last=last;return res}
function pySave(l,a,i,ok){const k=pyKey(l,a),T=a.tasks.length;let o=pyRecord(l,a)||{tasks:{},attempts:0,hist:[],qn:T,bestN:0};
  if(ok)o.tasks[i]=true;o.attempts++;const n=Object.keys(o.tasks).length;o.qn=T;o.correct=n;o.total=T;o.lastN=n;o.bestN=Math.max(o.bestN||0,n);
  o.best=Math.round(o.bestN/T*100);o.last=Math.round(n/T*100);o.date=new Date().toISOString();o.hist.push({date:o.date,n,wrong:[]});if(o.hist.length>20)o.hist.shift();
  S.acts[k]=o;save()}
/* runnable examples appear whenever a lesson is drawn */
new MutationObserver(()=>pyInitRunnable($("#app"))).observe(document.getElementById("app"),{childList:true});
