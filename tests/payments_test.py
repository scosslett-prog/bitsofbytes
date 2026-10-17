"""Payments switched on (site_settings.payments): free tier, locked content not sent, class access,
subscription access and licence totals. Stripe itself isn't called; subscriptions are inserted as
the webhook would. Run after tests/e2e_backend.py on a fresh dev server."""
import subprocess, sys
from playwright.sync_api import sync_playwright
sql=lambda q:subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c',q],capture_output=True,text=True).stdout.strip()
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(email=None):
        pg=br.new_context().new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('dialog',lambda d:d.accept())
        pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        if email:
            pg.evaluate('location.hash="login"'); pg.fill('#lemail',email); pg.fill('#lpass','password123')
            with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
            pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        return pg
    go=lambda pg,r:(pg.evaluate(f'location.hash="{r}"'),pg.wait_for_timeout(250))
    sql("update site_settings set payments = true")
    G=page()
    ok('payments on in test mode', G.evaluate('BOB.pay.enabled'))
    go(G,'l-1-1-binary'); ok('guest: first lesson of a section is free', G.locator('.lockpage').count()==0 and G.locator('#lcheck').count()==1)
    go(G,'l-1-1-hex'); ok('guest: second lesson shows the subscribe page', 'part of the full course' in G.inner_text('#app'))
    go(G,'t-1-1'); ok('guest: locked lessons marked in the section list', G.locator('a.lklock').count()>0)
    ok('guest: locked lesson text never reaches the browser', G.evaluate('!document.getElementById("th-1-1-hex") && !!document.getElementById("th-1-1-binary")'))
    ok('guest: locked questions never reach the browser', G.evaluate('EXQ.length')==int(sql("select count(*) from exam_questions where free")) and G.evaluate('EXQ.length')<int(sql("select count(*) from exam_questions")))
    ok('guest: tables cannot be read directly', 'permission denied' in subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c','set role anon; select html from lesson_theory limit 1'],capture_output=True,text=True).stderr)
    ok('guest: exam practice only from free lessons', G.evaluate('exPool(["1-1-hex"]).length')==0 and G.evaluate('exPool(["1-1-binary"]).length')>0)
    go(G,'pricing'); ok('guest: pricing asks them to create an account', 'Create an account to subscribe' in G.inner_text('#app'))
    A=page('ana@student.org')
    ok('student without class or subscription: free tier', not A.evaluate('BOB.pay.full()'))
    go(A,'account'); ok('account page shows the free plan', 'free plan' in A.inner_text('#app'))
    go(A,'pricing'); A.click('[data-pay="sub"]'); A.wait_for_timeout(400)
    ok('subscribe button reaches the payment call', 'only work on the live site' in A.inner_text('#suberr'), A.inner_text('#app')[:200])
    aid=sql("select id from profiles where email='ana@student.org'")
    sql(f"insert into subscriptions(id,user_id,plan,status,interval,current_period_end) values('sub_ana','{aid}','student','active','month',now()+interval '30 days')")
    A.reload(); A.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('active subscription: full access', A.evaluate('BOB.pay.full()'))
    go(A,'l-1-1-hex'); ok('subscriber opens any lesson', A.locator('.lockpage').count()==0 and 'Theory goes here' not in A.inner_text('#app'))
    ok('subscriber gets every question', A.evaluate('EXQ.length')==int(sql("select count(*) from exam_questions")))
    go(A,'account'); ok('account shows the subscription', 'Student subscription' in A.inner_text('#app') and 'Manage subscription' in A.inner_text('#app'))
    sql("update subscriptions set status='canceled' where id='sub_ana'")
    A.reload(); A.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('cancelled subscription: back to the free tier', not A.evaluate('BOB.pay.full()'))
    L=page('lee@student.org'); ok('student in a licensed class: full access', L.evaluate('BOB.pay.full()'))
    T=page('rivera@school.org'); ok('teacher: full access', T.evaluate('BOB.pay.full()'))
    before=T.evaluate('licInfo(S.user.id).bought')
    tid=sql("select id from profiles where email='rivera@school.org'")
    sql(f"insert into subscriptions(id,user_id,plan,status,quantity,interval,current_period_end) values('sub_t','{tid}','licences','active',5,'year',now()+interval '300 days')")
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")'); go(T,'teacher')
    ok('paid licences added to the teacher total', T.evaluate('licInfo(S.user.id).bought')==before+5, (before,T.evaluate('licInfo(S.user.id).bought')))
    txt=T.inner_text('.tlic'); ok('teacher sees the subscription, Manage billing and Buy licences', '5 licences' in txt and 'Manage billing' in txt and 'Buy licences' in txt)
    ok('invoice route still there', T.locator('details.treqd #reqForm').count()==1)
    sql("update subscriptions set status='canceled' where id='sub_t'")
    ok('cancelled licence subscription leaves the total', sql(f"select public._licence_total('{tid}')") == str(before))
    sql("update site_settings set payments = false")
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
