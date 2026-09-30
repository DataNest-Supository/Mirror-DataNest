# Mirror production-candidate handoff

Mirror is an owner-controlled R&D laboratory. Its deployment and observation results do not grant canonical production authority.

## Owner-selected packaging

1. Develop and deploy the candidate in Mirror.
2. Inspect the exact-SHA release manifests and live evidence artifact from **Mirror Production-Parity Candidate**.
3. Run **Package Production Candidate** with the exact shared canonical base SHA, candidate name and summary.
4. Optionally supply a Mirror workflow-run URL in `live_evidence_run`. This is a reference, not proof of successful verification.
5. Retain the patch, changed-file list, diff statistics and candidate observations.

Unit tests, type checking and dependency auditing are advisory inside Mirror, including packaging. Their actual outcomes remain in the candidate manifest. Invalid base SHAs, malformed evidence references and empty patches stop packaging because no valid handoff can be produced.

The shared base must belong to both canonical DataNest/main history and the candidate's history. The patch, changed-file list and diff statistics use the same exclusion list in `scripts/lib/mirror-candidate-pathspec.mjs`. Mirror workflow/action configuration, coordination records, staging-only migrations and Mirror-only verification tools are excluded. Application changes still need canonical review for staging URLs, owner-only behavior and environment-specific assumptions.

## Canonical production review

Import the candidate into a `mirror-promotion/*` branch in `DataNest-Supository/DataNest`. Before canonical deployment:

- retain successful route/browser evidence for the exact candidate and human visual/functional review as applicable;
- run canonical validation and Audit Optimizer review;
- record evidence in the existing Product Lab/governance models;
- obtain governance and human reviewer approval;
- deploy the approved canonical SHA through DataNest.

Missing or failed Mirror observations must remain visible to canonical reviewers. A package or a green advisory workflow is not certification.

## Evidence

`mirror-release.json` identifies the deployed candidate. `mirror-live-verification.json`, browser JSON/HTML reports and screenshots are retained in the workflow's `mirror-live-evidence-*` artifact. The verification JSON is a workflow artifact, not a public Pages endpoint.

The canonical admin R&D toggle uses Mirror release identity with the existing `product_surfaces`, `governance_observations` and `product_test_runs` models.

## Optional transport

If `DATANEST_PROMOTION_TOKEN` is configured, the packaging workflow sends candidate metadata to canonical DataNest. Otherwise the package remains available for manual import. Transport never grants canonical deployment authority.
