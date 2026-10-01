import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/production-candidate.yml", "utf8");

test("production candidate requires successful live evidence", () => {
  assert.match(workflow, /live_evidence_run:/);
  assert.match(workflow, /required: true/);
  assert.match(workflow, /status.*completed/);
  assert.match(workflow, /conclusion.*success/);
});

test("production candidate hard-gates advisory observations", () => {
  assert.match(workflow, /name: Hard production-candidate gate/);
  assert.match(workflow, /steps\.tests\.outcome/);
  assert.match(workflow, /steps\.typecheck\.outcome/);
  assert.match(workflow, /steps\.audit\.outcome/);
  assert.match(workflow, /steps\.boundary\.outcome/);
  assert.match(workflow, /Production candidate blocked/);
});

test("candidate handoff includes immutable artifact and patch identity", () => {
  assert.match(workflow, /mirror-production-candidate-v2/);
  assert.match(workflow, /PATCH_DIGEST/);
  assert.match(workflow, /candidate_patch_digest/);
  assert.match(workflow, /release-evidence-envelope-v1/);
  assert.match(workflow, /candidateStatus:"eligible-for-canonical-review"/);
});
