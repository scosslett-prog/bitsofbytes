"""Choosing a password: rules, live checklist, strength, show/hide and the second entry. Needs the dev server."""
import sys
from playwright.sync_api import sync_playwright
B='http://localhost:8787/'; fails=0
def ok(n,c,i=''):
    global fails; print(('PASS ' if c else 'FAIL ')+n+('' if c else '  -> '+str(i)),flush=True); fails+=0 if c else 1
with sync_playwright() as p:
    br=p.chromium.launch(); pg=br.new_page(); errs=[]; pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto(B+'#register'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    pg.fill('#rname','Priya Shah'); pg.fill('#remail','priya.shah@example.org')
    chk=lambda pw:pg.evaluate(f'pwCheck({pw!r},{{name:"Priya Shah",email:"priya.shah@example.org"}})')
    for pw,why in [('short1A','too short'),('alllowercase123','no capital'),('NoNumbersHereAtAll','no number'),('Password12345','common word'),
                   ('PriyaRocks2026','own name'),('Abcdefgh1234','run of letters'),('Zzzzzzzz9Aa','repeated letters')]:
        ok(f'rejected: {why}', not chk(pw)['ok'], chk(pw))
    for pw in ['Kettle-Planet-Robin7','Chalk-Harbour-42','MangoTrain58River']: ok(f'accepted: {pw}', chk(pw)['ok'], chk(pw))
    pg.fill('#rpass','abc'); ok('checklist marks unmet rules', pg.locator('.pwrules li.no').count()>=2)
    ok('strength shown', 'Strength: Weak' in pg.inner_text('#rpass-level'))
    pg.fill('#rpass','Kettle-Planet-Robin7'); ok('all rules ticked for a good password', pg.locator('.pwrules li.ok').count()==4)
    ok('strong password rated Strong', 'Strong' in pg.inner_text('#rpass-level'), pg.inner_text('#rpass-level'))
    pg.fill('#rpass2','Kettle-Planet-Robin'); ok('mismatch shown while typing', "don't match" in pg.inner_text('#rpass-match'))
    pg.click('#regForm button[type=submit]'); pg.wait_for_timeout(300)
    ok('mismatch blocks sign-up', "don't match" in pg.inner_text('#rerr'))
    pg.fill('#rpass2','Kettle-Planet-Robin7'); ok('match confirmed', 'Passwords match' in pg.inner_text('#rpass-match'))
    pg.fill('#rpass','weakpass'); pg.fill('#rpass2','weakpass'); pg.click('#regForm button[type=submit]'); pg.wait_for_timeout(300)
    ok('weak password blocks sign-up', 'needs' in pg.inner_text('#rerr') or 'harder to guess' in pg.inner_text('#rerr'), pg.inner_text('#rerr'))
    pg.click('[data-pwshow="rpass"]'); ok('show reveals both fields', pg.get_attribute('#rpass','type')=='text' and pg.get_attribute('#rpass2','type')=='text')
    pg.click('[data-pwshow="rpass"]'); ok('hide masks them again', pg.get_attribute('#rpass','type')=='password')
    pg.set_viewport_size({'width':390,'height':844}); pg.wait_for_timeout(100)
    ok('fits a phone screen', pg.evaluate('document.documentElement.scrollWidth<=window.innerWidth+1'))
    print('page errors:', errs or 'none'); br.close()
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
