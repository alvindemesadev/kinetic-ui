import { existsSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const registrySource = readFileSync(join(root, "src/components/ui/registry.ts"), "utf8");
const names = [...registrySource.matchAll(/\s+"([^"]+)",/g)].map((match) => match[1]);
const slugify = (name) =>
  name
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/\s+/g, "-")
    .toLowerCase();

const missing = names.filter((name) => !existsSync(join(root, "docs/components", `${slugify(name)}.md`)));
if (missing.length > 0) {
  console.error(`Missing component docs: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(`Component documentation verified: ${names.length} pages.`);
