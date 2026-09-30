# Mirror production-candidate handoff

All changes intended for production must leave `Mirror-DataNest` through a production-candidate handoff.

The mirror never deploys the canonical DataNest site.

## Flow

1. R&D work is completed in Mirror-DataNest.
2. Run **Package Production Candidate**.
3. Supply the exact canonical DataNest SHA the experiment was based on.
4. The workflow records the Mirror candidate SHA, changed files, patch, and advisory test/audit observations.
5. Mirror-only workflows and R&D policy files are excluded from the production patch.
6. The candidate is imported into a `mirror-promotion/*` branch in `DataNest-Supository/DataNest`.
7. The candidate is audited by DataNest Audit Optimizer and normal canonical validation.
8. Governance/human reviewer approval is required.
9. Only DataNest-Supository may execute the governed live deployment.

## Optional automatic handoff

A repository secret named `DATANEST_PROMOTION_TOKEN` may be configured with the minimum GitHub permission required to send a `repository_dispatch` event to `DataNest-Supository/DataNest`.

The token does not grant Mirror production deployment authority. It only notifies the canonical repository that a candidate is ready to import.

If the token is absent, the workflow still produces the immutable production-candidate artifact for manual canonical import.
