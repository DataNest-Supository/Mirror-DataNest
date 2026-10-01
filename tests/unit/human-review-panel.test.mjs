import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const panel=readFileSync("src/components/HumanReviewPanel.tsx","utf8");
const cockpit=readFileSync("src/components/OwnerRDCockpit.tsx","utf8");

test("Human Review panel reads GitHub review and check evidence without merge authority",()=>{
  assert.match(panel,/\/pulls\/"\+pullRequestNumber/);
  assert.match(panel,/\/reviews\?per_page=100/);
  assert.match(panel,/\/check-runs\?per_page=100/);
  assert.match(panel,/APPROVED/);
  assert.match(panel,/CHANGES_REQUESTED/);
  assert.match(panel,/Authority boundary:/);
  assert.match(panel,/cannot submit a reviewer decision/);
  assert.doesNotMatch(panel,/merge_pull_request|POST[^\n]+\/merge|method:\s*["']PUT["']/);
});

test("Mirror Owner R&D cockpit exposes the current canonical human-review gate",()=>{
  assert.match(cockpit,/HumanReviewPanel/);
  assert.match(cockpit,/DataNest-Supository\/DataNest/);
  assert.match(cockpit,/pullRequestNumber=\{390\}/);
  assert.match(cockpit,/expectedReviewer="ResonanceAppDev"/);
});
