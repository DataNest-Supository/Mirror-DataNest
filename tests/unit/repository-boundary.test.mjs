import test from "node:test";
import assert from "node:assert/strict";
import { classifyPath, loadBoundary } from "../../scripts/lib/repository-boundary.mjs";

const boundary = loadBoundary();

test("boundary fails closed for unclassified paths", () => {
  assert.equal(classifyPath("new-control-plane/unknown.yml", boundary).policy, "unclassified");
});

test("boundary blocks canonical-only and protected-shared files", () => {
  const blocked = [
    "scripts/write-release-manifest.mjs",
    "scripts/write-ui-governance-evidence.mjs",
    "config/worktree-gate-timeframes.json",
    "src/components/AuthGate.tsx"
  ];
  for (const path of blocked) {
    assert.notEqual(classifyPath(path, boundary).policy, "promotable");
  }
});

test("boundary blocks Mirror-only control-plane files", () => {
  for (const path of [
    ".github/workflows/sync-canonical.yml",
    ".github/workflows/production-candidate.yml",
    "config/mirror-rd-policy.json",
    "scripts/lib/sync-canonical-files.mjs",
    "tests/unit/repository-boundary.test.mjs"
  ]) {
    assert.equal(classifyPath(path, boundary).policy, "mirror_only");
  }
});

test("boundary allows ordinary application paths", () => {
  for (const path of [
    "apps/ronsas/creative-studio/src/pages/Admin.tsx",
    "src/components/NewFeature.tsx",
    "supabase/functions/example/index.ts"
  ]) {
    assert.equal(classifyPath(path, boundary).policy, "promotable");
  }
});
