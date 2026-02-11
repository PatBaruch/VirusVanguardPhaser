import { expect, test, type Page } from '@playwright/test';

interface CombatInteractionSnapshot {
  projectileCountAfterShoot: number;
  projectileCountBeforeShoot: number;
  scoreAfterProjectileHit: number;
  scoreBeforeProjectileHit: number;
  level1EnemyCountAfterHit: number;
  playerHealthAfterEnemyCollision: number;
  playerHealthBeforeEnemyCollision: number;
}

async function collectCombatInteractionSnapshot(path: string, page: Page): Promise<void> {
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

  const snapshot: CombatInteractionSnapshot = await page.evaluate(() => {
    interface FakeFEmailEnemy {
      destroyed: boolean;
      getEnemyId: () => string;
      destroy: () => void;
      toSnapshot: () => {
        centerX: number;
        centerY: number;
        currentHealth: number;
        damage: number;
        enemyId: string;
        height: number;
        scoreValue: number;
        velocityX: number;
        velocityY: number;
        width: number;
      };
    }

    const runtime = (window as Window & {
      __VV_E2E_RUNTIME__?: {
        getGameInstance: () => {
          scene: {
            getScene: (key: string) => unknown;
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
      activeFEmails: FakeFEmailEnemy[];
      activeLevelId: number;
      activeProjectiles: Array<{
        displayHeight: number;
        displayWidth: number;
        x: number;
        y: number;
      }>;
      events: {
        emit: (eventName: string, payload: { levelId: number }) => void;
      };
      level1Phase: string;
      player: {
        displayHeight: number;
        displayWidth: number;
        x: number;
        y: number;
      };
      playerHealth: number;
      resolveLevel1PlayerEnemyCollisions: () => void;
      resolveLevel1ProjectileHits: () => void;
      score: number;
    };

    if (scene.player === null || scene.player === undefined) {
      throw new Error('Expected player prefab to be present');
    }

    const createFakeFEmailEnemy = (
      enemyId: string,
      centerX: number,
      centerY: number,
      damage: number,
      scoreValue: number,
    ): FakeFEmailEnemy => {
      const enemy: FakeFEmailEnemy = {
        destroyed: false,
        destroy: () => {
          enemy.destroyed = true;
        },
        getEnemyId: () => enemyId,
        toSnapshot: () => ({
          centerX,
          centerY,
          currentHealth: 1,
          damage,
          enemyId,
          height: 48,
          scoreValue,
          velocityX: 0,
          velocityY: 0,
          width: 48,
        }),
      };
      return enemy;
    };

    scene.activeLevelId = 1;
    scene.level1Phase = 'walkable';
    scene.score = 0;
    scene.playerHealth = 100;
    scene.activeFEmails = [];

    const projectileCountBeforeShoot: number = scene.activeProjectiles.length;
    scene.events.emit('shoot-input', { levelId: 1 });
    const projectileCountAfterShoot: number = scene.activeProjectiles.length;

    if (projectileCountAfterShoot <= projectileCountBeforeShoot) {
      throw new Error('Expected shoot interaction to spawn at least one projectile');
    }

    const projectile = scene.activeProjectiles[projectileCountAfterShoot - 1];
    projectile.x = 300;
    projectile.y = 300;
    projectile.displayWidth = 24;
    projectile.displayHeight = 24;

    const projectileTargetEnemy = createFakeFEmailEnemy('e2e-level1-projectile-hit', 300, 300, 5, 10);
    scene.activeFEmails = [projectileTargetEnemy];

    const scoreBeforeProjectileHit: number = scene.score;
    scene.resolveLevel1ProjectileHits();
    const scoreAfterProjectileHit: number = scene.score;
    const level1EnemyCountAfterHit: number = scene.activeFEmails.length;

    const collisionEnemy = createFakeFEmailEnemy('e2e-level1-player-collision', 300, 300, 5, 10);
    scene.activeFEmails = [collisionEnemy];
    scene.player.x = 300 - (scene.player.displayWidth / 2);
    scene.player.y = 300 - (scene.player.displayHeight / 2);

    const playerHealthBeforeEnemyCollision: number = scene.playerHealth;
    scene.resolveLevel1PlayerEnemyCollisions();
    const playerHealthAfterEnemyCollision: number = scene.playerHealth;

    return {
      level1EnemyCountAfterHit,
      playerHealthAfterEnemyCollision,
      playerHealthBeforeEnemyCollision,
      projectileCountAfterShoot,
      projectileCountBeforeShoot,
      scoreAfterProjectileHit,
      scoreBeforeProjectileHit,
    };
  });

  expect(snapshot.projectileCountAfterShoot).toBeGreaterThan(snapshot.projectileCountBeforeShoot);
  expect(snapshot.level1EnemyCountAfterHit).toBe(0);
  expect(snapshot.scoreAfterProjectileHit).toBeGreaterThan(snapshot.scoreBeforeProjectileHit);
  expect(snapshot.playerHealthAfterEnemyCollision).toBeLessThan(snapshot.playerHealthBeforeEnemyCollision);
  expect(consoleErrors, `Unexpected console errors: ${consoleErrors.join('\n')}`).toHaveLength(0);
  expect(pageErrors, `Unexpected page errors: ${pageErrors.join('\n')}`).toHaveLength(0);
}

test('covers Level1 combat interactions for shooting, enemy damage, and score progression', async ({ page }) => {
  await collectCombatInteractionSnapshot('/?e2e=1', page);
});
