# leetravaglini.com (2026)

Vite + React + Tailwind CSS v4 + Motion. Built from the Figma file
`leetravaglini.com (2026)` → page "Home V2".

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, client build, SSR build, prerender → dist/
npm run preview   # serve dist/
```

## How it's put together

| Area | Where |
| --- | --- |
| Design tokens (Primitives / Responsive / Theme / Tile Fill / Tile Background) | `src/styles/index.css` |
| Type styles as classes (`heading-xl` … `body-sm`, `label-md`) | `src/styles/index.css` (`@utility`) |
| Bauhaus Tile component (shape, fill, background, rotation, flip, glitch) | `src/components/bauhaus/` |
| Every tile layout, read from Figma | `src/data/tiles.ts` |
| Case study copy + images | `src/data/caseStudies.ts` |
| Bio, experience, skills, links | `src/data/site.ts` |
| SEO head tags + JSON-LD | `src/lib/seo.ts` |

## SEO / GEO

- Every route is prerendered to static HTML (`scripts/prerender.mjs`), so
  crawlers and AI engines get full content without JavaScript.
- Each case study has its own URL (`/case-studies/<slug>/`) with its own
  title, description, canonical, Open Graph tags and JSON-LD; on the site it
  opens as an overlay.
- `sitemap.xml` and `llms.txt` are generated at build time from the data files;
  `robots.txt` lives in `public/`.
- Site origin defaults to `https://leetravaglini.com` — set `VITE_SITE_URL` to change it.

## Replacing placeholder images

Case study images are placeholders until `src` is set. Put files in
`public/images/case-studies/<slug>/` and set `src` (e.g.
`"/images/case-studies/priceline/hero.jpg"`) on the matching `thumb`,
`heroImage`, `approach.images[]` or `features[].image` in
`src/data/caseStudies.ts`. Keep `width`/`height` matching the file and update
the `alt` text to describe the real image.
