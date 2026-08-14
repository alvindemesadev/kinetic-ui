# Migration from the current template

The canonical page is `/`. The compatibility URL `/library` renders the same page and focuses `#reference`; it is not a second application.

For existing code:

1. Replace imports from `src/components/index.ts` with direct primitive imports from `src/components/ui` where possible.
2. Use `src/components/kinetic` for reusable Skeuomorphic compositions.
3. Keep `src/components/showcase` and `src/sections` in the demo application only.
4. Import the shared stylesheet once.
5. Replace copied date, tooltip, avatar, table, and overlay implementations with the canonical source listed in `docs/phase-1-inventory.md`.
6. Run `npm run check` and `npm run build:library` before publishing.

Behavior and visual changes should be intentional and reviewed with the visual regression checklist.
