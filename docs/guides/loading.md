# Loading and async actions

Loading communicates real waiting work, not every click. Use `LoadingButton` for submissions, uploads, deletes, and other async operations. Keep local toggles, navigation, pickers, tabs, and menu selection immediate.

```tsx
<LoadingButton loading={isSaving} onClick={saveSettings}>
  Save settings
</LoadingButton>
```

Preserve the button width while loading, expose `aria-busy`, prevent duplicate submissions, and provide a success or error toast after the promise resolves. The button state showcase is the authoritative reference for loading, disabled, retry, success, and error states.
