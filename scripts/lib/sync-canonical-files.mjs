import { execFileSync } from "node:child_process";
import { classifyPath, loadBoundary } from "./repository-boundary.mjs";

function arg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

const canonicalRef = arg("--canonical-ref") ?? "canonical/main";
const contractPath = arg("--contract") ?? "config/repository-boundary.json";
const boundary = loadBoundary(contractPath);

function git(args, options = {}) {
  return execFileSync("git", args, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...options
  }).trimEnd();
}

const changedEntries = git(["diff", "--name-status", "--find-renames", "HEAD", canonicalRef])
  .split(/\r?\n/)
  .filter(Boolean)
  .map((line) => {
    const [status, ...parts] = line.split("\t");
    const paths = parts.length >= 2 ? parts.slice(-2) : parts;
    return {
      status,
      path: parts.length >= 2 ? paths[1] : paths[0]
    };
  })
  .filter((entry) => entry.path);

const classifications = changedEntries.map((entry) => ({
  ...entry,
  classification: classifyPath(entry.path, boundary)
}));

const unclassified = classifications.filter((entry) => entry.classification.policy === "unclassified");
if (unclassified.length) {
  throw new Error(
    "Boundary is missing classifications for changed paths: " +
    unclassified.map((entry) => entry.path).join(", ")
  );
}

let changed = 0;
for (const entry of classifications.filter((item) => item.classification.policy === "promotable")) {
  const canonicalPath = entry.path;
  if (entry.status.startsWith("D")) {
    execFileSync("git", ["rm", "-f", "--", canonicalPath], { stdio: "inherit" });
  } else {
    execFileSync("git", ["checkout", canonicalRef, "--", canonicalPath], { stdio: "inherit" });
  }
  changed += 1;
}

console.log(JSON.stringify({
  canonicalRef,
  comparedPaths: classifications.length,
  changed,
  blockedPreservedPaths: classifications
    .filter((item) => item.classification.policy !== "promotable")
    .map((item) => ({
      path: item.path,
      policy: item.classification.policy
    }))
}, null, 2));
