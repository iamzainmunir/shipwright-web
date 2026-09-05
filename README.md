# Shipwright — marketing website

The public landing site for **Shipwright**, an autonomous AI software company. Zero build step —
plain HTML, CSS, and vanilla JavaScript, with a Three.js 3D hero and two interactive demos (an
animated pipeline reel and an auto-playing product tour).

**Live:** open `index.html` in a browser, or host the folder on any static host (GitHub Pages,
Netlify, Vercel, Cloudflare Pages…).

## Structure

```
index.html      Landing page (hero + 3D, pipeline, process reel, tour, features, team, autonomy, CTA)
terms.html      Terms of Service (template — customize before production)
privacy.html    Privacy Policy (template — customize before production)
styles.css      Shared design system (light + dark, violet brand)
app.js          Interactivity: 3D hero (Three.js), process reel, screenshot tour, nav
assets/shots/   Product screenshots used in the tour
```

## Run locally

No dependencies. Open the file directly:

```bash
open index.html
```

…or serve it (so relative asset paths and CDN resources behave exactly as in production):

```bash
python3 -m http.server 4700
# then visit http://localhost:4700
```

## External resources

- **Google Fonts** (Space Grotesk) — the display typeface.
- **Three.js** (via cdnjs) — the 3D hero. The hero degrades gracefully to a static halo if the
  library is unavailable or the visitor prefers reduced motion.

## Deploy to GitHub Pages

Push to the repo, then in **Settings → Pages** choose the `master` branch (root). The site is
static, so nothing else is required.

## Notes

- Fully responsive; respects `prefers-reduced-motion` (animations and 3D pause) and
  `prefers-color-scheme` (light/dark).
- The Terms and Privacy pages are **templates** — review and adapt them before relying on them.

The product itself lives in a separate repository.
