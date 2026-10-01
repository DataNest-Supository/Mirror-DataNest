# BRANCH-X Protection Tree

BRANCH-X is the repository-native branch governance layer for Mirror-DataNest.

Canonical branches are `main` and `release/**`. Canonical adoption requires a pull request, at least one approving review, stale-approval dismissal, conversation resolution, linear history, and a passing `BRANCH-X Protection Tree` check. Force-pushes and branch deletion are prohibited for canonical branches.

The repository-native workflow continuously verifies the policy and runs the unit suite. GitHub-native branch protection/rulesets remain the authoritative enforcement layer when administration credentials are available.

## Free host-level closure

GitHub confirms that protected branches and repository rulesets are available on GitHub Free for public repositories. The remaining gap is administrative configuration, not a paid-plan requirement.

Create a repository ruleset named **BRANCH-X Canonical** with enforcement set to **Active** and target patterns:

- `main`
- `release/**`

Configure these rules:

- Require a pull request before merging.
- Require at least 1 approving review.
- Dismiss stale pull-request approvals when new commits are pushed.
- Require conversation resolution before merging.
- Require the `BRANCH-X Protection Tree` status check.
- Require linear history.
- Block force pushes.
- Restrict deletions.
- Do not configure any bypass actors unless an explicit governance exception is later approved.

Create a second ruleset named **BRANCH-X Automation** for:

- `automation/**`
- `audit/**`
- `ci/**`

Configure it to block force pushes and deletions, require conversation resolution, and require the `BRANCH-X Protection Tree` status check.

Leave ordinary development branches outside these rulesets.

## Verification after configuration

After saving the rulesets, verify that the repository exposes the active rulesets and that their target patterns and rules match `config/branch-protection.tree.json`.

The BRANCH-X workflow should remain green. A missing or drifted native rule must continue to be treated as a protection gap rather than compliance.

This repository is a Mirror control plane, so BRANCH-X governance artifacts remain local to the Mirror rather than asserting canonical DataNest authority. A missing GitHub-native protection configuration is published as a protection gap, not as compliance.
