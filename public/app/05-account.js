/* ================= accounts: register, sign in, password reset, account, pricing, admin ================= */
const AUTH_OFF=()=>BOB.auth.available()?"":`<div class="proto">Accounts aren't switched on for this copy of the site yet. You can still use every lesson as a guest; your progress is kept in this browser.</div>`;
const formErr=(id,m)=>{const x=$("#"+id);if(x){x.textContent=m;x.hidden=!m}};
async function formBusy(form,fn){const b=form.querySelector("button[type=submit]"),t=b&&b.textContent;if(b){b.disabled=true;b.textContent="Please wait…"}
  try{return await fn()}finally{if(b&&document.body.contains(b)){b.disabled=false;b.textContent=t}}}

/* ---------- choosing a password: rules, live checklist, strength and a second entry to confirm ---------- */
const PW_MIN=10;
const PW_COMMON=["password","passw0rd","qwerty","qwertyuiop","asdfgh","zxcvbn","letmein","welcome","iloveyou","admin","login","monkey","dragon","football","baseball","sunshine","princess","starwars","whatever","trustno1","abc123","123abc","111111","000000","123123","654321","computer","student","teacher","school","bitsofbytes","igcse","cambridge"];
/* ctx: the name and email typed on the form, so a password can't just be built from them */
function pwCheck(p,ctx={}){p=p||"";const low=p.toLowerCase(),squash=low.replace(/[^a-z0-9]/g,"");
  const parts=[...(ctx.name||"").toLowerCase().split(/\s+/),...String(ctx.email||"").toLowerCase().split("@")[0].split(/[^a-z0-9]+/)].filter(w=>w.length>=3);
  const seq=s=>{let run=1;for(let i=1;i<s.length;i++){const d=s.charCodeAt(i)-s.charCodeAt(i-1);run=(d===1||d===-1||d===0)?run+1:1;if(run>=4)return true}return false};
  const guessable=!p?false:PW_COMMON.some(w=>squash.includes(w))||parts.some(w=>low.includes(w))||/(.)\1{3,}/.test(p)||seq(low);
  const rules=[
    {k:"len",ok:p.length>=PW_MIN,t:`At least ${PW_MIN} characters`},
    {k:"case",ok:/[a-z]/.test(p)&&/[A-Z]/.test(p),t:"Upper and lower case letters"},
    {k:"num",ok:/\d/.test(p),t:"At least one number"},
    {k:"guess",ok:!!p&&!guessable,t:"Not easy to guess (no common words, your name or email, or runs like 1234 or aaaa)"}];
  const ok=rules.every(r=>r.ok);
  let score=rules.filter(r=>r.ok).length+(p.length>=14?1:0)+(/[^A-Za-z0-9]/.test(p)?1:0);if(!ok)score=Math.min(score,3);
  const level=!p?"":score<=2?"Weak":score<=3?"Fair":score<=4?"Good":"Strong";
  return {ok,rules,score,level}}
function pwMessage(p,p2,ctx){const c=pwCheck(p,ctx),bad=c.rules.find(r=>!r.ok);
  if(bad)return bad.k==="guess"?"Choose a password that's harder to guess: avoid common words, your name or email, and runs like 1234.":`Your password needs: ${c.rules.filter(r=>!r.ok&&r.k!=="guess").map(r=>r.t.toLowerCase()).join(", ")}.`;
  if(p!==p2)return "The two passwords don't match.";return ""}
/* the two fields, a show/hide button, a strength bar, the checklist and a match line */
function pwFields(id,label="Password"){return `<div class="pwbox" data-pwbox="${id}">
   <label for="${id}">${label}<span class="pwwrap"><input type="password" id="${id}" autocomplete="new-password" required minlength="${PW_MIN}" data-pw="${id}" aria-describedby="${id}-rules"><button type="button" class="pwshow" data-pwshow="${id}" aria-label="Show password">Show</button></span></label>
   <div class="pwmeter" aria-hidden="true"><i></i></div><p class="pwlevel" id="${id}-level" aria-live="polite"></p>
   <ul class="pwrules" id="${id}-rules">${pwCheck("").rules.map(r=>`<li data-r="${r.k}">${r.t}</li>`).join("")}</ul>
   <p class="pwtip">Tip: three random words with a number, like <span class="mono">Kettle-Planet-Robin7</span>, are long, strong and easy to remember. Don't reuse a password from another site.</p>
   <label for="${id}2">Type it again<input type="password" id="${id}2" autocomplete="new-password" required data-pw2="${id}"></label>
   <p class="pwmatch" id="${id}-match" aria-live="polite"></p></div>`}
const pwCtx=id=>id==="rpass"?{name:($("#rname")||{}).value,email:($("#remail")||{}).value}:{name:S.user&&S.user.name,email:S.user&&S.user.email};
function pwUpdate(id){const box=document.querySelector(`[data-pwbox="${id}"]`);if(!box)return;
  const p=$("#"+id).value,p2=$("#"+id+"2").value,c=pwCheck(p,pwCtx(id));
  c.rules.forEach(r=>{const li=box.querySelector(`[data-r="${r.k}"]`);li.classList.toggle("ok",r.ok);li.classList.toggle("no",!!p&&!r.ok)});
  box.dataset.level=p?c.level.toLowerCase():"";box.querySelector(".pwmeter i").style.width=p?Math.max(12,Math.min(100,c.score/6*100))+"%":"0";
  $("#"+id+"-level").textContent=p?`Strength: ${c.level}`:"";
  const m=$("#"+id+"-match");m.className="pwmatch"+(p2?(p2===p?" ok":" no"):"");m.textContent=p2?(p2===p?"Passwords match":"Passwords don't match yet"):""}
document.addEventListener("input",e=>{const t=e.target;if(t.dataset.pw)pwUpdate(t.dataset.pw);else if(t.dataset.pw2)pwUpdate(t.dataset.pw2);else if(t.id==="rname"||t.id==="remail")pwUpdate("rpass")});
document.addEventListener("click",e=>{const b=e.target.closest("[data-pwshow]");if(!b)return;const id=b.dataset.pwshow,show=$("#"+id).type==="password";
  [$("#"+id),$("#"+id+"2")].forEach(i=>i.type=show?"text":"password");b.textContent=show?"Hide":"Show";b.setAttribute("aria-label",show?"Hide password":"Show password")});

const GLOGO=`<svg viewBox="0 0 48 48" width="20" height="20" aria-hidden="true"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.6 5.4 2.7 13.3l7.9 6.1C12.5 13.6 17.8 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.7 6c4.5-4.2 6.9-10.3 6.9-17.7z"/><path fill="#FBBC05" d="M10.6 28.6c-.5-1.4-.8-3-.8-4.6s.3-3.2.8-4.6l-7.9-6.1C1 16.6 0 20.2 0 24s1 7.4 2.7 10.7l7.9-6.1z"/><path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.7-6c-2.1 1.4-4.9 2.3-8.2 2.3-6.2 0-11.5-4.1-13.4-9.9l-7.9 6.1C6.6 42.6 14.6 48 24 48z"/></svg>`;
const googleBtn=(where)=>BOB.google?`<button class="btn gbtn" type="button" data-google="${where}">${GLOGO}<span>Continue with Google</span></button><div class="gor"><span>or ${where==="reg"?"sign up":"sign in"} with email</span></div>`:"";
function register(){
  if(S.user)return `<div class="formwrap"><h1>You're signed in</h1><p>You're signed in as ${esc(S.user.email)}.</p><a class="btn primary" href="#dashboard">Go to your dashboard</a></div>`;
  return `<div class="formwrap"><div><div class="eyebrow">Create an account</div><h1 style="margin-top:8px">Join Bits of Bytes</h1></div>
  ${AUTH_OFF()}
  <form id="regForm" novalidate>
   <div class="roles">
    <label><input type="radio" name="role" id="role-student" value="student" checked><span><b>Student</b><small>Study and track your own progress</small></span></label>
    <label><input type="radio" name="role" id="role-teacher" value="teacher"><span><b>Teacher</b><small>Manage classes and licences</small></span></label>
   </div>
   <label for="rcode" id="rcodel">Class join code <span style="font-weight:400;color:var(--muted)">(optional, from your teacher)</span><input type="text" id="rcode" maxlength="8" autocomplete="off" style="text-transform:uppercase"></label>
   ${googleBtn("reg")}
   <label for="rname">Full name<input type="text" id="rname" autocomplete="name" maxlength="100" required></label>
   <label for="remail">Email<input type="email" id="remail" autocomplete="email" required></label>
   <label for="rschool">School <span style="font-weight:400;color:var(--muted)">(optional)</span><input type="text" id="rschool" autocomplete="organization" maxlength="120"></label>
   ${pwFields("rpass","Choose a password")}
   <p class="err" id="rerr" hidden></p>
   <button class="btn primary" type="submit"${BOB.auth.available()?"":" disabled"}>Create account</button>
  </form><p class="alt">Already registered? <a href="#login">Sign in</a></p>
  <p class="vfoot">Any progress you've made as a guest in this browser is added to your new account.</p></div>`;
}
function login(){
  if(S.user)return register();
  return `<div class="formwrap"><div><div class="eyebrow">Welcome back</div><h1 style="margin-top:8px">Sign in</h1></div>
  ${AUTH_OFF()}
  ${googleBtn("log")}<p class="err" id="gerr" hidden></p>
  <form id="logForm" novalidate>
   <label for="lemail">Email<input type="email" id="lemail" autocomplete="email" required></label>
   <label for="lpass">Password<input type="password" id="lpass" autocomplete="current-password" required></label>
   <p class="err" id="lerr" hidden></p>
   <button class="btn primary" type="submit"${BOB.auth.available()?"":" disabled"}>Sign in</button>
  </form><p class="alt"><a href="#forgot">Forgotten your password?</a> · New here? <a href="#register">Create an account</a></p></div>`;
}
function forgotPage(){
  return `<div class="formwrap"><div><div class="eyebrow">Password</div><h1 style="margin-top:8px">Reset your password</h1></div>
  ${AUTH_OFF()}<p>Enter the email address you registered with. We'll send you a link to choose a new password.</p>
  <form id="forgotForm" novalidate><label for="femail">Email<input type="email" id="femail" autocomplete="email" required></label>
   <p class="err" id="ferr" hidden></p><p class="msg ok" id="fok" hidden></p>
   <button class="btn primary" type="submit"${BOB.auth.available()?"":" disabled"}>Send reset link</button></form>
  <p class="alt"><a href="#login">Back to sign in</a></p></div>`;
}
function resetPage(){
  if(!S.user)return `<div class="formwrap"><h1>Choose a new password</h1><p>Open the reset link from your email to choose a new password. Links only work once and expire after a while; you can <a href="#forgot">ask for a new one</a>.</p></div>`;
  return `<div class="formwrap"><div><div class="eyebrow">Password</div><h1 style="margin-top:8px">Choose a new password</h1></div>
  <form id="resetForm" novalidate>${pwFields("np","New password")}
   <p class="err" id="nperr" hidden></p><p class="msg ok" id="npok" hidden></p>
   <button class="btn primary" type="submit">Save new password</button></form></div>`;
}
function accountPage(){const u=S.user;
  if(!u)return `<div class="formwrap"><h1>Your account</h1><p><a href="#login">Sign in</a> to see your account.</p></div>`;
  const c=myClass(),RL={student:"Student",teacher:"Teacher",admin:"Administrator"};
  return `<div class="formwrap"><div><div class="eyebrow">${RL[u.role]||"Account"}</div><h1 style="margin-top:8px">Your account</h1></div>
  <form id="profForm" novalidate>
   <label>Email<input type="email" value="${esc(u.email)}" disabled></label>
   <label for="pname">Full name<input type="text" id="pname" value="${esc(u.name)}" maxlength="100" required></label>
   <label for="pschool">School<input type="text" id="pschool" value="${esc(u.school||"")}" maxlength="120"></label>
   <p class="err" id="perr" hidden></p><p class="msg ok" id="pok" hidden></p>
   <button class="btn primary" type="submit">Save changes</button></form>
  ${!isTeacher()?`<div class="panel"><h3>Class</h3>${c?`<p style="margin:0">You're in <b>${esc(c.name)}</b> with ${esc(teacherOf(c).name)}.</p><button class="btn small" style="align-self:flex-start" data-acc="leave">Leave this class</button>`:`<p class="sub" style="margin:0">You're studying on your own. Join a class from your <a href="#dashboard">dashboard</a>.</p>`}</div>`:""}
  <div class="panel"><h3>Password</h3><form id="pwForm" novalidate>${pwFields("pw","New password")}<button class="btn" type="submit" style="align-self:flex-start">Change password</button></form><p class="err" id="pwerr" hidden></p><p class="msg ok" id="pwok" hidden></p></div>
  ${planPanel()}
  <div class="panel"><h3>Display</h3><p class="sub" style="margin:0">Dyslexia-friendly reading, text size, light or dark theme and the site's colours.</p><a class="btn small" href="#display" style="align-self:flex-start">Display settings</a></div>
  <a class="btn" href="#signout" style="align-self:flex-start">Sign out</a></div>`;
}
let PLAN="year";
function pricing(){const P=BOB.pay,on=P.enabled;
  if(on&&!P.prices)P.loadPrices().then(()=>{if(location.hash==="#pricing")$("#app").innerHTML=pricing()});
  const pr=P.prices||{},m=P.money(pr.student_monthly),y=P.money(pr.student_yearly),lic=P.money(pr.licences);
  const save=pr.student_monthly&&pr.student_yearly?Math.round((1-pr.student_yearly.amount/(pr.student_monthly.amount*12))*100):0;
  const stu=S.user&&!isTeacher(),sub=P.access.sub,cls=P.access.class;
  let act;
  if(!on)act=`<button class="btn" disabled style="opacity:.6;cursor:not-allowed">Coming soon</button>`;
  else if(!S.user)act=`<a class="btn primary" href="#register">Create an account to subscribe</a><p class="vfoot" style="margin:0">Already have one? <a href="#login">Sign in</a>, then come back here.</p>`;
  else if(isTeacher())act=`<p class="vfoot" style="margin:0">Student subscriptions are for student accounts.</p>`;
  else if(sub)act=`<p style="margin:0"><b>You're subscribed</b> (${sub.interval==="month"?"monthly":"yearly"}).</p><button class="btn" data-pay="portal">Manage subscription</button>`;
  else if(cls)act=`<p style="margin:0"><b>You already have full access</b> through your school class.</p>`;
  else act=`<div class="dseg plint" role="radiogroup" aria-label="Billing period">${[["month","Monthly",m],["year","Yearly",y]].map(([k,n,v])=>`<label class="dopt${PLAN===k?" on":""}"><input type="radio" name="plint" value="${k}"${PLAN===k?" checked":""}><span><b>${n}</b>${v?` · ${v}`:""}${k==="year"&&save>0?` <span class="chip sec">save ${save}%</span>`:""}</span></label>`).join("")}</div>
    <button class="btn primary" data-pay="sub">Subscribe ${PLAN==="month"?"monthly":"yearly"}</button><p class="err" id="suberr" hidden></p>
    <p class="vfoot" style="margin:0">Paid securely by card through Stripe. Cancel any time; you keep access until the end of the period you've paid for.</p>`;
  return `<div class="phead"><div class="eyebrow">Pricing</div><h1>Plans for students and schools</h1><p>${on?"The first lesson in every section is free for everyone. Subscribe, or join a school class, to unlock the whole course.":"Prices are still to be confirmed. This page sets out what each plan will include."}</p></div>
  <div class="plans">
   <div class="plan" style="${accent(1)}"><span class="eyebrow">For students</span><h2>Student subscription</h2><div class="price">${on&&(m||y)?`${m?`${m}<small> / month</small>`:""}${m&&y?`<span class="sub" style="font-size:1rem"> or </span>`:""}${y?`${y}<small> / year</small>`:""}`:"Price TBC"}</div>
    <ul><li>Every Paper 1 and Paper 2 lesson, with quick checks and activities</li><li>Hundreds of past paper questions, marked for you</li><li>Flash cards and key vocabulary tests</li><li>Personal progress dashboard</li></ul>
    ${act}</div>
   <div class="plan" style="${accent(2)}"><span class="eyebrow">For teachers</span><h2>Class licences</h2><div class="price">${on&&lic?`${lic}<small> per student / year</small>`:"Price TBC"}</div>
    <ul><li>Licences for each student in your classes</li><li>Add students with a join code or email invitation</li><li>Class progress by lesson and syllabus section</li><li>Set lesson and exam-question assignments with due dates</li><li>See scores and students' answers, and adjust marks</li></ul>
    <a class="btn primary" href="${isTeacher()?"#teacher":"#register"}">${isTeacher()?(on?"Buy licences in the teacher area":"Go to the teacher area"):"Create a teacher account"}</a>
    ${on?`<p class="vfoot" style="margin:0">Schools can also pay by invoice or purchase order: request licences from the teacher area.</p>`:""}</div>
  </div>`;
}
document.addEventListener("change",e=>{if(e.target.name!=="plint")return;PLAN=e.target.value;$("#app").innerHTML=pricing()});
document.addEventListener("click",e=>{const b=e.target.closest('[data-pay="sub"]');if(!b)return;b.disabled=true;b.textContent="Opening checkout…";
  BOB.pay.checkout(PLAN==="month"?"student_monthly":"student_yearly").catch(x=>{b.disabled=false;b.textContent="Subscribe";const m=$("#suberr");if(m){m.textContent=x.message;m.hidden=false}})});
/* the account page's plan panel for students */
function planPanel(){const P=BOB.pay;if(!P.enabled||!S.user||isTeacher())return "";const sub=P.access.sub;
  const body=sub?`<p style="margin:0"><b>Student subscription</b> · ${sub.interval==="month"?"monthly":"yearly"}${sub.status==="past_due"?` · <span class="tdlate">payment overdue</span>`:""}</p>
     <p class="sub" style="margin:0">${sub.cancel_at_period_end?"Ends":"Renews"} ${sub.current_period_end?new Date(sub.current_period_end).toLocaleDateString("en-GB",{day:"numeric",month:"long",year:"numeric"}):""}</p>
     <button class="btn small" data-pay="portal" style="align-self:flex-start">Manage subscription</button>`
    :P.access.class?`<p style="margin:0">You have full access through your school class.</p>`
    :`<p style="margin:0">You're on the free plan: the first lesson in each section.</p><a class="btn primary small" href="#pricing" style="align-self:flex-start">See plans</a>`;
  return `<div class="panel"><h3>Your plan</h3>${body}</div>`}

/* ---------- admin: approve licence requests, give licences ---------- */
let ADM={err:"",ok:""};
function adminLoad(){if(!isAdmin()||SC.admin)return;BOB.school.admin.load().then(()=>{if(location.hash==="#admin")tRender()}).catch(e=>{ADM.err=e.message;tRender()})}
function adminPage(){
  if(!isAdmin())return `<div class="formwrap"><h1>Admin</h1><p>This page is only for Bits of Bytes administrators.</p></div>`;
  const D=SC.admin;
  const msg=(ADM.err?`<p class="msg bad">${esc(ADM.err)}</p>`:"")+(ADM.ok?`<p class="msg ok">${esc(ADM.ok)}</p>`:"");
  if(!D)return `<div class="phead"><div class="eyebrow">Admin</div><h1>Licences</h1></div>${msg}<div class="panel"><p class="sub" style="margin:0">Loading…</p></div>`;
  const T={};D.teachers.forEach(t=>T[t.id]=t);const who=id=>T[id]||{name:"Unknown teacher",email:"",school:""};
  const pend=D.req.filter(r=>r.status==="pending"),past=D.req.filter(r=>r.status!=="pending").slice(0,20);
  return `<div style="${accent(2)}"><div class="phead" style="padding-bottom:18px"><div class="eyebrow">Admin</div><h1>Admin</h1><p>Course content, the paywall, and teachers' licences.</p></div>${msg}
  ${admSite(D.site)}
  <h2 class="admh">Licences</h2><p class="sub">Approve teachers' licence requests, or give licences directly. Approving adds the licences to the teacher's account straight away.</p>
  <section class="panel"><div class="trow"><h3>Requests waiting (${pend.length})</h3><button class="btn small" data-adm="reload">Refresh</button></div>
   ${pend.length?`<div class="tscroll"><table class="table"><thead><tr><th>Teacher</th><th>Licences</th><th>Message</th><th>Requested</th><th></th></tr></thead><tbody>
    ${pend.map(r=>{const t=who(r.teacher);return `<tr><td><b>${esc(t.name)}</b><br><span class="sub mono">${esc(t.email)}</span>${t.school?`<br><span class="sub">${esc(t.school)}</span>`:""}</td><td class="mono">${r.n}</td><td>${r.msg?esc(r.msg):`<span class="sub">–</span>`}</td><td class="sub">${dshort(r.date)}</td>
     <td><div class="tbb"><button class="btn primary small" data-adm="approve" data-v="${r.id}">Approve</button><button class="btn small" data-adm="decline" data-v="${r.id}">Decline</button></div></td></tr>`}).join("")}</tbody></table></div>`:`<p class="sub" style="margin:0">No requests waiting.</p>`}</section>
  <div class="tgrid" style="margin-top:16px">
   <section class="panel"><h3>Give licences</h3><form id="grantForm" class="tform" novalidate>
    <label for="gemail">Teacher's email<input type="email" id="gemail" list="gteachers" required></label><datalist id="gteachers">${D.teachers.map(t=>`<option value="${esc(t.email)}">${esc(t.name)}</option>`).join("")}</datalist>
    <label for="gn">Number of licences<input type="number" id="gn" min="1" max="10000" value="10" required></label>
    <label for="gnote">Note <span class="sub">(optional, e.g. invoice number)</span><input type="text" id="gnote" maxlength="120"></label>
    <button class="btn primary" type="submit">Give licences</button></form></section>
   <section class="panel"><h3>Teachers (${D.teachers.length})</h3>${D.teachers.length?`<div class="tscroll"><table class="table"><thead><tr><th>Teacher</th><th>In use</th><th>Total</th></tr></thead><tbody>
    ${D.teachers.map(t=>`<tr><td><b>${esc(t.name)}</b><br><span class="sub mono">${esc(t.email)}</span>${t.school?` <span class="sub">· ${esc(t.school)}</span>`:""}</td><td class="mono">${t.used}</td><td class="mono">${t.total}</td></tr>`).join("")}</tbody></table></div>`:`<p class="sub" style="margin:0">No teacher accounts yet.</p>`}</section></div>
  ${past.length?`<section class="panel" style="margin-top:16px"><h3>Recent decisions</h3><ul class="tlist">${past.map(r=>{const t=who(r.teacher);return `<li><span>${esc(t.name)} · ${plural(r.n,"licence")}</span><span class="chip ${r.status==="approved"?"sec":"start"}">${r.status==="approved"?"Approved":"Declined"} ${r.decided?dshort(r.decided):""}</span></li>`}).join("")}</ul></section>`:""}</div>`}
/* course content and the paywall */
let ADMUP="";
function admSite(s){
  if(!s||s.error)return `<section class="panel admsite"><h3>Course content and paywall</h3><p class="msg bad" style="margin:0">This needs a database update: run <span class="mono">supabase/migrations/20261017070000_admin_content.sql</span> in the Supabase SQL Editor, then refresh.</p></section>`;
  const none=!s.lessons;
  return `<section class="panel admsite"><h3>Course content and paywall</h3>
   <div class="admrow"><div><b>Lessons and past paper questions</b><p class="sub">${none?"Nothing uploaded yet, so lessons are empty. Upload the content to fill them.":`${s.lessons} lessons (${s.free_lessons} free) and ${s.questions.toLocaleString()} questions (${s.free_questions} free)${s.updated?` · uploaded ${new Date(s.updated).toLocaleString("en-GB",{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}`:""}.`}</p>
     ${ADMUP?`<p class="admprog" role="status">${esc(ADMUP)}</p>`:""}</div>
    <div class="tbb"><button class="btn ${none?"primary":""}" data-adm="upload">${none?"Upload content":"Upload again"}</button>
     <input type="file" id="admfiles" accept=".html,.json" multiple hidden></div></div>
   <div class="admrow"><div><b>Paywall: ${s.payments?"on":"off"}</b><p class="sub">${s.payments?"Without a subscription or a licensed class, people can open only the first lesson of each section and its past paper questions.":"Everyone can open every lesson. Turn it on when payments are ready."}</p></div>
    <div class="tbb"><button class="btn ${s.payments?"":"primary"}" data-adm="paywall" data-v="${s.payments?"off":"on"}">${s.payments?"Turn paywall off":"Turn paywall on"}</button></div></div></section>`}
/* the two content files: from the local dev server (npm run dev), or chosen from this computer */
async function admFiles(){
  const get=async n=>{try{const r=await fetch("/__content/"+n,{cache:"no-store"});return r.ok?await r.text():null}catch(e){return null}};
  const [th,ex]=await Promise.all([get("theory.html"),get("exams.json")]);
  if(th&&ex)return {th,ex};
  return new Promise(ok=>{const f=$("#admfiles");f.value="";f.onchange=async()=>{const fs=[...f.files],pick=x=>fs.find(y=>y.name.endsWith(x));
    if(!pick(".html")||!pick(".json")){alert("Choose both files from the content folder: theory.html and exams.json.");ok(null);return}
    ok({th:await pick(".html").text(),ex:await pick(".json").text()})};
    alert("Choose theory.html and exams.json from the content folder of the site (hold Cmd to pick both).");f.click()})}
async function admUpload(){
  const F=await admFiles();if(!F)return;
  const step=t=>{ADMUP=t;tRender()};
  ADM={err:"",ok:""};document.body.classList.add("tbusy");
  try{
    const order=new Map(ALL_LESSONS.map((l,i)=>[l.id,{i,free:l.n===1}]));
    const theory=[...F.th.matchAll(/<template id="th-([^"]+)">([\s\S]*?)<\/template>/g)].map(([,id,html])=>{const o=order.get(id);if(!o)throw new Error("theory.html has a lesson the site doesn't know: "+id);return {id,ord:o.i,free:o.free,html}});
    if(!theory.length)throw new Error("No lessons found in theory.html.");
    let X;try{X=JSON.parse(F.ex)}catch(e){throw new Error("exams.json isn't valid JSON.")}
    const papers=X.EXAMS.map((data,ord)=>({id:data.id,ord,data}));
    const qs=X.Q.map((data,ord)=>({id:data.id,ord,free:(data.l||[]).some(l=>order.get(l)&&order.get(l).free),data}));
    const send=async(kind,rows,size,label)=>{for(let i=0;i<rows.length;i+=size){step(`Uploading ${label}: ${Math.min(i+size,rows.length)} of ${rows.length}…`);await BOB.school.admin.putContent(kind,rows.slice(i,i+size))}};
    await send("theory",theory,10,"lessons");await send("papers",papers,100,"papers");await send("questions",qs,150,"questions");
    step("Finishing…");
    await BOB.school.admin.finishContent({theory_ids:theory.map(r=>r.id),paper_ids:papers.map(r=>r.id),question_ids:qs.map(r=>r.id)});
    await BOB.refreshContent();await BOB.school.admin.load();
    ADM.ok=`Uploaded ${theory.length} lessons and ${qs.length.toLocaleString()} questions.`}
  catch(e){ADM.err="Upload stopped: "+e.message}
  finally{ADMUP="";document.body.classList.remove("tbusy");tRender()}}
async function admDo(fn,ok){ADM={err:"",ok:""};document.body.classList.add("tbusy");
  try{await fn();await BOB.school.admin.load();ADM.ok=ok||"Done."}catch(e){ADM.err=e.message}finally{document.body.classList.remove("tbusy")}tRender()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-adm]");if(!b||!isAdmin())return;const a=b.dataset.adm,v=b.dataset.v;
  if(a==="reload"){SC.admin=null;ADM={err:"",ok:""};tRender();adminLoad();return}
  if(a==="upload"){admUpload();return}
  if(a==="paywall"){const on=v==="on";if(confirm(on?"Turn the paywall on? People without a subscription or a licensed class will only see the first lesson of each section.":"Turn the paywall off? Everyone will be able to open every lesson."))
    admDo(async()=>{await BOB.school.admin.setPayments(on);await BOB.refreshContent()},on?"The paywall is on.":"The paywall is off.");return}
  const r=SC.admin&&SC.admin.req.find(x=>x.id===v);if(!r)return;
  const t=(SC.admin.teachers.find(x=>x.id===r.teacher)||{name:"this teacher"}).name;
  if(a==="approve"&&confirm(`Give ${plural(r.n,"licence")} to ${t}?`))admDo(()=>BOB.school.admin.decide(v,true),`${plural(r.n,"licence")} given to ${t}.`);
  if(a==="decline"&&confirm(`Decline ${t}'s request for ${plural(r.n,"licence")}?`))admDo(()=>BOB.school.admin.decide(v,false),"Request declined.")});

/* ---------- account form handling ---------- */
document.addEventListener("click",e=>{const b=e.target.closest("[data-acc]");if(!b)return;
  if(b.dataset.acc==="leave"){const c=myClass();if(c&&confirm(`Leave ${c.name}? Your teacher will no longer see your progress or set you assignments.`))tDo(()=>BOB.school.A.leaveClass(c.id))}});
document.addEventListener("submit",async e=>{const f=e.target;
  if(f.id==="regForm"){e.preventDefault();
    const name=$("#rname").value.trim(),email=$("#remail").value.trim().toLowerCase(),pass=$("#rpass").value;
    let m="";if(!name)m="Enter your name.";else if(!/^\S+@\S+\.\S+$/.test(email))m="Enter a valid email address.";else m=pwMessage(pass,$("#rpass2").value,{name,email});
    if(m)return formErr("rerr",m);formErr("rerr","");
    const role=document.querySelector("input[name=role]:checked").value,code=role==="student"?$("#rcode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,""):"";
    await formBusy(f,async()=>{try{const r=await BOB.auth.register({role,name,email,school:$("#rschool").value.trim(),code,password:pass});
      if(r.confirm)$("#app").innerHTML=`<div class="formwrap"><div class="eyebrow">Nearly there</div><h1>Check your email</h1><p>We've sent a link to <b>${esc(email)}</b>. Open it to confirm your address, then sign in.${code?" You'll join your class the first time you sign in.":""}</p><a class="btn" href="#login">Sign in</a></div>`}
      catch(x){formErr("rerr",x.message)}});return}
  if(f.id==="logForm"){e.preventDefault();const email=$("#lemail").value.trim().toLowerCase(),pass=$("#lpass").value;
    if(!email||!pass)return formErr("lerr","Enter your email and password.");formErr("lerr","");
    await formBusy(f,async()=>{try{await BOB.auth.login(email,pass)}catch(x){formErr("lerr",x.message)}});return}
  if(f.id==="forgotForm"){e.preventDefault();const email=$("#femail").value.trim().toLowerCase();
    if(!/^\S+@\S+\.\S+$/.test(email))return formErr("ferr","Enter a valid email address.");formErr("ferr","");
    await formBusy(f,async()=>{try{await BOB.auth.forgot(email);const ok=$("#fok");ok.textContent="If there's an account with that email, a reset link is on its way. Check your inbox (and spam folder).";ok.hidden=false}catch(x){formErr("ferr",x.message)}});return}
  if(f.id==="resetForm"||f.id==="pwForm"){e.preventDefault();const reset=f.id==="resetForm",id=reset?"np":"pw",p1=$("#"+id).value,p2=$("#"+id+"2").value,er=reset?"nperr":"pwerr",okid=reset?"npok":"pwok";
    const pm=pwMessage(p1,p2,pwCtx(id));if(pm)return formErr(er,pm);formErr(er,"");
    await formBusy(f,async()=>{try{await BOB.auth.setPassword(p1);f.reset();pwUpdate(id);const ok=$("#"+okid);ok.innerHTML=reset?`Password saved. <a href="#dashboard">Go to your dashboard</a>.`:"Password changed.";ok.hidden=false}catch(x){formErr(er,x.message)}});return}
  if(f.id==="profForm"){e.preventDefault();const name=$("#pname").value.trim();if(!name)return formErr("perr","Enter your name.");formErr("perr","");
    await formBusy(f,async()=>{try{await BOB.auth.updateProfile({name,school:$("#pschool").value.trim()});const ok=$("#pok");ok.textContent="Saved.";ok.hidden=false;nav("account")}catch(x){formErr("perr",x.message)}});return}
  if(f.id==="grantForm"&&isAdmin()){e.preventDefault();const email=$("#gemail").value.trim(),n=Math.floor(+$("#gn").value);
    if(!email||!(n>=1))return;admDo(()=>BOB.school.admin.grant(email,n,$("#gnote").value.trim()),`${plural(n,"licence")} given to ${email}.`)}
});

/* ---------- the account menu in the top bar: a circle with the person's initials ---------- */
const initials=n=>(String(n||"").trim().split(/\s+/).filter(Boolean).map(w=>w[0]).slice(0,2).join("")||"?").toUpperCase();
function userMenu(route){const u=S.user,RL={student:"Student",teacher:"Teacher",admin:"Administrator"},c=myClass();
  const on=r=>route===r?' class="on"':"",act=["account","pricing","admin","display"].includes(route);
  return `<div class="umenu"><button class="uavatar${act?" on":""}" data-um="toggle" aria-haspopup="menu" aria-expanded="false" aria-controls="udrop" title="${esc(u.name)}"><span aria-hidden="true">${esc(initials(u.name))}</span><span class="vh">Account menu for ${esc(u.name)}</span></button>
   <div class="udrop" id="udrop" role="menu" hidden>
    <div class="uhead"><span class="uavatar big" aria-hidden="true">${esc(initials(u.name))}</span><div><b>${esc(u.name)}</b><span class="sub">${esc(u.email)}</span><span class="sub">${RL[u.role]||""}${c?` · ${esc(c.name)}`:u.school?` · ${esc(u.school)}`:""}</span></div></div>
    <a role="menuitem" href="#account"${on("account")}>Account settings</a>
    <a role="menuitem" href="#display"${on("display")}>Display settings</a>
    ${isAdmin()?`<a role="menuitem" href="#admin"${on("admin")}>Admin</a>`:""}
    <a role="menuitem" href="#pricing"${on("pricing")}>Pricing</a>
    <hr><a role="menuitem" href="#signout" class="uout">Sign out</a></div></div>`}
function umenuSet(open){const b=document.querySelector('[data-um="toggle"]'),d=$("#udrop");if(!b||!d)return;d.hidden=!open;b.setAttribute("aria-expanded",open);
  if(open){const f=d.querySelector('[role="menuitem"]');if(f)f.focus({preventScroll:true})}}
document.addEventListener("click",e=>{const t=e.target.closest('[data-um="toggle"]');
  if(t){const d=$("#udrop");umenuSet(d&&d.hidden);return}
  if(!e.target.closest(".udrop"))umenuSet(false);else if(e.target.closest("a"))umenuSet(false)});
document.addEventListener("keydown",e=>{const d=$("#udrop");if(!d||d.hidden)return;
  if(e.key==="Escape"){umenuSet(false);document.querySelector('[data-um="toggle"]').focus();return}
  if(e.key==="ArrowDown"||e.key==="ArrowUp"){const it=[...d.querySelectorAll('[role="menuitem"]')],i=it.indexOf(document.activeElement);e.preventDefault();
    it[(i+(e.key==="ArrowDown"?1:-1)+it.length)%it.length].focus()}});

/* ---------- display settings: dyslexia-friendly reading, text size, theme and colours ---------- */
const DPRESETS=[["Teal and copper","",""],["Ocean","#1F5FA8","#C2410C"],["Forest","#2F7D32","#8E44AD"],["Berry","#9D2463","#1F6F8B"],["Navy and gold","#23395B","#B7791F"],["Slate","#475569","#0E7490"]];
const DTINTS=[["yellow","Pale yellow","#FBF3D0"],["cream","Cream","#F7F1E3"],["blue","Pale blue","#E6F0FA"],["peach","Peach","#FCEADF"],["green","Mint","#E5F4EA"]];
const DFONTS=[["lexend","Lexend","Designed to make reading easier"],["atkinson","Atkinson Hyperlegible","Clear letter shapes that are hard to mix up"],["verdana","Verdana","A wide, familiar sans serif font"]];
const dget=()=>Object.assign({},BOB.display.defaults,S.display||{});
function dset(ch){S.display=Object.assign(dget(),ch);BOB.display.apply(S.display);save();const y=scrollY;$("#app").innerHTML=displayPage();scrollTo(0,y)}
/* contrast of a colour against white (light theme surface), for a gentle warning */
function contrastWhite(hex){const c=hex.replace("#","").match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4));const L=.2126*c[0]+.7152*c[1]+.0722*c[2];return 1.05/(L+.05)}
function displayPage(){const d=dget(),cs=getComputedStyle(document.documentElement);
  const cur=n=>{const v=cs.getPropertyValue(n).trim();return /^#[0-9a-f]{6}$/i.test(v)?v:n==="--p1"?"#0D7566":"#A85A17"};
  const c1=d.c1||cur("--p1"),c2=d.c2||cur("--p2"),warn=[c1,c2].some(c=>contrastWhite(c)<3);
  const radio=(name,val,on,inner)=>`<label class="dopt${on?" on":""}"><input type="radio" name="${name}" value="${val}" data-dset="${name}"${on?" checked":""}>${inner}</label>`;
  return `<div class="formwrap dwrap"><div><div class="eyebrow">Settings</div><h1 style="margin-top:8px">Display</h1><p class="sub" style="margin:6px 0 0">Changes apply straight away${S.user?" and are saved to your account, so they follow you to any device":" and are saved in this browser"}.</p></div>
  <section class="panel"><div class="trow"><div><h3>Dyslexia-friendly reading</h3><p class="sub" style="margin:0">A tinted background, a clear sans serif font and more space between letters, words and lines.</p></div>
    <label class="dswitch"><input type="checkbox" data-dset="dys"${d.dys?" checked":""}><span aria-hidden="true"></span><b class="vh">Dyslexia-friendly reading</b></label></div>
   ${d.dys?`<div class="dsub"><span class="tlab">Background</span><div class="dtints">${DTINTS.map(([k,n,c])=>radio("tint",k,d.tint===k,`<i style="background:${c}"></i><span>${n}</span>`)).join("")}</div></div>
   <div class="dsub"><span class="tlab">Font</span><div class="dfonts">${DFONTS.map(([k,n,why])=>radio("font",k,d.font===k,`<span class="dsample" style="font-family:${k==="lexend"?'Lexend':k==="atkinson"?'"Atkinson Hyperlegible"':'Verdana'},sans-serif"><b>${n}</b><small>${why}</small></span>`)).join("")}</div></div>
   <label class="dcheck"><input type="checkbox" data-dset="spacing"${d.spacing!==false?" checked":""}> Extra space between letters, words and lines</label>`:""}
  </section>
  <section class="panel"><h3>Text size</h3><div class="dseg" role="radiogroup" aria-label="Text size">${[[100,"Standard"],[112,"Larger"],[125,"Largest"]].map(([v,n])=>radio("size",v,+d.size===v,`<span style="font-size:${v/100}rem">${n}</span>`)).join("")}</div></section>
  <section class="panel"><h3>Theme</h3>${d.dys?`<p class="sub" style="margin:0">Dyslexia-friendly reading uses a light background, so the theme is light while it's on.</p>`:""}
   <div class="dseg" role="radiogroup" aria-label="Theme">${[["auto","Match my device"],["light","Light"],["dark","Dark"]].map(([v,n])=>radio("theme",v,(d.theme||"auto")===v,`<span>${n}</span>`)).join("")}</div></section>
  <section class="panel"><h3>Colours</h3><p class="sub" style="margin:0">Choose the two main colours used for highlights, Paper 1 and Paper 2.</p>
   <div class="dcols">
    <label class="dcol"><input type="color" value="${c1}" data-dcol="c1"><span><b>Main colour</b><small>Paper 1, highlights and your initials</small></span></label>
    <label class="dcol"><input type="color" value="${c2}" data-dcol="c2"><span><b>Second colour</b><small>Paper 2 and exam questions</small></span></label>
   </div>
   ${warn?`<p class="msg bad" style="margin:0">One of these colours is quite light, so text in it may be hard to read. A darker shade works better.</p>`:""}
   <div><span class="tlab">Ready-made pairs</span><div class="dpresets">${DPRESETS.map(([n,a,b],i)=>`<button class="dpre${(d.c1||"")===a&&(d.c2||"")===b?" on":""}" data-dpre="${i}"><i style="background:${a||"#0D7566"}"></i><i style="background:${b||"#A85A17"}"></i><span>${n}</span></button>`).join("")}</div></div>
   <div class="dpreview"><span class="chip" style="background:var(--p1-soft);color:var(--p1)">Paper 1</span><span class="chip" style="background:var(--p2-soft);color:var(--p2)">Paper 2</span><span class="dbar"><i style="background:var(--p1)"></i></span><span class="dbar"><i style="background:var(--p2);width:45%"></i></span></div>
  </section>
  <button class="btn" data-dreset="1" style="align-self:flex-start">Reset all display settings</button></div>`}
document.addEventListener("change",e=>{const t=e.target;if(!t.matches("[data-dset],[data-dcol]"))return;
  if(t.dataset.dcol){dset({[t.dataset.dcol]:t.value});return}
  const k=t.dataset.dset;dset({[k]:t.type==="checkbox"?t.checked:k==="size"?+t.value:t.value})});
/* live colour while dragging the picker, saved on change */
document.addEventListener("input",e=>{const t=e.target;if(!t.matches("[data-dcol]"))return;BOB.display.apply(Object.assign(dget(),{[t.dataset.dcol]:t.value}))});
document.addEventListener("click",e=>{const p=e.target.closest("[data-dpre]");if(p){const [,a,b]=DPRESETS[+p.dataset.dpre];dset({c1:a,c2:b});return}
  if(e.target.closest("[data-dreset]")){S.display=null;BOB.display.apply(null);save();$("#app").innerHTML=displayPage()}});

/* Continue with Google: on the sign-up form it keeps the chosen role and any class code */
document.addEventListener("click",async e=>{const b=e.target.closest("[data-google]");if(!b)return;e.preventDefault();
  const reg=b.dataset.google==="reg",role=reg?(document.querySelector("input[name=role]:checked")||{}).value:"student";
  const code=reg&&role==="student"&&$("#rcode")?$("#rcode").value.trim().toUpperCase().replace(/[^A-Z0-9]/g,""):"";
  b.disabled=true;try{await BOB.auth.google({role,code})}catch(x){b.disabled=false;formErr(reg?"rerr":"gerr",x.message)}});
