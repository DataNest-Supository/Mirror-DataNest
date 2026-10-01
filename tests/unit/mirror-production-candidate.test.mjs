import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/production-candidate.yml", "utf8");

test("production candidate requires recorded canonical sync lineage", () => {
  assert.match(workflow, /canonical-lineage\.json/);
  assert.match(workflow, /RECORDED_CANONICAL_SHA/);
  assert.match(workflow, /MIRROR_SYNC_SHA/);
  assert.match(workflow, /merge-base --is-ancestor "\$MIRROR_SYNC_SHA" "\$GITHUB_SHA"/);
  assert.doesNotMatch(workflow, /merge-base --is-ancestor "\$BASE_SHA" "\$GITHUB_SHA"/);
});

test("production candidate requires successful exact-SHA live Pages evidence", () => {
  assert.match(workflow, /live_evidence_run:/);
  assert.match(workflow, /required: true/);
  assert.match(workflow, /workflow_path.*\.github\/workflows\/pages\.yml/);
  assert.match(workflow, /event.*push/);
  assert.match(workflow, /evidence_sha/);
  assert.match(workflow, /Live evidence SHA does not match this production candidate/);
});

test("production candidate validates R&D changes since the recorded post-sync Mirror anchor", () => {
  assert.match(workflow, /git diff --name-only "\$MIRROR_SYNC_SHA" "\$GITHUB_SHA"/);
  assert.match(workflow, /validate-mirror-candidate-boundary\.mjs/);
  assert.match(workflow, /boundary-classification\.json/);
});

test("production candidate hard-gates advisory observations", () => {
  assert.match(workflow, /name: Hard production-candidate gate/);
  assert.match(workflow, /steps\.tests\.outcome/);
  assert.match(workflow, /steps\.typecheck\.outcome/);
  assert.match(workflow, /steps\.audit\.outcome/);
  assert.match(workflow, /steps\.boundary\.outcome/);
  assert.match(workflow, /Production candidate blocked/);
});

test("candidate handoff includes immutable artifact, patch identity, and post-sync anchor identity", () => {
  assert.match(workflow, /mirror-production-candidate-v3/);
  assert.match(workflow, /PATCH_DIGEST/);
  assert.match(workflow, /candidate_patch_digest/);
  assert.match(workflow, /mirror_sync_sha/);
  assert.match(workflow, /release-evidence-envelope-v1/);
  assert.match(workflow, /candidateStatus:"eligible-for-canonical-review"/);
});
