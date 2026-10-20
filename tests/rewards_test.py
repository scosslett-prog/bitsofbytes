"""Tarsia puzzles, puzzle assignments, points, achievements and the class leaderboard.
Start the server first:  python3 tests/devserver.py --db bobe2e --port 8787 --reset
Run on a fresh database (it creates its own accounts)."""
import subprocess, sys, time
from playwright.sync_api import sync_playwright
B = 'http://localhost:8787/'
DB = ['psql', '-h', '/tmp', '-p', '54329', '-U', 'postgres', '-d', sys.argv[1] if len(sys.argv) > 1 else 'bobe2e', '-qtAX', '-c']
sql = lambda q: subprocess.run(DB + [q], capture_output=True, text=True).stdout.strip()
fails = 0
def ok(name, cond, info=''):
    global fails
    print(('PASS ' if cond else 'FAIL ') + name + ('' if cond else '  -> ' + str(info)), flush=True)
    if not cond: fails += 1
tag = str(int(time.time()))[-6:]

with sync_playwright() as p:
    br = p.chromium.launch(); errs = []
    def page(vp=None):
        pg = br.new_context(viewport=vp or {'width': 1300, 'height': 900}).new_page()
        pg.on('pageerror', lambda e: errs.append(str(e))); pg.on('dialog', lambda d: d.accept())
        pg.goto(B + '#home'); pg.wait_for_function('window.BOB && !document.getElementById("boot")')
        pg.evaluate('try{localStorage.setItem("bob-analytics","no")}catch(e){};document.getElementById("gabar")?.remove()')
        return pg
    def go(pg, r): pg.evaluate(f'location.hash="{r}"'); pg.wait_for_timeout(200)
    def idle(pg): pg.wait_for_function('!document.body.classList.contains("tbusy")'); pg.wait_for_timeout(150)
    def register(pg, role, name, email, code=''):
        go(pg, 'register'); pg.check(f'#role-{role}'); pg.fill('#rname', name); pg.fill('#remail', email); pg.fill('#rschool', 'Test School')
        if code: pg.fill('#rcode', code)
        pg.fill('#rpass', 'Chalk-Harbour-42'); pg.fill('#rpass2', 'Chalk-Harbour-42')
        with pg.expect_navigation(): pg.click('#regForm button[type=submit]')
        pg.wait_for_function('window.BOB && !document.getElementById("boot")')
    def flushed(pg): pg.evaluate('BOB.store.flush()'); pg.wait_for_function('BOB.store.status==="saved"')
    def solve(pg, lid, m):
        """open a puzzle and drag every piece to its place, turning it as needed"""
        pg.evaluate(f'tzOpen(ALL_LESSONS.find(l=>l.id==="{lid}"),"{m}")'); pg.wait_for_timeout(300)
        n = pg.evaluate('TZ.pieces.length')
        for i in range(n):
            b = pg.evaluate(f'''(()=>{{const pc=TZ.pieces[{i}],g=document.querySelector('#tzsvg [data-pc="{i}"]').getBoundingClientRect(),s=document.querySelector('#tzsvg [data-slot="'+pc.sol[0]+'"]').getBoundingClientRect();return [g.x+g.width/2,g.y+g.height/2,s.x+s.width/2,s.y+s.height/2]}})()''')
            pg.mouse.move(b[0], b[1]); pg.mouse.down(); pg.mouse.move(b[2], b[3], steps=6); pg.mouse.up(); pg.wait_for_timeout(30)
            for _ in range(3):
                if pg.evaluate('TZ.solved') or pg.evaluate(f'TZ.pieces[{i}].rot%6===TZ.pieces[{i}].sol[1]%6'): break
                pg.keyboard.press('r'); pg.wait_for_timeout(20)
        pg.wait_for_timeout(200)
        return pg.evaluate('TZ.solved')

    # ---- every lesson has a puzzle, and the pieces make a full board
    G = page()
    ok('every lesson has puzzle pairs', G.evaluate('ALL_LESSONS.every(l=>tzHas(l))'))
    nocross = G.evaluate('ALL_LESSONS.filter(l=>!pzHas(l,"cross")).map(l=>l.id)')
    ok('nearly every lesson has a crossword (a few number-only lessons have none)', len(nocross) <= 5, nocross)
    bad = G.evaluate('''(()=>{const out=[];for(const l of ALL_LESSONS){if(!pzHas(l,"cross"))continue;for(let n=0;n<3;n++){const X=pzBuild(pzWords(l));if(!X){out.push(l.id+": no grid");break}
      /* every run of 2+ letters across or down must be exactly one placed word */
      const at=(r,c)=>X.cells[r+","+c],runs=[];
      for(let r=0;r<X.h;r++){let c=0;while(c<X.w){if(at(r,c)){let e=c;while(at(r,e+1))e++;if(e>c)runs.push(["a",r,c,e-c+1]);c=e+1}else c++}}
      for(let c=0;c<X.w;c++){let r=0;while(r<X.h){if(at(r,c)){let e=r;while(at(e+1,c))e++;if(e>r)runs.push(["d",r,c,e-r+1]);r=e+1}else r++}}
      const ws=X.words.map(w=>[w.d,w.r,w.c,w.w.letters.length].join());
      if(runs.length!==ws.length||runs.some(x=>!ws.includes(x.join()))){out.push(l.id+": stray run");break}
      if(X.words.some(w=>pzWordCells(w).map(k=>X.cells[k].ch).join("")!==w.w.letters)){out.push(l.id+": letters");break}
      if(X.w>13||X.h>13){out.push(l.id+": too big");break}}}return out})()''')
    ok('every crossword grid is valid: no stray words, letters agree, fits 13 x 13', not bad, bad[:10])
    ok('pairs match makes 8 distinct pairs for every lesson', G.evaluate('ALL_LESSONS.every(l=>{const P=pzMake(l,"match");return P.pairs.length===8&&new Set(P.pairs.map(p=>p.a)).size===8})'), G.evaluate('ALL_LESSONS.filter(l=>{const P=pzMake(l,"match");return P.pairs.length!==8||new Set(P.pairs.map(p=>p.a)).size!==8}).map(l=>l.id)'))
    ok('Easy has 9 pieces and Challenge 16', G.evaluate('(()=>{const l=ALL_LESSONS[0];return tzMake(l,"e").pieces.length===9&&tzMake(l,"c").pieces.length===16})()'))
    ok('a made puzzle is solvable from its own answer', G.evaluate('''(()=>{for(const l of ALL_LESSONS)for(const m of ["e","c"]){const P=tzMake(l,m);P.pieces.forEach(pc=>{pc.at=pc.sol[0];pc.rot=pc.sol[1]});if(!tzEdges(P).every(Boolean))return l.id+m}return true})()''') is True)

    # ---- teacher with licences and a class
    T = page()
    register(T, 'teacher', 'Mr Byte', f'byte{tag}@school.org')
    sql(f"insert into licence_grants (teacher_id, quantity) select id, 5 from profiles where email='byte{tag}@school.org'")
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")'); go(T, 'teacher')
    T.fill('#clsn', '11C'); T.click('#clsForm button'); idle(T)
    code = T.inner_text('.tcode.big').strip()
    cid = T.evaluate('location.hash').replace('#class-', '')

    # ---- teacher sets a lesson assignment that includes the puzzles
    T.click('[data-tc="tab"][data-v="assign"]'); idle(T); T.click('[data-tc="newasg"]'); T.wait_for_timeout(200)
    T.fill('#atitle', 'Sound with puzzles')
    T.click('details[data-topen="p1"] > summary'); T.wait_for_timeout(100)
    T.evaluate('document.querySelectorAll("#asgForm details").forEach(d=>d.open=true)')
    T.check('[data-tl="1-2-sound"]'); T.wait_for_timeout(100)
    ok('three puzzle types offered for lesson assignments', T.locator('[data-apz]').count() == 3)
    for k in ['tarsia', 'match', 'cross']: T.check(f'[data-apz="{k}"]')
    T.click('#asgForm button[type=submit]'); idle(T)
    ok('assignment saved with the puzzle types', sql("select spec->>'tz' || ' ' || (spec->'pz')::text from assignments where title='Sound with puzzles' order by created_at desc limit 1") == 'true ["tarsia", "match", "cross"]',
       sql("select spec::text from assignments where title='Sound with puzzles' order by created_at desc limit 1"))
    ok('teacher sees the puzzle types on the assignment', '+ tarsia, pairs match and crossword' in T.inner_text('#app'))
    # a second assignment with only the crossword
    T.click('[data-tc="newasg"]'); T.wait_for_timeout(200); T.fill('#atitle', 'Crossword only')
    T.evaluate('document.querySelectorAll("#asgForm details").forEach(d=>d.open=true)')
    T.check('[data-tl="1-2-images"]'); T.check('[data-apz="cross"]'); T.click('#asgForm button[type=submit]'); idle(T)
    ok('crossword-only assignment saved without the tarsia flag', sql("select coalesce(spec->>'tz','none') || ' ' || (spec->'pz')::text from assignments where title='Crossword only' order by created_at desc limit 1") == 'none ["cross"]')

    # ---- two students join
    S1 = page(); register(S1, 'student', 'Ada Lovelace', f'ada{tag}@student.org', code=code.lower())
    S2 = page(); register(S2, 'student', 'Alan Turing', f'alan{tag}@student.org', code=code.lower())
    ok('students joined', S1.evaluate('!!myClass()') and S2.evaluate('!!myClass()'))

    # ---- student 1 sees the puzzle is required and solves it
    go(S1, 'l-1-2-sound'); S1.wait_for_timeout(300)
    S1.click('[data-lgt="tz"]'); S1.wait_for_timeout(200)
    ok('lesson card says the teacher set the puzzle', 'Set by your teacher' in S1.inner_text('#tzcard'))
    go(S1, 'todo'); S1.evaluate('document.querySelectorAll("details.todo").forEach(d=>d.open=true)')
    ok('to-do card mentions the puzzles', '+ tarsia, pairs match and crossword' in S1.inner_text('#app') and '+ crossword' in S1.inner_text('#app'))
    ok('only the crossword is required in the crossword-only lesson', S1.evaluate('(()=>{const l=ALL_LESSONS.find(x=>x.id==="1-2-images");return [pzRequired(l,"tarsia"),pzRequired(l,"match"),pzRequired(l,"cross")].join()})()') == 'false,false,true')
    go(S1, 'l-1-2-sound'); S1.wait_for_timeout(200)
    ok('student solves the Challenge puzzle by dragging', solve(S1, '1-2-sound', 'c'))
    ok('solved message shown', 'Solved' in S1.inner_text('#tzmsg'))
    S1.wait_for_timeout(800)
    ok('achievement toasts appear', S1.locator('.rwtoast').count() >= 1, S1.locator('#rwtoasts').count())
    S1.click('[data-tz="close"]'); S1.wait_for_timeout(200)
    ok('card shows the puzzle solved', '1 of 3 solved' in S1.inner_text('.lgrp[data-lg="tz"] .lgsum') or 'Best 100%' in S1.inner_text('#tzcard'), S1.inner_text('#tzcard'))
    # ---- pairs match: one wrong pick, then every pair
    if not S1.locator('[data-pz="open"][data-t="match"]').is_visible(): S1.click('[data-lgt="tz"]'); S1.wait_for_timeout(200)
    S1.click('[data-pz="open"][data-t="match"]'); S1.wait_for_timeout(200)
    n = S1.evaluate('PZ.pairs.length'); ok('pairs match has 8 pairs', n == 8, n)
    S1.click('[data-pz="pick"][data-side="l"][data-i="0"]'); S1.click('[data-pz="pick"][data-side="r"][data-i="1"]'); S1.wait_for_timeout(100)
    ok('a wrong match is counted', S1.evaluate('PZ.bad') == 1 and 'Not a pair' in S1.inner_text('#pzmsg'))
    for i in range(n):
        S1.click(f'[data-pz="pick"][data-side="r"][data-i="{i}"]'); S1.click(f'[data-pz="pick"][data-side="l"][data-i="{i}"]')
    ok('pairs match solved at 90%', 'Solved' in S1.inner_text('#pzmsg') and S1.evaluate('S.tz["1-2-sound-m"].best') == 90, S1.inner_text('#pzmsg'))
    S1.click('[data-pz="close"]'); S1.wait_for_timeout(200)
    # ---- crossword: type every letter
    if not S1.locator('[data-pz="open"][data-t="cross"]').is_visible(): S1.click('[data-lgt="tz"]'); S1.wait_for_timeout(200)
    S1.click('[data-pz="open"][data-t="cross"]'); S1.wait_for_timeout(300)
    cells = S1.evaluate('Object.entries(PZ.X.cells).map(([k,c])=>[k,c.ch])')
    ok('crossword has at least 5 words', S1.evaluate('PZ.X.words.length') >= 5, S1.evaluate('PZ.X.words.length'))
    k0, ch0 = cells[0]
    S1.click(f'.pzx input[data-k="{k0}"]'); S1.keyboard.press('Q' if ch0 != 'Q' else 'Z'); S1.click('#pzcheck'); S1.wait_for_timeout(100)
    ok('check marks a wrong letter', S1.locator('.pzx.bad').count() == 1 and S1.evaluate('PZ.bad') == 1)
    for k, ch in cells:
        S1.click(f'.pzx input[data-k="{k}"]'); S1.keyboard.press(ch)
    S1.wait_for_timeout(200)
    ok('crossword solved at 90%', 'Solved' in S1.inner_text('#pzmsg') and S1.evaluate('S.tz["1-2-sound-x"].best') == 90, S1.inner_text('#pzmsg'))
    S1.screenshot(path='/tmp/claude-0/-home-claude/451fbb71-c1b0-527b-9371-00181eb45299/scratchpad/pz-cross.png')
    S1.click('[data-pz="close"]'); S1.wait_for_timeout(200)
    if not S1.locator('#tzcard').is_visible(): S1.click('[data-lgt="tz"]'); S1.wait_for_timeout(200)
    ok('puzzles group shows all three solved', '3 of 3 solved' in S1.inner_text('.lgrp[data-lg="tz"]'), S1.inner_text('.lgrp[data-lg="tz"]'))
    flushed(S1)
    ok('puzzle result saved to the account', sql(f"select data->>'best' from user_progress u join profiles p on p.id=u.user_id where kind='tz' and key='1-2-sound-c' and p.email='ada{tag}@student.org'") == '100')
    pts = S1.evaluate('rwCompute().total')
    ok('points include the puzzles (50 Challenge, 18 match, 23 crossword)', pts >= 50 + 18 + 23 + 25, pts)
    flushed(S1)
    ok('pairs match and crossword results saved to the account', sql(f"select string_agg(key || '=' || (data->>'best'), ',' order by key) from user_progress u join profiles p on p.id=u.user_id where kind='tz' and key in ('1-2-sound-m','1-2-sound-x') and p.email='ada{tag}@student.org'") == '1-2-sound-m=90,1-2-sound-x=90')
    ok('points saved for the leaderboard', sql(f"select (data->>'points')::int from user_progress u join profiles p on p.id=u.user_id where kind='pts' and p.email='ada{tag}@student.org'") == str(pts))
    ok('rank shown in the menu bar', S1.locator('.rwnav').count() == 1 and str(pts) in S1.inner_text('.rwnav').replace(',', ''))

    # ---- student 2 does some quick checks: more points
    S2.evaluate('''(()=>{const d=new Date().toISOString();["1-1-binary","1-1-hex","1-1-hexuses"].forEach(id=>S.lessons[id]={best:100,last:100,attempts:1,date:d});save()})()''')
    S2.wait_for_timeout(700); flushed(S2)
    pts2 = S2.evaluate('rwCompute().total')
    ok('quick checks earn points (perfect scores)', pts2 >= 3 * 40, pts2)
    ok('Perfect score achievement unlocked', 'perfect' in S2.evaluate('rwCompute().ach'))

    # ---- rewards page and leaderboard
    go(S1, 'rewards'); S1.wait_for_selector('#rwlb table', timeout=8000)
    lb = S1.inner_text('#rwlb')
    ok('rewards page shows rank, achievements and breakdown', all(x.lower() in S1.inner_text('#app').lower() for x in ['Your rank', 'Achievements', 'Where your points come from', 'Puzzle solver']))
    ok('leaderboard lists both students, highest first', lb.find('Alan Turing') < lb.find('Ada Lovelace') if pts2 > pts else lb.find('Ada Lovelace') < lb.find('Alan Turing'), lb)
    ok('own row marked', '(you)' in lb)

    # ---- teacher sees points and can switch the leaderboard off
    T.reload(); T.wait_for_function('window.BOB && !document.getElementById("boot")')
    go(T, 'class-' + cid); T.click('[data-tc="tab"][data-v="progress"]'); idle(T); T.wait_for_selector('#rwcls table', timeout=8000)
    ok('teacher sees every student\'s points', 'Ada Lovelace' in T.inner_text('#rwcls') and 'Alan Turing' in T.inner_text('#rwcls'))
    a1 = T.inner_text('#app')
    T.uncheck('[data-rwlb]'); idle(T)
    ok('leaderboard switched off in the database', sql(f"select leaderboard from classes where id='{cid}'") == 'f')
    S1.reload(); S1.wait_for_function('window.BOB && !document.getElementById("boot")'); go(S1, 'rewards'); S1.wait_for_timeout(1500)
    ok('student told the leaderboard is off', 'turned the leaderboard off' in S1.inner_text('#rwlb'))
    ok('server refuses the leaderboard to students when off', S1.evaluate(f'BOB.school.A.leaderboard("{cid}").then(r=>r.length)') == 0)

    # ---- assignment progress counts the puzzle
    T.click('[data-tc="tab"][data-v="assign"]'); idle(T)
    ok('teacher sees Ada completed the puzzle assignment', T.evaluate(f'''(()=>{{const a=Object.values(SC.asg).find(x=>x.title==="Sound with puzzles");const s=Object.values(SC.users).find(u=>u.name==="Ada Lovelace");return asgStatus(a,s.id).per[0].pct}})()''') > 0)

    # ---- guests get points too, saved in the browser
    G2 = page(); G2.evaluate('S.lessons["1-1-binary"]={best:90,last:90,attempts:1,date:new Date().toISOString()};save()')
    go(G2, 'rewards'); ok('guest rewards page works', 'your rank' in G2.inner_text('#app').lower() and 'create an account' in G2.inner_text('#app').lower())

    # ---- phone: puzzle opens full screen and can be solved
    M = page({'width': 390, 'height': 844}); go(M, 'l-1-1-binary')
    ok('phone: Easy puzzle solved', solve(M, '1-1-binary', 'e'))

    print('page errors:', errs or 'none')
print(f'\n{fails} failure(s)'); sys.exit(1 if fails else 0)
