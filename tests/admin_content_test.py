"""Admin page: uploading the course content and switching the paywall. Run after tests/e2e_backend.py."""
import subprocess, sys
from playwright.sync_api import sync_playwright
sql=lambda q:subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c',q],capture_output=True,text=True).stdout.strip()
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
# make the stored content out of date, so the upload has something to fix
sql("update site_settings set payments=false; delete from exam_questions where id in (select id from exam_questions order by ord limit 5); update lesson_theory set html='OLD' where id='1-1-hex'; insert into lesson_theory values ('zz-gone',999,false,'x') on conflict do nothing")
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(email=None):
        pg=br.new_context().new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('dialog',lambda d:d.accept())
        pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        if email:
            pg.evaluate('location.hash="login"'); pg.fill('#lemail',email); pg.fill('#lpass','Chalk-Harbour-42')
            with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
            pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        return pg
    A=page('sam@bitsofbytes.co'); A.evaluate('location.hash="admin"'); A.wait_for_selector('.admsite')
    t=A.inner_text('.admsite'); ok('admin sees content and paywall panel', 'Paywall: off' in t and 'lessons' in t, t)
    A.click('[data-adm="upload"]'); A.wait_for_function('document.querySelector(".msg.ok")||document.querySelector(".msg.bad")',timeout=60000)
    ok('upload reports success', 'Uploaded 89 lessons' in A.inner_text('#app'), A.inner_text('#app')[:400])
    ok('missing questions restored', sql("select count(*) from exam_questions")=='1275')
    ok('changed lesson replaced', sql("select html<>'OLD' from lesson_theory where id='1-1-hex'")=='t')
    ok('removed lesson deleted', sql("select count(*) from lesson_theory where id='zz-gone'")=='0')
    ok('free flags right', sql("select count(*) from lesson_theory where free")=='24' and sql("select count(*) from exam_questions where free")=='442')
    ok('admin sees the new content at once', A.evaluate('EXQ.length')==1275)
    A.click('[data-adm="paywall"]'); A.wait_for_timeout(1200)
    ok('paywall switched on', sql("select payments from site_settings")=='t' and 'Paywall: on' in A.inner_text('.admsite'))
    G=page(); ok('guest now limited', not G.evaluate('BOB.pay.full()') and G.evaluate('EXQ.length')==442)
    S=page('ana@student.org'); S.evaluate('location.hash="admin"'); S.wait_for_timeout(300)
    ok('students cannot use the admin page', 'only for Bits of Bytes administrators' in S.inner_text('#app'))
    r=subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c',
      "set role authenticated; select set_config('request.jwt.claim.sub',(select id::text from profiles where email='ana@student.org'),false); select public.admin_set_payments(false)"],capture_output=True,text=True)
    ok('students cannot switch the paywall', 'Only admins' in r.stderr, r.stderr)
    A.click('[data-adm="paywall"]'); A.wait_for_timeout(1200)
    ok('paywall switched off again', sql("select payments from site_settings")=='f')
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
