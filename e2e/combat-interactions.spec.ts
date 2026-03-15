import { expect, test, type Page } from '@playwright/test';
import { reachLevel1Walkable } from './helpers/gameplay.js';

test.setTimeout(120000);

async function readRuntimeHud(page: Page): Promise<{
  controls: string;
  exitState: string;
  health: number;
  lastCombatFeedback: string;
  level: number;
  score: number;
  status: string;
}> {
  return page.evaluate(() => ({
    controls: document.body.dataset.vvControlsHint ?? '',
    exitState: document.body.dataset.vvExitState ?? '',
    health: Number(document.body.dataset.vvHealth ?? '0'),
    lastCombatFeedback: document.body.dataset.vvLastCombatFeedback ?? '',
    level: Number(document.body.dataset.vvLevel ?? '-1'),
    score: Number(document.body.dataset.vvScore ?? '0'),
    status: document.body.dataset.vvStatusText ?? '',
  }));
}

async function readCombatSnapshot(page: Page): Promise<{
  activeDeathEffectCount: number;
  cameraShakeActive: boolean;
  enemyCount: number;
  firstEnemyTextureKey: string | null;
  firstEnemyY: number | null;
  playerY: number;
  projectileCount: number;
  redOverlayAlpha: number;
}> {
  return page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              activeDeathEffects?: unknown[];
              activeFEmails?: Array<{ y: number; texture: { key: string } }>;
              activeProjectiles?: unknown[];
              cameras?: { main?: { shakeEffect?: { isRunning: boolean } } };
              damageOverlay?: { alpha: number };
              player?: { y: number };
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return {
        activeDeathEffectCount: 0,
        cameraShakeActive: false,
        enemyCount: 0,
        firstEnemyTextureKey: null,
        firstEnemyY: null,
        playerY: 0,
        projectileCount: 0,
        redOverlayAlpha: 0,
      };
    }

    const scene = game.scene.getScene('GameScene');
    const enemies = scene.activeFEmails ?? [];
    const projectiles = scene.activeProjectiles ?? [];

    return {
      activeDeathEffectCount: scene.activeDeathEffects?.length ?? 0,
      cameraShakeActive: scene.cameras?.main?.shakeEffect?.isRunning ?? false,
      enemyCount: enemies.length,
      firstEnemyTextureKey: enemies.length > 0 ? enemies[0].texture.key : null,
      firstEnemyY: enemies.length > 0 ? enemies[0].y : null,
      playerY: scene.player?.y ?? 0,
      projectileCount: projectiles.length,
      redOverlayAlpha: scene.damageOverlay?.alpha ?? 0,
    };
  });
}

async function isLevel1Walkable(page: Page): Promise<boolean> {
  return page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => { level1Phase?: string };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return false;
    }

    return game.scene.getScene('GameScene').level1Phase === 'walkable';
  });
}

test('supports early-level combat with real input: shooting raises score and enemies can damage player', async ({ page }) => {
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

  await reachLevel1Walkable(page);
  await expect.poll(async () => isLevel1Walkable(page), { timeout: 15000 }).toBe(true);
  await page.click('#game');

  const initial = await readRuntimeHud(page);
  expect(initial.level).toBe(1);

  let sawScoreIncrease = false;
  let sawHealthDecrease = false;
  let sawDamageFlash = false;
  let sawDeathEffect = false;
  let latest = initial;

  let sawProjectileSpawn = false;
  let sawEnemyAnimation = false;
  let previousEnemyTextureKey: string | null = null;

  // Real gameplay loop: align with visible enemies, shoot, and absorb combat damage.
  await page.keyboard.down('Space');
  for (let index = 0; index < 320; index += 1) {
    const combatSnapshot = await readCombatSnapshot(page);
    if (combatSnapshot.projectileCount > 0) {
      sawProjectileSpawn = true;
    }

    if (
      combatSnapshot.firstEnemyTextureKey !== null
      && previousEnemyTextureKey !== null
      && combatSnapshot.firstEnemyTextureKey !== previousEnemyTextureKey
    ) {
      sawEnemyAnimation = true;
    }
    previousEnemyTextureKey = combatSnapshot.firstEnemyTextureKey;

    if (combatSnapshot.activeDeathEffectCount > 0) {
      sawDeathEffect = true;
    }

    if (combatSnapshot.redOverlayAlpha > 0 || combatSnapshot.cameraShakeActive) {
      sawDamageFlash = true;
    }

    if (combatSnapshot.firstEnemyY !== null) {
      if (combatSnapshot.playerY < combatSnapshot.firstEnemyY - 8) {
        await page.keyboard.down('s');
        await page.waitForTimeout(60);
        await page.keyboard.up('s');
      } else if (combatSnapshot.playerY > combatSnapshot.firstEnemyY + 8) {
        await page.keyboard.down('w');
        await page.waitForTimeout(60);
        await page.keyboard.up('w');
      }
    }

    if (index % 4 === 0) {
      await page.keyboard.down('d');
      await page.waitForTimeout(70);
      await page.keyboard.up('d');
    } else if (index % 4 === 1) {
      await page.keyboard.down('s');
      await page.waitForTimeout(70);
      await page.keyboard.up('s');
    } else if (index % 4 === 2) {
      await page.keyboard.down('a');
      await page.waitForTimeout(70);
      await page.keyboard.up('a');
    } else {
      await page.keyboard.down('w');
      await page.waitForTimeout(70);
      await page.keyboard.up('w');
    }

    await page.waitForTimeout(70);
    latest = await readRuntimeHud(page);
    if (latest.score > initial.score) {
      sawScoreIncrease = true;
    }

    if (latest.health < initial.health) {
      sawHealthDecrease = true;
    }

    if (sawScoreIncrease && sawHealthDecrease && sawDamageFlash && sawDeathEffect && sawEnemyAnimation) {
      break;
    }
  }
  await page.keyboard.up('Space');

  expect(sawProjectileSpawn).toBe(true);
  expect(sawScoreIncrease, `Expected score to increase from ${initial.score}, latest score was ${latest.score}`).toBe(true);
  expect(sawHealthDecrease, `Expected health to decrease from ${initial.health}, latest health was ${latest.health}`).toBe(true);
  expect(sawDamageFlash).toBe(true);
  expect(sawDeathEffect).toBe(true);
  expect(sawEnemyAnimation).toBe(true);

  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
});

test('supports sustained fire from held space input in Level1 combat', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();

  await reachLevel1Walkable(page);
  await expect.poll(async () => isLevel1Walkable(page), { timeout: 15000 }).toBe(true);
  await page.click('#game');

  let maxProjectileCount: number = 0;

  await page.keyboard.down('Space');
  for (let index = 0; index < 8; index += 1) {
    await page.waitForTimeout(120);
    const combatSnapshot = await readCombatSnapshot(page);
    maxProjectileCount = Math.max(maxProjectileCount, combatSnapshot.projectileCount);
  }
  await page.keyboard.up('Space');

  expect(maxProjectileCount).toBeGreaterThan(1);
});

test('surfaces hit confirmation separately from enemy death feedback', async ({ page }) => {
  await page.goto('/?e2e=1');
  await expect(page.locator('#game')).toBeVisible();

  const feedbackStates = await page.evaluate(() => {
    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => {
              activeCombatItemCount: number;
              activeLevelId: number;
              activeMrHacker: {
                applySnapshot: (snapshot: { currentHealth: number }) => void;
                toSnapshot: () => {
                  centerX: number;
                  centerY: number;
                  currentHealth: number;
                  enemyId: string;
                  height: number;
                  scoreValue: number;
                  width: number;
                };
                x: number;
                y: number;
              } | null;
              activeProjectiles: Array<{
                destroy: () => void;
                displayHeight: number;
                displayWidth: number;
                getDamage: () => number;
                name: string;
                x: number;
                y: number;
              }>;
              hasTriggeredVictory: boolean;
              level5MrHackerSpawnState: { hasSpawned: boolean };
              level5Phase: string;
              resolveLevel5MrHackerProjectileHits: () => void;
              score: number;
              syncGameplayHud: () => void;
              update: (time: number, delta: number) => void;
            };
          };
        } | null;
      };
    }).__VV_E2E_RUNTIME__;

    const game = runtime?.getGameInstance();
    if (game === null || game === undefined) {
      return [] as string[];
    }

    const scene = game.scene.getScene('GameScene');
    scene.activeLevelId = 5;
    scene.level5Phase = 'walkable';
    scene.score = 0;
    scene.activeCombatItemCount = 1;
    scene.hasTriggeredVictory = false;
    scene.level5MrHackerSpawnState = { hasSpawned: false };
    scene.update(0, 16);

    if (scene.activeMrHacker === null) {
      return [] as string[];
    }

    const bossSnapshot = scene.activeMrHacker.toSnapshot();
    scene.activeProjectiles = [{
      destroy: () => undefined,
      displayHeight: bossSnapshot.height,
      displayWidth: bossSnapshot.width,
      getDamage: () => 1,
      name: 'projectile-hit',
      x: bossSnapshot.centerX,
      y: bossSnapshot.centerY,
    }];
    scene.resolveLevel5MrHackerProjectileHits();
    scene.syncGameplayHud();
    const hitFeedback = document.body.dataset.vvLastCombatFeedback ?? '';

    scene.activeMrHacker?.applySnapshot({ ...bossSnapshot, currentHealth: 1 });
    scene.activeProjectiles = [{
      destroy: () => undefined,
      displayHeight: bossSnapshot.height,
      displayWidth: bossSnapshot.width,
      getDamage: () => 1,
      name: 'projectile-death',
      x: bossSnapshot.centerX,
      y: bossSnapshot.centerY,
    }];
    scene.resolveLevel5MrHackerProjectileHits();
    scene.syncGameplayHud();
    const deathFeedback = document.body.dataset.vvLastCombatFeedback ?? '';

    return [hitFeedback, deathFeedback];
  });

  expect(feedbackStates).toEqual(['enemyHit', 'enemyDeath']);
});

test('surfaces a recovering player state after taking combat damage', async ({ page }) => {
  await page.goto('/?e2e=1&e2ePlayerHealth=30');
  await expect(page.locator('#game')).toBeVisible();

  await reachLevel1Walkable(page);
  await expect.poll(async () => isLevel1Walkable(page), { timeout: 15000 }).toBe(true);
  await page.click('#game');

  const initial = await readRuntimeHud(page);
  let latest = initial;
  let sawRecoveringState = false;

  for (let index = 0; index < 400; index += 1) {
    if (index % 2 === 0) {
      await page.keyboard.down('d');
      await page.waitForTimeout(80);
      await page.keyboard.up('d');
    } else {
      await page.keyboard.down('w');
      await page.waitForTimeout(80);
      await page.keyboard.up('w');
    }

    await page.waitForTimeout(80);
    latest = await readRuntimeHud(page);
    if (latest.health < initial.health) {
      sawRecoveringState = (await page.evaluate(() => document.body.dataset.vvPlayerState)) === 'recovering';
      break;
    }
  }

  expect(latest.health).toBeLessThan(initial.health);
  expect(sawRecoveringState).toBe(true);

  await page.waitForTimeout(250);
  const midRecoverySnapshot = await readCombatSnapshot(page);
  expect(await page.evaluate(() => document.body.dataset.vvPlayerState)).toBe('recovering');
  expect(midRecoverySnapshot.redOverlayAlpha).toBeGreaterThan(0);

  await expect.poll(async () => page.evaluate(() => document.body.dataset.vvPlayerState), { timeout: 2000 }).toBe('active');
});

test('allows player death from enemy collisions and surfaces game-over state', async ({ page }) => {
  await page.goto('/?e2e=1&e2ePlayerHealth=30');
  await expect(page.locator('#game')).toBeVisible();

  await reachLevel1Walkable(page);
  await expect.poll(async () => isLevel1Walkable(page), { timeout: 15000 }).toBe(true);
  await page.click('#game');

  for (let index = 0; index < 400; index += 1) {
    if (index % 2 === 0) {
      await page.keyboard.down('d');
      await page.waitForTimeout(80);
      await page.keyboard.up('d');
    } else {
      await page.keyboard.down('w');
      await page.waitForTimeout(80);
      await page.keyboard.up('w');
    }

    await page.waitForTimeout(80);

    const playerState = await page.evaluate(() => document.body.dataset.vvPlayerState ?? 'active');
    if (playerState === 'gameOver') {
      break;
    }
  }

  await expect
    .poll(async () => page.evaluate(() => document.body.className), {
      message: 'Expected gameplay to eventually reach game-over state',
      timeout: 30000,
    })
    .toBe('gameOver');

  await expect.poll(async () => page.evaluate(() => document.body.dataset.vvPlayerState), { timeout: 5000 }).toBe('gameOver');
});
