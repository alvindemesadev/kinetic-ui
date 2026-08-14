import { readdirSync, readFileSync, statSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const assetsDirectory = join(root, "dist", "assets");
const budgetFile = join(root, "performance-budget.json");
const enforce = process.argv.includes("--check");

function collectFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? collectFiles(path) : [path];
  });
}

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

function extensionFor(path) {
  const extension = path.split(".").pop()?.toLowerCase();
  return extension ? `.${extension}` : "(none)";
}

if (!statSync(assetsDirectory, { throwIfNoEntry: false })) {
  console.error("Build assets were not found. Run npm run build first.");
  process.exit(1);
}

const assets = collectFiles(assetsDirectory)
  .map((path) => {
    const source = readFileSync(path);
    return {
      name: relative(assetsDirectory, path),
      extension: extensionFor(path),
      rawBytes: source.byteLength,
      gzipBytes: gzipSync(source, { level: 9 }).byteLength,
    };
  })
  .sort((a, b) => b.rawBytes - a.rawBytes);

const totals = new Map();
for (const asset of assets) {
  const current = totals.get(asset.extension) ?? { rawBytes: 0, gzipBytes: 0 };
  current.rawBytes += asset.rawBytes;
  current.gzipBytes += asset.gzipBytes;
  totals.set(asset.extension, current);
}

const budget = JSON.parse(readFileSync(budgetFile, "utf8"));
const javascriptTotal = totals.get(".js") ?? { gzipBytes: 0 };
const cssTotal = totals.get(".css") ?? { gzipBytes: 0 };
const entryJavaScript = assets.find((asset) => asset.extension === ".js" && asset.name.startsWith("index-"));
const entryCss = assets.find((asset) => asset.extension === ".css" && asset.name.startsWith("index-"));

console.log("\nKinetic UI production asset report");
console.log(`Assets: ${assets.length}`);
console.log("\nLargest assets:");
console.table(
  assets.slice(0, 12).map((asset) => ({
    asset: asset.name,
    raw: formatBytes(asset.rawBytes),
    gzip: formatBytes(asset.gzipBytes),
  })),
);

console.log("Totals by type (raw / gzip):");
for (const [extension, total] of [...totals.entries()].sort()) {
  console.log(
    `  ${extension.padEnd(7)} ${formatBytes(total.rawBytes).padStart(10)} / ${formatBytes(total.gzipBytes)}`,
  );
}

const checks = [
  ["initial JavaScript gzip", entryJavaScript?.gzipBytes ?? 0, budget.budgets.initialJavaScriptGzipBytes],
  ["initial CSS gzip", entryCss?.gzipBytes ?? 0, budget.budgets.initialCssGzipBytes],
  ["total JavaScript gzip", javascriptTotal.gzipBytes, budget.budgets.totalJavaScriptGzipBytes],
  ["total CSS gzip", cssTotal.gzipBytes, budget.budgets.totalCssGzipBytes],
];

console.log(`\nPerformance budget targets (${enforce ? "enforced" : "report only"}):`);
let failed = false;
for (const [label, value, limit] of checks) {
  const status = value <= limit ? "within target" : "over target";
  if (enforce && value > limit) failed = true;
  console.log(`  ${label}: ${formatBytes(value)} / ${formatBytes(limit)} — ${status}`);
}

if (failed) {
  console.error("\nPerformance budget check failed. Review the largest assets before merging.");
  process.exit(1);
}

console.log(enforce ? "\nAll enforced budgets pass." : "\nReport generated without enforcement.");
