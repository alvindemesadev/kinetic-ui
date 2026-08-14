# Visual regression review checklist

Use this checklist for any change that can affect layout, tokens, controls, navigation, or responsive behavior. The goal is to protect the existing Skeuomorphic React visual contract while allowing implementation and performance improvements.

## Capture matrix

Capture the changed section and its surrounding context at these viewport/theme combinations when relevant:

- [ ] Desktop, light theme (1440 x 900 or the project desktop baseline).
- [ ] Desktop, dark theme.
- [ ] Tablet width.
- [ ] Mobile width.
- [ ] Compact/collapsed sidebar width.
- [ ] `/landing` when the landing page is affected.
- [ ] `/` when the canonical showcase page is affected.
- [ ] `/library#reference` when the Reference alias or catalog is affected.

Screenshots should be captured from a production build when possible. Store local captures under `artifacts/` only; that directory is intentionally ignored by Git. Do not add screenshots to the application bundle or package output.

## Interaction review

- [ ] The default, hover, active, focus-visible, disabled, loading, success, warning, and destructive states still use the shared tokens.
- [ ] Text and icons remain readable in both themes; no light-theme hover state changes text or icons to white unless the surface is dark.
- [ ] Border radii, borders, shadows, gradients, and inset highlights match adjacent components.
- [ ] Pointer, keyboard, and touch interactions work without layout jumps.
- [ ] Menus and overlays open in the correct placement and close on Escape or outside click where expected.
- [ ] Focus moves into dialogs/drawers and returns to the trigger after close.
- [ ] Scroll position and active sidebar/navigation state remain synchronized with the URL hash.
- [ ] Reduced-motion behavior does not remove necessary feedback or cause a sudden layout change.

## Layout and content review

- [ ] No clipping, unexpected scrollbars, double borders, or unexplained empty space.
- [ ] Cards have consistent horizontal and vertical spacing.
- [ ] Avatars, icons, badges, controls, and text are aligned to the same baseline/center rules.
- [ ] Tables, calendars, charts, Kanban, Timeline, and To-do content remain usable at narrow widths.
- [ ] Empty, loading, skeleton, and error states preserve the space required by the resolved content.
- [ ] Long labels, translated text, and larger browser font settings do not overlap controls.

## Evidence and approval

- [ ] `npm run format:check` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run test` passes.
- [ ] `npm run build` passes.
- [ ] `npm run measure:build` was reviewed for performance-sensitive changes.
- [ ] Any intentional visual difference is described in the pull request with before/after captures and a reason.
- [ ] No screenshot, debug artifact, or demo-only dependency was added to the reusable component package.

## Review notes

Record the tested route, viewport, theme, browser, and any accepted visual differences in the pull request. A passing automated test does not replace a visual review for changes to shared tokens or layout primitives.
