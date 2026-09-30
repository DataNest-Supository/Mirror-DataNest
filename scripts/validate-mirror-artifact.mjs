import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import { validateMirrorRelease, mirrorAppSlugs } from "./lib/mirror-release-validation.mjs";

const root = resolve(process.argv[2] || "out");
const policy = JSON.parse(readFileSync(new URL("../config/mirror-rd-policy.json", import.meta.url), "utf8"));
const readJson = path => JSON.parse(readFileSync(resolve(root, path), "utf8"));
const sandbox = { window: {} };
runInNewContext(readFileSync(resolve(root, "runtime-config.js"), "utf8"), sandbox, { timeout: 1000 });
validateMirrorRelease({
  runtime: sandbox.window.__DATANEST_CONFIG__,
  mirror: readJson("mirror-release.json"),
  release: readJson("release-manifest.json"),
  apps: readJson("apps/manifest.json")
}, process.env.GITHUB_SHA || process.env.DATANEST_UI_RELEASE_SHA || "", policy);

for (const entry of ["index.html", ...mirrorAppSlugs.map(slug => "apps/" + slug + "/index.html")]) {
  const file = statSync(resolve(root, entry));
  if (!file.isFile() || file.size === 0) throw new Error("Missing or empty Mirror page: " + entry);
}
console.log("Verified exact-SHA staging runtime, release manifests, and all seven bundled Mirror apps.");
