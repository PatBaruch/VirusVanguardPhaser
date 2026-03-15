import { expect, test, type Page } from '@playwright/test';
import { reachLevel1Walkable } from './helpers/gameplay.js';

async function readLevel1EntrySnapshot(page: Page): Promise<{
  backgroundImage: string;
  backgroundRepeat: string;
  canvasHeight: number;
  canvasWidth: number;
  playerFacingDirection: string;
  playerX: number;
  playerY: number;
}> {
  return page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              player?: {
                x: number;
                y: number;
                getFacingDirection?: () => string;
              };
              scale: { height: number; width: number };
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return {
        backgroundImage: '',
        backgroundRepeat: '',
        canvasHeight: 0,
        canvasWidth: 0,
        playerFacingDirection: '',
        playerX: 0,
        playerY: 0,
      };
    }

    const scene = game.scene.getScene('GameScene');
    return {
      backgroundImage: getComputedStyle(document.body).backgroundImage,
      backgroundRepeat: getComputedStyle(document.body).backgroundRepeat,
      canvasHeight: scene.scale.height,
      canvasWidth: scene.scale.width,
      playerFacingDirection: scene.player?.getFacingDirection?.() ?? '',
      playerX: scene.player?.x ?? 0,
      playerY: scene.player?.y ?? 0,
    };
  });
}

test('traverses from start screen into Level1 using gameplay input only', async ({ page }) => {
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

  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();

  await expect
    .poll(async () => page.evaluate(() => document.body.className))
    .toBe('startScreen');

  await reachLevel1Walkable(page);

  const level1Entry = await readLevel1EntrySnapshot(page);
  expect(level1Entry.backgroundImage).toContain('BG_LevelArena.png');
  expect(level1Entry.backgroundRepeat).toBe('no-repeat');
  expect(level1Entry.playerFacingDirection).toBe('E');
  expect(level1Entry.playerX).toBeLessThan(level1Entry.canvasWidth * 0.25);
  expect(level1Entry.playerY).toBeLessThan(level1Entry.canvasHeight * 0.6);
  expect(level1Entry.playerY).toBeGreaterThan(level1Entry.canvasHeight * 0.3);

  const activeLevel = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => { activeLevelId: number };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return -1;
    }

    return game.scene.getScene('GameScene').activeLevelId;
  });

  expect(activeLevel).toBe(1);
  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
});

test('switches Level5 arena backdrop to lit state once combat is cleared', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.body.className)).toBe('startScreen');

  const bodyClass = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              activeCombatItemCount: number;
              activeFEmails: unknown[];
              activeLevelId: number;
              level5MrHackerSpawnState: { hasSpawned: boolean };
              activeRViruses: unknown[];
              activeWorms: unknown[];
              activeMrHacker: null;
              hasTriggeredVictory: boolean;
              level5Phase: string;
              score: number;
              update: (time: number, delta: number) => void;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return '';
    }

    const scene = game.scene.getScene('GameScene');
    scene.activeLevelId = 5;
    scene.level5Phase = 'walkable';
    scene.score = 1010;
    scene.activeCombatItemCount = 0;
    scene.activeMrHacker = null;
    scene.level5MrHackerSpawnState = { hasSpawned: true };
    scene.activeFEmails = [];
    scene.activeRViruses = [];
    scene.activeWorms = [];
    scene.hasTriggeredVictory = false;
    scene.update(0, 16);

    return document.body.className;
  });

  expect(bodyClass).toBe('goNextLevel');
});

test('switches early combat levels to the lit arena backdrop when the level is complete', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.body.className)).toBe('startScreen');

  const bodyState = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              activeCombatItemCount: number;
              activeLevelId: number;
              level1Phase: string;
              score: number;
              update: (time: number, delta: number) => void;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return {
        backgroundImage: '',
        bodyClass: '',
      };
    }

    const scene = game.scene.getScene('GameScene');
    scene.activeLevelId = 1;
    scene.level1Phase = 'walkable';
    scene.score = 200;
    scene.activeCombatItemCount = 0;
    scene.update(0, 16);

    return {
      backgroundImage: getComputedStyle(document.body).backgroundImage,
      bodyClass: document.body.className,
    };
  });

  expect(bodyState.bodyClass).toBe('goNextLevel');
  expect(bodyState.backgroundImage).toContain('BG_LevelArena_lit.png');
});

test('surfaces an explicit exit-open runtime state when Level1 is cleared', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();
  await expect.poll(async () => page.evaluate(() => document.body.className)).toBe('startScreen');

  const exitState = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              activeCombatItemCount: number;
              activeLevelId: number;
              level1Phase: string;
              score: number;
              update: (time: number, delta: number) => void;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return '';
    }

    const scene = game.scene.getScene('GameScene');
    scene.activeLevelId = 1;
    scene.level1Phase = 'walkable';
    scene.score = 200;
    scene.activeCombatItemCount = 0;
    scene.update(0, 16);

    return document.body.dataset.vvExitState ?? '';
  });

  expect(exitState).toBe('open');
});
