# BRANCH-X Protection Tree

BRANCH-X is the repository-native branch governance layer for Mirror-DataNest.

Canonical branches are `main` and `release/**`. Canonical adoption requires a pull request, at least one approving review, stale-approval dismissal, conversation resolution, linear history, and a passing `BRANCH-X Protection Tree` check. Force-pushes and branch deletion are prohibited for canonical branches.

The repository-native workflow continuously verifies the policy and runs the unit suite. GitHub-native branch protection/rulesets remain the authoritative enforcement layer when administration credentials are available.

This repository is a Mirror control plane, so BRANCH-X governance artifacts remain local to the Mirror rather than asserting canonical DataNest authority. A missing GitHub-native protection configuration is published as a protection gap, not as compliance.
