# Kinetic UI registry (shadcn-compatible)

Kinetic UI ships as a **source-copy registry**, the same distribution model as shadcn/ui:
consumers don't install a built dependency — `shadcn add` copies the component source
into their project so they own and can edit it.

```
┌────────────────────────── repo ──────────────────────────┐
│ registry.json (source) ── validate ──► shadcn registry validate
│        │
│        ▼
│ public/r/{name}.json  (built items, inline content)      │
│ public/r/index.json   (discovery index)                  │
└──────────────────────────────────────────────────────────┘
        │  hosted on GitHub + jsDelivr
        ▼
  consumer: npx shadcn add @kinetic/button
```

## Commands

```bash
npm run registry:build    # generate registry.json, public/r/*, wire components.json
npm run registry:verify   # generate + `shadcn registry validate ./registry.json`
node scripts/serve-registry.mjs [port]   # serve ./public locally for testing (default 8199)
```

`registry:build` also keeps `components.json → registries.kinetic.url` in sync with the
`REGISTRY_URL` constant at the top of `scripts/generate-registry.mjs`. The registry is served
from `alvindemesadev/kinetic-ui` via jsDelivr, so **commit `public/r/`** — jsDelivr serves
files from the repository, so the built registry must be committed.

### Versioning

`REGISTRY_URL` is pinned to a **release tag** (`@v1.1.0`), so consumers get a versioned,
immutable registry — `main` can keep evolving without silently changing what `@kinetic/*`
installs. On each release: tag it (`v1.1.0`, …), update `REGISTRY_URL` to the new tag, run
`npm run registry:build`, and commit the regenerated files.

## How the CSS travels (decision)

Kinetic components are styled by bespoke CSS files that live outside the component sources
(`tokens.css`, `base.css`, `ui-primitives.css`, `portals-overlays.css`,
`tactile-controls.css`). The registry ships them as a **copied style bundle** — a
`registry:file` item named `kinetic` that installs to the consumer's
`src/styles/kinetic/*.css` — and every component item declares `@kinetic/kinetic` in its
`registryDependencies`, so `shadcn add @kinetic/button` brings the skin along automatically.

The alternative — restyling all 60+ components with Tailwind utilities so each file is
self-contained like upstream shadcn — was rejected: it is a large rewrite, it would degrade
the fidelity of the skeuomorphic materials (gradients, color-mix depth, custom shadows), and
it would fork the styling away from the template's single source of truth
(`tokens.css`). The bundle keeps one copy of the design language shared by the template and
any consumer.

### Consumer integration contract

- **Import** the bundle in the global stylesheet after Tailwind:
  `@import "./styles/kinetic/kinetic.css";` (Tailwind v4 is required; the bundle does not
  need `shadcn/tailwind.css`).
- **Scope**: the data-slot skins are scoped under `.ui-kit` (matching the template's own
  root element). Wrap the app — or the parts using Kinetic components — in an element with
  class `ui-kit`, plus `light`/`dark` for the material theme:
  `<div className="ui-kit dark">…</div>`.
- **Fonts**: the bundle installs `@fontsource/geist`, `@fontsource/geist-mono`, and
  `@fontsource/dotgothic16` as dependencies; import the faces you use.
- **`cn`**: components import `@/lib/utils` (the `cn` helper), which `shadcn init`
  already generates in consumer projects.

## Consumer usage

```bash
# register the registry once (writes components.json)
npx shadcn registry add @kinetic=https://cdn.jsdelivr.net/gh/alvindemesadev/kinetic-ui@v1.1.0/public/r/{name}.json

# add components (dependencies and the kinetic skin install automatically)
npx shadcn add @kinetic/button @kinetic/card @kinetic/sidebar
```

For local testing against a built registry: run `node scripts/serve-registry.mjs` and
register `@kinetic=http://localhost:8199/r/{name}.json`.

## Registry format notes (verified against shadcn CLI v4)

- **`registryDependencies` must be namespaced** (`@kinetic/button`, `@kinetic/kinetic`).
  Plain names resolve against ui.shadcn.com's registry instead of this one.
- **`registry:ui` file paths are alias-relative** (`components/ui/button.tsx`); the CLI maps
  them onto the consumer's `@/components/ui` alias. Repo-relative paths (`src/...`) cause the
  CLI to write a literal `@/` directory.
- **`registry:file` files install at `target`** (consumer-side path); used for the CSS
  bundle and for `src/hooks/use-mobile.ts`, which `sidebar` requires.
- The source `registry.json` keeps repo-relative paths so `shadcn registry validate` can
  check file existence and item schema; the built items in `public/r/` are consumer-facing.

## Known limitations

- **Windows CLI quirk**: `shadcn init`/`add` scan parent directories to detect monorepos and
  crash with `EPERM: scandir 'C:\Users\Alvin\Application Data'` when the project lives under
  a directory containing protected junctions (e.g. `C:\Users\<user>` or `%TEMP%`). Run
  consumer projects from a clean path (e.g. `C:\regtest\...`) or run `shadcn init` on a
  non-Windows machine and copy the generated `components.json` + `lib/utils` over.
- The registry covers `src/components/ui/*` (the shadcn-style primitives). The custom
  Skeuomorphic pickers (`AvatarPicker`, `DatePicker`, …) remain in the published npm library
  (`src/library.ts`) rather than the registry.
