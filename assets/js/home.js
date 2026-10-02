/* Robann's home page interactions */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, clamp, reduce, coarse } = RB;

  /* ---------- HERO: pendant swing, spotlight, sparkles ---------- */
  const hero = $('#hero'), pend = $('#pendant'), spot = $('#heroSpot');
  {
    // pendulum spring: angle follows pointer x + scroll velocity kicks
    let a = 0, v = 0, target = 0, lastY = scrollY, lastT = performance.now(), lift = 0;
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      target = ((e.clientX - r.left) / r.width - .5) * 7;
      spot.style.setProperty('--sx', (e.clientX - r.left) + 'px');
      spot.style.setProperty('--sy', (e.clientY - r.top) + 'px');
    });
    hero.addEventListener('pointerleave', () => target = 0);
    const loop = now => {
      const dt = Math.min(.05, (now - lastT) / 1000); lastT = now;
      const y = scrollY, dy = y - lastY; lastY = y;
      if (!reduce) {
        v += dy * .012; // scroll gives the pendant a nudge
        const idle = Math.sin(now / 1400) * 1.1; // slow breathing sway
        const acc = -18 * (a - target - idle) - 3.2 * v;
        v += acc * dt; a += v * dt;
        lift = y * .35;
        pend.style.transform = `translateX(-50%) translateY(${-lift}px) rotate(${a}deg)`;
      }
      if (y < innerHeight * 1.3) requestAnimationFrame(loop); else { requestAnimationFrame(function wait(t) { if (scrollY < innerHeight * 1.3) { lastT = t; lastY = scrollY; requestAnimationFrame(loop); } else requestAnimationFrame(wait); }); }
    };
    requestAnimationFrame(loop);
    // sparkles cluster around the stone (lower part of the pendant)
    RB.sparkles($('#heroSparks'), {
      count: coarse() ? 18 : 34, max: 4.2, area: (w, h) => {
        const r = pend.getBoundingClientRect(), hr = hero.getBoundingClientRect();
        const cx = r.left - hr.left + r.width / 2, cy = r.top - hr.top + r.height * .72;
        const ang = Math.random() * 6.283, rad = Math.pow(Math.random(), .7) * r.width * .3;
        return Math.random() < .25 ? [Math.random() * w, Math.random() * h * .9] : [cx + Math.cos(ang) * rad, cy + Math.sin(ang) * rad * 1.2];
      }
    });
  }

  /* ---------- marquee loop ---------- */
  const mq = $('#marquee'); mq.innerHTML += mq.innerHTML;

  /* ---------- statement: words light up as you scroll ---------- */
  const ft = $('#fillText');
  {
    const walk = n => { [...n.childNodes].forEach(c => { if (c.nodeType === 3) { const f = document.createDocumentFragment(); c.textContent.split(/(\s+)/).forEach(t => { if (!t.trim()) f.append(t); else { const s = document.createElement('span'); s.className = 'w'; s.textContent = t; f.append(s); } }); c.replaceWith(f); } else walk(c); }); };
    walk(ft);
    const words = $$('.w', ft);
    const upd = () => { const r = ft.getBoundingClientRect(); const p = clamp((innerHeight * .85 - r.top) / (r.height + innerHeight * .35)); const n = Math.round(p * words.length * 1.15); words.forEach((w, i) => w.classList.toggle('on', i < n)); };
    if (reduce) words.forEach(w => w.classList.add('on')); else { addEventListener('scroll', upd, { passive: true }); upd(); }
  }

  /* ---------- collections: cursor preview ---------- */
  const prev = $('#cprev');
  if (!coarse()) {
    const rows = $$('#clist a');
    rows.forEach(a => { const l = document.createElement('div'); l.className = 'layer' + ('light' in a.dataset ? ' light' : ''); l.innerHTML = `<img src="${a.dataset.img}" alt="">`; prev.append(l); a._layer = l; });
    let mx = 0, my = 0, px = 0, py = 0, on = false, lastX = 0;
    rows.forEach(a => {
      a.addEventListener('pointerenter', () => { on = true; prev.classList.add('on'); $$('.layer', prev).forEach(l => l.classList.toggle('on', l === a._layer)); });
      a.addEventListener('pointerleave', () => { on = false; prev.classList.remove('on'); });
    });
    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    const loop = () => { px += (mx - px) * .14; py += (my - py) * .14; const vx = px - lastX; lastX = px; prev.style.left = px + 'px'; prev.style.top = py + 'px'; prev.style.setProperty('--rot', clamp(vx * .4, -10, 10) + 'deg'); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }

  /* ---------- STACK SPREAD (vanilla port, same slots/timings as the React original) ---------- */
  (() => {
    const sec = $('#vault'), wrap = $('#spreadCards'), copy = $('#spreadCopy'), hint = $('#spreadHint');
    const SLOTS = [
      { so: [-8, -10], sr: -18, t: { x: -20, y: -34, s: .7, w: 17, h: 22 }, sm: [-36, -33], z: 2 },
      { so: [14, -10], sr: 20, t: { x: 32, y: -30, s: .9, w: 18, h: 32 }, sm: [-12, -33], z: 3 },
      { so: [-16, 0], sr: -4, t: { x: -36, y: -2, s: .9, w: 15, h: 32 }, sm: [12, -33], z: 4 },
      { so: [1, -10], sr: -2, t: { x: 6, y: -32, s: .8, w: 25, h: 30 }, sm: [36, -33], z: 5 },
      { so: [18, 1], sr: 6, t: { x: 37, y: 6, s: .8, w: 18, h: 32 }, sm: [-36, 34], z: 6 },
      { so: [-6, 10], sr: 6, t: { x: -24, y: 34, s: .9, w: 22, h: 25 }, sm: [-12, 34], z: 7 },
      { so: [8, 7], sr: 3, t: { x: 4, y: 39, s: .72, w: 20, h: 24 }, sm: [12, 34], z: 8 },
      { so: [20, 12], sr: -7, t: { x: 30, y: 34, s: .9, w: 16, h: 20 }, sm: [36, 34], z: 9 },
    ];
    const imgs = $$('img', wrap);
    const cards = imgs.map((img, i) => { const d = document.createElement('div'); d.className = 'spread__card'; const inner = document.createElement('div'); img.replaceWith(d); inner.append(img); d.append(inner); d.style.zIndex = SLOTS[i].z; return d; });
    const n = cards.length, depth = i => .55 + (i / (n - 1)) * .75;
    const STACK_SCALE = .82, S0 = .12, S1 = .9, FADE_START = .45, FADE_LEN = .28;
    let isCoarse = coarse();
    const size = () => cards.forEach((c, i) => { const t = SLOTS[i].t; c.style.width = (isCoarse ? 22 : t.w) + 'vw'; c.style.height = (isCoarse ? 14 : t.h) + 'vh'; });
    matchMedia('(pointer: coarse)').addEventListener('change', e => { isCoarse = e.matches; size(); });
    size();
    let x = 0, v = 0, last = performance.now(), raw = 0, rawScroll = 0, active = false, spread = false;
    let px = 0, py = 0, tpx = 0, tpy = 0, pvx = 0, pvy = 0;
    addEventListener('pointermove', e => { if (!spread || isCoarse) return; tpx = e.clientX / innerWidth * 2 - 1; tpy = e.clientY / innerHeight * 2 - 1; }, { passive: true });
    const read = () => { const r = sec.getBoundingClientRect(); const total = r.height - innerHeight; rawScroll = clamp(-r.top / total); raw = clamp((rawScroll - S0) / (S1 - S0)); };
    const render = p => {
      cards.forEach((c, i) => {
        const s = SLOTS[i], t = s.t;
        const endX = isCoarse ? s.sm[0] : t.x, endY = isCoarse ? s.sm[1] : t.y;
        const tx = s.so[0] + (endX - s.so[0]) * p, ty = s.so[1] + (endY - s.so[1]) * p;
        const drift = (reduce || isCoarse) ? 0 : depth(i) * p;
        const sr = reduce ? 0 : s.sr, rot = sr * (1 - p);
        const rest = isCoarse ? 1 : t.s, sc = STACK_SCALE + (rest - STACK_SCALE) * p;
        c.style.transform = `translate(calc(-50% + ${tx - px * 2.6 * drift}vw), calc(-50% + ${ty - py * 2.2 * drift}vh)) rotate(${rot}deg) scale(${sc})`;
      });
      const o = clamp((p - FADE_START) / FADE_LEN), cs = .85 + .15 * clamp((p - FADE_START) / (.9 - FADE_START));
      copy.style.opacity = o; copy.style.transform = reduce ? 'none' : `scale(${cs})`;
      copy.style.pointerEvents = o > .9 ? 'auto' : 'none';
      hint.style.opacity = 1 - clamp(rawScroll / S0);
    };
    const loop = now => {
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      read();
      if (reduce) x = raw; else { const steps = Math.ceil(dt / (1 / 240)); for (let k = 0; k < steps; k++) { const h = dt / steps; const acc = (-70 * (x - raw) - 24 * v) / .5; v += acc * h; x += v * h; } }
      spread = spread ? x > .985 : x >= .999;
      if (!spread) { tpx = 0; tpy = 0; }
      const ax = (-90 * (px - tpx) - 22 * pvx) / .6, ay = (-90 * (py - tpy) - 22 * pvy) / .6;
      pvx += ax * dt; pvy += ay * dt; px += pvx * dt; py += pvy * dt;
      render(clamp(x, -.05, 1.05));
      if (active) requestAnimationFrame(loop);
    };
    new IntersectionObserver(([e]) => { const was = active; active = e.isIntersecting; if (active && !was) { last = performance.now(); requestAnimationFrame(loop); } }, { rootMargin: '200px 0px' }).observe(sec);
    read(); x = raw; render(x);
  })();

  /* ---------- BRIDAL STUDIO ---------- */
  (() => {
    const SH = {
      oval: { label: 'Oval', icon: '<ellipse cx="12" cy="12" rx="6" ry="8.5"/><path d="M12 3.5v17M6 12h12" opacity=".35"/>', m: { white: 'br-oval-white', rose: 'br-oval-rose' } },
      emerald: { label: 'Emerald', icon: '<path d="M8 3h8l3 3v12l-3 3H8l-3-3V6z"/><path d="M9.5 6h5l1.5 1.5v9L14.5 18h-5L8 16.5v-9z" opacity=".35"/>', m: { white: 'br-emerald-white', yellow: 'br-emerald-yellow' } },
      pear: { label: 'Pear', icon: '<path d="M12 2.5C9 7 6 10.5 6 14.5a6 6 0 0 0 12 0c0-4-3-7.5-6-12z"/><path d="M12 6v14" opacity=".35"/>', m: { rose: 'br-pear-rose', yellow: 'br-pear-yellow' } },
      round: { label: 'Round', icon: '<circle cx="12" cy="12" r="8"/><path d="m12 4 3 8-3 8-3-8z" opacity=".35"/>', m: { white: 'br-round-white', yellow: 'br-round-yellow' } },
      halo: { label: 'Double halo', icon: '<ellipse cx="12" cy="12" rx="4" ry="5.5"/><ellipse cx="12" cy="12" rx="7" ry="9" opacity=".55"/>', m: { white: 'br-halo-oval-white' } },
    };
    const MN = { white: 'White gold', yellow: 'Yellow gold', rose: 'Rose gold' };
    const stage = $('#bstage'), tag = $('#btag'), mlabel = $('#mlabel'), shapesEl = $('#shapes');
    const imgs = {};
    Object.values(SH).forEach(s => Object.values(s.m).forEach(f => { const im = new Image(); im.src = `assets/img/${f}.jpg`; im.alt = ''; im.decoding = 'async'; stage.append(im); imgs[f] = im; }));
    let shape = 'oval', metal = 'white';
    Object.entries(SH).forEach(([k, s]) => { const b = document.createElement('button'); b.className = 'chip'; b.dataset.s = k; b.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.3">${s.icon}</svg>${s.label}`; shapesEl.append(b); });
    const metals = $$('#metals .metal');
    const render = () => {
      const s = SH[shape]; if (!s.m[metal]) metal = Object.keys(s.m)[0];
      $$('.chip', shapesEl).forEach(b => b.setAttribute('aria-pressed', b.dataset.s === shape));
      metals.forEach(b => { const ok = !!s.m[b.dataset.m]; b.disabled = !ok; b.setAttribute('aria-pressed', b.dataset.m === metal); b.title = ok ? MN[b.dataset.m] : MN[b.dataset.m] + ', made to order'; });
      const f = s.m[metal]; Object.entries(imgs).forEach(([k, im]) => { im.classList.toggle('on', k === f); im.alt = k === f ? `${s.label} halo engagement ring in ${MN[metal].toLowerCase()}` : ''; });
      tag.innerHTML = `<b>${s.label}</b> &middot; ${MN[metal]}`; mlabel.textContent = MN[metal];
      tag.animate([{ transform: 'scale(.9)' }, { transform: 'scale(1)' }], { duration: 500, easing: 'cubic-bezier(.34,1.4,.64,1)' });
    };
    shapesEl.addEventListener('click', e => { const b = e.target.closest('.chip'); if (!b) return; shape = b.dataset.s; render(); });
    metals.forEach(b => b.addEventListener('click', () => { metal = b.dataset.m; render(); }));
    render();
    // gentle tilt toward the cursor
    if (!coarse() && !reduce) {
      stage.parentElement.addEventListener('pointermove', e => { const r = stage.getBoundingClientRect(); const dx = (e.clientX - r.left) / r.width - .5, dy = (e.clientY - r.top) / r.height - .5; stage.style.transform = `perspective(1200px) rotateY(${dx * 8}deg) rotateX(${-dy * 8}deg)`; });
      stage.parentElement.addEventListener('pointerleave', () => stage.style.transform = '');
      stage.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)';
    }
  })();

  /* ---------- GEMSTONES: vertical scroll drives horizontal track ---------- */
  (() => {
    const sec = $('#gems'), track = $('#gemTrack'), bar = $('#gemBar');
    const mql = matchMedia('(max-width:860px)');
    let dist = 0, cur = 0, tgt = 0, run = false;
    const size = () => { if (mql.matches) { sec.style.height = ''; track.style.transform = ''; return; } dist = track.scrollWidth - innerWidth; sec.style.height = (dist + innerHeight) + 'px'; };
    const read = () => { const r = sec.getBoundingClientRect(); tgt = clamp(-r.top / (r.height - innerHeight)); };
    const loop = () => { if (mql.matches) { run = false; return; } read(); cur += (tgt - cur) * (reduce ? 1 : .12); track.style.transform = `translate3d(${-cur * dist}px,0,0)`; bar.style.setProperty('--p', (cur * 100) + '%'); if (run) requestAnimationFrame(loop); };
    new IntersectionObserver(([e]) => { run = e.isIntersecting; if (run) requestAnimationFrame(loop); }).observe(sec);
    addEventListener('resize', size); addEventListener('load', size); size();
  })();

  /* ---------- RADO: drag rail ---------- */
  (() => {
    const rail = $('#rail'); let down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; });
    addEventListener('pointermove', e => { if (!down) return; const d = e.clientX - sx; moved = Math.abs(d); if (moved > 4) rail.classList.add('drag'); rail.scrollLeft = sl - d; });
    addEventListener('pointerup', () => { if (!down) return; down = false; setTimeout(() => rail.classList.remove('drag'), 0); });
    $$('.rbtn').forEach(b => b.addEventListener('click', () => rail.scrollBy({ left: +b.dataset.dir * (rail.clientWidth * .7), behavior: 'smooth' })));
  })();

  /* ---------- custom steps: earlier cards recede as the next one covers ---------- */
  (() => {
    const steps = $$('#steps .step'); if (reduce || steps.length < 2) return;
    const loop = () => { steps.forEach((c, i) => { const nx = steps[i + 1]; if (!nx) return; const r = c.getBoundingClientRect(), nr = nx.getBoundingClientRect(); const cover = clamp((r.bottom - nr.top) / r.height); c.style.transform = `scale(${1 - cover * .07})`; c.style.filter = `brightness(${1 - cover * .45})`; }); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  })();

  /* ---------- timeline fill ---------- */
  (() => {
    const tl = $('#tl'), items = $$('li', tl);
    const upd = () => { const r = tl.getBoundingClientRect(); const p = clamp((innerHeight * .7 - r.top) / r.height); tl.style.setProperty('--tl', (p * 100) + '%'); items.forEach(li => li.classList.toggle('lit', li.offsetTop <= p * r.height + 4)); };
    addEventListener('scroll', upd, { passive: true }); upd();
  })();

  /* ---------- bento spotlight ---------- */
  $$('.tile').forEach(t => t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
});
