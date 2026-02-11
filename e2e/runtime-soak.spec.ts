import { expect, test, type Page } from '@playwright/test';

interface RuntimeSoakSnapshot {
  activeLevelId: number;
  playerX: number;
  playerY: number;
}

async function runRuntimeSoak(path: string, page: Page): Promise<void> {
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

  await page.waitForFunction(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              [key: string]: unknown;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return false;
    }

    const scene = game.scene.getScene('GameScene') as {
      player?: unknown;
    };
    return scene.player !== null && scene.player !== undefined;
  });

  await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              [key: string]: unknown;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    if (runtime === undefined) {
      throw new Error('Expected __VV_E2E_RUNTIME__ test hook to be present');
    }

    const game = runtime.getGameInstance();
    if (game === null) {
      throw new Error('Expected Phaser game instance to be available');
    }

    const scene = game.scene.getScene('GameScene') as {
      activeLevelId: number;
      level1Phase: string;
      syncActiveLevelVisualState: () => void;
    };

    scene.activeLevelId = 1;
    scene.level1Phase = 'walkable';
    scene.syncActiveLevelVisualState();
  });

  const inputSteps: Array<{ keysDown: string[]; keysUp: string[] }> = [
    { keysDown: ['w', 'd'], keysUp: [] },
    { keysDown: ['s'], keysUp: ['w'] },
    { keysDown: ['a'], keysUp: ['d'] },
    { keysDown: ['w'], keysUp: ['s'] },
  ];

  for (let index: number = 0; index < 120; index += 1) {
    const step = inputSteps[index % inputSteps.length];
    for (const key of step.keysDown) {
      await page.keyboard.down(key);
    }
    for (const key of step.keysUp) {
      await page.keyboard.up(key);
    }

    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
  }

  await page.keyboard.up('w');
  await page.keyboard.up('a');
  await page.keyboard.up('s');
  await page.keyboard.up('d');

  const snapshot: RuntimeSoakSnapshot = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              [key: string]: unknown;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    if (runtime === undefined) {
      throw new Error('Expected __VV_E2E_RUNTIME__ test hook to be present');
    }

    const game = runtime.getGameInstance();
    if (game === null) {
      throw new Error('Expected Phaser game instance to be available');
    }

    const scene = game.scene.getScene('GameScene') as {
      activeLevelId: number;
      player: {
        x: number;
        y: number;
      } | null;
    };

    if (scene.player === null) {
      throw new Error('Expected player prefab to be present after runtime soak');
    }

    return {
      activeLevelId: scene.activeLevelId,
      playerX: scene.player.x,
      playerY: scene.player.y,
    };
  });

  expect(snapshot.activeLevelId).toBe(1);
  expect(Number.isFinite(snapshot.playerX)).toBe(true);
  expect(Number.isFinite(snapshot.playerY)).toBe(true);
  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
}

test('runs a sustained runtime soak without console or page errors', async ({ page }) => {
  await runRuntimeSoak('/?e2e=1', page);
});
