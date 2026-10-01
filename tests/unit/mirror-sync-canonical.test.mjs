import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/sync-canonical.yml", "utf8");

test("canonical refresh is event-driven with daily reconciliation", () => {
  assert.match(workflow, /repository_dispatch:/);
  assert.match(workflow, /types: \[canonical-main-updated\]/);
  assert.match(workflow, /cron: "17 2 \* \* \*"/);
});

test("canonical refresh uses immutable SHA-derived branch names", () => {
  assert.match(workflow, /BRANCH="sync\/canonical-main-\$\{SHORT_CANONICAL\}-\$\{SHORT_MIRROR\}"/);
  assert.match(workflow, /git push origin "\$BRANCH"/);
  assert.doesNotMatch(workflow, /git push --force/);
  assert.doesNotMatch(workflow, /checkout -B .*canonical\/main/);
});

test("canonical refresh uses the machine-readable boundary contract", () => {
  assert.match(workflow, /config\/repository-boundary\.json/);
  assert.match(workflow, /scripts\/lib\/sync-canonical-files\.mjs/);
  assert.match(workflow, /Only paths classified as promotable/);
});

test("canonical refresh records exact lineage and retires superseded SHA branches", () => {
  assert.match(workflow, /Canonical DataNest\/main refresh/);
  assert.match(workflow, /Canonical SHA/);
  assert.match(workflow, /Mirror main refresh base/);
  assert.match(workflow, /\^sync\/canonical-main-\[0-9a-f\]\{12\}-\[0-9a-f\]\{7\}\$/);
  assert.match(workflow, /state:"closed"/);
});
