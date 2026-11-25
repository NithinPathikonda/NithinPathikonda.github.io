# Agent & Developer Instructions (`NithinPathikonda.github.io`)

- **Repository Role:** Public developer portfolio hosted on GitHub Pages (`https://nithinpathikonda.github.io/`).
- **Stack:** Vanilla HTML5, CSS3 (`css/style.css`), and ES6 JavaScript (`js/main.js`) with zero build steps.
- **Key Architecture Notes:**
  - `index.html` `<head>` contains an immediate inline URL parameter sanitizer that strips `?project=kanso` via `window.history.replaceState` before paint to prevent modal re-trigger loops.
  - All Kanso modal logic (`openKansoModal`, `closeKansoModal`, `switchKansoSlide`, `handleKansoModalBackdrop`) lives in `js/main.js` and is exposed on `window`. Do not duplicate modal listeners inline in `index.html`.
  - Bump `?v=X.Y` query versions on `style.css` and `main.js` in `index.html` when updating frontend assets to bust CDN/browser caches.
  - `kanso/index.html` provides LinkedIn-friendly OpenGraph tags and redirects to `https://nithinpathikonda.github.io/?project=kanso#kanso-showcase`.
- **Verification:** Run `python3 tests/test_portfolio.py` (10 tests) before committing/pushing to `origin main`.
