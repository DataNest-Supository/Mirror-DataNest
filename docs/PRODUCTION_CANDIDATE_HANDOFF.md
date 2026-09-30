# Mirror production-candidate handoff

Every change intended for canonical production must first be deployed and tested as a live Mirror candidate, then leave `Mirror-DataNest` through the production-candidate handoff.

## Required flow

1. Complete R&D in Mirror-DataNest.
2. Let **Mirror Production-Parity Candidate** deploy the exact commit to the Mirror Pages URL.
3. Complete live route/browser verification and human visual/functional testing as applicable.
4. Retain the successful Mirror live evidence reference.
5. Run **Package Production Candidate**.
6. Supply:
   - exact canonical DataNest base SHA;
   - candidate name/summary;
   - successful live Mirror evidence reference.
7. Package the exact Mirror SHA, production patch and observations.
8. Import it into a `mirror-promotion/*` branch in `DataNest-Supository/DataNest`.
9. Run canonical validation and DataNest Audit Optimizer review.
10. Complete formal governance and human reviewer approval.
11. Deploy the approved exact SHA from canonical DataNest only.

## Live Mirror evidence

The Mirror live workflow produces:

- `mirror-release.json` — immutable build/release identity;
- `mirror-live-verification.json` — live route/browser outcome;
- Playwright/test artifacts where available;
- workflow run reference.

A candidate package without a live Mirror evidence reference is incomplete.

## Update-management relationship

The canonical DataNest admin R&D toggle synchronizes the live Mirror build into existing `product_surfaces` and `governance_observations`. Human test evidence is recorded in existing `product_test_runs`. This means candidate version management, visual/functional evidence and Audit Optimizer review remain within the current DataNest database models.

## Optional automatic repository handoff

A repository secret named `DATANEST_PROMOTION_TOKEN` may be configured with only the permission needed to send the production-candidate `repository_dispatch` event to `DataNest-Supository/DataNest`.

That token only transports candidate metadata. It grants no canonical production deployment authority.

If the token is absent, the candidate artifact can still be imported through the canonical workflow manually.
