// One shared exclusion list for the patch, file list, and diff statistics.
// Canonical workflow/backend configuration is reviewed and maintained in DataNest.
export const candidatePathspec = Object.freeze([
  ".",
  ":(exclude).github",
  ":(exclude).datanest",
  ":(exclude)config/mirror-rd-policy.json",
  ":(exclude)docs/MIRROR_DATANEST_RD_MODE.md",
  ":(exclude)docs/PRODUCTION_CANDIDATE_HANDOFF.md",
  ":(exclude)docs/reviews/mirror-*",
  ":(exclude)scripts/mirror-test-suite.mjs",
  ":(exclude)scripts/validate-mirror-artifact.mjs",
  ":(exclude)scripts/lib/mirror-*.mjs",
  ":(exclude)tests/unit/mirror-*.test.mjs",
  ":(exclude)tests/browser/mirror-*.spec.ts",
  ":(exclude)supabase/staging-migrations",
  ":(exclude)README.md"
]);
