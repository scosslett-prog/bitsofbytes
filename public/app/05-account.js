/* ================= accounts: register, sign in, password reset, account, pricing, admin ================= */
const AUTH_OFF=()=>BOB.auth.available()?"":`<div class="proto">Accounts aren't switched on for this copy of the site yet. You can still use every lesson as a guest; your progress is kept in this browser.</div>`;
const formErr=(id,m)=>{const x=$("#"+id);if(x){x.textContent=m;x.hidden=!m}};
async function formBusy(form,fn){const b=form.querySelector("button[type=submit]"),t=b&&b.textContent;if(b){b.disabled=true;b.textContent="Please wait…"}
  try{return await fn()}finally{if(b&&document.body.contains(b)){b.disabled=false;b.textContent=t}}}

function register(){
  if(S.user)return `<div class="formwrap"><h1>You're signed in</h1><p>You're signed in as ${esc(S.user.email)}.</p><a class="btn primary" href="#dashboard">Go to your dashboard</a></div>`;
  return `<div class="formwrap"><div><div class="eyebrow">Create an account</div><h1 style="margin-top:8px">Join Bits of Bytes</h1></div>
  ${AUTH_OFF()}
  <form id="regForm" novalidate>
   <div class="roles">
    <label><input type="radio" name="role" id="role-student" value="student" checked><span><b>Student</b><small>Study and track your own progress</small></span></label>
    <label><input type="radio" name="role" id="role-teacher" value="teacher"><span><b>Teacher</b><small>Manage classes and licences</small></span></label>
   </div>
   <label for="rname">Full name<input type="text" id="rname" autocomplete="name" maxlength="100" required></label>
   <label for="remail">Email<input type="email" id="remail" autocomplete="email" required></label>
   <label for="rschool">School <span style="font-weight:400;color:var(--muted)">(optional)</span><input type="text" id="rschool" autocomplete="organization" maxlength="120"></label>
   <label for="rcode" id="rcodel">Class join code <span style="font-weight:400;color:var(--muted)">(optional, from your teacher)</span><input type="text" id="rcode" maxlength="8" autocomplete="off" style="text-transform:uppercase"></label>
   <label for="rpass">Password <span style="font-weight:400;color:var(--muted)">(at least 8 characters)</span><input type="password" id="rpass" autocomplete="new-password" required minlength="8"></label>
   <p class="err" id="rerr" hidden></p>
   <button class="btn primary" type="submit"${BOB.auth.available()?"":" disabled"}>Create account</button>
  </form><p class="alt">Already registered? <a href="#login">Sign in</a></p>
  <p class="vfoot">Any progress you've made as a guest in this browser is added to your new account.</p></div>`;
}
function login(){
  if(S.user)return register();
  return `<div class="formwrap"><div><div class="eyebrow">Welcome back</div><h1 style="margin-top:8px">Sign in</h1></div>
  ${AUTH_OFF()}
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
  <form id="resetForm" novalidate><label for="np1">New password <span style="font-weight:400;color:var(--muted)">(at least 8 characters)</span><input type="password" id="np1" autocomplete="new-password" required minlength="8"></label>
   <label for="np2">Type it again<input type="password" id="np2" autocomplete="new-password" required minlength="8"></label>
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
  <div class="panel"><h3>Password</h3><form id="pwForm" class="tinline" novalidate><label for="pw1">New password<input type="password" id="pw1" autocomplete="new-password" minlength="8" required></label><button class="btn" type="submit">Change password</button></form><p class="err" id="pwerr" hidden></p><p class="msg ok" id="pwok" hidden></p></div>
  <a class="btn" href="#signout" style="align-self:flex-start">Sign out</a></div>`;
}
function pricing(){
  return `<div class="phead"><div class="eyebrow">Pricing</div><h1>Plans for students and schools</h1><p>Prices are still to be confirmed. This page sets out what each plan will include.</p></div>
  <div class="plans">
   <div class="plan" style="${accent(1)}"><span class="eyebrow">For students</span><h2>Student subscription</h2><div class="price">Price TBC</div>
    <ul><li>Every Paper 1 and Paper 2 topic page</li><li>Key vocabulary self-tests on every page</li><li>Personal progress dashboard</li></ul>
    <button class="btn" disabled style="opacity:.6;cursor:not-allowed">Coming soon</button></div>
   <div class="plan" style="${accent(2)}"><span class="eyebrow">For teachers</span><h2>Class licences</h2><div class="price">Price TBC</div>
    <ul><li>Licences for each student in your classes</li><li>Add students with a join code or email invitation</li><li>Class progress by lesson and syllabus section</li><li>Set lesson and exam-question assignments with due dates</li><li>See scores and students' answers, and adjust marks</li></ul>
    <a class="btn primary" href="${isTeacher()?"#teacher":"#register"}">${isTeacher()?"Go to the teacher area":"Create a teacher account"}</a></div>
  </div>`;
}

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
  return `<div style="${accent(2)}"><div class="phead" style="padding-bottom:18px"><div class="eyebrow">Admin</div><h1>Licences</h1><p>Approve teachers' licence requests, or give licences directly. Approving adds the licences to the teacher's account straight away.</p></div>${msg}
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
async function admDo(fn,ok){ADM={err:"",ok:""};document.body.classList.add("tbusy");
  try{await fn();await BOB.school.admin.load();ADM.ok=ok||"Done."}catch(e){ADM.err=e.message}finally{document.body.classList.remove("tbusy")}tRender()}
document.addEventListener("click",e=>{const b=e.target.closest("[data-adm]");if(!b||!isAdmin())return;const a=b.dataset.adm,v=b.dataset.v;
  if(a==="reload"){SC.admin=null;ADM={err:"",ok:""};tRender();adminLoad();return}
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
    let m="";if(!name)m="Enter your name.";else if(!/^\S+@\S+\.\S+$/.test(email))m="Enter a valid email address.";else if(pass.length<8)m="Use a password of at least 8 characters.";
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
  if(f.id==="resetForm"||f.id==="pwForm"){e.preventDefault();const reset=f.id==="resetForm",p1=$(reset?"#np1":"#pw1").value,p2=reset?$("#np2").value:p1,er=reset?"nperr":"pwerr",okid=reset?"npok":"pwok";
    if(p1.length<8)return formErr(er,"Use a password of at least 8 characters.");if(p1!==p2)return formErr(er,"The two passwords don't match.");formErr(er,"");
    await formBusy(f,async()=>{try{await BOB.auth.setPassword(p1);f.reset();const ok=$("#"+okid);ok.innerHTML=reset?`Password saved. <a href="#dashboard">Go to your dashboard</a>.`:"Password changed.";ok.hidden=false}catch(x){formErr(er,x.message)}});return}
  if(f.id==="profForm"){e.preventDefault();const name=$("#pname").value.trim();if(!name)return formErr("perr","Enter your name.");formErr("perr","");
    await formBusy(f,async()=>{try{await BOB.auth.updateProfile({name,school:$("#pschool").value.trim()});const ok=$("#pok");ok.textContent="Saved.";ok.hidden=false;nav("account")}catch(x){formErr("perr",x.message)}});return}
  if(f.id==="grantForm"&&isAdmin()){e.preventDefault();const email=$("#gemail").value.trim(),n=Math.floor(+$("#gn").value);
    if(!email||!(n>=1))return;admDo(()=>BOB.school.admin.grant(email,n,$("#gnote").value.trim()),`${plural(n,"licence")} given to ${email}.`)}
});
