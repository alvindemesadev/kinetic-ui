# Kinetic UI — Skeuomorphic React Template

A Vite, React, TypeScript, Tailwind CSS v4, and shadcn-style component showcase with responsive dark/light skeuomorphic styling. The project includes the complete 64-component shadcn catalog, Kinetic-specific controls, a lazy-loaded Recharts gallery, keyboard-accessible overlays, local theme persistence, and automated unit and accessibility checks.

## Requirements

- Node.js 20.19+ or 22.12+
- npm 10+

## Start

```bash
npm install
npm run dev
```

Create a production build with `npm run build`, or run the complete local verification pipeline with `npm run check`.

## Available scripts

| Command                | Purpose                                     |
| ---------------------- | ------------------------------------------- |
| `npm run dev`          | Start the Vite development server           |
| `npm run build`        | Type-check and create a production bundle   |
| `npm run preview`      | Preview the production build                |
| `npm run lint`         | Run ESLint with zero warnings allowed       |
| `npm run format`       | Format supported files with Prettier        |
| `npm run format:check` | Verify formatting without changing files    |
| `npm test`             | Run Vitest component and hook tests         |
| `npm run test:watch`   | Run Vitest interactively                    |
| `npm run test:e2e`     | Run Playwright accessibility tests          |
| `npm run check`        | Run lint, formatting, unit tests, and build |

Install Playwright's Chromium binary once before the first browser test:

```bash
npx playwright install chromium
```

## Reusable components

Reusable controls are exported from `src/components/index.ts`:

- `Avatar`
- `StatusBadge`
- `Toggle`
- `DatePicker`
- `TimePicker`
- `StyleDropdown`
- `FrameworkCombobox`

The picker and dropdown components use controlled values and controlled open state. This lets the consuming application decide whether multiple popovers may remain open.

```tsx
import { useState } from "react";
import { DatePicker } from "./components";

export function DateField() {
  const [value, setValue] = useState("2026-08-12");
  const [open, setOpen] = useState(false);

  return (
    <DatePicker
      value={value}
      onChange={setValue}
      isOpen={open}
      onToggle={() => setOpen((current) => !current)}
      onClose={() => setOpen(false)}
    />
  );
}
```

All components rely on the design tokens and class definitions in `src/styles.css`. Import that stylesheet once at the application entry point.

## Complete shadcn-style registry

The current official component catalog is installed in `src/components/ui`. It includes all registry components plus the documented Data Table, Date Picker, Toast, and Typography compositions. Components are source-owned and can be edited directly, following shadcn's model.

Import one component directly for the smallest dependency surface:

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
```

For discovery or application-level composition, `src/components/ui/index.ts` provides a complete barrel export. `src/components/ui/registry.ts` contains the authoritative 64-component inventory displayed in the showcase.

Tailwind v4 is integrated with the Vite plugin. `components.json` points the shadcn CLI at `src/styles.css` and the `@/*` alias resolves to `src/*`. Kinetic's dark and light themes populate the same semantic variables used by generated components, including `background`, `foreground`, `primary`, `card`, `popover`, `muted`, and `sidebar`.

Add or refresh a registry component with:

```bash
npx shadcn@latest add button
```

## Theme handling

`src/hooks/useTheme.ts` exposes the resolved `dark` or `light` theme, the stored `dark`, `light`, or `system` preference, and a preference setter. The hook:

- defaults to the operating-system color scheme;
- observes system theme changes while `system` is selected;
- persists explicit choices in `localStorage` under `kinetic-theme`;
- synchronizes the document `color-scheme` property.

## Typography

DotGothic16, Geist, and Geist Mono are installed through Fontsource and bundled locally. The application does not need a Google Fonts request and continues to render its intended typography offline.

## Accessibility

- Dialogs trap focus, restore focus to the opener, close with Escape, and prevent background scrolling.
- Custom listboxes and the combobox support arrow-key navigation and selection.
- The date picker uses a keyboard-navigable grid with arrow, Home, End, Page Up, and Page Down behavior.
- Reduced-motion preferences disable nonessential transitions and animations.
- Playwright runs axe-core checks against the page, modal, command menu, desktop viewport, and mobile viewport.

Automated checks support accessibility review but do not replace manual keyboard, screen-reader, zoom, contrast, and high-contrast-mode testing.

## Project structure

```text
src/
  components/          Reusable controls, primitives, and public exports
  hooks/               Focus management and theme hooks
  test/                Vitest setup
  App.tsx              Application shell
  SkeuomorphicKit.tsx  Showcase composition and demonstration state
  ChartGallery.tsx     Lazy-loaded chart examples
  styles.css           Tokens, component styles, themes, and breakpoints
tests/e2e/             Playwright accessibility checks
```
