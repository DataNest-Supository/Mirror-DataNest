import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { execFileSync } from "node:child_process";
import { candidatePathspec } from "../../scripts/lib/mirror-candidate-pathspec.mjs";

test("production patch keeps application changes and omits all Mirror control files", () => {
  const root = mkdtempSync(join(tmpdir(), "mirror-candidate-"));
  const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });
  const application = ["src/app/page.tsx", "supabase/migrations/20260930_example.sql"];
  const mirror = [
    ".github/workflows/mirror-pages.yml", ".github/workflows/sync-canonical.yml",
    ".github/workflows/future-mirror-publisher.yml", ".github/actions/node-project-setup/action.yml",
    ".datanest/coordination/checkpoints/review.md", "config/mirror-rd-policy.json",
    "docs/PRODUCTION_CANDIDATE_HANDOFF.md", "docs/reviews/mirror-20260930.md",
    "scripts/mirror-test-suite.mjs", "scripts/validate-mirror-artifact.mjs",
    "scripts/lib/mirror-release-validation.mjs", "tests/unit/mirror-release-validation.test.mjs",
    "tests/browser/mirror-rd-live.spec.ts", "supabase/staging-migrations/example.sql", "README.md"
  ];
  try {
    git("init", "--quiet");
    for (const path of [...application, ...mirror]) {
      const full = join(root, path);
      mkdirSync(dirname(full), { recursive: true });
      writeFileSync(full, "baseline\n");
    }
    git("add", ".");
    git("-c", "user.name=Mirror test", "-c", "user.email=mirror-test@example.invalid", "commit", "--quiet", "-m", "baseline");
    for (const path of [...application, ...mirror]) writeFileSync(join(root, path), "candidate\n");
    assert.deepEqual(git("diff", "--name-only", "HEAD", "--", ...candidatePathspec).trim().split("\n").sort(), [...application].sort());
    const patch = git("diff", "--binary", "HEAD", "--", ...candidatePathspec);
    execFileSync("git", ["apply", "--reverse", "--check", "-"], { cwd: root, input: patch, encoding: "utf8" });
    assert.ok(patch.includes("candidate"));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
