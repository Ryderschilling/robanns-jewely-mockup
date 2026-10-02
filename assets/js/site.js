/* Robann's shared behaviour */
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const coarse = () => matchMedia('(pointer: coarse)').matches;
window.RB = { $, $$, clamp, reduce, coarse };

document.addEventListener('DOMContentLoaded', () => {
  /* reveals */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: .06 });
  $$('[data-rv], .mask-line, .site-foot [data-fx], [data-io]').forEach(el => io.observe(el));
  requestAnimationFrame(() => $$('.gnav [data-fx]').forEach(el => el.classList.add('in')));

  /* nav state, two thresholds */
  const nav = $('#gnav'), callbar = $('#callbar'); let scrolled = false;
  const onScroll = () => {
    const y = scrollY;
    if (!scrolled && y > 70) { scrolled = true; nav.classList.add('is-scrolled'); }
    else if (scrolled && y < 20) { scrolled = false; nav.classList.remove('is-scrolled'); }
    if (callbar) callbar.classList.toggle('on', y > innerHeight * .6);
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* mobile menu */
  const burger = $('#burger'), mm = $('#mmenu');
  const setMenu = o => { document.body.classList.toggle('menu-open', o); burger.setAttribute('aria-expanded', o); mm.setAttribute('aria-hidden', !o); };
  burger.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#mmenu a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  /* year */
  $$('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* counters */
  const cio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, from = +(el.dataset.from || 0);
    if (reduce) { el.textContent = end; return; }
    const t0 = performance.now(), dur = +(el.dataset.dur || 1800);
    const tick = t => { const p = clamp((t - t0) / dur), k = 1 - Math.pow(1 - p, 4); el.textContent = Math.round(from + (end - from) * k); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  $$('[data-count]').forEach(el => cio.observe(el));

  /* live open / closed status, Pacific time. Tue to Sat 10 to 5 */
  const status = () => {
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Los_Angeles' }));
    const d = now.getDay(), m = now.getHours() * 60 + now.getMinutes();
    const openDay = d >= 2 && d <= 6, open = openDay && m >= 600 && m < 1020;
    let txt;
    if (open) txt = m >= 960 ? `Open now, closing at 5pm` : `Open now until 5pm`;
    else {
      let n = d, add = 0; const names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      if (openDay && m < 600) txt = 'Opens today at 10am';
      else { do { n = (n + 1) % 7; add++; } while (n < 2); txt = `Closed now, opens ${add === 1 ? 'tomorrow' : names[n]} at 10am`; }
    }
    $$('[data-status]').forEach(el => { el.classList.toggle('is-open', open); const t = $('.t', el); (t || el).textContent = txt; });
    $$('[data-day]').forEach(el => el.classList.toggle('today', +el.dataset.day === d));
  };
  status(); setInterval(status, 60000);

  /* magnetic buttons */
  if (!coarse() && !reduce) $$('.btn--gold, [data-magnet]').forEach(b => {
    b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.translate = `${(e.clientX - r.left - r.width / 2) * .18}px ${(e.clientY - r.top - r.height / 2) * .28}px`; });
    b.addEventListener('pointerleave', () => b.style.translate = '0 0');
  });

  /* mockup forms */
  $$('form[data-mock]').forEach(f => f.addEventListener('submit', e => { e.preventDefault(); f.classList.add('sent'); }));

  /* parallax */
  const pars = $$('[data-par]');
  if (pars.length && !reduce) {
    const loop = () => { pars.forEach(el => { const r = el.parentElement.getBoundingClientRect(); if (r.bottom < -200 || r.top > innerHeight + 200) return; const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; el.style.transform = `translate3d(0,${p * +el.dataset.par}px,0) scale(1.12)`; }); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
});

/* Sparkle field: 4 point glints that twinkle. Usage: RB.sparkles(canvas, {count, area:fn}) */
RB.sparkles = (cv, o = {}) => {
  if (reduce) return;
  const ctx = cv.getContext('2d'); let w, h, dpr; const N = o.count || 40;
  const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
  size(); addEventListener('resize', size);
  const spawn = s => { const p = o.area ? o.area(w, h) : [Math.random() * w, Math.random() * h]; s.x = p[0]; s.y = p[1]; s.r = (o.min || 1.5) + Math.random() * (o.max || 5); s.t = 0; s.life = 1.6 + Math.random() * 2.8; s.delay = Math.random() * 4; return s; };
  const S = Array.from({ length: N }, () => spawn({}));
  let last = performance.now(), visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) { last = performance.now(); requestAnimationFrame(frame); } }).observe(cv);
  function star(x, y, r, a) {
    ctx.globalAlpha = a; ctx.beginPath();
    ctx.moveTo(x, y - r * 2.4); ctx.quadraticCurveTo(x, y, x + r * 2.4, y); ctx.quadraticCurveTo(x, y, x, y + r * 2.4); ctx.quadraticCurveTo(x, y, x - r * 2.4, y); ctx.quadraticCurveTo(x, y, x, y - r * 2.4); ctx.fill();
    ctx.globalAlpha = a * .35; ctx.beginPath(); ctx.arc(x, y, r * 1.6, 0, 6.283); ctx.fill();
  }
  function frame(now) {
    const dt = Math.min(.05, (now - last) / 1000); last = now;
    ctx.clearRect(0, 0, w, h); ctx.fillStyle = o.color || '#fff6dc';
    S.forEach(s => { if (s.delay > 0) { s.delay -= dt; return; } s.t += dt; const k = s.t / s.life; if (k >= 1) { spawn(s); s.delay = Math.random() * 1.5; return; } const a = Math.sin(k * Math.PI); star(s.x, s.y, s.r * (.6 + a * .4), a * (o.alpha || .9)); });
    if (visible) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
};
