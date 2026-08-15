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

`registry:build` also keeps `components.json → registries["@kinetic"].url` in sync with the
`REGISTRY_URL` constant at the top of `scripts/generate-registry.mjs`. The registry is served
from `alvindemesadev/kinetic-ui` via jsDelivr, so **commit `public/r/`** — jsDelivr serves
files from the repository, so the built registry must be committed.

### Versioning

`REGISTRY_URL` is pinned to a **release tag** (`@v1.2.0`), so consumers get a versioned,
immutable registry — `main` can keep evolving without silently changing what `@kinetic/*`
installs. On each release: tag it (`v1.2.0`, …), update `REGISTRY_URL` to the new tag, run
`npm run registry:build`, and commit the regenerated files.

The `registry-install` job in `.github/workflows/quality.yml` **proves the pin installs on
every push and pull request**. It scaffolds a throwaway Vite app, wires the shadcn config
with the `@kinetic` registry URL **extracted from the `REGISTRY_URL` constant** (so the job
can never drift from the pin), runs
`npx shadcn@4.17.0 add @kinetic/button @kinetic/card @kinetic/combobox @kinetic/sidebar`,
asserts that the components, the `use-mobile` hook file, _and_ the Kinetic skin bundle
landed, and typechecks + builds the app with the skin compiled in. The chain exercises
**transitive resolution across registry items**: `combobox` declares `@kinetic/input-group`
and `@kinetic/button` (and `input-group` in turn declares `input`/`textarea`), and
`sidebar` is the deepest case — 6 component deps (`button`, `input`, `separator`, `sheet`,
`skeleton`, `tooltip`) plus the `src/hooks/use-mobile.ts` hook file, all sharing the
`@kinetic/kinetic` skin. So the job proves multi-hop resolution and `registry:file` hook
install, not just a direct skin dependency. The skin assertion is what distinguishes this
registry from the unrelated community `@kinetic` registry — a bare upstream component would
pass the add but fail theskin check. The job's install step tracks `shadcn@latest` on every push and PR (consumer
reality), and a **weekly scheduled leg** re-runs the same command pinned to `4.17.0` — the
version this repo's registry is verified against — so neither the latest CLI drifting
ahead nor the pinned version silently breaking can go unnoticed.

This enforces the release flow: **bump `REGISTRY_URL` → tag and publish → the next CI run
proves the new pin installs end-to-end**. The job fails fast if the constant is bumped to a
tag that doesn't exist yet, which is the correct failure mode — an unpublished pin is a
broken registry until the release ships.

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
npx shadcn registry add @kinetic=https://cdn.jsdelivr.net/gh/alvindemesadev/kinetic-ui@v1.2.0/public/r/{name}.json

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
- **`REGISTRY_URL` env var hijacks the CLI's registry base**: the shadcn CLI reads
  `process.env.REGISTRY_URL` as the base URL for registry base items (styles, colors). If you
  export it — e.g. the pinned `@kinetic` URL in a shell or CI step — the CLI resolves base
  items like `colors/neutral.json` against it and fails with
  `.../public/r/{name}.json/colors/neutral.json was not found`. Unset it (`unset REGISTRY_URL`)
  before running shadcn commands; the registry configured in `components.json` is what
  matters.
- The registry covers `src/components/ui/*` (the shadcn-style primitives). The custom
  Skeuomorphic pickers (`AvatarPicker`, `DatePicker`, …) remain in the published npm library
  (`src/library.ts`) rather than the registry.
