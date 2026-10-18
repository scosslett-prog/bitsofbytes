"""Page title shrinking into the menu bar, and focus mode on lessons. Needs the dev server."""
from playwright.sync_api import sync_playwright
import tempfile; SC=tempfile.gettempdir()
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':800});errs=[];pg.on('pageerror',lambda e:errs.append(str(e)))
    pg.goto('http://localhost:8787/#l-1-2-charsets');pg.wait_for_function('window.BOB && !document.getElementById("boot")');pg.wait_for_timeout(400)
    print('btn visible on lesson', pg.is_visible('#focusbtn'))
    for y in [0,90,400]:
        pg.evaluate(f'scrollTo(0,{y})');pg.wait_for_timeout(300);pg.screenshot(path=f'{SC}/nt_{y}.png',clip={'x':0,'y':0,'width':1280,'height':260})
        print(y, pg.evaluate('[document.querySelector(".navtitle").classList.contains("on"), getComputedStyle(document.querySelector(".navtitle")).opacity]'))
    pg.evaluate('scrollTo(0,0)');pg.wait_for_timeout(200)
    pg.click('#focusbtn');pg.wait_for_timeout(900);pg.screenshot(path=f'{SC}/focus1.png')
    print('focus on', pg.evaluate('[document.getElementById("focusbtn").getAttribute("aria-pressed"), document.querySelector("#fspot").classList.contains("on"), document.querySelector(".fcur h2").textContent]'))
    pg.mouse.wheel(0,700);pg.wait_for_timeout(1000);pg.screenshot(path=f'{SC}/focus2.png')
    print('after scroll part', pg.evaluate('document.querySelector(".fcur h2").textContent'))
    pg.click('#act-1 , .lside .check:nth-child(3)') if False else None
    pg.evaluate('setFocus(document.querySelector("#lcheck"))');pg.wait_for_timeout(300)
    print('activity open -> spot hidden', not pg.evaluate('document.querySelector("#fspot").classList.contains("on")'), pg.evaluate('document.getElementById("focusbtn").classList.contains("paused")'))
    pg.evaluate('setFocus(null)');pg.wait_for_timeout(300)
    print('activity closed -> spot back', pg.evaluate('document.querySelector("#fspot").classList.contains("on")'))
    pg.evaluate('location.hash="paper-1"');pg.wait_for_timeout(400)
    print('btn hidden off lesson', not pg.is_visible('#focusbtn'), 'spot off', not pg.evaluate('document.querySelector("#fspot").classList.contains("on")'))
    pg.set_viewport_size({'width':390,'height':800});pg.evaluate('location.hash="l-1-2-charsets"');pg.wait_for_timeout(500);pg.evaluate('scrollTo(0,500)');pg.wait_for_timeout(700)
    pg.screenshot(path=f'{SC}/focus_m.png');print('no h-scroll', pg.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
    pg.set_viewport_size({'width':1280,'height':800});pg.evaluate('location.hash="l-4-1-software"');pg.wait_for_timeout(500)
    pg.evaluate('scrollTo(0,document.documentElement.scrollHeight)');pg.wait_for_timeout(800)
    last=pg.evaluate('[...document.querySelectorAll("#pane-theory .theory > section")].pop().querySelector("h2").textContent')
    print('bottom of page focuses the last part', pg.evaluate('document.querySelector(".fcur h2").textContent')==last)
    print('errors', errs)
