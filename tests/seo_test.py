"""Search pages and analytics: run scripts/prerender.mjs on a copy of the site, open its pages through the dev
server, and check titles, canonical addresses, the route they open, and that analytics wait for consent."""
import os, re, json, shutil, subprocess, sys, tempfile, glob
from playwright.sync_api import sync_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); B='http://localhost:8787'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
D=tempfile.mkdtemp(); shutil.copy(os.path.join(ROOT,'index.html'),D); shutil.copytree(os.path.join(ROOT,'public'),D,dirs_exist_ok=True)
out=subprocess.run(['node',os.path.join(ROOT,'scripts/prerender.mjs'),D],capture_output=True,text=True,env={**os.environ,'SITE_URL':'https://example.org'}).stdout
ok('pages generated', 'wrote 120 pages' in out, out)
files=glob.glob(D+'/**/index.html',recursive=True)
ok('every page has one canonical, a title and valid structured data', all(open(f).read().count('rel="canonical"')==1 and all(json.loads(m) for m in re.findall(r'<script type="application/ld\+json">(.*?)</script>',open(f).read(),re.S)) for f in files))
ok('sitemap lists every page', open(D+'/sitemap.xml').read().count('<loc>')==len(files))
ok('robots.txt points to the sitemap', 'Sitemap: https://example.org/sitemap.xml' in open(D+'/robots.txt').read())
hex_=open(D+'/lesson/1-1-hex/index.html').read()
ok('lesson page has its own title and text', '<title>Hexadecimal number system' in hex_ and '<h1>Hexadecimal number system</h1>' in hex_ and 'Key vocabulary' in hex_)
ok('paid lesson text is not in the page', 'th-1-1-hex' not in hex_)
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def serve(route):
        u=route.request.url.split('?')[0][len(B):].rstrip('/')
        f=os.path.join(D,u.lstrip('/'),'index.html')
        if os.path.exists(f): route.fulfill(path=f,content_type='text/html')
        else: route.continue_()
    pg=br.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.route(re.compile(r'.*/(lesson|topic|paper-\d|exam-questions|flash-cards|pricing|dashboard-preview)(/.*)?$'),serve)
    pg.goto(B+'/lesson/1-1-hex'); pg.wait_for_function('window.BOB && !document.getElementById("boot")'); pg.wait_for_timeout(300)
    ok('address opens the lesson', pg.evaluate('location.hash')=='#l-1-1-hex' and 'Hexadecimal' in pg.inner_text('#app h1'), pg.evaluate('location.href'))
    ok('title set for the page', pg.title().startswith('Hexadecimal number system'), pg.title())
    ok('canonical is the clean address', pg.evaluate('document.querySelector("link[rel=canonical]").href').endswith('/lesson/1-1-hex'))
    pg.evaluate('location.hash="t-8-1"'); pg.wait_for_timeout(300)
    ok('in-app navigation updates title and canonical', pg.title().startswith('8.1 ') and pg.evaluate('document.querySelector("link[rel=canonical]").href').endswith('/topic/8-1'))
    pg.evaluate('location.hash="login"'); pg.wait_for_timeout(200)
    ok('private pages are noindex, no canonical', pg.evaluate('!!document.querySelector(\'meta[name=robots][content=noindex]\') && !document.querySelector("link[rel=canonical]")'))
    ok('no analytics without an ID', pg.evaluate('!window.gtag && !document.getElementById("gabar")'))
    # with a measurement ID: nothing loads until the visitor agrees
    g=br.new_page(); g.on('pageerror',lambda e:errs.append(str(e))); gtm=[]
    g.route('**/src/main.js',lambda r:(lambda body:r.fulfill(body=body.replace("ENV.VITE_GA_ID || ''","'G-TEST123'"),content_type='text/javascript'))(r.fetch().text()))
    g.route(re.compile(r'.*googletagmanager\.com/.*'),lambda r:(gtm.append(r.request.url),r.fulfill(body='',content_type='text/javascript')))
    g.goto(B+'/#paper-1'); g.wait_for_function('window.BOB && !document.getElementById("boot")'); g.wait_for_timeout(1600)
    ok('consent banner shown, analytics not loaded yet', g.is_visible('#gabar') and not gtm and g.evaluate('!window.gtag'))
    g.click('[data-ga="yes"]'); g.wait_for_timeout(300)
    ok('analytics load after Allow', len(gtm)==1 and 'G-TEST123' in gtm[0])
    pv=lambda: g.evaluate('(window.dataLayer||[]).filter(a=>a[0]==="event"&&a[1]==="page_view").map(a=>a[2].page_path)')
    g.evaluate('location.hash="l-1-1-binary"'); g.wait_for_timeout(300)
    ok('page views use clean addresses', pv()[-1]=='/lesson/1-1-binary', pv())
    n=len(pv()); g.evaluate('render()'); g.wait_for_timeout(200)
    ok('redrawing the same page is not a new page view', len(pv())==n)
    g.reload(); g.wait_for_function('window.BOB && !document.getElementById("boot")'); g.wait_for_timeout(1500)
    ok('choice remembered: no banner, analytics on', not g.is_visible('#gabar') and g.evaluate('!!window.gtag'))
    g.click('[data-cookies]'); g.wait_for_timeout(200); ok('cookie settings reopens the choice', g.is_visible('#gabar'))
    g.click('[data-ga="no"]'); g.reload(); g.wait_for_function('window.BOB && !document.getElementById("boot")'); g.wait_for_timeout(1500)
    ok('after No thanks, analytics stay off', g.evaluate('!window.gtag') and not g.is_visible('#gabar'))
    print('page errors:', errs or 'none'); br.close()
shutil.rmtree(D)
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
