import test from "node:test";
import assert from "node:assert/strict";
import { classifyPath, loadBoundary } from "../../scripts/lib/repository-boundary.mjs";

const boundary = loadBoundary();

test("canonical refresh classifies canonical evidence and schemas without one-file exceptions", () => {
  for (const path of [
    "evidence/owner-test-mode-rate-limit-fix-2026-10-01.md",
    "evidence/future-release-proof.json",
    "schemas/future-governance-contract.schema.json"
  ]) {
    assert.equal(classifyPath(path, boundary).policy, "canonical_only");
  }
});

test("canonical refresh remains fail-closed outside classified roots", () => {
  assert.equal(classifyPath("new-control-plane/unknown.yml", boundary).policy, "unclassified");
});
