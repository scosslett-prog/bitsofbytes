"""The admin's People list: everyone registered and how they have access. Run after tests/e2e_backend.py."""
import subprocess, sys
from playwright.sync_api import sync_playwright
B = 'http://localhost:8787/'
DB = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-d', 'bobe2e', '-qtAX', '-c']
sql = lambda q: subprocess.run(DB + [q], capture_output=True, text=True).stdout.strip()
fails = 0
def ok(name, cond, info=''):
    global fails
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  -> ' + str(info)), flush=True)
    if not cond: fails += 1
SHOT = '/tmp/claude-0/-home-claude/451fbb71-c1b0-527b-9371-00181eb45299/scratchpad/'

aid = sql("select id from profiles where email='ana@student.org'")
sql(f"insert into subscriptions(id,user_id,plan,status,interval,current_period_end) values('sub_people','{aid}','student','active','month',now()+interval '20 days') on conflict (id) do nothing")
with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    A = br.new_context(viewport={'width': 1300, 'height': 1000}).new_page()
    A.on('pageerror', lambda e: errs.append(str(e))); A.on('download', lambda d: None)
    A.goto(B + '#login'); A.wait_for_function('window.BOB && !document.getElementById("boot")')
    A.fill('#lemail', 'sam@bitsofbytes.co'); A.fill('#lpass', 'Chalk-Harbour-42')
    with A.expect_navigation(): A.click('#logForm button[type=submit]')
    A.wait_for_function('window.BOB && !document.getElementById("boot")')
    A.evaluate('location.hash="admin"'); A.wait_for_selector('.admpeople')
    txt = A.inner_text('.admpeople')
    n = int(sql("select count(*) from profiles"))
    ok('everyone is listed', A.locator('.admpeople tbody tr').count() == min(n, 100), (A.locator('.admpeople tbody tr').count(), n))
    ok('counts of teachers and students shown', 'teacher' in txt and 'student' in txt and 'paying account' in txt)
    row = A.locator('.admpeople tr', has_text='ana@student.org').inner_text()
    ok('a subscribed student shows as Subscribed, monthly', 'Subscribed' in row and 'Monthly' in row, row)
    row = A.locator('.admpeople tr', has_text='lee@student.org').inner_text()
    ok('a student in a licensed class shows their class', 'School class' in row, row)
    row = A.locator('.admpeople tr', has_text='rivera@school.org').inner_text()
    ok('a teacher shows their licences', 'licence' in row and 'in use' in row, row)
    A.click('[data-admpf="students"]'); A.wait_for_timeout(200)
    ok('filter: students only', 'rivera@school.org' not in A.inner_text('.admpeople tbody') and 'ana@student.org' in A.inner_text('.admpeople tbody'))
    A.click('[data-admpf="paid"]'); A.wait_for_timeout(200)
    ok('filter: paying', 'ana@student.org' in A.inner_text('.admpeople tbody') and 'lee@student.org' not in A.inner_text('.admpeople tbody'))
    A.click('[data-admpf="all"]'); A.fill('#admpq', 'rivera'); A.wait_for_timeout(200)
    ok('search narrows the list', A.locator('.admpeople tbody tr').count() == 1 and A.evaluate('document.activeElement.id') == 'admpq')
    A.fill('#admpq', '')
    with A.expect_download() as d: A.click('[data-adm="pcsv"]')
    csv = open(d.value.path()).read()
    ok('CSV download has everyone', csv.count('\n') == n and 'ana@student.org' in csv, csv[:200])
    A.locator('.admpeople').screenshot(path=SHOT + 'admin-people.png')
    S = br.new_context().new_page(); S.goto(B + '#login'); S.wait_for_function('window.BOB && !document.getElementById("boot")')
    S.fill('#lemail', 'ana@student.org'); S.fill('#lpass', 'Chalk-Harbour-42')
    with S.expect_navigation(): S.click('#logForm button[type=submit]')
    S.wait_for_function('window.BOB && !document.getElementById("boot")')
    r2 = subprocess.run(DB[:-2] + ['-qtAX', '-c', f"set role authenticated; select set_config('request.jwt.claim.sub','{aid}',false); select public.admin_people();"], capture_output=True, text=True)
    ok('a student cannot read the list', 'not allowed' in r2.stderr, r2.stdout + r2.stderr)
    print('page errors:', errs or 'none'); br.close()
sql("delete from subscriptions where id='sub_people'")
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
