"""Dashboard preview for visitors: example student and teacher views, read-only, never saved. Needs the dev server
(run after e2e_backend.py so a real student account exists)."""
import sys, tempfile
from playwright.sync_api import sync_playwright
B='http://localhost:8787/'; fails=0; SC=tempfile.gettempdir()
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    pg=br.new_page(viewport={'width':1280,'height':900}); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('dialog',lambda d:d.accept())
    pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('home offers the preview', pg.locator('.ctas a[href="#dashboard"]').count()==1)
    before=pg.evaluate('localStorage.getItem("bob-state-v1")')
    pg.click('.ctas a[href="#dashboard"]'); pg.wait_for_timeout(400)
    t=pg.inner_text('#app')
    ok('preview banner shown', 'preview' in t.lower() and 'example student account' in t, t[:200])
    ok('student view has example data', 'Hello, Alex' in t and '10C Computer Science' in t, t[:600])
    ok('menu bar still shows a guest', pg.locator('.nav a[href="#login"]').count()>=1)
    pg.screenshot(path=SC+'/demo_student.png',full_page=False)
    pg.click('[data-pv="teacher"]'); pg.wait_for_timeout(400); t=pg.inner_text('#app')
    ok('teacher view lists the example classes', '10C Computer Science' in t and '11B Computer Science' in t, t[:600])
    pg.screenshot(path=SC+'/demo_teacher.png')
    pg.click('a[href="#class-demo-c1"]'); pg.wait_for_timeout(500); t=pg.inner_text('#app')
    ok('class page opens with students', 'Priya Shah' in t, t[:500])
    tabs=pg.locator('[data-tc="tab"]').all_inner_texts(); ok('class page has tabs', len(tabs)>=2, tabs)
    for name in tabs:
        pg.locator('[data-tc="tab"]',has_text=name).first.click(); pg.wait_for_timeout(300)
        pg.screenshot(path=SC+f'/demo_tab_{name.split()[0].lower()}.png',full_page=True)
    ok('tabs work without errors', not errs, errs)
    pg.locator('[data-tc="tab"]',has_text='Assignments').click(); pg.wait_for_timeout(300)
    pg.click('[data-tc="newasg"]'); pg.wait_for_timeout(300); pg.fill('#atitle','Test'); pg.locator('#asgForm button[type=submit]').click(); pg.wait_for_timeout(300)
    ok('creating an assignment is blocked with a note', pg.is_visible('#pvnote.show'))
    import re; ok('lessons homework mostly completed', any(int(x)>=8 for x in re.findall(r'(\d+)/12',pg.inner_text('#app'))))
    pg.click('[data-pv="mine"]'); pg.wait_for_timeout(300); t=pg.inner_text('#app')
    ok('my progress shows the guest dashboard', 'Your progress in this browser' in t and 'Hello, Alex' not in t, t[:300])
    ok('nothing saved to the guest progress', pg.evaluate('localStorage.getItem("bob-state-v1")')==before)
    pg.evaluate('location.hash="paper-1"'); pg.wait_for_timeout(300)
    ok('leaving the preview restores the guest', pg.evaluate('S.user===null && !SC.classes["demo-c1"]'))
    # a signed-in student never sees the preview
    s=br.new_context().new_page(); s.goto(B+'#login'); s.wait_for_function('window.BOB && !document.getElementById("boot")')
    s.fill('#lemail','ana@student.org'); s.fill('#lpass','Chalk-Harbour-42')
    with s.expect_navigation(): s.click('#logForm button[type=submit]')
    s.wait_for_function('window.BOB && !document.getElementById("boot")'); s.evaluate('location.hash="dashboard"'); s.wait_for_timeout(300)
    ok('signed-in users see their own dashboard', 'example student account' not in s.inner_text('#app') and 'Alex Morgan' not in s.inner_text('#app'))
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
