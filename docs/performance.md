# Runtime performance notes

## Current loading boundaries

The application entry contains the shell, navigation, hero, foundation, controls, and lightweight showcase compositions. The following expensive trees are deferred:

- `ComponentCatalog` and its catalog dependencies load only when the Reference section approaches the viewport.
- `ChartGallery` and Recharts load only when the Data section approaches the viewport.
- `content-visibility: auto` with an intrinsic size hint lets the browser skip layout and paint work for distant sections.

`DeferredRender` has an IntersectionObserver path and a scroll/resize fallback so direct anchor navigation and compact viewports activate content reliably.

## Measurement commands

```bash
npm run measure:build:report
npm run measure:build
npm run verify:library
```

The report records raw and gzip sizes for every production asset. The enforced targets live in `performance-budget.json` and currently cover initial JavaScript/CSS and total JavaScript/CSS.

## Avoiding regressions

- Keep charting and catalog imports behind dynamic boundaries.
- Keep static data arrays outside render functions.
- Use a stable prop boundary before adding memoization.
- Use transform/opacity for continuous animation.
- Pause offscreen carousels and honor reduced motion.
- Re-run the browser trace when a control or section introduces scroll/resize work.
