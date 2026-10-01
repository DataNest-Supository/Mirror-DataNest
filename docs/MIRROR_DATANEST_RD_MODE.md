# MIRROR-DATANEST R&D + Production-Parity Test Mode

`DataNest-Supository/Mirror-DataNest` is the fast, ungated R&D clone and live production-parity candidate environment for the canonical `DataNest-Supository/DataNest` repository.

## Purpose

The Mirror has two linked jobs:

1. allow rapid R&D without canonical production approval gates on every experiment;
2. deploy the selected candidate as a real public Mirror UI so humans and browser automation can test the actual rendered pages before certification.

## Fast-lane R&D contract

Mirror is intentionally non-governed for experiment iteration, not non-evidenced for production promotion.

- Pushes to main may publish a live candidate automatically so R&D can review the real rendered UI quickly.
- Pre-deployment test, type-check and dependency-audit results remain visible observations and do not block live experimentation.
- Production-candidate packaging retains advisory test, type-check and audit outcomes. A live evidence reference is optional for owner R&D packaging; successful exact-candidate evidence and human review remain required for canonical production certification.
- Canonical production remains a separate authority boundary. No Mirror workflow may deploy or overwrite the canonical DataNest Pages site, production backend, or governance state.
- Canonical refresh uses repository dispatch plus an hourly reconciliation fallback.

This keeps the R&D loop fast while preserving the existing DataNest governance firewall: evidence can accelerate review, but Mirror cannot approve, ratify, certify, or deploy canonical production.

## Live Mirror candidate

Preferred public candidate identity:

`https://datanest-supository.github.io/Mirror-DataNest/`

The sole Pages publisher is `.github/workflows/pages.yml`. It builds the current Mirror commit under the `/Mirror-DataNest` base path, validates staging runtime identity and all seven bundled apps, publishes `mirror-release.json`, then verifies the live routes and runs browser tests. Pull requests build and validate the artifact without deploying. Build and verification jobs have read-only repository permissions; only the main-branch deployment job has Pages/OIDC write permissions.

The release manifest contains an immutable commit identity, but its public URL always serves the latest candidate. Retain the workflow artifact for historical evidence. Browser JSON/HTML reports and a signed-out desktop screenshot accompany `mirror-live-verification.json` in the evidence artifact.

The Mirror uses **DataNest AI Staging** (`qchttpcyqlqnhvahprhz`) for functional testing. Production backend writes are not the default R&D mechanism.

## Inside the Mirror

- direct R&D commits are permitted;
- no human approval gate is required for experimental iteration;
- failed experiments may remain traceable;
- advisory checks support iteration;
- a candidate intended for canonical production must obtain successful live Mirror evidence before canonical approval;
- visual and functional review evidence is part of the production certification packet.

## Authority boundary

Mirror-DataNest **may**:

- deploy its own public production-parity candidate UI;
- run functional tests against isolated staging;
- produce exact-SHA release/test evidence;
- package production candidates.

Mirror-DataNest **may not**:

- deploy or overwrite `https://datanest-supository.github.io/DataNest/`;
- become canonical source authority by implication;
- write to the canonical production database by default;
- approve governance;
- certify itself;
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

A passing Mirror candidate is evidence, not certification.

## DataNest admin toggle

Canonical DataNest owner/admin users use **R&D Test Mode** to open the live Mirror UI. The control reads `mirror-release.json` and synchronizes the exact Mirror build into the existing Product Lab/governance evidence model, allowing reviewers to record versioned pass/fail/blocked evidence for the actual deployed candidate.

## Refreshing from canonical

Mirror should periodically refresh from approved `DataNest/main` so R&D starts from the latest certified baseline. Production-candidate evidence should be retained before any destructive history cleanup.


## FREETREE isolation

FREETREE is a separate open-development repository target. It has no canonical refresh, reverse promotion, Knowledge feed exchange, Boundaries enforcement, or production authority. The Mirror bootstrap workflow creates it only with an explicit repository-administration token and strips synchronization workflows before the initial FREETREE commit.
