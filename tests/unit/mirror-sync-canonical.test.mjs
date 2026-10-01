import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const workflow = readFileSync(".github/workflows/sync-canonical.yml", "utf8");

test("canonical refresh is event-driven with hourly reconciliation fallback", () => {
  assert.match(workflow, /repository_dispatch:/);
  assert.match(workflow, /types: \[canonical-main-updated\]/);
  assert.match(workflow, /cron: "17 \* \* \* \*"/);
});

test("canonical refresh uses immutable SHA-derived branch names without force pushes", () => {
  assert.match(workflow, /BRANCH="sync\/canonical-main-\$\{SHORT_CANONICAL\}-\$\{SHORT_MIRROR\}"/);
  assert.match(workflow, /git push origin "\$BRANCH"/);
  assert.doesNotMatch(workflow, /git push --force/);
  assert.match(workflow, /git ls-remote --exit-code --heads origin "\$BRANCH"/);
});

test("canonical refresh synchronizes canonical-owned boundary controls explicitly", () => {
  assert.match(workflow, /config\/repository-boundary\.json/);
  assert.match(workflow, /scripts\/lib\/repository-boundary\.mjs/);
  assert.match(workflow, /scripts\/validate-mirror-candidate-boundary\.mjs/);
  assert.match(workflow, /scripts\/lib\/sync-canonical-files\.mjs/);
});

test("canonical refresh records machine-readable selective-sync lineage", () => {
  assert.match(workflow, /canonical-lineage\.json/);
  assert.match(workflow, /mirror-canonical-lineage-v2/);
  assert.match(workflow, /canonicalSha:\$canonicalSha/);
  assert.match(workflow, /mirrorBaseSha:\$mirrorBaseSha/);
  assert.match(workflow, /mirrorSyncSha:\$mirrorSyncSha/);
  assert.match(workflow, /MIRROR_SYNC_SHA="\$\(git rev-parse HEAD\)"/);
  assert.match(workflow, /boundaryDigest:\$boundaryDigest/);
});

test("canonical refresh skips current lineage and reuses an existing exact-lineage PR", () => {
  assert.match(workflow, /RECORDED_CANONICAL/);
  assert.match(workflow, /Mirror already records current canonical SHA/);
  assert.match(workflow, /state=open&head=DataNest-Supository:\$BRANCH&base=main/);
  assert.match(workflow, /Create or reuse refresh PR/);
});

test("canonical refresh keeps generated PR body YAML-safe", () => {
  assert.doesNotMatch(workflow, /BODY="\$\(cat <<EOF/);
  assert.match(workflow, /BODY="Canonical DataNest\/main refresh\./);
});
