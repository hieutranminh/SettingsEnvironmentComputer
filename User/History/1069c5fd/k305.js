// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link', async ({ page }) => {
  await page.goto('https://playwright.dev/');

  // Click the get started link.
  await page.getByRole('link', { name: 'Get started' }).click();

  // Expects page to have a heading with the name of Installation.
  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});

test('add product category', async ({ page }) => {
  // Navigate to product categories page
  await page.goto('/goods/product-categories');

  // Wait for the page to load and verify the page title
  await expect(page.getByRole('heading', { name: /Products Categories|제품 분류/i })).toBeVisible();

  // Get the initial count of categories (if any exist)
  const initialCategoryCount = await page.locator('.goods-table tbody tr').count();

  // Click the "Add Category" button
  await page.getByRole('button', { name: /Add Category|분류 등록/i }).click();

  // Wait for the modal to appear
  const modal = page.locator('#action-product-category-modal');
  await expect(modal).toBeVisible();

  // Verify modal title
  await expect(modal.getByRole('heading', { name: /Add Category|분류 등록/i })).toBeVisible();

  // Fill in the category name
  const categoryName = `Test Category ${Date.now()}`;
  const nameInput = modal.locator('input[type="text"]').first();
  await nameInput.fill(categoryName);

  // Verify the input value
  await expect(nameInput).toHaveValue(categoryName);

  // Click the Save button
  await page.getByRole('button', { name: /Save|저장/i }).click();

  // Wait for the modal to close
  await expect(modal).not.toBeVisible();

  // Wait for the page to reload/update (check if new category appears in table)
  // The page should reload after adding, so we wait for the table to update
  await page.waitForTimeout(1000);

  // Verify the category was added by checking if it appears in the table
  // Note: This assumes the category name appears in the table
  // Adjust selector based on actual table structure
  const categoryRow = page.locator(`text=${categoryName}`).first();
  await expect(categoryRow).toBeVisible({ timeout: 5000 });
});
