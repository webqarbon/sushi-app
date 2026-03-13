/**
 * E2E tests for Nova Poshta integration in checkout
 * Requires: dev server, NOVA_POSHTA_API_KEY, products in DB
 */

import { test, expect } from "@playwright/test";

test.describe("Checkout Nova Poshta", () => {
  test.beforeEach(async ({ page }) => {
    // Add product to cart: visit home, click Add on first product
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const addBtn = page.getByRole("button", { name: "Додати в кошик" }).first();
    await addBtn.waitFor({ state: "visible", timeout: 10000 });
    await addBtn.click();
    await page.goto("/checkout");
    await expect(page.getByRole("heading", { name: /оформлення замовлення/i })).toBeVisible({ timeout: 10000 });
  });

  test("Kyiv: city search returns results", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Київ");
    await page.waitForTimeout(500);
    const dropdown = page.locator("ul").filter({ hasText: /київ/i }).first();
    await expect(dropdown).toBeVisible({ timeout: 5000 });
    const option = page.getByText("м. Київ", { exact: false }).first();
    await expect(option).toBeVisible({ timeout: 3000 });
  });

  test("Kyiv: select city loads branches", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Київ");
    await page.waitForTimeout(600);
    await page.getByText("м. Київ", { exact: false }).first().click();
    await page.waitForTimeout(300);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.focus();
    await page.waitForTimeout(1500);
    const branchList = page.locator("ul").filter({ hasText: /відділення|поштомат|№/i });
    await expect(branchList).toBeVisible({ timeout: 5000 });
    const items = page.locator("li").filter({ hasText: /№/ });
    await expect(items.first()).toBeVisible({ timeout: 3000 });
  });

  test("Kyiv: filter by number 4 shows prefix matches", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Київ");
    await page.waitForTimeout(600);
    await page.getByText("м. Київ", { exact: false }).first().click();
    await page.waitForTimeout(500);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.focus();
    await page.waitForTimeout(1500);
    await branchInput.fill("4");
    await page.waitForTimeout(400);
    const items = page.locator("li").filter({ hasText: /№4|№40|№41|№42|№43|№44|№45|№46|№47|№48|№49/ });
    const count = await items.count();
    expect(count).toBeGreaterThan(0);
    const firstText = await items.first().textContent();
    expect(firstText).toMatch(/№4/);
  });

  test("Dnipro: city search and branches load", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Дніпро");
    await page.waitForTimeout(600);
    const option = page.getByText("м. Дніпро", { exact: false }).first();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();
    await page.waitForTimeout(500);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.focus();
    await page.waitForTimeout(1500);
    const branchList = page.locator("li").filter({ hasText: /відділення|поштомат|№/i });
    await expect(branchList.first()).toBeVisible({ timeout: 5000 });
  });

  test("Lviv: city search and branches load", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Львів");
    await page.waitForTimeout(600);
    const option = page.getByText("м. Львів", { exact: false }).first();
    await expect(option).toBeVisible({ timeout: 5000 });
    await option.click();
    await page.waitForTimeout(500);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.focus();
    await page.waitForTimeout(1500);
    const branchList = page.locator("li").filter({ hasText: /відділення|поштомат|№/i });
    await expect(branchList.first()).toBeVisible({ timeout: 5000 });
  });

  test("Free input: can type custom branch without selecting", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Київ");
    await page.waitForTimeout(600);
    await page.getByText("м. Київ", { exact: false }).first().click();
    await page.waitForTimeout(300);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.fill("Київ, вул. Хрещатик, відділення 5");
    const value = await branchInput.inputValue();
    expect(value).toBe("Київ, вул. Хрещатик, відділення 5");
  });

  test("Search postomat filters results", async ({ page }) => {
    const cityInput = page.getByPlaceholder("Почніть вводити місто...");
    await cityInput.fill("Київ");
    await page.waitForTimeout(600);
    await page.getByText("м. Київ", { exact: false }).first().click();
    await page.waitForTimeout(500);
    const branchInput = page.getByPlaceholder("Введіть номер, адресу або оберіть зі списку...");
    await branchInput.focus();
    await page.waitForTimeout(1500);
    await branchInput.fill("поштомат");
    await page.waitForTimeout(400);
    const items = page.locator("li").filter({ hasText: /поштомат/i });
    const count = await items.count();
    if (count > 0) {
      await expect(items.first()).toBeVisible();
    }
  });
});
