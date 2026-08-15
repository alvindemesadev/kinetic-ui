/**
 * Generates the Kinetic UI shadcn-style registry.
 *
 * Outputs:
 *   - ./registry.json          — source registry (repo-relative paths) for `shadcn registry validate`.
 *   - ./registry/kinetic.css   — single-entry CSS bundle that imports the Kinetic skin files.
 *   - ./public/r/{name}.json   — built per-item registry files for consumers.
 *   - ./public/r/index.json    — discovery index.
 *
 * It also keeps `components.json` → `registries.kinetic.url` in sync with
 * `REGISTRY_URL` below so consumers can run `npx shadcn add @kinetic/button`.
 *
 * Registry conventions verified against shadcn CLI v4:
 *   - `registryDependencies` must be namespaced (`@kinetic/...`) so deps
 *     resolve against this registry instead of ui.shadcn.com.
 *   - `registry:ui` file paths are alias-relative (`components/ui/...`); the
 *     CLI maps them onto the consumer's `@/components/ui` alias.
 *   - `registry:file` files install at `target` (consumer-side path).
 *
 * Usage: node scripts/generate-registry.mjs [--check]
 *   --check  verify every generated output matches disk without writing; exits 1 on drift.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");

/** Published location of the built registry (GitHub + jsDelivr). */
const REGISTRY_URL = "https://cdn.jsdelivr.net/gh/alvindemesadev/kinetic-ui@main/public/r/{name}.json";
const REGISTRY_NAMESPACE = "@kinetic";

const registrySource = readFileSync(join(root, "src/components/ui/registry.ts"), "utf8");
const names = [...registrySource.matchAll(/\s+"([^"]+)",/g)].map((match) => match[1]);
const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

const slugify = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const categoryFor = (name) => {
  if (/Dialog|Drawer|Sheet|Popover|Hover Card/.test(name)) return "overlays";
  if (/Input|Checkbox|Combobox|Date Picker|Field|Label|Radio|Select|Slider|Switch|Textarea/.test(name)) {
    return "forms";
  }
  if (/Button|Toggle/.test(name)) return "actions";
  if (/Alert|Badge|Marker|Progress|Spinner|Toast|Tooltip/.test(name)) return "feedback";
  if (/Menu|Breadcrumb|Command|Kbd|Navigation|Pagination|Tabs/.test(name)) return "navigation";
  return "content";
};

// Map of registry slug -> display name, e.g. "date-picker" -> "Date Picker".
const slugToName = new Map(names.map((name) => [slugify(name), name]));

/** Npm packages available as runtime dependencies. */
const runtimeDependencies = new Set(Object.keys(pkg.dependencies ?? {}));

/** Peer packages every React consumer already has; not declared per item. */
const peerPackages = new Set(["react", "react-dom", "react/jsx-runtime", "react-dom/client"]);

const importSpecifiers = (source) => {
  const specifiers = [];
  for (const match of source.matchAll(/\bfrom\s+["']([^"']+)["']/g)) specifiers.push(match[1]);
  for (const match of source.matchAll(/import\s*\(\s*["']([^"']+)["']\s*\)/g)) specifiers.push(match[1]);
  return specifiers;
};

const barePackage = (specifier) => {
  const segments = specifier.split("/");
  return specifier.startsWith("@") ? segments.slice(0, 2).join("/") : segments[0];
};

/**
 * Derives npm dependencies, sibling-registry dependencies, and hook files from
 * a component source file.
 */
function deriveDependencies(source, slug) {
  const dependencies = new Set();
  const registryDependencies = new Set();
  const hookFiles = new Set();
  for (const specifier of importSpecifiers(source)) {
    if (specifier.startsWith("@/components/ui/")) {
      const base = specifier.replace(/^@\/components\/ui\//, "").replace(/\.tsx?$/, "");
      if (slugToName.has(base)) {
        registryDependencies.add(base);
      } else {
        console.warn(`[registry] ${slug}: unknown ui import "${specifier}"`);
      }
    } else if (specifier.startsWith("@/lib/")) {
      // The `cn` util and lib helpers are provided by `shadcn init`.
    } else if (specifier.startsWith("@/hooks/")) {
      const base = specifier.replace(/^@\/hooks\//, "").replace(/\.ts$/, "");
      const sourcePath = `src/hooks/${base}.ts`;
      try {
        readFileSync(join(root, sourcePath), "utf8");
        hookFiles.add(sourcePath);
      } catch {
        console.warn(`[registry] ${slug}: unknown hook import "${specifier}"`);
      }
    } else if (specifier.startsWith("@/")) {
      console.warn(`[registry] ${slug}: unhandled alias import "${specifier}"`);
    } else if (specifier.startsWith(".")) {
      console.warn(`[registry] ${slug}: relative import "${specifier}" is not supported by the registry`);
    } else {
      const pkgName = barePackage(specifier);
      if (runtimeDependencies.has(pkgName)) dependencies.add(pkgName);
      else if (!peerPackages.has(pkgName))
        console.warn(`[registry] ${slug}: bare import "${specifier}" is not a declared dependency`);
    }
  }
  return {
    dependencies: [...dependencies].sort(),
    registryDependencies: [...registryDependencies].sort(),
    hookFiles: [...hookFiles].sort(),
  };
}

// --- Kinetic CSS bundle --------------------------------------------------------

const kineticCssFiles = [
  ["src/styles/tokens.css", "tokens.css"],
  ["src/styles/base.css", "base.css"],
  ["src/styles/components/tactile-controls.css", "tactile-controls.css"],
  ["src/styles/components/ui-primitives.css", "ui-primitives.css"],
  ["src/styles/components/portals-overlays.css", "portals-overlays.css"],
];

const kineticEntry = [
  "/* Generated by scripts/generate-registry.mjs — do not edit. */",
  ...kineticCssFiles.map(([, fileName]) => `@import "./${fileName}";`),
  "",
].join("\n");

const kineticDescription =
  "Skeuomorphic material skin: design tokens, base styles, and data-slot skins for the Kinetic UI registry. Wrap your app in an element with class `ui-kit` (plus `dark`/`light`) and import `@/styles/kinetic/kinetic.css` in your global stylesheet.";
const kineticDependencies = ["@fontsource/geist", "@fontsource/geist-mono", "@fontsource/dotgothic16"];

const kineticFiles = [
  { source: "registry/kinetic.css", target: "src/styles/kinetic/kinetic.css" },
  ...kineticCssFiles.map(([path]) => ({
    source: path,
    target: `src/styles/kinetic/${path.split("/").pop()}`,
  })),
];

// --- Component items -----------------------------------------------------------

const sourceItems = [];
const builtItems = [];

const addItem = (sourceItem, builtItem) => {
  sourceItems.push(sourceItem);
  builtItems.push(builtItem);
};

const readBuiltFile = (path) => readFileSync(join(root, path), "utf8").replace(/\r\n/g, "\n");

// Kinetic style bundle item.
const kineticFilesEntries = kineticFiles.map(({ source, target }) => ({
  path: source,
  type: "registry:file",
  target,
  content: readBuiltFile(source),
}));
addItem(
  {
    name: "kinetic",
    type: "registry:file",
    title: "Kinetic UI styles",
    description: kineticDescription,
    dependencies: kineticDependencies,
    registryDependencies: [],
    files: kineticFiles.map(({ source, target }) => ({ path: source, type: "registry:file", target })),
  },
  {
    $schema: "https://ui.shadcn.com/schema/registry-item.json",
    name: "kinetic",
    type: "registry:file",
    title: "Kinetic UI styles",
    description: kineticDescription,
    dependencies: kineticDependencies,
    registryDependencies: [],
    files: kineticFilesEntries,
  },
);

for (const name of names) {
  const slug = slugify(name);
  const sourcePath = `src/components/ui/${slug}.tsx`;
  const source = readBuiltFile(sourcePath);
  const { dependencies, registryDependencies, hookFiles } = deriveDependencies(source, slug);
  const namespacedDependencies = [...registryDependencies, "kinetic"].map(
    (dep) => `${REGISTRY_NAMESPACE}/${dep}`,
  );

  const sourceFiles = [{ path: sourcePath, type: "registry:ui" }];
  const builtFiles = [{ path: `components/ui/${slug}.tsx`, type: "registry:ui", content: source }];
  for (const hookPath of hookFiles) {
    const hookTarget = `src/hooks/${hookPath.split("/").pop()}`;
    sourceFiles.push({ path: hookPath, type: "registry:file", target: hookTarget });
    builtFiles.push({
      path: hookPath,
      type: "registry:file",
      target: hookTarget,
      content: readBuiltFile(hookPath),
    });
  }

  const baseItem = {
    name: slug,
    type: "registry:ui",
    title: name,
    description: `${name} — ${categoryFor(name)} primitive from the Kinetic UI registry.`,
    dependencies,
    registryDependencies: namespacedDependencies,
    meta: { category: categoryFor(name) },
  };
  addItem(
    { ...baseItem, files: sourceFiles },
    { $schema: "https://ui.shadcn.com/schema/registry-item.json", ...baseItem, files: builtFiles },
  );
}

// --- Collect generated outputs -----------------------------------------------------

const writes = new Map();
const removals = new Set();

writes.set(join(root, "registry/kinetic.css"), kineticEntry);

writes.set(
  join(root, "registry.json"),
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "kinetic",
      homepage: "https://github.com/alvindemesadev/kinetic-ui",
      items: sourceItems,
    },
    null,
    2,
  )}\n`,
);

const outputDirectory = join(root, "public/r");
let existingOutputFiles = [];
try {
  existingOutputFiles = readdirSync(outputDirectory);
} catch {
  // Directory missing entirely — every built item below counts as drift.
}
const currentFiles = new Set([...builtItems.map((item) => `${item.name}.json`), "index.json"]);
for (const existing of existingOutputFiles) {
  if (existing.endsWith(".json") && !currentFiles.has(existing)) {
    removals.add(join(outputDirectory, existing));
  }
}
for (const item of builtItems) {
  writes.set(join(outputDirectory, `${item.name}.json`), `${JSON.stringify(item, null, 2)}\n`);
}

const index = {
  $schema: "https://ui.shadcn.com/schema/registry-index.json",
  name: "kinetic",
  homepage: "https://github.com/alvindemesadev/kinetic-ui",
  items: builtItems.map(
    ({ name: itemName, type, title, description, dependencies, registryDependencies, meta }) => ({
      name: itemName,
      type,
      title,
      description,
      dependencies,
      registryDependencies,
      ...(meta ? { meta } : {}),
    }),
  ),
};
writes.set(join(outputDirectory, "index.json"), `${JSON.stringify(index, null, 2)}\n`);

// --- Wire components.json ---------------------------------------------------------

const configPath = join(root, "components.json");
const config = JSON.parse(readFileSync(configPath, "utf8"));
if (config.registries?.kinetic?.url !== REGISTRY_URL) {
  writes.set(
    configPath,
    `${JSON.stringify({ ...config, registries: { ...config.registries, kinetic: { url: REGISTRY_URL } } }, null, 2)}\n`,
  );
}

// --- Apply or verify ----------------------------------------------------------------

const checkOnly = process.argv.includes("--check");

if (checkOnly) {
  const drifted = [];
  for (const [path, expected] of writes) {
    let actual;
    try {
      actual = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
    } catch {
      actual = null;
    }
    if (actual !== expected) drifted.push(path.replace(root, "."));
  }
  for (const path of removals) {
    try {
      readFileSync(path, "utf8");
      drifted.push(`${path.replace(root, ".")} (stale — should be removed)`);
    } catch {
      // Already absent — fine.
    }
  }
  if (drifted.length > 0) {
    console.error(`[registry] Drift detected in ${drifted.length} generated file(s):`);
    for (const file of drifted) console.error(`  - ${file}`);
    console.error('Run "npm run registry:build" and commit the regenerated files.');
    process.exit(1);
  }
  console.log(
    `[registry] Generated registry is up to date (${builtItems.length} built items, ${writes.size} files).`,
  );
} else {
  for (const path of removals) rmSync(path);
  for (const [path, content] of writes) {
    mkdirSync(dirname(path), { recursive: true });
    writeFileSync(path, content);
  }
  if (writes.has(configPath)) {
    console.log(`[registry] components.json registries.kinetic.url -> ${REGISTRY_URL}`);
  }
  console.log(
    `[registry] Generated ${builtItems.length} built items (${names.length} components + kinetic styles) and wrote ${outputDirectory.replace(root, ".")}.`,
  );
}
