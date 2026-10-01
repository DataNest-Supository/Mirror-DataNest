# Mirror owner workspace access recovery — 2026-10-01

Repository: `DataNest-Supository/Mirror-DataNest`  
Baseline: `d138896f38fc43deca44f7ec797996fa4ca4fb20`  
Environment: DataNest AI Staging (`qchttpcyqlqnhvahprhz`)

## Observed failure and cause

The owner could sign in, but the project lookup returned no visible row. The application displayed the obsolete message “You do not have access to reson8.datanest.life.” and offered no retry.

The configured, confirmed owner account matched the staging database's restrictive `mirror_owner_only` policy. However, it had no active `project_members` row for `resonance-datanest`. A different account held the existing membership. The normal project membership policy therefore denied the configured owner despite successful authentication.

## Staging repair

Inserted the missing active owner membership for the existing configured owner and existing active project. The transaction verified the exact account, confirmed email, undeleted account, project identity, slug, and status before inserting. It refused to overwrite any conflicting membership and was idempotent for an already-correct membership.

Existing memberships, authentication credentials, RLS policies, database functions, and canonical production were unchanged. This is a staging data correction, not a schema migration or a client-side provisioning mechanism.

## Application recovery

- Missing project access now explains that the signed-in account cannot access the workspace and points to project membership.
- A “Workspace unavailable” panel provides “Retry workspace access” without requiring sign-out.
- Failed project lookups clear project and membership state. Unexpected load failures clear the loading indicator through `finally`.
- Two browser cases cover a hidden project and a service error, continued denial after retry, and successful recovery after the fixture backend restores access. All Supabase requests are intercepted; unexpected backends and direct table writes fail the assertions.
- Both cases run in the existing live Mirror browser workflow. They exercise the deployed frontend with a simulated owner session and backend responses, rather than a real owner's credentials.

## Verification evidence

Database checks ran in read-only transactions under `SET LOCAL ROLE authenticated` with transaction-local JWT claims. These test RLS behavior without issuing a user session.

| Check | Before repair | After repair |
| --- | --- | --- |
| Configured owner: visible target projects | 0 | 1 |
| Configured owner: active owner memberships | 0 | 1 |
| Configured owner: dashboard summary | Not checked | `authorized: true`, 3 jobs |
| Configured owner: tools and capabilities | Not checked | Queries succeed; currently empty |
| Other existing member: visible target projects | Not checked | 0 |
| Other existing member: visible memberships | Not checked | 0 |

Local validation: type check passes; Mirror unit suite passes 843/843. Local Chromium installation failed because the browser download was not a valid archive; browser results must be taken from the linked pull request's final GitHub Actions evidence.

After future staging restores or owner-account changes, confirm that the owner configured in `config/mirror-rd-policy.json`, the restrictive owner policy, and an active owner membership for `resonance-datanest` all refer to the intended account. Repeat both owner and non-owner RLS checks. Do not broaden policies or add client-side grants to compensate for missing membership data.

The successor checkpoint and pull request record the final tested commit, deployment, and browser outcome. This evidence does not authorize canonical promotion or claim full acceptance of every authenticated owner workflow.
