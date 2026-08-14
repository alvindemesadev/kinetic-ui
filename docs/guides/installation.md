# Installation and source ownership

## Use the source directly

The repository is a Vite + React + TypeScript application. Install dependencies, then start the showcase:

```bash
npm install
npm run dev
```

Reusable primitives are exported from `src/components/ui/index.ts`. Skeuomorphic composed controls are exposed by `src/components/kinetic/index.ts`. The showcase entrypoint is `src/SkeuomorphicKit.tsx` and is not required by reusable components.

```tsx
import { Button } from "@/components/ui/button";
import { SkeuomorphicDatePicker } from "@/library";
import "@/styles.css";
```

## Build the reusable entrypoint

```bash
npm run verify:library
```

This writes `dist-library/kinetic-ui.js` and `dist-library/kinetic-ui.css`. The library build externalizes React and peer UI dependencies; it does not import charts, the catalog, page sections, fake demo delays, or the application shell.

## Source ownership

- `src/components/ui`: primitive source and public barrel.
- `src/components/kinetic`: reusable Skeuomorphic compositions.
- `src/components/showcase`: demo-only compositions and fake async examples.
- `src/sections`: page-level composition and navigation.
- `src/registry`: discovery metadata only; it does not implement behavior.

Prefer direct imports for production code and the barrel for discovery. Do not copy a catalog demo as a second component implementation.
