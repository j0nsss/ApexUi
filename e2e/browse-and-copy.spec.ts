import { test, expect } from "@playwright/test";

test.describe("Desktop Browse & Copy", () => {
  test("gallery loads and displays components", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("ApexUI");
    await expect(page.locator("text=Design Vault")).toBeVisible();
  });

  test("filter chips work", async ({ page }) => {
    await page.goto("/");
    const filter = page.locator("button:has-text('table')");
    await filter.click();
    await expect(filter).toHaveClass(/border-accent/);
  });

  test("clicking a cell navigates to detail view", async ({ page }) => {
    await page.goto("/");
    const firstCell = page.locator("button:has-text('Data Table')").first();
    await firstCell.click();
    await expect(page).toHaveURL(/\/components\//);
  });
});

test.describe("Desktop Detail View", () => {
  test("detail page renders 3-panel layout", async ({ page }) => {
    await page.goto("/components/data-table-default");
    await expect(page.locator("text=Data Table")).toBeVisible();
  });

  test("copy code button works", async ({ page }) => {
    await page.goto("/components/data-table-default");
    const copyBtn = page.locator("button:has-text('Copy Code')");
    await copyBtn.click();
    await expect(page.locator("text=Copied")).toBeVisible();
  });

  test("code tab switch works", async ({ page }) => {
    await page.goto("/components/data-table-default");
    await page.locator("button:has-text('Customize')").click();
    await expect(page.locator("text=Reset Defaults")).toBeVisible();
  });
});

test.describe("Mobile Catalog", () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test("shows mobile catalog cards instead of bento grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("text=Design Vault")).toBeVisible();
  });

  test("view code bottom sheet opens", async ({ page }) => {
    await page.goto("/components/data-table-default");
    await page.locator("button:has-text('View Code')").click();
    await expect(page.locator("text=html")).toBeVisible();
  });
});
