# Robann's Jewelers website (Ryder Schilling LLC)

Plain HTML/CSS/JS, no build step needed to deploy. Pages are generated from `src/`:

- Edit page bodies in `src/pages/*.html`, shared nav/footer/head in `src/partials/`.
- Run `python3 src/build.py` to regenerate the root `*.html` files, then commit.
- Collection items live in `assets/js/collection.js` (ITEMS). Swap for the POS product feed when access lands.
- `assets/img/hero-necklace.png` is a stock placeholder. Everything else is from robanns.com.
