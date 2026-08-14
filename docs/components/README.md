# Component documentation

The public component inventory is maintained in `src/components/ui/registry.ts` and described in [`../phase-1-inventory.md`](../phase-1-inventory.md). The 64 source-linked pages in this folder are generated with `npm run docs:components` so source paths, examples, and ownership do not drift. Run `npm run verify:docs` in CI to check that every registered component has a page.

Each component page follows this structure so previews, source, and API details do not drift:

## Component name

### Purpose

Explain the problem the component solves and when to choose it over a related primitive.

### Install or copy

List the direct source file, required dependencies, and stylesheet import.

### Basic usage

Show the smallest controlled or uncontrolled example that compiles against the public API.

### API and variants

Document props, events, sizes, variants, controlled/uncontrolled behavior, and forwarded refs.

### Accessibility

Document the semantic role, accessible name, focus behavior, keyboard shortcuts, Escape behavior, and screen-reader announcements.

### States and responsive behavior

Document disabled, loading, error, success, light/dark, reduced-motion, and mobile behavior.

### Composition and limitations

Show how the component composes with adjacent primitives and record known limitations.

The Reference section should link to these pages and render the same source used in the showcase; it must not maintain a second implementation.
