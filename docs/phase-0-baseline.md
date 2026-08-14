# Phase 0 baseline: visual contract and measurement

Recorded 2026-08-14 from the production build on `main`.

Phase 0 freezes the current experience before structural optimization begins. It intentionally changes no rendered UI. The files in this phase define what must remain visually and behaviorally stable while the application is split, deduplicated, and packaged.

## Current production baseline

Run `npm run measure:build:report` to regenerate this report after a build. The current output is approximately:

| Asset                   |    Raw |   Gzip | Notes                                               |
| ----------------------- | -----: | -----: | --------------------------------------------------- |
| `index-*.js`            | 536 KB | 158 KB | Initial application shell and demos                 |
| `ChartGallery-*.js`     | 421 KB | 118 KB | Recharts gallery; should remain deferred            |
| `ComponentCatalog-*.js` | 230 KB |  65 KB | Reference/catalog demos; should not block the shell |
| `index-*.css`           | 430 KB |  61 KB | Shared tokens plus demo styles                      |

The target budgets are recorded in [`../performance-budget.json`](../performance-budget.json). `npm run measure:build` enforces them; use the `:report` variant when measuring a change before deciding how to resolve an overage.

### Browser trace baseline

A cold reload trace was recorded against `http://localhost:5173/` on 2026-08-14. The app currently resolves the initial navigation to `/#reference`, which is itself a routing/scroll-sync item for a later phase.

| Metric                        |                         Observed | Rating / interpretation                                                |
| ----------------------------- | -------------------------------: | ---------------------------------------------------------------------- |
| LCP                           |                         1,901 ms | Good (< 2.5 s); 99.7% was render delay rather than network time        |
| TTFB                          |                             5 ms | Good local-server baseline                                             |
| CLS                           |                             0.00 | Good; a small 0.0006 font-load shift was observed                      |
| INP                           | Not available in cold-load trace | Capture with interaction profiling in a later phase                    |
| DOM elements                  |                            2,881 | High for the initial path; catalog and chart demos are mounted eagerly |
| Longest critical request path |                         2,515 ms | Catalog, chart, and overlay modules are on the initial dependency path |
| Forced reflow time            |                           667 ms | Follow up on ForgotPasswordCard, Sonner, and Recharts call sites       |

The trace also showed style recalculations affecting up to 2,266 elements and a layout update affecting 3,184 nodes. These are baseline signals for Phase 2; they are not altered in Phase 0 so visual behavior remains comparable.

## Visual contract

All optimization work must preserve these contracts unless a deliberate design change is approved separately:

- Skeuomorphic light and dark materials, including restrained depth, borders, gradients, and shadows.
- DotGothic16 display type, Geist/Geist Mono utility type, and the existing readable hierarchy.
- Orange signal as the primary action and active state; success, warning, danger, and info semantics remain distinct.
- One shared radius scale: `xs` 6px, `sm` 8px, controls 10px, menus 14px, panels 18px, and pills 999px.
- Shared control heights: 40px default, 36px compact, and 32px small.
- Shared spacing scale: 4px, 8px, 12px, 16px, 20px, 24px, and 32px.
- Desktop modal/mobile drawer behavior, focus management, keyboard controls, and accessible names.
- Canonical root routing and hash navigation. `/library` remains an alias to the Reference section; it must not create a second application shell.
- Existing behavior for calendar, date/time pickers, charts, tables, overlays, forms, Kanban, Timeline, To-do, profile, theme, and notifications.

The source of truth for these values is [`../src/styles/tokens.css`](../src/styles/tokens.css). New components should consume tokens rather than introducing one-off values.

## Screenshot review matrix

Visual snapshots should be captured and reviewed before and after each structural optimization. Keep local captures in the ignored `artifacts/` directory; do not ship screenshots in the component package.

| Surface                               | Light desktop | Dark desktop | Narrow/mobile | Keyboard/focus |
| ------------------------------------- | :-----------: | :----------: | :-----------: | :------------: |
| Landing and shell navigation          |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Overview/profile/stat cards           |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Inputs, date picker, time picker, OTP |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Calendar and event modal              |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Charts and chart tooltips             |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Tables, row actions, badges           |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Overlays: modal, drawer, confirmation |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Kanban, Timeline, To-do               |      [ ]      |     [ ]      |      [ ]      |      [ ]       |
| Reference/catalog examples            |      [ ]      |     [ ]      |      [ ]      |      [ ]       |

The empty boxes are intentionally a design-review checklist. They should be checked only after the corresponding screenshot has been compared with the approved current experience.

## Reproducible measurement commands

```bash
# Build and print raw/gzip asset sizes without failing on a budget overage
npm run measure:build:report

# Build and enforce the current budgets
npm run measure:build

# Existing quality gate
npm run check

# Accessibility and interaction suite
npm run test:e2e
```

The measurement script uses only Node's built-in filesystem and gzip APIs, so Phase 0 adds no runtime dependency or bundle weight.

The Vitest interaction timeout is 15 seconds so calendar and overlay tests have a deterministic local budget instead of intermittently failing at the default 5-second limit.

## Phase 0 completion

- [x] Current production baseline recorded.
- [x] Browser Web Vitals and main-thread baseline recorded.
- [x] Reproducible build measurement command added.
- [x] Initial performance budgets recorded.
- [x] Visual/token contract documented.
- [ ] Approved screenshot matrix reviewed by the design owner.
- [ ] Budget enforcement enabled in CI (planned for Phase 10).

## Scope boundary

No UI code, component behavior, routes, or styling was changed for this phase. The only changes are roadmap/baseline documentation, budget metadata, and a local measurement script. This keeps the baseline trustworthy before Phase 1 starts changing architecture.
