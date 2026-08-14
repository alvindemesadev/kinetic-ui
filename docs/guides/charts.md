# Charts and deferred loading

Charts are intentionally isolated from the initial route. `ChartGallery` is lazy-loaded and wrapped by `DeferredRender`, so Recharts is fetched when the Data section approaches the viewport.

Keep chart data outside render paths, use the shared semantic colors, and provide readable labels and tooltips. Do not import the chart gallery from reusable component code.

When adding a chart, verify light/dark contrast, keyboard-independent data access (table or text summary where needed), responsive sizing, reduced-motion behavior, and the bundle report.
