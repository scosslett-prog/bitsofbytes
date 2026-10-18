"""The Bits of Bytes logo: a phone full of bits with a bite taken out, the bitten bits tumbling away.
   python3 scripts/logo.py  writes public/logo.svg and public/favicon.svg (then regenerate the PNGs, see README)."""
import math
TEAL="#0D7566"; DEEP="#0A5A4E"; COP="#A85A17"; INK="#14232A"
def scallops(cx,cy,R,n,r):
    # the bite: a big circle plus small circles round its edge facing the phone, so the edge looks bitten
    out=[f'<circle cx="{cx:.1f}" cy="{cy:.1f}" r="{R:.1f}" fill="#000"/>']
    for k in range(n):
        a=math.radians(112+(248-112)*k/(n-1))
        out.append(f'<circle cx="{cx+R*math.cos(a):.1f}" cy="{cy+R*math.sin(a):.1f}" r="{r:.1f}" fill="#000"/>')
    return "".join(out)
def mark(full=True, rows=("10110110","00101101","11011010","11000011","00101011"), uid="a", frame=TEAL):
    W,H=(176,200) if full else (120,200)
    px,py,pw,ph,rx=8,8,104,184,22
    cx,cy,R=px+pw-2,py+52,36
    sx,sy,sw,sh=px+11,py+15,pw-22,ph-54
    s=[f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" role="img" aria-label="Bits of Bytes logo">',
       # the frame loses the bite; the screen loses a slightly bigger bite, so the frame colour rims the bitten edge
       f'<defs><mask id="m{uid}" maskUnits="userSpaceOnUse"><rect width="{W}" height="{H}" fill="#fff"/>{scallops(cx,cy,R,5,12)}</mask>',
       f'<mask id="s{uid}" maskUnits="userSpaceOnUse"><rect width="{W}" height="{H}" fill="#fff"/>{scallops(cx,cy,R+5,5,17)}</mask></defs>',
       f'<g mask="url(#m{uid})"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="{rx}" fill="{frame}"/>',
       f'<g mask="url(#s{uid})"><rect x="{sx}" y="{sy}" width="{sw}" height="{sh}" rx="7" fill="#fff"/>']
    lh=sh/len(rows)
    for i,row in enumerate(rows):
        y=sy+lh*(i+.73)
        tsp="".join(f'<tspan fill="{TEAL if ch=="1" else INK}">{ch}</tspan>' for ch in row)
        s.append(f'<text x="{sx+sw/2:.1f}" y="{y:.1f}" text-anchor="middle" font-family="JetBrains Mono,Menlo,Consolas,monospace" font-weight="800" font-size="{lh*.74:.1f}" textLength="{sw-12}" lengthAdjust="spacingAndGlyphs">{tsp}</text>')
    s.append(f'</g><rect x="{px+pw/2-12}" y="{py+ph-23}" width="24" height="7" rx="3.5" fill="#fff"/></g>')
    if full:
        for ch,x,y,rot,col,sz in [("1",142,90,-16,TEAL,16),("0",160,118,20,COP,14),("1",146,146,-30,TEAL,12.5),("0",163,170,12,COP,11)]:
            s.append(f'<g class="lbit"><g transform="translate({x} {y}) rotate({rot})"><rect x="{-sz*.62:.1f}" y="{-sz*.76:.1f}" width="{sz*1.24:.1f}" height="{sz*1.52:.1f}" rx="{sz*.3:.1f}" fill="{col}"/><text x="0" y="{sz*.39:.1f}" text-anchor="middle" font-family="JetBrains Mono,Menlo,Consolas,monospace" font-weight="800" font-size="{sz*1.05:.1f}" fill="#fff">{ch}</text></g></g>')
    s.append('</svg>')
    return "".join(s)
if __name__=="__main__":
    open('public/logo.svg','w').write(mark(True))
    open('public/favicon.svg','w').write(mark(False,rows=("101","010","110"),uid="i"))
