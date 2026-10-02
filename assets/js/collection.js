/* Collection lookbook. Items are a curated set of real catalog photos from robanns.com.
   When POS access lands, ITEMS gets replaced by a live product feed (Square or Shopify) and the
   drawer form becomes add to cart. Layout + filters stay the same. */
document.addEventListener('DOMContentLoaded', () => {
  const { $, $$ } = RB;
  const CATS = { all: 'Everything', bridal: 'Diamonds & Bridal', gemstones: 'Gemstones', designer: 'Designer', watches: 'Rado Watches', mens: "Men's Rings" };
  const LEADS = {
    all: ['The <em>Collection.</em>', 'A look inside the cases on El Paseo. See something you love? Tap any piece to ask about it, and our team will get right back to you.'],
    bridal: ['Diamonds <em>&amp; Bridal.</em>', 'Halo settings, eternity bands and diamonds chosen with a GIA certified gemologist at your side.'],
    gemstones: ['Colored <em>Gemstones.</em>', 'Sapphire, ruby, emerald and fancy yellow diamonds, set in white gold and platinum.'],
    designer: ['Designer <em>Jewelry.</em>', 'Charles Krypell, Doves, Fana, Shy Creation, Spark and Uneek. The designer houses in our cases.'],
    watches: ['Rado <em>Watches.</em>', 'Swiss made, high tech ceramic. Plus batteries and watch care while you wait.'],
    mens: ["Men's <em>Rings.</em>", 'Damascus steel, meteorite, carbon fiber and exotic woods. Built to be worn hard.'],
  };
  // [file, name, brand, cat, light, size]
  const ITEMS = [
    ['br-oval-white', 'Oval halo engagement ring', 'Uneek', 'bridal', 1],
    ['dk-krypell-blue-crown', 'Blue topaz crown ring', 'Charles Krypell', 'designer', 0, 'tall'],
    ['gm-sapphire-ring', 'Cushion sapphire halo ring', 'Uneek', 'gemstones', 1],
    ['rd-captain-cook-blue', 'Captain Cook automatic', 'Rado', 'watches', 1],
    ['mn-redheart-damascus', 'Redheart wood Damascus band', "Men's bands", 'mens', 1],
    ['br-emerald-yellow', 'Emerald cut halo, yellow gold', 'Uneek', 'bridal', 1],
    ['dk-earring-rain', 'Gemstone rain drop earrings', 'Doves', 'designer', 0],
    ['gm-ruby-ring', 'Oval crimson halo ring', 'Uneek', 'gemstones', 1],
    ['life-uneek-wide', 'Uneek, worn', 'Uneek', 'designer', 0, 'wide'],
    ['br-pear-rose', 'Pear halo, rose gold', 'Uneek', 'bridal', 1],
    ['rd-true-square-skeleton', 'True Square open heart', 'Rado', 'watches', 1],
    ['gm-emerald-ring', 'Elongated emerald ring', 'Uneek', 'gemstones', 1],
    ['ds-fana-color', 'Gemstone color collection', 'Fana', 'designer', 1],
    ['mn-meteorite', 'Meteorite inlay band', "Men's bands", 'mens', 1],
    ['gm-eternity-band', 'Emerald cut eternity band', 'Uneek', 'bridal', 1],
    ['dk-cypress', 'Pavé drop pendants', 'Doves', 'designer', 0, 'tall'],
    ['gm-yellow-diamond-ring', 'Fancy yellow diamond ring', 'Uneek', 'gemstones', 1],
    ['rd-true-thinline-green', 'True Thinline, forest green', 'Rado', 'watches', 1],
    ['br-round-white', 'Round halo, white gold', 'Uneek', 'bridal', 1],
    ['ds-shy-rose-band', 'Pavé rose gold wide band', 'Shy Creation', 'designer', 1],
    ['mn-damascus', 'Damascus steel band', "Men's bands", 'mens', 1],
    ['gm-sapphire-pear-ring', 'Pear sapphire halo ring', 'Uneek', 'gemstones', 1],
    ['dk-ring-stack', 'Opal and turquoise doublet rings', 'Doves', 'designer', 0],
    ['rd-hyperchrome-green', 'HyperChrome Captain Cook', 'Rado', 'watches', 1],
    ['br-halo-oval-white', 'Double halo oval', 'Uneek', 'bridal', 1],
    ['gm-ruby-hoops', 'Ruby inside out hoops', 'Uneek', 'gemstones', 1],
    ['ds-krypell-bracelets', 'Precious pastel bracelets', 'Charles Krypell', 'designer', 1],
    ['mn-gold-carbon', 'Carbon fiber and yellow gold', "Men's bands", 'mens', 1],
    ['dk-shy-model', 'Diamond bangle stack', 'Shy Creation', 'designer', 0, 'wide'],
    ['gm-tennis-bracelet', 'Diamond tennis bracelet', 'Uneek', 'bridal', 1],
    ['rd-centrix-gold', 'Centrix, two tone', 'Rado', 'watches', 1],
    ['gm-sapphire-necklace', 'Sapphire riviera necklace', 'Uneek', 'gemstones', 1],
    ['ds-doves-rings', 'Gemstone ring spread', 'Doves', 'designer', 0],
    ['mn-desert-camo', 'Desert camo inlay band', "Men's bands", 'mens', 1],
    ['br-emerald-white', 'Emerald cut halo, white gold', 'Uneek', 'bridal', 1],
    ['dk-daggers', 'Gold dagger collection', 'Doves', 'designer', 0],
    ['gm-sapphire-drops', 'Sapphire drop earrings', 'Uneek', 'gemstones', 1],
    ['rd-captain-cook-pink', 'Captain Cook 37mm, blush', 'Rado', 'watches', 1],
    ['gm-diamond-drops', 'Cushion diamond drops', 'Uneek', 'bridal', 1],
    ['ds-fana-bands', 'Color stack bands', 'Fana', 'designer', 1],
    ['mn-rose-carbon', 'Rose gold and carbon band', "Men's bands", 'mens', 1],
    ['gm-emerald-cut-ring', 'Emerald and diamond ring', 'Uneek', 'gemstones', 1],
    ['dk-krypell-pastel', 'Precious pastel rings', 'Charles Krypell', 'designer', 0, 'tall'],
    ['rd-true-thinline-blue', 'True Thinline, deep blue', 'Rado', 'watches', 1],
    ['br-pear-yellow', 'Pear halo, yellow gold', 'Uneek', 'bridal', 1],
    ['gm-sapphire-bracelet', 'Sapphire and diamond bracelet', 'Uneek', 'gemstones', 1],
    ['ds-shy-earrings', 'Diamond teardrop earrings', 'Shy Creation', 'designer', 1],
    ['mn-fingerprint', 'Engraved fingerprint band', "Men's bands", 'mens', 1],
    ['dk-az-wmp', 'Turquoise pendant collection', 'Doves', 'designer', 0],
    ['rd-captain-cook-black', 'Captain Cook high tech ceramic', 'Rado', 'watches', 1],
    ['br-oval-rose', 'Oval halo, rose gold', 'Uneek', 'bridal', 1],
    ['gm-diamond-pendant', 'Diamond cluster pendant', 'Uneek', 'bridal', 1],
    ['ds-doves-turquoise', 'Turquoise and shell pendants', 'Doves', 'designer', 0],
    ['mn-rose-blue', 'Rose gold with cerakote blue', "Men's bands", 'mens', 1],
    ['rd-integral', 'Integral', 'Rado', 'watches', 1],
    ['ds-shy-cuff', 'Diamond cuff bracelet', 'Shy Creation', 'designer', 1],
    ['br-round-yellow', 'Round halo, yellow gold', 'Uneek', 'bridal', 1],
  ];
  const DESC = {
    bridal: 'Every center stone can be chosen with Roger, our GIA certified gemologist, and set in white, yellow or rose gold or platinum.',
    gemstones: 'Vivid color set with diamonds. Come see the stone in person, under the light, before you decide.',
    designer: 'From one of the designer houses we carry on El Paseo. Ask about matching pieces and sizes.',
    watches: 'Swiss made by Rado. Try it on in the showroom and ask about sizing and strap options.',
    mens: "Built for everyday wear. Widths, finishes and inlays can be customized to his hand.",
  };

  const grid = $('#grid'), filters = $('#filters'), count = $('#count');
  grid.innerHTML = ITEMS.map(([f, n, b, c, l, s], i) => `
    <button class="item ${s || ''}" data-c="${c}" data-i="${i}" aria-label="${n}, ${b}. Ask about this piece">
      <div class="ph ${l ? 'plinth' : ''}"><img src="assets/img/${f}.jpg" alt="${n}" loading="lazy"><span class="ask"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>Ask about this piece</span></div>
      <div class="meta"><h3>${n}</h3><span class="b">${b}</span></div>
    </button>`).join('');
  const items = $$('.item', grid);
  filters.innerHTML = Object.entries(CATS).map(([k, v]) => `<button class="fbtn" data-f="${k}">${v}<sup>${k === 'all' ? ITEMS.length : ITEMS.filter(i => i[3] === k).length}</sup></button>`).join('');

  const apply = (f, push) => {
    if (!CATS[f]) f = 'all';
    $$('.fbtn', filters).forEach(b => b.setAttribute('aria-pressed', b.dataset.f === f));
    let n = 0;
    items.forEach(el => { const show = f === 'all' || el.dataset.c === f; el.classList.toggle('out', !show); el.classList.remove('enter'); if (show) { void el.offsetWidth; el.style.setProperty('--d', Math.min(n, 12) * .04 + 's'); el.classList.add('enter'); n++; } });
    count.textContent = n;
    $('#colTitle').innerHTML = LEADS[f][0]; $('#colLead').textContent = LEADS[f][1];
    if (push) history.replaceState(null, '', f === 'all' ? 'collection.html' : `collection.html?c=${f}`);
  };
  filters.addEventListener('click', e => { const b = e.target.closest('.fbtn'); if (!b) return; apply(b.dataset.f, true); const top = grid.getBoundingClientRect().top + scrollY - 160; if (scrollY > top) scrollTo({ top, behavior: 'smooth' }); });
  apply(new URLSearchParams(location.search).get('c') || 'all');

  /* drawer */
  const dr = $('#drawer'), dImg = $('#dImg');
  const open = i => {
    const [f, n, b, c, l] = ITEMS[i];
    dImg.className = 'dimg' + (l ? ' plinth' : ''); $('img', dImg).src = `assets/img/${f}.jpg`; $('img', dImg).alt = n;
    $('#dBrand').textContent = b; $('#dTitle').textContent = n; $('#dCat').textContent = CATS[c]; $('#dDesc').textContent = DESC[c];
    $('#dMsg').value = `Hi, I'd love to know more about the ${n.toLowerCase()} (${b}).`;
    $('form', dr).classList.remove('sent');
    dr.classList.add('open'); dr.setAttribute('aria-hidden', 'false'); document.body.style.overflow = 'hidden';
    setTimeout(() => $('.x', dr).focus(), 300);
  };
  const close = () => { dr.classList.remove('open'); dr.setAttribute('aria-hidden', 'true'); document.body.style.overflow = ''; };
  grid.addEventListener('click', e => { const it = e.target.closest('.item'); if (it) open(+it.dataset.i); });
  $$('[data-close]', dr).forEach(x => x.addEventListener('click', close));
  addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
});
