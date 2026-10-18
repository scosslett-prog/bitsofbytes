"""A-Level preview (admin only): upload the course files, view the site, open a lesson, run Python.
Run after tests/e2e_backend.py, with content/al/ built (node scripts/build-al.mjs)."""
import subprocess, sys
from playwright.sync_api import sync_playwright
sql=lambda q:subprocess.run(['psql','-h','/tmp','-p','54329','-U','postgres','-d','bobe2e','-qtAX','-c',q],capture_output=True,text=True).stdout.strip()
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
sql("delete from course_files")
SHOT='/tmp/claude-0/-home-claude/451fbb71-c1b0-527b-9371-00181eb45299/scratchpad/'
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def page(email=None,path='#home',w=1280):
        pg=br.new_context(viewport={'width':w,'height':900}).new_page(); pg.on('pageerror',lambda e:errs.append(str(e))); pg.on('dialog',lambda d:d.accept())
        pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        if email:
            pg.evaluate('location.hash="login"'); pg.fill('#lemail',email); pg.fill('#lpass','Chalk-Harbour-42')
            with pg.expect_navigation(): pg.click('#logForm button[type=submit]')
            pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        return pg
    A=page('sam@bitsofbytes.co'); A.evaluate('location.hash="admin"'); A.wait_for_selector('[data-adm="alup"]')
    A.click('[data-adm="alup"]'); A.wait_for_function('/Uploaded\\. |Upload stopped|valid JSON/.test(document.body.innerText)',timeout=30000)
    ok('admin uploads the A-Level files', sql("select count(*) from course_files where course='al'")=='4', A.inner_text('#app')[:600])
    with A.expect_navigation(): A.click('text=View A-Level site')
    A.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('A-Level mode on', A.evaluate('BOB.course')=='al' and A.evaluate('document.documentElement.classList.contains("course-al")'))
    ok('preview banner shown', A.is_visible('#albar'), '')
    ok('noindex in preview', A.evaluate('document.querySelector("meta[name=robots]")?.content||""').find('noindex')>=0)
    nav=A.inner_text('nav, header'); ok('nav shows four units', all(u in nav for u in ['Unit 1','Unit 2','Unit 3','Unit 4']), nav[:300])
    A.screenshot(path=SHOT+'al-home.png')
    A.evaluate('location.hash="paper-1"'); A.wait_for_timeout(500); A.screenshot(path=SHOT+'al-unit1.png', full_page=True)
    ok('unit page lists topics', 'Computer architecture' in A.inner_text('#app'), A.inner_text('#app')[:300])
    A.evaluate('location.hash="l-a1-1-fde"'); A.wait_for_selector('.theory'); A.wait_for_timeout(400)
    t=A.inner_text('#app'); ok('FDE lesson renders', 'register transfer' in t.lower() and 'MAR ← [PC]' in t, t[:300])
    A.screenshot(path=SHOT+'al-fde.png', full_page=True)
    # runnable example
    btn=A.locator('.pyrun [data-py=run]').first
    ok('runnable Python example has a Run button', btn.count()>0)
    if btn.count():
        btn.click(); A.wait_for_function('[...document.querySelectorAll(".pyout")].some(e=>/ACC =/.test(e.innerText))',timeout=20000)
        ok('Python example runs', 'ACC = 12' in A.inner_text('.pyout'), A.inner_text('.pyout'))
    for l in ['a1-1-stored','a1-1-components','a1-1-cpu','a1-1-hierarchy','a1-1-transmission']:
        A.evaluate(f'location.hash="l-{l}"'); A.wait_for_timeout(300)
        ok(f'{l} renders', A.locator('.theory svg.dg').count()>0, A.inner_text('#app')[:200])
    # every activity generator makes questions
    bad=A.evaluate('''ALL_LESSONS.flatMap(l=>(l.acts||[]).filter(a=>a.type!=="py").map(a=>{try{const g=GEN[a.gen];const q=g.call(a);return (q&&(q.length||q.prompt||q.q))?null:l.id+" "+a.id}catch(e){return l.id+" "+a.id+": "+e.message}})).filter(Boolean)''')
    ok('all A-Level activities generate', not bad, bad)
    A.evaluate('location.hash="l-a1-1-components"'); A.wait_for_timeout(300); A.screenshot(path=SHOT+'al-components.png', full_page=True)
    # back to IGCSE
    A.goto(B+'#home'); A.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('IGCSE site unaffected', not A.evaluate('BOB.course') and A.evaluate('ALL_LESSONS.length')==89)
    # non-admins are turned away
    S=page('ana@student.org'); S.goto(B+'?course=al#home'); S.wait_for_timeout(1500)
    ok('student cannot open the A-Level site', S.evaluate('!BOB.course') and 'course=al' not in S.url, S.url)
    G=page(); G.goto(B+'?course=al#home'); G.wait_for_timeout(1500)
    ok('guest cannot open the A-Level site', G.evaluate('!BOB.course'), G.url)
    r=sql("set role anon; select count(*) from course_files")
    ok('course files not readable directly', r in ('','0'), r)
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
