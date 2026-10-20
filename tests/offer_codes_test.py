"""Offer codes: the admin makes a code, teachers type it in and get free licences.
Start the server first:  python3 tests/devserver.py --db bobe2e --port 8787 --reset
Run after tests/e2e_backend.py (it uses the admin account); it creates its own teachers."""
import subprocess, sys, time
from playwright.sync_api import sync_playwright
B = 'http://localhost:8787/'
DB = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-d', 'bobe2e', '-qtAX', '-c']
sql = lambda q: subprocess.run(DB + [q], capture_output=True, text=True).stdout.strip()
fails = 0
def ok(name, cond, info=''):
    global fails
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  -> ' + str(info)), flush=True)
    if not cond: fails += 1
tag = str(int(time.time()))[-6:]
SHOT = '/tmp/claude-0/-home-claude/451fbb71-c1b0-527b-9371-00181eb45299/scratchpad/'

with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    def page():
        pg = br.new_context(viewport={'width': 1300, 'height': 900}).new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(B + '#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        pg.evaluate('try{localStorage.setItem("bob-analytics","no")}catch(e){};document.getElementById("gabar")?.remove()')
        return pg
    def go(pg, r): pg.evaluate(f'location.hash="{r}"'); pg.wait_for_timeout(250)
    def idle(pg): pg.wait_for_function('!document.body.classList.contains("tbusy")'); pg.wait_for_timeout(200)
    def login(pg, email):
        go(pg, 'login'); pg.fill('#lemail', email); pg.fill('#lpass', 'Chalk-Harbour-42')
        with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def register(pg, role, name, email):
        go(pg, 'register'); pg.check(f'#role-{role}'); pg.fill('#rname', name); pg.fill('#remail', email); pg.fill('#rschool', 'Test School')
        pg.fill('#rpass', 'Chalk-Harbour-42'); pg.fill('#rpass2', 'Chalk-Harbour-42')
        with pg.expect_navigation(): pg.click('#regForm button[type=submit]')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def total(pg): return pg.evaluate('licInfo(S.user.id).bought')

    # ---- the admin makes a code for two teachers
    A = page(); login(A, 'sam@bitsofbytes.co'); go(A, 'admin')
    A.wait_for_selector('#codeForm'); code = f'SCHOOL-{tag}'
    ok('admin page has an offer code form with a suggested code', A.input_value('#ccode').startswith('BOB-'))
    A.fill('#ccode', code.lower()); A.fill('#cn', '50'); A.fill('#cmax', '2'); A.fill('#cnote', 'My school')
    A.click('#codeForm button[type=submit]'); idle(A)
    ok('code created', sql(f"select licences || ' ' || max_uses || ' ' || active from offer_codes where code='{code}'") == '50 2 true', A.inner_text('#app')[:300])
    ok('code listed on the admin page', code in A.inner_text('#app') and '0 / 2' in A.inner_text('#app'))
    A.locator('#codeForm').evaluate('f=>f.closest("section").scrollIntoView()'); A.wait_for_timeout(100)
    A.screenshot(path=SHOT + 'offer-admin.png', full_page=True)

    # ---- teacher 1 uses it
    T1 = page(); register(T1, 'teacher', 'Tess One', f'tess{tag}@school.org'); go(T1, 'teacher'); idle(T1)
    before = total(T1)
    ok('new teacher sees the offer code box open', T1.locator('details.toffer[open] #offc').count() == 1)
    T1.fill('#offc', 'nope-nope'); T1.click('#offerForm button[type=submit]'); idle(T1)
    ok('a wrong code is refused', "isn't valid" in T1.inner_text('#offerr') and total(T1) == before, T1.inner_text('#offerr'))
    T1.fill('#offc', f' {code.lower()} '); T1.click('#offerForm button[type=submit]'); idle(T1)
    ok('the code adds 50 licences', total(T1) == before + 50, (before, total(T1)))
    ok('teacher told the code worked', '50 licences added' in T1.inner_text('.tlic'), T1.inner_text('.tlic')[:400])
    T1.screenshot(path=SHOT + 'offer-teacher.png')
    T1.fill('#offc', code); T1.click('#offerForm button[type=submit]'); idle(T1)
    ok('the same teacher cannot use it twice', 'already used' in T1.inner_text('#offerr') and total(T1) == before + 50, T1.inner_text('#offerr'))
    ok('licence history notes the offer code', sql(f"select note from licence_grants g join profiles p on p.id=g.teacher_id where p.email='tess{tag}@school.org'") == f'Offer code {code}')

    # ---- teacher 2 uses it; teacher 3 finds it used up
    T2 = page(); register(T2, 'teacher', 'Tom Two', f'tom{tag}@school.org'); go(T2, 'teacher'); idle(T2)
    T2.fill('#offc', code); T2.click('#offerForm button[type=submit]'); idle(T2)
    ok('a second teacher gets the licences', total(T2) == 50)
    T3 = page(); register(T3, 'teacher', 'Tia Three', f'tia{tag}@school.org'); go(T3, 'teacher'); idle(T3)
    T3.fill('#offc', code); T3.click('#offerForm button[type=submit]'); idle(T3)
    ok('a third teacher finds it used up', 'used up' in T3.inner_text('#offerr') and total(T3) == 0, T3.inner_text('#offerr'))

    # ---- turned off and expired codes
    sql(f"insert into offer_codes (code, licences) values ('OFF-{tag}', 5)")
    go(A, 'home'); go(A, 'admin'); A.click('[data-adm="reload"]'); A.wait_for_selector(f'[data-adm="codeoff"][data-v="OFF-{tag}"]')
    A.click(f'[data-adm="codeoff"][data-v="OFF-{tag}"]'); idle(A)
    ok('admin can turn a code off', sql(f"select active from offer_codes where code='OFF-{tag}'") == 'f')
    T3.fill('#offc', f'OFF-{tag}'); T3.click('#offerForm button[type=submit]'); idle(T3)
    ok('a turned-off code is refused', "isn't valid" in T3.inner_text('#offerr'))
    sql(f"insert into offer_codes (code, licences, expires) values ('OLD-{tag}', 5, current_date - 1)")
    T3.fill('#offc', f'OLD-{tag}'); T3.click('#offerForm button[type=submit]'); idle(T3)
    ok('an expired code is refused', 'expired' in T3.inner_text('#offerr'))

    # ---- students can't use codes, nobody but the admin can read them, and guessing is slowed down
    S = page(); register(S, 'student', 'Stu Dent', f'stu{tag}@student.org')
    r = S.evaluate(f'BOB.school.A.redeemOffer("{code}").then(()=>"ok",e=>e.message)')
    ok('a student account cannot use a code', 'teacher accounts' in r, r)
    uid = sql(f"select id from profiles where email='tia{tag}@school.org'")
    as_t3 = lambda q: subprocess.run(DB + [f"set role authenticated; select set_config('request.jwt.claim.sub','{uid}',false); {q}"], capture_output=True, text=True)
    r = as_t3("select count(*) from offer_codes")
    ok('teachers cannot list the codes', r.stdout.strip().split('\n')[-1] == '0', r.stdout + r.stderr)
    r = as_t3(f"insert into offer_codes (code, licences) values ('MINE-{tag}', 999)")
    ok('teachers cannot make their own codes', r.returncode != 0 or 'violates' in r.stderr or sql(f"select count(*) from offer_codes where code='MINE-{tag}'") == '0', r.stderr)
    r = as_t3(f"insert into licence_grants (teacher_id, quantity) values ('{uid}', 999)")
    ok('teachers still cannot give themselves licences', sql(f"select coalesce(sum(quantity),0) from licence_grants where teacher_id='{uid}'") == '0')
    msgs = [T3.evaluate('BOB.school.A.redeemOffer("GUESS-0000").then(()=>"ok",e=>e.message)') for _ in range(9)]
    ok('after 10 tries in 15 minutes, more are refused', 'Too many tries' in msgs[-1] and "isn't valid" in msgs[0], msgs[-3:])

    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
