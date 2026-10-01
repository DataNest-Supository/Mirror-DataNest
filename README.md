# MIRROR-DATANEST — RESONANCE OWNER R&D WORKSPACE

> **Single-owner development laboratory for Resonance DataNest and related products/tools.** Mirror-DataNest is intentionally separate from the governed collaborative repository and is optimized for rapid owner-led development, experimentation, testing and live candidate deployment.
>
> Governed collaborative work belongs in `DataNest-Supository/DataNest`. Mirror-DataNest is not its governance authority, but it is the owner's primary R&D surface for evolving the product ecosystem.

- Live candidate UI: `https://datanest-supository.github.io/Mirror-DataNest/`
- R&D policy: [`config/mirror-rd-policy.json`](config/mirror-rd-policy.json)
- Production handoff: [`docs/PRODUCTION_CANDIDATE_HANDOFF.md`](docs/PRODUCTION_CANDIDATE_HANDOFF.md)
- Machine policy: [`config/mirror-rd-policy.json`](config/mirror-rd-policy.json)
- Functional backend: **DataNest AI Staging** · `qchttpcyqlqnhvahprhz`

---

**Operating rule:** Mirror-DataNest is the owner's build/test/deploy laboratory. Candidate work can be developed and deployed here without collaborative-review gates. When work is ready for governed collaboration or canonical production release, the owner selectively hands it off to `DataNest-Supository/DataNest`, where the existing governance and release controls remain authoritative.


## Specialized R&D trees

- **Knowledge consumer** — receives the Mirror-targeted provisional learning feed from canonical Knowledge on an isolated automation branch.
- **AI Plugin Lab** — Mirror-only registry and read-only validation harness for Ollama, llama.cpp, vLLM, LocalAI, Hugging Face TGI, and generic OpenAI-compatible endpoints.
- **FREETREE bootstrap** — provisions an isolated open-development snapshot with DataNest synchronization, promotion, Knowledge exchange, and Boundaries controls removed. Baseline credential/platform safety remains.

Maintenance is defined in [`docs/MAINTENANCE_PROTOCOL.md`](docs/MAINTENANCE_PROTOCOL.md), and the R&D provider registry is documented in [`docs/MIRROR_AI_PLUGIN_LAB.md`](docs/MIRROR_AI_PLUGIN_LAB.md).

# DataNest

**DataNest** is the canonical Resonance AppDev web control plane. It governs product execution intent, promotion, evidence and lifecycle state while preserving separate source, backend and delivery authorities.

It provides an owner-oriented development surface for:

- rapid product/tool prototyping and UI evolution
- DataNest AI experimentation and test workflows
- live candidate deployment and visual/functional inspection
- product portfolio development across Resonance tools
- selective handoff of mature work into governed DataNest

## Canonical public identity

DataNest uses its current GitHub Pages project-path deployment as the canonical public endpoint. There is no active DNS/custom-domain cutover or branded-host redirect. Reson8 remains an ecosystem Hub link rather than a routing target.

## Live web UI

Primary free public endpoint:

**https://datanest-supository.github.io/DataNest/**

Reson8 ecosystem integration links directly between the live DataNest GitHub Pages endpoint and the Reson8 Hub. No branded-host activation, DNS cutover, or Railway ingress is required.

Static health marker:

**https://datanest-supository.github.io/DataNest/health.json**

GitHub Pages is the **current public delivery target** for the DataNest-managed production path. Supabase supplies the governed auth, database, storage and backend-function services.

Standalone Node/Docker runtimes continue to expose the server health endpoint at `/api/health`, but local machines are development, controlled-test, and specialized execution surfaces only. They are not backup hosts or continuity authorities. Dropbox `/DataNest-AI-Backups` is the governed backup-artifact host.

## Canonical stack

- DataNest: parent platform, governance and execution/promotion authority
- GitHub repository: `DataNest-Supository/DataNest`
- Branch: `main`
- GitHub: source control, history, CI and evidence authority
- Supabase: `sgqdmfgjbprsoqsmgigi`
- Supabase URL: `https://sgqdmfgjbprsoqsmgigi.supabase.co`
- Supabase: auth, database, storage and backend-function authority
- Current public delivery target: **GitHub Pages**
- Canonical production route: **DataNest-managed public delivery: GitHub Pages + Supabase**
- Railway dependency: **none**
- Hosting model: **replaceable delivery infrastructure**
- Backup-artifact host: **Dropbox · `/DataNest-AI-Backups`**
- Local PC backup hosting: **disabled**
- AI compute: **replaceable approved HTTPS inference endpoints; no workstation is required**
- AI architecture: [`docs/DATANEST_AI_ARCHITECTURE.md`](docs/DATANEST_AI_ARCHITECTURE.md)
- Vercel dependency: **none**

GitHub and Supabase remain the required source/CI and backend authorities. Dropbox is continuity storage for governed release and recovery artifacts; it is not the request-serving production web runtime. Hosting remains replaceable delivery infrastructure, not system authority.

## Target-state architecture concepts

The approved 27 Sep 2026 ecosystem design extends DataNest with target-state concepts that are intentionally separate from current production capability claims:

- **Cloud-Nest** — planned governed workspace abstraction for identity, projects, knowledge, permissions and resources.
- **Supository** — planned governed knowledge and provenance abstraction linking source, evidence, lineage and reuse policy.
- **ILM (Inclusive Language Model)** — planned governed intelligence abstraction that begins as orchestration across approved models, tools, people and certified knowledge rather than a claim that Resonance has trained a proprietary foundation model.

These concepts require separate implementation and evidence before DataNest presents them as available product capabilities.


## RONSAS cloud integration

DataNest integrates with **RONSAS (Resonance Open Nova Sovereign Application Suite)** as a governed product through the authenticated Supabase Edge Function contract `ronsas-status@1`.

- RONSAS is governed through DataNest; it is not the parent platform or DataNest AI authority.
- No local workstation, loopback service, desktop launcher, or Ealiophin interaction is required by the DataNest web control plane.
- Ealiophin, Spider, Weed, and other local PCs are not backup hosts or continuity authorities.
- Dropbox `/DataNest-AI-Backups` is the governed backup-artifact host.
- The integration is cloud-only and rejects localhost, loopback, and `.local` origins.
- RONSAS health is non-blocking: DataNest remains usable when the public RONSAS Hub is unavailable.
- Resonance AppDev source authority is explicit: `resonance36912-cell/RONSAS` is the control-source repository and `resonance36912-cell/resonance-hub` is the public Hub source.
- The canonical public Hub probe is `https://reson8.life/`.

## Web UI

The UI is being evolved around a single-owner R&D workflow: development cockpit, product/tool portfolio, AI experimentation, live candidate controls, runtime/health inspection, test evidence, deployment surfaces and owner settings. Shared-team administration, contributor workflows and collaborative approval UX are not the primary interaction model here.

The sign-in screen is owner-oriented and preloads `iace1236912@gmail.com`. The UI accepts only a session for that owner account; it does not create users. Password or magic-link sign-in can be used, subject to the configured Supabase Auth account.

## External Audit & Optimizer production status

The **DataNest External Audit & Optimizer** is deployed through the canonical DataNest production path: GitHub Pages for the authenticated UI and Supabase project `sgqdmfgjbprsoqsmgigi` for governed database and Edge Function services.

- Production database release: `external-audit-production-v1`
- Supabase Edge Function: `external-audit@1`
- JWT verification: enabled
- Project-scoped RLS, reviewer gates, evidence traceability, Certified Memory usage receipts, and UNIFI/TranScheduler handoff remain enforced by backend controls.
- The tool produces assisted assessment evidence and optimization records; it does not claim ISO certification or accreditation.

## Runtime configuration

Runtime-resolved public configuration uses:

```env
SUPABASE_URL=https://sgqdmfgjbprsoqsmgigi.supabase.co
SUPABASE_PUBLISHABLE_KEY=<publishable key>
```

The GitHub Pages workflow generates the public Supabase configuration into `runtime-config.js`. Local development and controlled-test Node/container runtimes consume the same public variables.

## Local development and controlled testing

Local development:

```bash
cp .env.example .env.local
npm install
npm run dev
```

Legacy Windows/Node controlled-test launcher:

```powershell
$env:SUPABASE_PUBLISHABLE_KEY="<publishable key>"
.\scripts\start-production.ps1
```

Local Docker controlled test:

```bash
docker compose up --build -d
```

These paths do not replace the DataNest-managed production route and are not backup hosts.

## Backup and continuity artifacts

Dropbox `/DataNest-AI-Backups` is the governed backup-artifact host for DataNest and RONSAS continuity material. Existing governed ZIP, PGP, manifest, and GitHub Pages release artifacts are stored there. Dropbox is used for backup/recovery storage, not as the public web-serving origin; the operational web fallback remains the canonical GitHub Pages release.

See `docs/DEPLOYMENT.md` for the authority and delivery model.

## Validation

```bash
npm run check
npm run build
docker build -t resonance-datanest:ci .
```

Every GitHub Pages deployment also verifies the live homepage, static health marker, and published Supabase runtime configuration from a GitHub-hosted runner.

## Delivery-provider metadata

Mirror-DataNest does not require Vercel. Its active public candidate delivery target is GitHub Pages; provider metadata must not present the old Vercel preview as required infrastructure.

## Scheduling safety

TranScheduler does not treat `UNKNOWN` capability state as permission to execute. Capability availability must be observed explicitly before routing work.

## Transparency

The **Transparency** workspace publishes audit methodology and accessible audit-source transcriptions separately from the operational Audit event log. The initial library contains the complete accessible transcription of the Resonance DataNest / RONSAS External Full-System Audit Brief v1.0 and explicitly marks external audit results as pending until a completed review is supplied.

### External audit return · 25 Sep 2026

The Transparency workspace now publishes the exact external audit return, structured `AUD-001`–`AUD-014` findings, and the reported remediation backlog. The audit is explicitly identified as a read-only public/source review, not a full production certification. DataNest validation/closure status remains separate and starts as pending for every reported finding.

## Resonance UI/UX alignment

This application follows the **Resonance Sovereign Spectrum 2026** portfolio design system: sovereign-dark operational surfaces, restrained translucent control layers, product-specific accents, explicit AI/governance state, accessible focus/motion behavior, and RONSAS-aligned product identity.

Canonical design authority: https://github.com/resonance36912-cell/RONSAS/blob/main/docs/design/RESONANCE_SOVEREIGN_SPECTRUM_2026.md
