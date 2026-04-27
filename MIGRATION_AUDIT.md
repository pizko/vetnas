# Migration Audit

## Archive

- Source archive: `/workspace/vibecoding/studytool/dev/vetnasvyaz/vetnasvyaz.zip`
- Extracted source: `/workspace/vibecoding/studytool/dev/vetnasvyaz/extracted/1d151d1a0536be76c8ae99c23e0e1bb9/public_html`
- Repository baseline: `/workspace/vibecoding/studytool/dev/vetnasvyaz/site-repo`

## Snapshot Stats

- HTML pages: 75
- CSS files: 61
- JS files: 128
- Images: 250+
- Font files: 196
- Extracted size: about 38 MB

## Cleanup Plan

1. Preserve this baseline for visual comparison.
2. Normalize page URLs and internal links.
3. Extract header, footer, menus, forms, and repeated blocks into shared layouts.
4. Replace MegaGroup forms with a working endpoint.
5. Remove MegaGroup scripts, old counters, duplicate galleries, duplicate fonts, and unused CSS.
6. Rebuild one curated `assets/css/main.css`.
7. Rebuild one minimal `assets/js/app.js`.
8. Add sitemap, robots, canonical URLs, and redirect rules.
9. Validate links, forms, mobile layout, and page speed.

## Do Not Blindly Merge

Do not concatenate all legacy CSS and JS files into one file. Most of them are generated, duplicated, or backend-dependent. The correct approach is to keep a baseline, then replace legacy behavior with small clean assets.

