import assert from "node:assert/strict";

export const mirrorAppSlugs = Object.freeze([
  "career-compass", "creative-studio", "epublisher", "lyricsync-studio",
  "scene-song-spark", "sovereign-forge", "syncvision"
]);

export function validateMirrorRelease({ runtime, mirror, release, apps }, expectedSha, policy) {
  assert.match(expectedSha, /^[0-9a-f]{40}$/i, "An exact expected commit is required.");
  const candidate = policy.liveCandidate;
  assert.equal(runtime?.authoritative, true, "Mirror runtime must be authoritative.");
  assert.equal(runtime?.supabaseUrl, "https://" + candidate.backendProject + ".supabase.co",
    "Mirror runtime must point to isolated staging.");
  assert.match(runtime?.supabasePublishableKey || "", /^sb_publishable_\S+$/,
    "Mirror requires a public publishable key.");
  assert.equal(runtime?.releaseSha, expectedSha, "Runtime commit does not match the candidate.");
  assert.equal(mirror?.schemaVersion, "mirror-live-release-v1");
  assert.equal(mirror?.repository, policy.repository);
  assert.equal(mirror?.commit, expectedSha, "Mirror manifest commit does not match the candidate.");
  assert.equal(mirror?.publicUrl, candidate.publicUrl);
  assert.equal(mirror?.backend?.project, candidate.backendProject);
  assert.equal(mirror?.backend?.mode, "isolated-staging");
  for (const authority of ["productionSource", "canonicalDeployment", "governance"]) {
    assert.equal(mirror?.authority?.[authority], false, "Mirror cannot claim " + authority + " authority.");
  }
  assert.equal(release?.frontendCommit, expectedSha, "Release manifest commit does not match the candidate.");
  assert.equal(release?.supabaseProject, candidate.backendProject);
  assert.equal(apps?.contract, "datanest-ronsas-apps@1");
  assert.ok(Array.isArray(apps?.apps), "Bundled app manifest is missing.");
  assert.deepEqual(apps.apps.map(app => app.slug).sort(), [...mirrorAppSlugs].sort(),
    "Mirror must include each expected RONSAS app exactly once.");
  for (const app of apps.apps) {
    assert.equal(app.path, candidate.basePath + "/apps/" + app.slug + "/",
      "Bundled app must use the Mirror base path.");
  }
}
