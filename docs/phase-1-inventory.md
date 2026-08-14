# Phase 1: component and demo inventory

Status: inventory completed on 2026-08-14. This document records ownership and duplication before the source is reorganized. It is an audit artifact, not a request to change the current UI.

## Ownership rules

| Layer                      | Location                                                                                                           | Responsibility                                                                 | Consumer                                  |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------ | ----------------------------------------- |
| Primitive source           | `src/components/ui/*.tsx`                                                                                          | Reusable, accessible building blocks with shared tokens                        | Application code and library consumers    |
| Public primitive barrel    | `src/components/ui/index.ts`                                                                                       | Stable named exports for the 64-item reference registry and related primitives | Copy/install consumers                    |
| Composed reusable controls | `src/components/controls.tsx`, `src/components/primitives.tsx`                                                     | Skeuomorphic compositions used by the showcase and suitable for extraction     | Showcase now; package boundary in Phase 2 |
| Showcase compositions      | `src/sections/showcase/*.tsx`                                                                                      | One complete, realistic example for a page section                             | Documentation site                        |
| Demo-only catalog          | `src/ComponentCatalog.tsx` and `src/catalog/*.tsx`                                                                 | Reference views for primitives and interaction examples                        | `#reference` section only                 |
| Application shell          | `src/SkeuomorphicKit.tsx`, `src/sections/navigationData.ts`, `src/sections/Sidebar.tsx`, `src/sections/Navbar.tsx` | Routing, section composition, navigation, theme and demo state                 | Showcase site                             |

The root page (`/`) is the canonical showcase. `/library` is an alias that resolves to the same shell and focuses the Reference section. The catalog is therefore a section, not a second application shell.

## Canonical page sections

| Anchor                          | Authoritative owner                                                  | What belongs here                                                          | Notes                                                                                |
| ------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| `#overview`                     | `sections/Hero.tsx`                                                  | Hero, session preview, top-level introduction                              | The page entry point; `Overview` navigation targets this anchor.                     |
| `#profile`                      | `sections/showcase/ShowcaseProfile.tsx`                              | Profile identity card, personal details, verified identity                 | Sidebar and navbar profile menus link to this page section.                          |
| settings surface                | `sections/showcase/ShowcaseSettings.tsx`                             | Theme/style preferences and settings examples                              | Opens as a responsive overlay when invoked from the shell.                           |
| `#stats`                        | `sections/showcase/ShowcaseStatCards.tsx`                            | Four metric/stat cards                                                     | The only authoritative stat-card gallery.                                            |
| `#features`                     | `sections/showcase/ShowcaseFeatures.tsx`                             | Feature cards and feature states                                           | Uses the shared panel/card material.                                                 |
| `#pricing`                      | `sections/showcase/ShowcasePricing.tsx`                              | Pricing cards and plan actions                                             | Landing-page pricing is separate by intent; do not copy this demo into the catalog.  |
| `#foundation`                   | `sections/showcase/ShowcaseFoundation.tsx`                           | Color palette, typography, token contract                                  | The source of truth for visual tokens and type examples.                             |
| `#controls`                     | `src/SkeuomorphicKit.tsx` controls section                           | Buttons, inputs, selection controls, combobox and command trigger          | Custom controls are currently composed inline and are Phase 2 extraction candidates. |
| `#components`                   | `src/SkeuomorphicKit.tsx` components section                         | Logo carousel, auth cards, forgot-password flow, profiles, messages, forms | Complete compositions live here; primitives remain in the public barrel.             |
| `#calendar`                     | `sections/showcase/ShowcaseCalendar.tsx`                             | Month calendar, agenda, event selection and add-event modal                | This is the canonical full calendar. The date picker is a separate input control.    |
| `#kanban`, `#timeline`, `#todo` | `sections/showcase/ShowcaseProductivity.tsx`                         | Drag/drop board, timeline and to-do list                                   | Arrow movement remains available alongside drag/drop.                                |
| `#overlays`                     | `sections/showcase/ShowcaseModals.tsx`, `ShowcaseOverlayGallery.tsx` | Dialog, drawer, confirmation, delete and password confirmation             | Overlay variants must share one responsive shell and focus policy.                   |
| `#reference`                    | `src/ComponentCatalog.tsx`, `src/catalog/*.tsx`                      | Primitive examples grouped by behavior                                     | Lazy-loaded; it must not introduce a second layout or token system.                  |
| `#data`                         | `sections/showcase/ShowcaseDataTable.tsx` plus `ChartGallery.tsx`    | Structured table and chart gallery                                         | The table is canonical for data; charts remain a deferred gallery.                   |
| `#states`                       | state examples in `src/SkeuomorphicKit.tsx`                          | Empty, loading, skeleton, progress and stepper states                      | State examples should point to shared primitives rather than copies.                 |

## Public primitive inventory

Every row below is exported from `src/components/ui/index.ts`. The registry in `src/components/ui/registry.ts` contains 64 named entries. The source file is the public implementation; catalog entries are examples, not alternate implementations.

### Layout, content and navigation primitives

| Name            | Source                   | Reference/demo owner                                      | Current test signal |
| --------------- | ------------------------ | --------------------------------------------------------- | ------------------- |
| Accordion       | `ui/accordion.tsx`       | `catalog/CatalogContent.tsx`                              | UI behavior suite   |
| Aspect Ratio    | `ui/aspect-ratio.tsx`    | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Breadcrumb      | `ui/breadcrumb.tsx`      | `catalog/CatalogNavigation.tsx`                           | Catalog render      |
| Card            | `ui/card.tsx`            | Shared across showcase and catalog                        | UI/layout suite     |
| Carousel        | `ui/carousel.tsx`        | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Collapsible     | `ui/collapsible.tsx`     | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Direction       | `ui/direction.tsx`       | `catalog/CatalogNavigation.tsx`                           | Catalog render      |
| Empty           | `ui/empty.tsx`           | `catalog/CatalogFeedback.tsx`; root `#states` composition | Catalog render      |
| Item            | `ui/item.tsx`            | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Kbd             | `ui/kbd.tsx`             | `catalog/CatalogNavigation.tsx`; command trigger          | Catalog render      |
| Menubar         | `ui/menubar.tsx`         | `catalog/CatalogNavigation.tsx`                           | Catalog render      |
| Navigation Menu | `ui/navigation-menu.tsx` | `catalog/CatalogNavigation.tsx`                           | Catalog render      |
| Resizable       | `ui/resizable.tsx`       | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Scroll Area     | `ui/scroll-area.tsx`     | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Separator       | `ui/separator.tsx`       | `catalog/CatalogContent.tsx`                              | Catalog render      |
| Sidebar         | `ui/sidebar.tsx`         | Shell sidebar composition                                 | UI/layout suite     |
| Skeleton        | `ui/skeleton.tsx`        | `catalog/CatalogFeedback.tsx`; root `#states` composition | UI behavior suite   |
| Tabs            | `ui/tabs.tsx`            | `catalog/CatalogNavigation.tsx`                           | UI behavior suite   |
| Typography      | `ui/typography.tsx`      | `catalog/CatalogContent.tsx` and foundation               | Catalog render      |

### Forms and selection primitives

| Name          | Source                 | Reference/demo owner                                                             | Current test signal |
| ------------- | ---------------------- | -------------------------------------------------------------------------------- | ------------------- |
| Checkbox      | `ui/checkbox.tsx`      | `catalog/CatalogForms.tsx`; root selection controls                              | UI behavior suite   |
| Combobox      | `ui/combobox.tsx`      | `catalog/CatalogForms.tsx`; root FrameworkCombobox composition                   | UI behavior suite   |
| Date Picker   | `ui/date-picker.tsx`   | Catalog form example; root custom `DatePicker` is a separate migration candidate | UI behavior suite   |
| Field         | `ui/field.tsx`         | `catalog/CatalogForms.tsx`                                                       | Catalog render      |
| Input         | `ui/input.tsx`         | `catalog/CatalogForms.tsx`; root forms                                           | UI behavior suite   |
| Input Group   | `ui/input-group.tsx`   | `catalog/CatalogForms.tsx`                                                       | Catalog render      |
| Input OTP     | `ui/input-otp.tsx`     | `catalog/CatalogForms.tsx`; forgot-password flow                                 | UI behavior suite   |
| Label         | `ui/label.tsx`         | `catalog/CatalogForms.tsx`                                                       | Catalog render      |
| Native Select | `ui/native-select.tsx` | `catalog/CatalogForms.tsx`                                                       | Catalog render      |
| Questionnaire | `ui/questionnaire.tsx` | `catalog/CatalogForms.tsx`                                                       | Catalog render      |
| Radio Group   | `ui/radio-group.tsx`   | `catalog/CatalogForms.tsx`; root selection controls                              | UI behavior suite   |
| Select        | `ui/select.tsx`        | `catalog/CatalogForms.tsx`; root Framework selection context                     | UI behavior suite   |
| Slider        | `ui/slider.tsx`        | `catalog/CatalogForms.tsx`; root settings/progress examples                      | UI behavior suite   |
| Switch        | `ui/switch.tsx`        | `catalog/CatalogForms.tsx`; root `SwitchControl` composition                     | UI behavior suite   |
| Textarea      | `ui/textarea.tsx`      | `catalog/CatalogForms.tsx`                                                       | Catalog render      |

### Feedback, status and overlays

| Name         | Source                          | Reference/demo owner                                      | Current test signal |
| ------------ | ------------------------------- | --------------------------------------------------------- | ------------------- |
| Alert        | `ui/alert.tsx`                  | `catalog/CatalogFeedback.tsx`                             | Catalog render      |
| Alert Dialog | `ui/alert-dialog.tsx`           | `catalog/CatalogOverlays.tsx`                             | Catalog render      |
| Badge        | `ui/badge.tsx`                  | `catalog/CatalogFeedback.tsx`; table/status examples      | UI/layout suite     |
| Dialog       | `ui/dialog.tsx`                 | `catalog/CatalogOverlays.tsx`; root overlay gallery       | UI behavior suite   |
| Drawer       | `ui/drawer.tsx`                 | `catalog/CatalogOverlays.tsx`; root responsive overlays   | Catalog render      |
| Hover Card   | `ui/hover-card.tsx`             | `catalog/CatalogOverlays.tsx`                             | Catalog render      |
| Marker       | `ui/marker.tsx`                 | `catalog/CatalogFeedback.tsx`                             | Catalog render      |
| Popover      | `ui/popover.tsx`                | `catalog/CatalogOverlays.tsx`; date/calendar surfaces     | UI behavior suite   |
| Progress     | `ui/progress.tsx`               | `catalog/CatalogFeedback.tsx`; root `#states` composition | UI behavior suite   |
| Sheet        | `ui/sheet.tsx`                  | `catalog/CatalogOverlays.tsx`; root settings drawer       | Catalog render      |
| Spinner      | `ui/spinner.tsx`                | `catalog/CatalogFeedback.tsx`; loading buttons            | UI behavior suite   |
| Toast        | `ui/toast.tsx`, `ui/sonner.tsx` | `catalog/CatalogFeedback.tsx`; shared app toaster         | Catalog render      |
| Tooltip      | `ui/tooltip.tsx`                | `catalog/CatalogFeedback.tsx`; shell/sidebar tooltips     | UI behavior suite   |

### Data, communication and actions

| Name             | Source                    | Reference/demo owner                                        | Current test signal |
| ---------------- | ------------------------- | ----------------------------------------------------------- | ------------------- |
| Attachment       | `ui/attachment.tsx`       | `catalog/CatalogForms.tsx`                                  | Catalog render      |
| Avatar           | `ui/avatar.tsx`           | `catalog/CatalogContent.tsx`; shared profile surfaces       | UI/layout suite     |
| Bubble           | `ui/bubble.tsx`           | `catalog/CatalogContent.tsx`; message composition candidate | Catalog render      |
| Button           | `ui/button.tsx`           | `catalog/CatalogActions.tsx`; root button/state examples    | UI behavior suite   |
| Button Group     | `ui/button-group.tsx`     | `catalog/CatalogActions.tsx`                                | Catalog render      |
| Calendar         | `ui/calendar.tsx`         | `catalog/CatalogForms.tsx`; picker primitive layer          | UI behavior suite   |
| Chart            | `ui/chart.tsx`            | `catalog/CatalogContent.tsx`; `ChartGallery` uses Recharts  | Catalog render      |
| Command          | `ui/command.tsx`          | `catalog/CatalogNavigation.tsx`; root command menu          | UI behavior suite   |
| Context Menu     | `ui/context-menu.tsx`     | `catalog/CatalogNavigation.tsx`                             | Catalog render      |
| Data Table       | `ui/data-table.tsx`       | `ShowcaseDataTable` is the full example                     | UI/layout suite     |
| Dropdown Menu    | `ui/dropdown-menu.tsx`    | `catalog/CatalogNavigation.tsx`; profile/table actions      | Catalog render      |
| Message          | `ui/message.tsx`          | `catalog/CatalogContent.tsx`; root chat composition         | Catalog render      |
| Message Scroller | `ui/message-scroller.tsx` | `catalog/CatalogContent.tsx`                                | Catalog render      |
| Pagination       | `ui/pagination.tsx`       | `catalog/CatalogContent.tsx`                                | Catalog render      |
| Table            | `ui/table.tsx`            | `ShowcaseDataTable` and catalog content                     | UI/layout suite     |
| Toggle           | `ui/toggle.tsx`           | `catalog/CatalogActions.tsx`                                | Catalog render      |
| Toggle Group     | `ui/toggle-group.tsx`     | `catalog/CatalogActions.tsx`                                | Catalog render      |

## Composed showcase inventory

These are reusable compositions today, but their public package boundary is not yet separated from showcase code. Phase 2 should move them into explicit `components/composed` or keep them clearly demo-only.

| Composition                | Source                                                 | Canonical use                       | Extraction decision                                                               |
| -------------------------- | ------------------------------------------------------ | ----------------------------------- | --------------------------------------------------------------------------------- |
| `DatePicker`               | `src/components/controls.tsx`                          | Controls > Inputs                   | Consolidate with `ui/date-picker.tsx` before publishing a second API.             |
| `TimePicker`               | `src/components/controls.tsx`                          | Controls > Inputs                   | Keep as the Skeuomorphic time input; document its 12/24-hour variants.            |
| `StyleDropdown`            | `src/components/controls.tsx`                          | Controls > Inputs and settings      | Share option-row styling with Select/Dropdown examples.                           |
| `FrameworkCombobox`        | `src/components/controls.tsx`                          | Controls > Combobox & command       | Keep one keyboard-accessible composition.                                         |
| `SwitchControl`            | `src/components/controls.tsx`                          | Controls and settings               | Replace duplicated switch markup with the shared primitive when behavior matches. |
| `InitialsAvatar`           | `src/components/primitives.tsx`                        | Shell, profile, table owner cells   | Use a single centered avatar primitive for all initials.                          |
| `AuthCard`                 | `src/components/showcase/AuthCard.tsx`                 | Components > Login and signup       | Showcase composition; document loading and validation states.                     |
| `ForgotPasswordCard`       | `src/components/showcase/ForgotPasswordCard.tsx`       | Components > password recovery      | Showcase flow built from Input OTP and form primitives.                           |
| `LoadingButton`            | `src/components/showcase/LoadingButton.tsx`            | Button state examples               | Canonical async button state composition.                                         |
| `ButtonStateShowcase`      | `src/components/showcase/ButtonStateShowcase.tsx`      | Components > button states          | One reference for loading/disabled/success/error states.                          |
| `InfiniteLogoCarousel`     | `src/components/showcase/InfiniteLogoCarousel.tsx`     | Components > logo carousel          | Reusable marquee; keep arrow controls and reduced-motion behavior.                |
| `TableRowActions`          | `src/components/showcase/TableRowActions.tsx`          | Data > row overflow menu            | One skeuomorphic View/Edit/Delete action surface.                                 |
| `DeleteConfirmationDialog` | `src/components/showcase/DeleteConfirmationDialog.tsx` | Overlays > destructive confirmation | One responsive delete confirmation, including password variant where needed.      |

## Duplicate and consolidation audit

The items below are intentionally not removed in Phase 1. They identify where two layers currently exist and define the Phase 2 owner.

| Concern                      | Current implementations                                                             | Authoritative example                                                     | Phase 2 action                                                                                |
| ---------------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| Calendar                     | `ShowcaseCalendar`; `ui/calendar.tsx`; date-grid logic inside custom `DatePicker`   | Full calendar: `ShowcaseCalendar`; date grid primitive: `ui/calendar.tsx` | Make the custom picker consume the primitive or document why it needs a distinct compact API. |
| Date picker                  | `controls.tsx` `DatePicker`; `ui/date-picker.tsx`; catalog date example             | Controls > Inputs                                                         | Replace the custom duplicate with a themed wrapper around the public primitive.               |
| Time picker                  | `controls.tsx` `TimePicker`; native time input examples                             | Controls > Inputs                                                         | Keep one custom Skeuomorphic picker and expose explicit 12/24-hour modes.                     |
| Dropdown/select              | `StyleDropdown`; `FrameworkCombobox`; catalog `Select`/`DropdownMenu`               | Controls > Inputs for style/framework; primitives for generic use         | Share option-row, hover, focus, and checkmark tokens.                                         |
| Tooltip                      | Shell/sidebar tooltip CSS; catalog Tooltip demo; inline tooltip in controls         | Shared `ui/tooltip.tsx` behavior and one themed example                   | Remove ad-hoc triangles and white hover text from duplicate surfaces.                         |
| Chat/message                 | Root `Message` composition; `ui/message.tsx`; `ui/bubble.tsx`; catalog examples     | Components section message composition                                    | Select one message API and make Bubble an explicit variant.                                   |
| Tables                       | `ShowcaseDataTable`; `ui/data-table.tsx`; `ui/table.tsx`                            | Data section table                                                        | Keep `table.tsx` primitive, `data-table.tsx` behavior wrapper, and one showcase.              |
| Modal/drawer/sheet           | `ShowcaseModals`; `ShowcaseOverlayGallery`; catalog Dialog/Sheet/Drawer             | Overlays section                                                          | Route all examples through shared responsive overlay primitives and focus management.         |
| Selection controls           | Root checkbox/radio markup; `SwitchControl`; catalog Checkbox/Radio/Switch/Progress | Controls section                                                          | Use shared primitives for the root examples and leave CSS only for material tokens.           |
| Avatar/profile               | Shell avatars; `ShowcaseProfile`; `InitialsAvatar`; catalog Avatar/Avatar Group     | Profile section plus shared avatar primitive                              | Make all initials use the same centering, size, and material rules.                           |
| Buttons/loading              | Root controls; `LoadingButton`; `ButtonStateShowcase`; catalog Button/Spinner       | Button state showcase                                                     | Keep loading only for real async actions and make states a documented variant matrix.         |
| Empty/loading/progress/toast | Root `#states`; catalog feedback; Sonner app toaster                                | Root `#states` plus shared feedback primitives                            | Link catalog examples to the same state primitives and toaster contract.                      |

## Test and documentation coverage

| Area                 | Existing evidence                                                                                                                         | Gap to close                                                                      |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| Primitive registry   | `src/components/ui/registry.test.tsx` validates 64 unique entries and core exports                                                        | Add a generated inventory check when the package barrel is introduced.            |
| Primitive behavior   | `src/components/ui/ui-behaviors.test.tsx` covers buttons, selection, tabs, overlays, tooltip, progress, sliders, select, forms and layout | Add keyboard/focus tests for every extracted composed control.                    |
| Composed controls    | `src/components/components.test.tsx` covers pickers, combobox, switch, carousel, auth and loading buttons                                 | Add focused tests for date/time value entry and responsive overlay return focus.  |
| Catalog              | `src/ComponentCatalog.test.tsx` checks all catalog sections and interactions                                                              | Replace duplicated demos with links to canonical section examples during Phase 2. |
| Charts               | `src/ChartGallery.test.tsx` covers render and tooltip data                                                                                | Keep the gallery deferred and add reduced-motion/resize checks.                   |
| Root shell           | `src/SkeuomorphicKit.test.tsx` covers theme, profile, command menu, calendar and sections                                                 | Add URL/hash synchronization and active-sidebar assertions for every anchor.      |
| Visual documentation | `docs/visual-regression-checklist.md` and PR template                                                                                     | Capture approved references before changing shared tokens.                        |

## Phase 1 acceptance checklist

- [x] Canonical page section ownership is recorded.
- [x] Public primitive inventory is recorded against `src/components/ui/index.ts` and the 64-entry registry.
- [x] Composed showcase ownership is recorded.
- [x] Duplicate/demo audit is recorded with a Phase 2 action for each repeated concern.
- [x] Existing test and documentation coverage is recorded.
- [ ] Every duplicate implementation has been consolidated. (Phase 2.)
- [ ] Package exports are separated from showcase exports. (Phase 2.)
- [ ] Component API pages and copyable examples are generated. (Phase 3.)

## Explicit non-goals for Phase 1

No visual redesign, token change, component deletion, dependency removal, or route change belongs in this inventory phase. The next phase can make structural changes only after this ownership map and the Phase 0 visual/performance contract are reviewed.
