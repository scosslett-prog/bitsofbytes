"""Contact page: validation, sending through Netlify Forms (faked here), and the fallback when sending fails."""
import sys, re
from urllib.parse import parse_qs
from playwright.sync_api import sync_playwright
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]; pg=br.new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(B+'#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    ok('footer has Contact us', pg.locator('footer a[href="#contact"]').count()==1)
    ok('hidden form for Netlify to find', pg.locator('form[name=contact][data-netlify=true]').count()==1)
    pg.click('footer a[href="#contact"]'); pg.wait_for_timeout(300)
    ok('contact page shows the address', 'info@bitsofbytes.ac' in pg.inner_text('#app'))
    ok('page title', pg.title().startswith('Contact us'))
    pg.click('#contactForm button[type=submit]'); pg.wait_for_timeout(200)
    ok('asks for a name first', 'Enter your name' in pg.inner_text('#cerr'))
    pg.fill('#cname','Priya Shah'); pg.fill('#cemail','priya@example.org'); pg.fill('#cmsg','Do you offer licences for 30 students?')
    sent=[]
    pg.route(B, lambda r: (sent.append(r.request.post_data), r.fulfill(status=200, body='ok')) if r.request.method=='POST' else r.continue_())
    pg.click('#contactForm button[type=submit]'); pg.wait_for_timeout(500)
    q=parse_qs(sent[0]) if sent else {}
    ok('posts the form to Netlify', q.get('form-name')==['contact'] and q.get('email')==['priya@example.org'] and 'licences' in q.get('message',[''])[0], q)
    ok('thank-you shown', 'on its way' in pg.inner_text('#app'))
    pg.unroute(B); pg.click('[data-contact="again"]'); pg.wait_for_timeout(200)
    pg.fill('#cname','A'); pg.fill('#cemail','a@b.co'); pg.fill('#cmsg','Testing failure')
    pg.route(B, lambda r: r.fulfill(status=500, body='no') if r.request.method=='POST' else r.continue_())
    pg.click('#contactForm button[type=submit]'); pg.wait_for_timeout(500)
    ok('if sending fails, points to the email address', 'email info@bitsofbytes.ac instead' in pg.inner_text('#cerr'))
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
