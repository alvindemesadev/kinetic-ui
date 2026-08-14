# Release checklist

Run this checklist before tagging a release or publishing the reusable entrypoint:

```bash
npm ci
npm run check
npm run verify:library
npm run measure:build
npm run test:e2e
```

Then verify:

- `/`, `/landing`, and `/library#reference` resolve correctly.
- Light, dark, and system theme preferences persist and react to OS changes.
- Desktop, tablet, mobile, and collapsed-sidebar layouts have no unintended overflow.
- Calendar, pickers, tables, overlays, charts, Kanban, Timeline, and To-do interactions work.
- Keyboard focus, Escape behavior, screen-reader names, and reduced-motion behavior remain valid.
- The library build contains no showcase shell, chart gallery, catalog demo, screenshots, or fake delays.
- `performance-budget.json` passes without an undocumented exception.
- Documentation examples match the current public exports and source files.
- Any visual change has reviewed evidence from `docs/visual-regression-checklist.md`.

Update `CHANGELOG.md` and migration notes before creating a tag.
