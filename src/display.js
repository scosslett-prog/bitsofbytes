/* Display settings: dyslexia-friendly reading, text size, light or dark theme and the two
   main colours. They are kept with the rest of a person's state (S.display), so they follow a
   signed-in user to any device; a guest's stay in this browser. */
export const DEFAULTS = { dys: false, tint: 'yellow', font: 'lexend', spacing: true, size: 100, theme: 'auto', c1: '', c2: '' };
const FONTS = { lexend: '"Lexend", "Atkinson Hyperlegible", Verdana, sans-serif', atkinson: '"Atkinson Hyperlegible", Verdana, sans-serif', verdana: 'Verdana, Tahoma, "Segoe UI", sans-serif' };

function loadLexend() {
  if (document.getElementById('font-lexend')) return;
  const l = document.createElement('link');
  l.id = 'font-lexend'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Lexend:wght@400;600;700&display=swap';
  document.head.appendChild(l);
}

export function applyDisplay(d0) {
  const d = Object.assign({}, DEFAULTS, d0 || {}), r = document.documentElement, st = r.style;
  // a tinted reading background is a light design, so it uses the light theme
  const theme = d.dys ? 'light' : d.theme === 'light' || d.theme === 'dark' ? d.theme : '';
  if (theme) r.dataset.theme = theme; else delete r.dataset.theme;
  r.classList.toggle('dys', !!d.dys);
  r.classList.toggle('dys-space', !!d.dys && d.spacing !== false);
  if (d.dys) { r.dataset.tint = d.tint; st.setProperty('--body', FONTS[d.font] || FONTS.lexend); st.setProperty('--display', FONTS[d.font] || FONTS.lexend); if (d.font === 'lexend') loadLexend(); }
  else { delete r.dataset.tint; st.removeProperty('--body'); st.removeProperty('--display'); }
  st.setProperty('--tscale', String((+d.size || 100) / 100));
  const col = (name, v, extra = []) => {
    if (v) { st.setProperty(name, v); st.setProperty(name + '-soft', `color-mix(in srgb, ${v} 16%, var(--surface))`); extra.forEach((x) => { st.setProperty(x, v); st.setProperty(x + '-soft', `color-mix(in srgb, ${v} 16%, var(--surface))`); }); }
    else [name, ...extra].forEach((x) => { st.removeProperty(x); st.removeProperty(x + '-soft'); });
  };
  col('--p1', d.c1);
  col('--p2', d.c2, ['--ex']);
  return d;
}
