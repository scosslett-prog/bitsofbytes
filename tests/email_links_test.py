"""Links from emails (?token_hash=…&type=…) and resending the confirmation email. Needs the dev server."""
import sys
from playwright.sync_api import sync_playwright
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
with sync_playwright() as p:
    br=p.chromium.launch(); errs=[]
    def open_(path):
        pg=br.new_context().new_page(); pg.on('pageerror',lambda e:errs.append(str(e)))
        pg.goto(B+path); pg.wait_for_function('window.BOB && !document.getElementById("boot")'); pg.wait_for_timeout(200); return pg
    pg=open_('?token_hash=old&type=recovery')
    ok('expired reset link goes to Forgotten password', pg.evaluate('location.hash')=='#forgot', pg.evaluate('location.href'))
    ok('and explains why', 'expired or has already been used' in pg.inner_text('body'))
    ok('token removed from the address bar', 'token_hash' not in pg.evaluate('location.href'))
    pg=open_('?token_hash=old&type=email')
    ok('expired confirm link goes to Sign in', pg.evaluate('location.hash')=='#login')
    ok('with a message', 'confirmation link has expired' in pg.inner_text('body'))
    pg=open_('?token_hash=dev-good&type=email')
    ok('good confirm link welcomes them', 'email address is confirmed' in pg.inner_text('body'), pg.inner_text('body')[:300])
    pg=open_('#login'); pg.evaluate('document.getElementById("lresend").innerHTML=resendBox("x@example.org");document.getElementById("lresend").hidden=false')
    pg.click('[data-resend]'); pg.wait_for_timeout(300)
    ok('resend button sends and confirms', 'Sent' in pg.inner_text('#lresend'))
    ok('resend button pauses to avoid repeats', pg.evaluate('document.querySelector("[data-resend]").disabled'))
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
