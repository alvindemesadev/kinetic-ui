/**
 * Fails if the `REGISTRY_URL` environment variable is set.
 *
 * The shadcn CLI reads `process.env.REGISTRY_URL` as its base registry URL override
 * (defaults to `https://ui.shadcn.com/r`). If it is set — e.g. the pinned `@kinetic`
 * jsDelivr URL exported in a shell or CI step — the CLI resolves base items such as
 * `colors/neutral.json` against that URL and fails with confusing
 * `.../r/{name}.json/colors/neutral.json was not found` errors, even though the registry
 * configured in `components.json` is perfectly valid.
 *
 * Guard every shadcn CLI invocation (npm scripts + CI) with this check so a stray export
 * surfaces as a clear error instead of a mysterious item-not-found failure.
 */
if (process.env.REGISTRY_URL) {
  console.error(`[shadcn-env] REGISTRY_URL is set to: ${process.env.REGISTRY_URL}`);
  console.error("[shadcn-env] The shadcn CLI uses this variable as its base registry URL override and");
  console.error("[shadcn-env] would resolve base items (colors/neutral.json, styles, ...) against it.");
  console.error("[shadcn-env] Unset it before running shadcn commands:  unset REGISTRY_URL");
  process.exit(1);
}
console.log("[shadcn-env] REGISTRY_URL is not set — shadcn CLI will use its default base (ui.shadcn.com/r).");
