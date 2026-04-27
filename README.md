# Vetnasvyaz Static Site

Static baseline export of the former MegaGroup site for `vetnasvyaz.ru`.

## Current State

This first version is a legacy static snapshot. It is intentionally kept close to the exported site so we can compare behavior before cleanup.

Known issues:

- MegaGroup-generated HTML/CSS/JS is still present.
- Old form handlers do not work without the MegaGroup backend.
- Some links use legacy filenames like `index.html.1.html` and `users@mode=agreement.html`.
- CSS and JS are duplicated and need to be rebuilt, not just concatenated.
- External counters and widgets should be reviewed before production.

## Migration Goal

Build a clean static site with shared layouts, normalized assets, one curated CSS bundle, one minimal JS file, working forms, sitemap, robots, and redirects from legacy URLs.

