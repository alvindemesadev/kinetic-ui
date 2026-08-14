# Overlays, drawers, and confirmations

Use the responsive overlay primitives from `src/components/ui` and the composed examples in the Overlays section.

- Desktop uses a centered modal surface.
- Mobile uses a bottom drawer surface.
- Escape closes dismissible surfaces.
- Focus moves into the surface and returns to the opener.
- Destructive confirmation uses the red semantic palette and a clear primary action.
- Password confirmation keeps the password input in the same modal/drawer shell.

The canonical examples are `ShowcaseModals`, `ShowcaseOverlayGallery`, and `DeleteConfirmationDialog`. Do not create a separate delete dialog for tables or calendars; pass the entity label and action callbacks into the shared composition.
