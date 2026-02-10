import { expect, test } from '@playwright/test';

test('boots Phaser runtime without browser errors', async ({ page }) => {
  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  await page.goto('/?runtime=phaser');
  await expect(page.locator('#game')).toBeVisible();
  await page.waitForTimeout(200);

  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
});
