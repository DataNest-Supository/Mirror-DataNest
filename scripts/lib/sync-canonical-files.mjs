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
  return execFileSync("git", args, { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"], ...options }).trimEnd();
}

function filesAt(ref) {
  return git(["ls-tree", "-r", "--name-only", ref]).split(/\r?\n/).filter(Boolean);
}
function localFiles() {
  return git(["ls-files"]).split(/\r?\n/).filter(Boolean);
}
function blobAt(ref, path) {
  try {
    const line = git(["ls-tree", "-r", ref, "--", path]);
    if (!line) return null;
    return line.split(/\t/, 2)[0].split(/\s+/)[2] ?? null;
  } catch {
    return null;
  }
}

const canonicalFiles = filesAt(canonicalRef);
const mirrorFiles = localFiles();
const canonicalClassifications = canonicalFiles.map((path) => classifyPath(path, boundary));
const mirrorClassifications = mirrorFiles.map((path) => classifyPath(path, boundary));
const unknownCanonical = canonicalClassifications.filter((item) => item.policy === "unclassified");
const unknownMirror = mirrorClassifications.filter((item) => item.policy === "unclassified");

if (unknownCanonical.length || unknownMirror.length) {
  const lines = [...unknownCanonical, ...unknownMirror].map((item) => item.path);
  throw new Error("Boundary is missing classifications for: " + lines.join(", "));
}

const canonicalSet = new Set(canonicalFiles);
let changed = 0;
for (const item of canonicalClassifications.filter((value) => value.policy === "promotable")) {
  const canonicalSha = blobAt(canonicalRef, item.path);
  const mirrorSha = blobAt("HEAD", item.path);
  if (canonicalSha !== mirrorSha) {
    execFileSync("git", ["checkout", canonicalRef, "--", item.path], { stdio: "inherit" });
    changed += 1;
  }
}
for (const item of mirrorClassifications.filter((value) => value.policy === "promotable")) {
  if (!canonicalSet.has(item.path)) {
    execFileSync("git", ["rm", "-f", "--", item.path], { stdio: "inherit" });
    changed += 1;
  }
}
console.log(JSON.stringify({ canonicalRef, changed }, null, 2));
