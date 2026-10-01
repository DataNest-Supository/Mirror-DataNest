# MIRROR-DATANEST R&D + Production Authority Mode

`DataNest-Supository/Mirror-DataNest` is the fast, owner-controlled R&D workspace and independent production environment for the canonical `DataNest-Supository/DataNest` repository.

## Purpose

The Mirror has two linked jobs:

1. allow rapid R&D without canonical production approval gates on every experiment;
2. deploy the current Mirror build as a real public production UI so humans and browser automation can exercise the exact deployed release.

## Fast-lane R&D contract

Mirror is intentionally non-governed for experiment iteration, not non-evidenced for production promotion.

- Pushes to main may publish the current Mirror production release automatically so R&D can review the real rendered UI quickly.
- Pre-release test, type-check and dependency-audit results remain visible observations and do not block live experimentation.
- Production releases retain exact-SHA evidence. The Mirror may release its own production surface directly; canonical production certification remains a separate path for changes intended for `/DataNest/`.
- Mirror has independent production authority only over `/Mirror-DataNest/` and its isolated Supabase project. No Mirror workflow may deploy or overwrite `/DataNest/`, the canonical production backend, or canonical governance state.
- Canonical refresh uses repository dispatch plus an hourly reconciliation fallback.

This keeps the R&D loop fast while preserving the existing DataNest governance firewall: evidence can accelerate review, but Mirror cannot approve, ratify, certify, or deploy canonical production.

## Live Mirror production

Preferred public production identity:

`https://datanest-supository.github.io/Mirror-DataNest/`

The sole Pages publisher is `.github/workflows/pages.yml`. It builds the current Mirror commit under the `/Mirror-DataNest` base path, validates isolated production runtime identity and all seven bundled apps, publishes `mirror-release.json`, then verifies the live routes and runs browser tests. Pull requests build and validate the artifact without deploying. Build and verification jobs have read-only repository permissions; only the main-branch deployment job has Pages/OIDC write permissions.

The release manifest contains an immutable commit identity, but its public URL always serves the latest production release. Retain the workflow artifact for historical evidence. Browser JSON/HTML reports and a signed-out desktop screenshot accompany `mirror-live-verification.json` in the evidence artifact.

The Mirror uses its isolated Supabase project (`qchttpcyqlqnhvahprhz`) as its own production backend. It is independent from the canonical production project `sgqdmfgjbprsoqsmgigi`.

## Inside the Mirror

- direct R&D commits are permitted;
- no human approval gate is required for experimental iteration;
- failed experiments may remain traceable;
- advisory checks support iteration;
- a change intended for canonical `/DataNest/` production must retain successful live Mirror evidence before canonical approval;
- visual and functional review evidence is part of the production certification packet.

## Authority boundary

Mirror-DataNest **may**:

- deploy and operate its own public production UI;
- write only to its isolated production backend;
- publish exact-SHA production releases and evidence;
- package candidates for the canonical `/DataNest/` surface;
- maintain its own owner-controlled production release authority.

Mirror-DataNest **may not**:

- deploy or overwrite `https://datanest-supository.github.io/DataNest/`;
- write to the canonical production database;
- alter canonical governance without the canonical repository's controls;
- claim authority over the `/DataNest/` production surface;
- merge directly into `DataNest/main`.

## Certification flow

```text
R&D iteration
    |
    v
Mirror live candidate
    |
    | route + browser + human Product Lab tests
    v
live Mirror evidence
    |
    v
Package Production Candidate
    |
    v
DataNest mirror-promotion/*
    |
    | Audit Optimizer + canonical validation
    | governance + human approval
    v
DataNest/main
    |
    v
canonical live deployment
```

A Mirror production release is authoritative for the Mirror production surface. It is still evidence—not certification—for the separate canonical `/DataNest/` surface.

## DataNest admin toggle

Canonical DataNest owner/admin users use **R&D Test Mode** to open the live Mirror UI. The control reads `mirror-release.json` and synchronizes the exact Mirror build into the existing Product Lab/governance evidence model, allowing reviewers to record versioned pass/fail/blocked evidence for the actual deployed production release.

## Refreshing from canonical

Mirror should periodically refresh from approved `DataNest/main` so R&D starts from the latest certified baseline. Production evidence should be retained before any destructive history cleanup.


## FREETREE isolation

FREETREE is a separate open-development repository target. It has no canonical refresh, reverse promotion, Knowledge feed exchange, Boundaries enforcement, or production authority. The Mirror bootstrap workflow creates it only with an explicit repository-administration token and strips synchronization workflows before the initial FREETREE commit.
