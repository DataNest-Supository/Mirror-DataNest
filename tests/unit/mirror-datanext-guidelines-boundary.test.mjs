import test from "node:test";
import assert from "node:assert/strict";
import { classifyPath, loadBoundary } from "../../scripts/lib/repository-boundary.mjs";

const boundary = loadBoundary();

test("DataNext Mirror guidelines stay inside the Mirror-only review namespace", () => {
  assert.equal(
    classifyPath("docs/reviews/mirror-datanext-guidelines.md", boundary).policy,
    "mirror_only"
  );
});
