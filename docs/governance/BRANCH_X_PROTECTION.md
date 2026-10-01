# BRANCH-X Protection Tree

BRANCH-X is the repository-native branch governance layer for Mirror-DataNest.

Canonical branches are `main` and `release/**`. Canonical adoption requires a pull request, at least one approving review, stale-approval dismissal, conversation resolution, linear history, and a passing `BRANCH-X Protection Tree` check. Force-pushes and branch deletion are prohibited for canonical branches.

The repository-native workflow continuously verifies the policy and runs the unit suite. GitHub-native branch protection/rulesets remain the authoritative enforcement layer when administration credentials are available.

## Free host-level closure

GitHub confirms that repository rulesets and protected branches are available for public repositories on GitHub Free. citeturn718149search4turn718149search6

Import `.github/rulesets/BRANCH-X-Canonical.json` and set it to **Active** for `main` and `release/**`. The definition enforces pull requests, one approval, stale-review dismissal, conversation resolution, the BRANCH-X status check, linear history, no force pushes, and no deletions.

Import `.github/rulesets/BRANCH-X-Automation.json` and set it to **Active** for `automation/**`, `audit/**`, and `ci/**`. This host-level ruleset intentionally enforces only non-fast-forward and deletion protection so existing direct automation writes remain possible; BRANCH-X continues to require and verify the repository-native check for these branches.

No bypass actors are configured in either definition.
