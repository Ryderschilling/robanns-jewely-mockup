/* inner page interactions */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$, clamp, reduce } = RB;
  const steps = $$('#steps .step');
  if (!reduce && steps.length > 1) {
    const loop = () => { steps.forEach((c, i) => { const nx = steps[i + 1]; if (!nx) return; const r = c.getBoundingClientRect(), nr = nx.getBoundingClientRect(); const cover = clamp((r.bottom - nr.top) / r.height); c.style.transform = `scale(${1 - cover * .07})`; c.style.filter = `brightness(${1 - cover * .45})`; }); requestAnimationFrame(loop); };
    requestAnimationFrame(loop);
  }
  const tl = $('#tl');
  if (tl) {
    const items = $$('li', tl);
    const upd = () => { const r = tl.getBoundingClientRect(); const p = clamp((innerHeight * .7 - r.top) / r.height); tl.style.setProperty('--tl', (p * 100) + '%'); items.forEach(li => li.classList.toggle('lit', li.offsetTop <= p * r.height + 4)); };
    addEventListener('scroll', upd, { passive: true }); upd();
  }
  $$('.tile').forEach(t => t.addEventListener('pointermove', e => { const r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); }));
});
