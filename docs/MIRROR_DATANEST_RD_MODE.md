# MIRROR-DATANEST R&D Test Mode

`DataNest-Supository/Mirror-DataNest` is the fast, ungated R&D clone of the canonical `DataNest-Supository/DataNest` repository.

## Purpose

The mirror exists to optimize code, architecture, build performance, deployment design, user experience and operational workflows before any change is proposed to canonical production.

Inside the mirror:

- experimentation does not require a human approval gate;
- direct commits to the mirror are permitted;
- failed experiments are acceptable and should remain traceable;
- automated tests are advisory unless a developer chooses to treat them as blocking;
- preview deployment is for R&D evidence only;
- AI-assisted and human-assisted optimization may iterate rapidly.

## Authority boundary

The mirror is **not**:

- the production source of truth;
- a release authority;
- a governance authority;
- permitted to deploy to the canonical DataNest GitHub Pages route;
- permitted to mutate production databases or production infrastructure by default.

Production remains governed by `DataNest-Supository/DataNest`.

## Promotion model

```text
DataNest main
    |
    | clone / refresh
    v
MIRROR-DATANEST
    |
    | unrestricted R&D iteration
    | preview + tests + optimization evidence
    v
selected candidate change
    |
    | import onto a promotion branch in DataNest
    v
DataNest pull request
    |
    | HUMAN REVIEWER APPROVAL
    v
DataNest main
    |
    v
governed production release
```

A mirror commit never becomes production merely because it passes tests.

## Synchronization contract

Promotion must record:

1. mirror repository and source commit SHA(s);
2. purpose of the experiment;
3. test/build results;
4. preview/deployment observations;
5. known regressions or unresolved risks;
6. rollback/revert note;
7. canonical promotion branch and pull request;
8. human reviewer approval before merge to `DataNest/main`.

The canonical repository may cherry-pick selected commits, apply an equivalent patch, or import a curated tree. The synchronization unit should be the smallest reviewed change set rather than blindly mirroring the entire R&D history.

## R&D backend

Use a separate free-tier R&D backend wherever stateful testing is needed. Production Supabase credentials, privileged tokens, production deployment keys and production write paths must not be copied into the mirror.

Public client configuration may be reproduced only when the test cannot mutate production state and the behavior is explicitly understood.

## Preview target

Preferred free preview identity:

`https://datanest-supository.github.io/Mirror-DataNest/`

The mirror Pages workflow uses the `/Mirror-DataNest` base path and must never deploy to `/DataNest`.

## Refreshing from canonical

Periodically refresh the mirror from approved `DataNest/main` so R&D does not drift indefinitely. A refresh may reset experimental history when explicitly desired, but candidate promotion evidence should be retained before destructive cleanup.
