"""Guest smoke test: every route renders without errors."""
import sys
from playwright.sync_api import sync_playwright
B='http://localhost:8787/'
errs=[]
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page()
    pg.on('pageerror',lambda e:errs.append('pageerror '+str(e)))
    pg.on('console',lambda m:errs.append('console '+m.text) if m.type=='error' else None)
    pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")',timeout=20000)
    print('boot gone:', pg.locator('#boot').count()==0, '| mode:', pg.evaluate('BOB.mode'))
    routes=pg.evaluate('["home","paper-1","paper-2","dashboard","flashcards","exams","register","login","forgot","reset","account","pricing","teacher","todo","admin", ...ALL_LESSONS.map(l=>"l-"+l.id), ...TOPICS.map(t=>"t-"+t.id)]')
    for r in routes:
        pg.evaluate(f'location.hash="{r}"'); pg.wait_for_timeout(30)
        if pg.locator('#app').inner_text().strip()=='' : errs.append('empty '+r)
    print(len(routes),'routes')
    br.close()
print('\n'.join(errs[:30]) or 'no errors'); sys.exit(1 if errs else 0)
