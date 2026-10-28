import { test, expect } from '@playwright/test';

test('homepage loads with the right title', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/WeaveMeAlone/);
});
