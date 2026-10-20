"""Paying for licences by invoice: the quote and the invoice form on the teacher's Licences panel.
Stripe can't be reached from the dev server, so the two billing calls are replaced with stand-ins and the
subscription the billing function would save is inserted directly. Run after tests/e2e_backend.py."""
import subprocess, sys
from playwright.sync_api import sync_playwright
B = 'http://localhost:8787/'
DB = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-d', 'bobe2e', '-qtAX', '-c']
sql = lambda q: subprocess.run(DB + [q], capture_output=True, text=True).stdout.strip()
fails = 0
def ok(name, cond, info=''):
    global fails
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  -> ' + str(info)), flush=True)
    if not cond: fails += 1
SHOT = '/tmp/claude-0/-home-claude/451fbb71-c1b0-527b-9371-00181eb45299/scratchpad/'

sql("update site_settings set payments = true")
with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    ctx = br.new_context(viewport={'width': 1300, 'height': 1000}); T = ctx.new_page()
    T.on('pageerror', lambda e: errs.append(str(e))); T.on('dialog', lambda d: d.accept())
    T.goto(B + '#login'); T.wait_for_function('window.BOB && !document.getElementById("boot")')
    T.fill('#lemail', 'rivera@school.org'); T.fill('#lpass', 'Chalk-Harbour-42')
    with T.expect_navigation(): T.click('#logForm button[type=submit]')
    T.wait_for_function('window.BOB && !document.getElementById("boot")')
    T.evaluate('''()=>{BOB.pay.prices={licences:{id:"price_x",amount:1500,currency:"gbp",interval:"year"}};
      BOB.pay.seller=async()=>({price:{amount:1500,currency:"gbp"},teacher:{amount:130000,currency:"gbp"},firstBuy:true,seller:{name:"Bits of Bytes",email:"hello@bitsofbytes.co",url:"https://bitsofbytes.co",address:"Bangkok, Thailand",phone:""},days:30});
      window.__inv=null;BOB.pay.invoice=async d=>{window.__inv=d;return {number:"INV-0001",url:"https://invoice.stripe.com/i/x",pdf:"https://pay.stripe.com/invoice/x/pdf",email:d.email,total:1500*d.quantity,currency:"gbp"}}}''')
    T.evaluate('location.hash="teacher"'); T.wait_for_timeout(400)
    ok('invoice section shown when payments are on', T.locator('details.tinv').count() == 1 and T.locator('#reqForm').count() == 0)
    T.click('details.tinv > summary'); T.wait_for_timeout(100)
    ok('school name filled in from the account', T.input_value('#invs') == 'Test School', T.input_value('#invs'))
    T.fill('#invn', '25'); T.fill('#inva', '1 School Road\nBangkok'); T.fill('#invp', 'PO-778')
    # ---- the quote opens in a new window
    with ctx.expect_page() as q: T.click('[data-inv="quote"]')
    Q = q.value; Q.wait_for_load_state(); Q.wait_for_function('document.title.startsWith("Quote")')
    qt = Q.inner_text('body')
    ok('quote shows the school, 25 licences, the teacher subscription and the total', 'Test School' in qt and '25' in qt and '£375.00' in qt and 'teacher subscription' in qt and '£1,675.00' in qt, qt[:700])
    ok('quote has a number, a date and a valid-until date', 'Q-' in qt and 'valid until' in qt.lower())
    ok('quote shows the seller details', 'hello@bitsofbytes.co' in qt and 'Bangkok, Thailand' in qt)
    Q.screenshot(path=SHOT + 'quote.png', full_page=True); Q.close()
    # ---- sending the invoice
    T.click('#invForm button[type=submit]'); T.wait_for_timeout(200)
    ok('an invoice needs an email address', 'email address' in T.inner_text('#inverr2'))
    T.fill('#inve', 'finance@school.org')
    tid = sql("select id from profiles where email='rivera@school.org'")
    before = T.evaluate('licInfo(S.user.id).bought')
    sql(f"insert into subscriptions(id,user_id,plan,status,quantity,interval,current_period_end,collection) values('sub_inv','{tid}','licences','active',25,'year',now()+interval '365 days','send_invoice')")
    T.click('#invForm button[type=submit]'); T.wait_for_timeout(800)
    sent = T.evaluate('window.__inv')
    ok('the invoice call gets the form details', sent and sent['quantity'] == 25 and sent['school'] == 'Test School' and sent['email'] == 'finance@school.org' and sent['po'] == 'PO-778' and 'Bangkok' in sent['address'], sent)
    txt = T.inner_text('.tlic')
    ok('teacher told the invoice was sent, with links', 'Invoice INV-0001 sent to finance@school.org' in txt and T.locator('.tinv a[href*="pdf"]').count() == 1, txt[:600])
    ok('the licences are added straight away', T.evaluate('licInfo(S.user.id).bought') == before + 25, (before, T.evaluate('licInfo(S.user.id).bought')))
    ok('licence list says paid by invoice, without the card billing button', 'paid by invoice' in txt and T.locator('[data-pay="portal"]').count() == 0, txt[:400])
    T.locator('.tlic').screenshot(path=SHOT + 'invoice-panel.png')
    # ---- adding licences tops up the existing subscription, without a checkout page
    T.evaluate('''()=>{window.__set=[];BOB.pay.setLicences=async(id,q)=>{window.__set.push([id,q]);await fetch("/").catch(()=>{});return {quantity:q,byInvoice:true,invoice:{url:"https://invoice.stripe.com/i/y",number:"INV-0002"}}}}''')
    T.fill('#buyn', '5'); ok('buy button says Add licences when there is a subscription', 'Add licences' in T.inner_text('#buyForm'))
    T.click('#buyForm button[type=submit]'); T.wait_for_function('window.__set.length>0'); T.wait_for_timeout(1500)
    ok('adding 5 licences asks to raise sub_inv from 25 to 30', T.evaluate('window.__set') == [['sub_inv', 30]], T.evaluate('window.__set'))
    ok('teacher told an invoice for the extra licences was emailed', 'invoice for the extra licences' in T.inner_text('.tlic'), T.inner_text('.tlic')[:400])
    T.click('[data-lic="edit"][data-id="sub_inv"]'); T.wait_for_timeout(200)
    T.fill('[data-licform="sub_inv"] [data-licn]', '12'); T.click('[data-licform="sub_inv"] button[type=submit]'); T.wait_for_timeout(600)
    ok('changing the number sends the new total', T.evaluate('window.__set')[-1] == ['sub_inv', 12], T.evaluate('window.__set'))
    sql("delete from subscriptions where id='sub_inv'")
    print('page errors:', errs or 'none'); br.close()
sql("update site_settings set payments = false")
print(f'{fails} failure(s)'); sys.exit(1 if fails or errs else 0)
