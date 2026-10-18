"""Signed-in student does a quick check and an activity through the page; both reach the database."""
import subprocess, sys
from playwright.sync_api import sync_playwright
sql=lambda q:subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c',q],capture_output=True,text=True).stdout.strip()
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(); errs=[]
    pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/#login'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    pg.fill('#lemail','ana@student.org'); pg.fill('#lpass','Chalk-Harbour-42')
    with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
    pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    pg.evaluate('location.hash="l-3-1-buses"'); pg.wait_for_timeout(300)
    # quick check: always pick the right answer
    pg.evaluate('document.querySelector(\'[data-act="lstart"]\').click()')
    for i in range(4):
        pg.evaluate('(()=>{const it=LQ.items[LQ.k];const i=it.opts.indexOf(it.a);document.querySelector(`[data-act="lpick"][data-i="${i}"]`).click()})()')
        pg.wait_for_timeout(50); pg.evaluate('document.querySelector(\'[data-act="lnext"]\').click()'); pg.wait_for_timeout(50)
    # first activity: start, then answer every item with whatever is offered
    pg.evaluate('document.querySelector(\'[data-act="astart"]\').click()'); pg.wait_for_timeout(200)
    for _ in range(40):
        if not pg.evaluate('!!AQ && AQ.k<AQ.items.length'): break
        b=pg.locator('[data-act="apick"]')
        if b.count(): b.first.evaluate('e=>e.click()')
        else:
            f=pg.locator('#act-in')
            if f.count(): f.evaluate('e=>{e.value="1";e.form.requestSubmit()}')
            else: break
        pg.wait_for_timeout(60)
        n=pg.locator('[data-act="anext"]')
        if n.count(): n.first.evaluate('e=>e.click()'); pg.wait_for_timeout(60)
    pg.evaluate('BOB.store.flush()'); pg.wait_for_function('BOB.store.status==="saved"')
    qc=sql("select data->>'best' from user_progress p join profiles u on u.id=p.user_id where u.email='ana@student.org' and kind='lessons' and key='3-1-buses'")
    acts=sql("select count(*) from user_progress p join profiles u on u.id=p.user_id where u.email='ana@student.org' and kind='acts'")
    print('quick check best:',qc,'| activity rows:',acts,'| errors:',errs or 'none')
    br.close()
sys.exit(0 if qc=='100' and acts!='0' and not errs else 1)
