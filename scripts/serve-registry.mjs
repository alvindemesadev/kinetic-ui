/**
 * Serves the built registry (`./public`) over HTTP for local testing, e.g.
 * `shadcn registry add @kinetic=http://localhost:8199/r/{name}.json`.
 *
 * Usage: node scripts/serve-registry.mjs [port]
 *
 * The shadcn CLI reads `process.env.REGISTRY_URL` as its base registry URL
 * override, so before testing with the CLI make sure it is unset:
 *   unset REGISTRY_URL
 * (scripts/check-shadcn-env.mjs fails loudly if it is set.)
 */
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { join, normalize, resolve } from "node:path";

const port = Number(process.argv[2] ?? 8199);
const root = resolve(import.meta.dirname, "../public");

if (process.env.REGISTRY_URL) {
  console.warn(
    `[serve-registry] REGISTRY_URL is set to: ${process.env.REGISTRY_URL}\n` +
      "[serve-registry] The shadcn CLI uses this variable as its base registry URL override and would\n" +
      "[serve-registry] resolve base items (colors/neutral.json, styles, ...) against it instead of this server.\n" +
      "[serve-registry] Unset it before running shadcn commands:  unset REGISTRY_URL",
  );
}

const contentTypes = {
  ".json": "application/json",
  ".css": "text/css",
  ".js": "text/javascript",
  ".html": "text/html",
};

createServer(async (request, response) => {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const filePath = normalize(join(root, pathname));
    if (!filePath.startsWith(root)) {
      response.writeHead(403);
      response.end("Forbidden");
      return;
    }
    const body = await readFile(filePath);
    response.writeHead(200, {
      "Content-Type": contentTypes[filePath.slice(filePath.lastIndexOf("."))] ?? "application/octet-stream",
      "Access-Control-Allow-Origin": "*",
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Serving built registry at http://localhost:${port}/`);
});
