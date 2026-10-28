import { test, expect } from '@playwright/test';

test('loading the example pattern shows the results panel', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('button', { name: 'Load Example Pattern' }).click();

  await expect(page.locator('#results')).toBeVisible();
});
