# Theme tokens and customization

Import the shared stylesheet once. The semantic variables live in `src/styles/tokens.css`; component rules consume those variables instead of hard-coded colors.

The supported theme preferences are `light`, `dark`, and `system`. `useTheme` persists explicit choices under `kinetic-theme` and observes `prefers-color-scheme` while `system` is selected.

## Safe customization

Override semantic variables in a scope, then keep the existing relationships between raised, inset, border, and accent surfaces:

```css
.brand-theme {
  --accent: #ff6a2a;
  --accent-strong: #e34d18;
  --success: #45b87f;
}
```

Do not override individual component selectors to compensate for a token mismatch. Keep the radius, spacing, typography, and shadow scales from the foundation section together so controls remain physically consistent.
