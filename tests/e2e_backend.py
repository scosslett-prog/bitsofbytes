"""End-to-end: teacher, admin and students through the dev server (real RLS on local Postgres).
Start the server first:  python3 tests/devserver.py --db bobe2e --port 8787 --reset"""
import json, subprocess, sys
from playwright.sync_api import sync_playwright
B = 'http://localhost:8787/'
DB = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-d', sys.argv[1] if len(sys.argv) > 1 else 'bobe2e', '-qtAX', '-c']
sql = lambda q: subprocess.run(DB + [q], capture_output=True, text=True).stdout.strip()
fails = 0
def ok(name, cond, info=''):
    global fails
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  -> ' + str(info)), flush=True)
    if not cond: fails += 1

with sync_playwright() as p:
    br = p.chromium.launch()
    errs = []
    def page():
        ctx = br.new_context(); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.on('dialog', lambda d: d.accept())
        pg.goto(B + '#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        return pg
    def go(pg, r): pg.evaluate(f'location.hash="{r}"'); pg.wait_for_timeout(150)
    def idle(pg): pg.wait_for_function('!document.body.classList.contains("tbusy")'); pg.wait_for_timeout(100)
    def register(pg, role, name, email, code='', school='Test School'):
        go(pg, 'register'); pg.check(f'#role-{role}'); pg.fill('#rname', name); pg.fill('#remail', email); pg.fill('#rschool', school)
        if code: pg.fill('#rcode', code)
        pg.fill('#rpass', 'password123')
        with pg.expect_navigation(): pg.click('#regForm button[type=submit]')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def login(pg, email):
        go(pg, 'login'); pg.fill('#lemail', email); pg.fill('#lpass', 'password123')
        with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def signout(pg):
        with pg.expect_navigation(): go(pg, 'signout')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def flushed(pg): pg.evaluate('BOB.store.flush()'); pg.wait_for_function('BOB.store.status==="saved"')

    # ---- teacher registers and asks for licences
    T = page()
    register(T, 'teacher', 'Ms Rivera', 'rivera@school.org')
    ok('teacher lands in the teacher area', T.evaluate('location.hash') == '#teacher', T.evaluate('location.hash'))
    ok('nav shows My classes and Account', 'My classes' in T.inner_text('#links') and 'Account' in T.inner_text('#links'))
    T.fill('#reqn', '2'); T.fill('#reqm', 'PO 1234'); T.click('#reqForm button'); idle(T)
    ok('licence request shows as waiting', 'Waiting for approval' in T.inner_text('#app'))
    ok('request stored', sql("select quantity||'|'||status||'|'||message from licence_requests") == '2|pending|PO 1234')

    # ---- admin approves
    A = page()
    register(A, 'student', 'Sam Admin', 'sam@bitsofbytes.co')
    sql("update profiles set role='admin' where email='sam@bitsofbytes.co'")
    signout(A); login(A, 'sam@bitsofbytes.co')
    ok('admin lands on teacher area, sees Admin link', 'Admin' in A.inner_text('#links'))
    go(A, 'admin'); A.wait_for_selector('[data-adm="approve"]')
    ok('admin sees the request with the teacher', 'Ms Rivera' in A.inner_text('#app') and 'PO 1234' in A.inner_text('#app'))
    A.click('[data-adm="approve"]'); idle(A); A.wait_for_timeout(300)
    ok('approval confirmed', 'given to Ms Rivera' in A.inner_text('#app'), A.inner_text('#app')[:300])
    ok('grant created', sql('select sum(quantity) from licence_grants') == '2')

    # ---- teacher creates a class and invites a student
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")'); go(T, 'teacher')
    ok('teacher sees 2 licences', '2\ntotal' in T.inner_text('.tlstats'), T.inner_text('.tlstats'))
    T.fill('#clsn', '10B Computer Science'); T.click('#clsForm button'); idle(T)
    ok('class page opens', T.evaluate('location.hash').startswith('#class-') and '10B Computer Science' in T.inner_text('h1'))
    code = T.inner_text('.tcode.big').strip()
    ok('join code shown', len(code) == 6, code)
    T.fill('#invs', 'Kim@Student.org'); T.click('#invForm button'); idle(T)
    ok('invitation listed (lower case)', 'kim@student.org' in T.inner_text('#app'))

    # ---- student 1 registers with the join code, after doing some work as a guest
    S1 = page()
    go(S1, 'l-1-1-binary'); S1.wait_for_timeout(200)
    S1.evaluate('S.lessons["1-1-binary"]={best:75,last:75,attempts:1,date:new Date().toISOString()};S.conf["1-1-binary"]=3;save()')
    ok('guest progress kept in this browser', 'best' in (S1.evaluate('localStorage.getItem("bob-state-v1")') or ''))
    register(S1, 'student', 'Lee Chan', 'lee@student.org', code=code.lower())
    ok('student joined class from sign-up code', S1.evaluate('!!myClass()') and 'joined your class' in S1.inner_text('#app'), S1.inner_text('#app')[:200])
    ok('guest progress merged into the account', sql("select data->>'best' from user_progress where kind='lessons' and key='1-1-binary'") == '75')
    ok('guest state merged (confidence rating)', sql("select data->'conf'->>'1-1-binary' from user_state") == '3')
    ok('guest copy cleared from browser', S1.evaluate('localStorage.getItem("bob-state-v1")') is None)

    # ---- student 2 registers with the invited email and accepts
    S2 = page()
    register(S2, 'student', 'Kim Park', 'kim@student.org')
    go(S2, 'home')
    ok('invite banner shows', 'invited you to join' in S2.inner_text('#app'))
    S2.click('.tbanner [data-tc="accept"]'); idle(S2)
    ok('student 2 joined via invite', S2.evaluate('!!myClass()'))
    ok('invite removed after joining', sql('select count(*) from class_invites') == '0')

    # ---- licences are now full
    S3 = page()
    register(S3, 'student', 'Ana Silva', 'ana@student.org', code=code)
    ok('third student refused: no licences', not S3.evaluate('!!myClass()') and 'no free licences' in S3.inner_text('#app'), S3.inner_text('#app')[:200])

    # ---- teacher sets two assignments
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")')
    cid = T.evaluate('Object.keys(SC.classes)[0]')
    go(T, 'class-' + cid)
    ok('teacher sees 2 students', '2 students' in T.inner_text('#app'))
    T.click('[data-tc="tab"][data-v="assign"]'); T.click('[data-tc="newasg"]'); T.wait_for_selector('#asgForm')
    T.fill('#atitle', 'Binary basics')
    T.evaluate('document.querySelector("details.tpaper").open=true;document.querySelector("details.tpaper details").open=true')
    T.check('[data-tl="1-1-binary"]'); T.check('[data-tl="1-1-hex"]')
    T.select_option('#amode', 'qc')
    T.click('#asgForm button[type=submit]'); idle(T)
    ok('lesson assignment saved', sql("select title||'|'||mode||'|'||array_to_string(lesson_ids,',') from assignments") == 'Binary basics|qc|1-1-binary,1-1-hex')
    ok('form closes after setting', T.locator('#asgForm').count() == 0)
    T.click('[data-tc="newasg"]'); T.wait_for_selector('#asgForm')
    T.click('[data-ta="kind"][value="exam"]'); T.wait_for_timeout(200)
    T.fill('#atitle', 'Exam practice')
    T.evaluate('document.querySelectorAll("details.tpaper").forEach(d=>d.open=true)')
    T.check('[data-ta="alltop"][data-p="1"]'); T.wait_for_timeout(200)
    T.select_option('#an', '5'); T.wait_for_timeout(200)
    T.fill('#atitle', 'Exam practice')
    T.click('#asgForm button[type=submit]'); idle(T)
    ok('exam assignment saved with 5 questions', sql("select cardinality(question_ids) from assignments where kind='exam'") == '5')

    # ---- student 1 does the work
    S1.reload(); S1.wait_for_function('window.BOB && !document.getElementById("boot")')
    go(S1, 'home')
    ok('new assignment banner', 'New assignment' in S1.inner_text('#app'))
    go(S1, 'todo')
    ok('to-do lists both assignments', 'Binary basics' in S1.inner_text('#app') and 'Exam practice' in S1.inner_text('#app'))
    S1.wait_for_timeout(500)
    ok('assignments marked as seen', sql('select count(*) from assignment_seen') == '2')
    S1.evaluate('S.lessons["1-1-hex"]={best:100,last:100,attempts:1,date:new Date().toISOString()};save()'); flushed(S1)
    ok('quick check saved to account', sql("select data->>'best' from user_progress where key='1-1-hex'") == '100')
    aid = S1.evaluate('Object.values(SC.asg).find(a=>a.kind==="exam").id')
    S1.evaluate(f'''(()=>{{const a=SC.asg["{aid}"];asgStartRun(a);a.qids.forEach((id,i)=>{{const q=EXQ.find(x=>x.id===id);EX.c={{v:"answer "+i}};exRecord(q,i===0?q.m:0)}});
       const r=S.asgAns[a.id];r.done=true;r.date=Date.now();save()}})()'''); flushed(S1)
    ok('exam answers handed in', sql("select done||'|'||(select count(*) from jsonb_object_keys(answers)) from assignment_submissions") == 'true|5')
    S1.evaluate('save()'); S1.evaluate(f'S.asgAns["{aid}"].ans["x"]={{m:9}};save()'); flushed(S1)
    ok('answers locked after handing in', sql("select answers ? 'x' from assignment_submissions") == 'f')
    go(S1, 'todo')
    ok('lesson assignment complete for student', 'Completed' in S1.inner_text('#app'))

    # ---- teacher reviews and changes a mark
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")')
    go(T, 'class-' + cid); T.click('[data-tc="tab"][data-v="progress"]')
    T.wait_for_selector('table.ttab'); T.wait_for_timeout(300)
    ok('progress tab shows students', 'Lee Chan' in T.inner_text('#app') and 'Kim Park' in T.inner_text('#app'))
    T.click('[data-tc="tab"][data-v="assign"]'); T.wait_for_timeout(300)
    T.evaluate('document.querySelectorAll("details.tasg").forEach(d=>d.open=true)')
    txt = T.inner_text('.tasl')
    ok('lesson assignment: 1/2 completed', '1/2' in txt, txt[:400])
    T.click('[data-tc="rev"]'); T.wait_for_selector('.trev')
    ok('teacher sees student answers', 'Lee Chan' in T.inner_text('.trev'))
    sel = T.locator('.trev select[data-tm]').nth(1)
    sel.select_option('1'); T.wait_for_timeout(600)
    ok('teacher mark saved', sql('select mark from teacher_marks') == '1')
    S1.reload(); S1.wait_for_function('window.BOB && !document.getElementById("boot")'); go(S1, 'todo')
    S1.click('[data-tc="rev"]'); S1.wait_for_selector('.trev')
    ok('student sees mark changed by teacher', 'Mark changed by your teacher' in S1.inner_text('.trev'))

    # ---- persistence and isolation
    ok('student 1 progress survives reload', S1.evaluate('S.lessons["1-1-hex"].best') == 100)
    ok('student 2 cannot see student 1 progress', S2.evaluate('BOB.school.ensureProg(["%s"]).then(()=>Object.keys(SC.prog["%s"].lessons).length)' % (S1.evaluate('S.user.id'), S1.evaluate('S.user.id'))) == 0)
    signout(S1)
    ok('after sign out: guest with no progress', S1.evaluate('S.user===null && Object.keys(S.lessons).length===0'))
    login(S1, 'lee@student.org')
    ok('sign in brings progress back', S1.evaluate('S.lessons["1-1-hex"] && S.lessons["1-1-hex"].best') == 100)

    # ---- teacher removes a student, licence freed; account page
    T.keyboard.press('Escape'); go(T, 'class-' + cid); T.click('[data-tc="tab"][data-v="students"]'); T.wait_for_timeout(200)
    T.locator('[data-tc="remove"]').first.click(); idle(T)
    ok('student removed, licence freed', sql('select count(*) from class_members') == '1')
    go(S2, 'account'); S2.fill('#pname', 'Kim Park-Lee'); S2.click('#profForm button'); S2.wait_for_timeout(500)
    ok('profile name updated', sql("select full_name from profiles where email='kim@student.org'") == 'Kim Park-Lee')
    S2.evaluate('S.user.role="teacher"'); S2.evaluate("BOB.store.api.db.update('profiles',{role:'teacher'},{eq:{id:S.user.id}})"); S2.wait_for_timeout(300)
    ok('student cannot make themselves a teacher', sql("select role from profiles where email='kim@student.org'") == 'student')

    # ---- progress tab shows exam assignments; teacher releases lessons one at a time
    go(T, 'class-' + cid); T.click('[data-tc="tab"][data-v="progress"]'); T.wait_for_timeout(500)
    ok('exam assignments heatmap on progress tab', 'Exam question assignments' in T.inner_text('#app') and T.locator('.theatx .thx').count() == 1)
    T.click('[data-tc="tab"][data-v="lessons"]'); T.wait_for_timeout(200)
    T.check('[data-tacc="mode"][value="released"]'); T.wait_for_timeout(500)
    T.evaluate('document.querySelector("[data-topen=la1]").open=true;document.querySelector("[data-topen=la3-1]").open=true'); T.wait_for_timeout(100)
    T.check('[data-tacc="l"][value="3-1-buses"]'); T.wait_for_timeout(700)
    ok('lesson access saved', sql("select restrict_lessons||'|'||array_to_string(released_lessons,',') from classes") == 'true|3-1-buses', sql("select restrict_lessons, released_lessons from classes"))
    S1.reload(); S1.wait_for_function('window.BOB && !document.getElementById("boot")')
    go(S1, 'l-3-1-cpu'); ok('unreleased lesson is locked for the student', S1.locator('.lockpage').count() == 1)
    go(S1, 'l-3-1-buses'); ok('released lesson opens', S1.locator('.lockpage').count() == 0 and S1.locator('#lcheck').count() == 1)
    go(S1, 'l-1-1-hex'); ok('lesson in an assignment stays open', S1.locator('.lockpage').count() == 0)
    go(S1, 't-3-1'); ok('locked lessons marked on the section page', S1.locator('a.lklock').count() > 0)
    ok('exam practice leaves out locked lessons', S1.evaluate('exPool(["3-1-cpu"]).length') == 0 and S1.evaluate('exPool(["3-1-buses"]).length') > 0)
    ok('teacher still sees every lesson', T.evaluate('lessonOpen("3-1-cpu")'))

    # ---- reassigning: exam assignment to one student with feedback, lesson assignment via the tick boxes
    go(T, 'class-' + cid); T.click('[data-tc="tab"][data-v="assign"]'); T.wait_for_timeout(300)
    lee = S1.evaluate('S.user.id'); exam_id = T.evaluate('Object.values(SC.asg).find(a=>a.kind==="exam").id'); les_id = T.evaluate('Object.values(SC.asg).find(a=>a.kind==="lessons").id')
    T.evaluate(f'document.querySelector("[data-topen=\'{exam_id}\']").open=true'); T.wait_for_timeout(100)
    T.click(f'[data-tc="reone"][data-a="{exam_id}"][data-v="{lee}"]'); T.wait_for_selector('#reForm')
    T.fill('#renote', 'Look again at storage types'); T.click('#reForm button[type=submit]'); idle(T)
    ok('reassignment stored with feedback', sql("select comment from assignment_reassigns") == 'Look again at storage types')
    ok('previous attempt archived, answers cleared', sql("select (previous->>'done') from assignment_reassigns") == 'true' and sql(f"select count(*) from assignment_submissions where assignment_id='{exam_id}'") == '0')
    ok('teacher sees the reassigned badge', 'Reassigned' in T.inner_text('.tasl'))
    T.evaluate(f'document.querySelector("[data-topen=\'{les_id}\']").open=true'); T.wait_for_timeout(100)
    T.check(f'[data-tsel="{les_id}"][value="{lee}"]'); T.wait_for_timeout(200)
    T.click(f'[data-tc="resel"][data-v="{les_id}"]'); T.wait_for_selector('#reForm'); T.click('#reForm button[type=submit]'); idle(T)
    ok('lesson assignment reassigned through the tick boxes', sql(f"select count(*) from assignment_reassigns where assignment_id='{les_id}'") == '1')
    S1.reload(); S1.wait_for_function('window.BOB && !document.getElementById("boot")'); go(S1, 'home')
    ok('student gets a reassigned banner', 'Reassigned' in S1.inner_text('.tbanner'))
    go(S1, 'todo'); txt = S1.inner_text('#app')
    ok('student sees the feedback on the to-do list', 'Look again at storage types' in txt and 'Reassigned by Ms Rivera' in txt)
    ok('reassigned lesson assignment needs redoing', not S1.evaluate(f'asgStatus(SC.asg["{les_id}"],S.user.id).complete'))
    S1.evaluate('S.lessons["1-1-binary"]={best:100,last:100,attempts:2,date:new Date(Date.now()+1000).toISOString()};S.lessons["1-1-hex"]={best:100,last:100,attempts:2,date:new Date(Date.now()+1000).toISOString()};save()')
    ok('complete again after new quick checks', S1.evaluate(f'asgStatus(SC.asg["{les_id}"],S.user.id).complete'))
    ok('reassigned exam assignment can be started again', S1.locator(f'[data-tc="asgstart"][data-v="{exam_id}"]').count() == 1)
    br.close()

print('page errors:', errs[:5] if errs else 'none')
print(f'\n{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
