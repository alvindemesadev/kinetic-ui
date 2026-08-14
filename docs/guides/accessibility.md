# Accessible forms and focus

Use the semantic primitive as the behavior owner and the Skeuomorphic class as the material owner.

- Give every input a visible `Label` or an explicit accessible name.
- Keep controlled values and open state explicit for custom pickers and listboxes.
- Use `aria-expanded`, `aria-controls`, `aria-selected`, and `aria-checked` on custom controls.
- Keep focus visible; do not replace focus rings with a color-only hover state.
- Dialogs, drawers, sheets, and popovers must restore focus to their trigger on close.
- Use `aria-busy="true"` only while a real async action is pending.
- Do not use disabled styling for a control that is merely waiting for local state.

The keyboard expectations for each public component are recorded in the Phase 1 inventory and should be covered by Vitest or Playwright before changing behavior.
