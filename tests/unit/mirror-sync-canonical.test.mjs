import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/sync-canonical.yml", "utf8");

test("canonical refresh converges on one bot-owned latest branch", () => {
  assert.match(workflow, /BRANCH="sync\/canonical-main-latest"/);
  assert.doesNotMatch(workflow, /BRANCH="sync\/canonical-main-\$SHORT_SHA"/);
  assert.match(workflow, /git push --force origin "\$BRANCH"/);
});

test("canonical refresh records exact lineage in the current PR", () => {
  assert.match(workflow, /Canonical DataNest\/main: \$CANONICAL_SHA/);
  assert.match(workflow, /Mirror main at refresh: \$MIRROR_SHA/);
  assert.match(workflow, /Create or update current mirror refresh PR/);
});

test("canonical refresh retires only superseded bot SHA branches", () => {
  assert.match(workflow, /select\(\.user\.login == "github-actions\[bot\]"\)/);
  assert.match(workflow, /\^sync\/canonical-main-\[0-9a-f\]\{12\}\$/);
  assert.match(workflow, /select\(\.number != \$current\)/);
});

test("canonical refresh keeps generated PR text inside the workflow run block", () => {
  assert.doesNotMatch(workflow, /BODY="\$\(cat <<EOF/);
  assert.ok(workflow.includes('BODY="Canonical DataNest/main moved.'));
  assert.ok(workflow.includes("$'\\n\\n'"));
});
