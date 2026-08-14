# Dependency and asset audit

Audited 2026-08-14. This is the release record for Phase 4; remove or replace a dependency only when the visual and accessibility contract can be preserved.

## Runtime dependencies

| Dependency                                           | Used by                                            | Loading decision                                                                             |
| ---------------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------------------------- |
| React / React DOM                                    | Application and all components                     | Externalized by the library build.                                                           |
| `@base-ui/react`, `radix-ui`, `vaul`                 | Dialog, menu, sheet, drawer and primitive behavior | Keep; these own keyboard/focus semantics.                                                    |
| `lucide-react`                                       | Interface icons                                    | Keep named imports only; no icon package-wide import.                                        |
| `date-fns`, `react-day-picker`                       | Date/calendar primitives                           | Keep in form/calendar paths; full calendar remains a page feature.                           |
| `input-otp`                                          | OTP primitive and password recovery                | Keep; avoid custom verification-cell duplication.                                            |
| `cmdk`                                               | Command menu                                       | Keep in command interaction path.                                                            |
| `embla-carousel-react`                               | Carousel primitive                                 | Keep; logo carousel uses the lightweight composed implementation.                            |
| `react-resizable-panels`                             | Resizable catalog example                          | Catalog-only dependency; not imported by `src/library.ts`.                                   |
| `recharts`                                           | Chart gallery                                      | Deferred `ChartGallery` chunk only; not imported by `src/library.ts`.                        |
| `sonner`                                             | Shared application toaster                         | Keep for the demo site; consumers can use their own toast host.                              |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Class composition                                  | Keep; used throughout the primitive source.                                                  |
| `@tanstack/react-table`                              | Data table behavior                                | Keep in the data-table path; not imported by the chart or shell entry.                       |
| `simple-icons`                                       | Infinite logo carousel                             | Keep the explicit item list; do not import the complete icon catalog into a consumer bundle. |

## Fonts

The app imports local Fontsource CSS in `src/main.tsx` and does not request Google Fonts. The current roles are:

- DotGothic16 400 for display headings and the LED-style timer.
- Geist 400/500/600/700 for readable UI text.
- Geist Mono 400/500/600 for metadata, numbers, and code-like labels.

The library entrypoint does not import application fonts automatically; consumers should choose the required weights and load them once. This avoids shipping unused font files in a component package.

## CSS boundaries

- `src/styles.css` is the full showcase stylesheet.
- `src/library.css` contains tokens, base rules, primitive styles, composed-control styles, and overlay materials.
- The library build does not include landing, chart, responsive showcase, or shell layout rules.

## Verification commands

```bash
npm ls --depth=0
npm run build
npm run build:library
npm run measure:build
```

The asset report is enforced by `npm run measure:build`; any overage must be resolved or documented before merge.
