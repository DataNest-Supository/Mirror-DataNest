import { expect, test } from "@playwright/test";

const appPath = process.env.DATANEST_APP_PATH || "/";

test("Mirror live surface exposes the single-owner R&D gate", async ({ page }, testInfo) => {
  await page.goto(appPath);

  await expect(page.getByRole("heading", { name: "DataNest", exact: true })).toBeVisible();
  await expect(page.getByText("OWNER R&D MODE · AI & I", { exact: true })).toBeVisible();
  await expect(page.getByText("Single-owner development workspace.", { exact: true })).toBeVisible();
  await expect(page.getByText("Owner access only · authorized account required.", { exact: true })).toBeVisible();

  for (const label of ["Build", "Experiment", "Inspect", "Ship candidate"]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }

  await expect(page.getByLabel("Email")).toHaveValue("iace1236912@gmail.com");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  await expect(page.getByRole("link", { name: "RSGP Governed", exact: true })).toBeVisible();
  await testInfo.attach("mirror-desktop", { body: await page.screenshot({ fullPage: true }), contentType: "image/png" });
});

test("Mirror live shell remains usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appPath);

  await expect(page.getByText("OWNER R&D MODE · AI & I", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test("live Mirror runtime, manifests and bundled apps belong to the expected candidate", async ({ page, request }) => {
  const expectedSha = process.env.MIRROR_EXPECTED_SHA;
  test.skip(!expectedSha, "Exact-SHA release verification runs in the Mirror deployment workflow.");
  await page.goto(appPath);
  const runtime = await page.evaluate(() => (window as Window & {
    __DATANEST_CONFIG__?: { supabaseUrl?: string; authoritative?: boolean; releaseSha?: string };
  }).__DATANEST_CONFIG__);
  expect(runtime?.authoritative).toBe(true);
  expect(runtime?.supabaseUrl).toBe("https://qchttpcyqlqnhvahprhz.supabase.co");
  expect(runtime?.releaseSha).toBe(expectedSha);

  for (const [file, field] of [["mirror-release.json", "commit"], ["release-manifest.json", "frontendCommit"]] as const) {
    const response = await request.get(appPath + file);
    expect(response.ok(), file).toBe(true);
    expect((await response.json())[field], file).toBe(expectedSha);
  }
  const response = await request.get(appPath + "apps/manifest.json");
  expect(response.ok()).toBe(true);
  const manifest = await response.json() as { apps: Array<{ slug: string; path: string }> };
  expect(manifest.apps.map(app => app.slug).sort()).toEqual([
    "career-compass", "creative-studio", "epublisher", "lyricsync-studio",
    "scene-song-spark", "sovereign-forge", "syncvision"
  ]);
  for (const app of manifest.apps) {
    expect(app.path).toBe(appPath + "apps/" + app.slug + "/");
    const entry = await request.get(app.path);
    expect(entry.ok(), app.slug + " must be reachable").toBe(true);
    expect(await entry.text(), app.slug + " must serve HTML").toMatch(/<html[\s>]/i);
  }
});
