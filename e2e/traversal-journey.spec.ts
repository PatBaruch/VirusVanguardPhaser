import { expect, test, type Page } from '@playwright/test';

interface TraversalSnapshot {
  activeLevelId: number;
  checkpoints: number[];
}

async function expectNoBrowserErrors(path: string, page: Page): Promise<void> {
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

  const traversalSnapshot: TraversalSnapshot = await page.evaluate(() => {
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
      [key: string]: unknown;
      activeCombatItemCount: number;
      activeLevelId: number;
      level0Phase: string;
      level1Phase: string;
      level2Phase: string;
      level3Phase: string;
      level4Phase: string;
      player: {
        displayHeight: number;
        displayWidth: number;
        x: number;
        y: number;
      } | null;
      scale: {
        height: number;
        width: number;
      };
      score: number;
    };

    if (scene.player === null) {
      throw new Error('Expected player prefab to be present');
    }

    const checkpoints: number[] = [];
    const setPlayerAtTransition = (entranceXRatio: number): void => {
      if (scene.player === null) {
        throw new Error('Expected player prefab to be present');
      }

      scene.player.x = (entranceXRatio * scene.scale.width) - (scene.player.displayWidth / 2) + 1;
      scene.player.y = (0.5 * scene.scale.height) - (scene.player.displayHeight / 2);
    };

    scene.level0Phase = 'walkable';
    scene.score = 0;
    scene.activeCombatItemCount = 0;
    setPlayerAtTransition(0.72);
    (scene.updateLevel0TransitionTrigger as () => void)();
    checkpoints.push(scene.activeLevelId);

    scene.level1Phase = 'walkable';
    scene.score = 200;
    scene.activeCombatItemCount = 0;
    setPlayerAtTransition(0.9);
    (scene.updateLevel1TransitionTrigger as () => void)();
    checkpoints.push(scene.activeLevelId);

    scene.level2Phase = 'walkable';
    scene.score = 400;
    scene.activeCombatItemCount = 0;
    setPlayerAtTransition(0.9);
    (scene.updateLevel2TransitionTrigger as () => void)();
    checkpoints.push(scene.activeLevelId);

    scene.level3Phase = 'walkable';
    scene.score = 600;
    scene.activeCombatItemCount = 0;
    setPlayerAtTransition(0.9);
    (scene.updateLevel3TransitionTrigger as () => void)();
    checkpoints.push(scene.activeLevelId);

    scene.level4Phase = 'walkable';
    scene.score = 1000;
    scene.activeCombatItemCount = 0;
    setPlayerAtTransition(0.9);
    (scene.updateLevel4TransitionTrigger as () => void)();
    checkpoints.push(scene.activeLevelId);

    return {
      activeLevelId: scene.activeLevelId,
      checkpoints,
    };
  });

  expect(traversalSnapshot.checkpoints).toEqual([1, 2, 3, 4, 5]);
  expect(traversalSnapshot.activeLevelId).toBe(5);
  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
}

test('traverses from Level0 start state to Level5 reachability checkpoints', async ({ page }) => {
  await expectNoBrowserErrors('/?e2e=1', page);
});
