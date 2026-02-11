import { expect, test, type Page } from '@playwright/test';

async function expectBootWithoutBrowserErrors(path: string, page: Page): Promise<void> {
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

  await page.goto(path);
  await expect(page.locator('#game')).toBeVisible();
  await page.waitForTimeout(200);

  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
}

test('boots default Phaser runtime without browser errors', async ({ page }) => {
  await expectBootWithoutBrowserErrors('/', page);
});

test('ignores runtime=legacy query and still boots Phaser without browser errors', async ({ page }) => {
  await expectBootWithoutBrowserErrors('/?runtime=legacy', page);
});
