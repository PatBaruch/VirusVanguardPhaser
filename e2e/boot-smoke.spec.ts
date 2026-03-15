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

async function readStartScreenPrompt(page: Page): Promise<string> {
  return page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => { startPromptText?: { text: string } };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return '';
    }

    return game.scene.getScene('GameScene').startPromptText?.text ?? '';
  });
}

test('boots default Phaser runtime without browser errors', async ({ page }) => {
  await expectBootWithoutBrowserErrors('/', page);
});

test('ignores runtime=legacy query and still boots Phaser without browser errors', async ({ page }) => {
  await expectBootWithoutBrowserErrors('/?runtime=legacy', page);
});

test('teaches WASD and Space controls on the start screen', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.body.className)).toBe('startScreen');

  const prompt = await readStartScreenPrompt(page);
  expect(prompt).toContain('WASD');
  expect(prompt).toContain('Space');
});
