import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const entry = readFileSync(join(root, "dist-library", "kinetic-ui.js"), "utf8");
const forbidden = [
  "SkeuomorphicKit",
  "ComponentCatalog",
  "ChartGallery",
  "ShowcaseCalendar",
  "ShowcaseProductivity",
];
const included = forbidden.filter((name) => entry.includes(name));

if (included.length > 0) {
  console.error(`Library bundle contains showcase symbols: ${included.join(", ")}`);
  process.exit(1);
}

console.log("Library boundary verified: showcase shell and demo galleries are excluded.");
