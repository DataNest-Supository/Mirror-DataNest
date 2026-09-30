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
- A production-candidate package is different: unit tests, type checking and the dependency audit are blocking evidence, and the live Mirror verification reference remains mandatory.
- Canonical production remains a separate authority boundary. No Mirror workflow may deploy or overwrite the canonical DataNest Pages site, production backend, or governance state.
- Canonical refresh is watched every 15 minutes and skipped when the current canonical main commit is already an ancestor of Mirror main.

This keeps the R&D loop fast while preserving the existing DataNest governance firewall: evidence can accelerate review, but Mirror cannot approve, ratify, certify, or deploy canonical production.

## Live Mirror candidate

Preferred public candidate identity:

`https://datanest-supository.github.io/Mirror-DataNest/`

The Pages workflow builds the current Mirror commit under the `/Mirror-DataNest` base path, publishes an immutable `mirror-release.json`, then verifies the live routes and runs browser tests.

The Mirror uses **DataNest AI Staging** (`qchttpcyqlqnhvahprhz`) for functional testing. Production backend writes are not the default R&D mechanism.

## Inside the Mirror

- direct R&D commits are permitted;
- no human approval gate is required for experimental iteration;
- failed experiments may remain traceable;
- advisory checks support iteration;
- a candidate intended for production must obtain a successful live Mirror verification reference before packaging;
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
