import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { validateMirrorRelease, mirrorAppSlugs } from "../../scripts/lib/mirror-release-validation.mjs";

const policy = JSON.parse(readFileSync(new URL("../../config/mirror-rd-policy.json", import.meta.url), "utf8"));
const sha = "a".repeat(40);
function fixture() {
  return {
    runtime: {
      authoritative: true,
      supabaseUrl: "https://" + policy.liveCandidate.backendProject + ".supabase.co",
      supabasePublishableKey: "sb_publishable_fixture",
      releaseSha: sha
    },
    mirror: {
      schemaVersion: "mirror-live-release-v1", repository: policy.repository,
      commit: sha, publicUrl: policy.liveCandidate.publicUrl,
      backend: { project: policy.liveCandidate.backendProject, mode: "isolated-production" },
      authority: { productionSource: true, productionDeployment: true, productionBackend: true, canonicalDeployment: false, governance: false }
    },
    release: { frontendCommit: sha, supabaseProject: policy.liveCandidate.backendProject },
    apps: {
      contract: "datanest-ronsas-apps@1",
      apps: mirrorAppSlugs.map(slug => ({ slug, path: policy.liveCandidate.basePath + "/apps/" + slug + "/" }))
    }
  };
}
test("accepts a complete isolated release with consistent commit identity", () => {
  assert.doesNotThrow(() => validateMirrorRelease(fixture(), sha, policy));
});
for (const [name, mutate] of [
  ["production runtime", value => { value.runtime.supabaseUrl = "https://sgqdmfgjbprsoqsmgigi.supabase.co"; }],
  ["missing runtime", value => { value.runtime = {}; }],
  ["secret instead of publishable key", value => { value.runtime.supabasePublishableKey = "sb_secret_fixture"; }],
  ["stale runtime commit", value => { value.runtime.releaseSha = "b".repeat(40); }],
  ["stale Mirror manifest", value => { value.mirror.commit = "b".repeat(40); }],
  ["stale release manifest", value => { value.release.frontendCommit = "b".repeat(40); }],
  ["production release backend", value => { value.release.supabaseProject = "sgqdmfgjbprsoqsmgigi"; }],
  ["missing production deployment authority", value => { value.mirror.authority.productionDeployment = false; }],
  ["missing production backend authority", value => { value.mirror.authority.productionBackend = false; }],
  ["canonical deployment claim", value => { value.mirror.authority.canonicalDeployment = true; }],
  ["missing app", value => { value.apps.apps.pop(); }],
  ["duplicate app", value => { value.apps.apps[0] = value.apps.apps[1]; }],
  ["canonical app path", value => { value.apps.apps[0].path = "/DataNest/apps/career-compass/"; }]
]) {
  test("rejects " + name + " before publication", () => {
    const value = fixture();
    mutate(value);
    assert.throws(() => validateMirrorRelease(value, sha, policy));
  });
}
test("requires an exact expected commit rather than a moving branch", () => {
  assert.throws(() => validateMirrorRelease(fixture(), "main", policy));
});
