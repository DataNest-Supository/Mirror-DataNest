import { expect, test } from "@playwright/test";

const appPath = process.env.DATANEST_APP_PATH || "/";

test("Mirror live surface exposes the single-owner R&D gate", async ({ page }) => {
  await page.goto(appPath);

  await expect(page.getByRole("heading", { name: "DataNest", exact: true })).toBeVisible();
  await expect(page.getByText("OWNER R&D MODE", { exact: true })).toBeVisible();
  await expect(page.getByText("Single-owner development workspace. Sign in to continue.", { exact: true })).toBeVisible();
  await expect(page.getByText("Owner access only · iace1236912@gmail.com", { exact: true })).toBeVisible();

  for (const label of ["Build", "Experiment", "Inspect", "Ship candidate"]) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }

  await expect(page.getByLabel("Email")).toHaveValue("iace1236912@gmail.com");
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  await expect(page.getByRole("link", { name: /Governance|Legal Centre/i })).toHaveCount(0);
});

test("Mirror live shell remains usable on a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(appPath);

  await expect(page.getByText("OWNER R&D MODE", { exact: true })).toBeVisible();
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByRole("button", { name: "Sign in", exact: true })).toBeEnabled();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});
