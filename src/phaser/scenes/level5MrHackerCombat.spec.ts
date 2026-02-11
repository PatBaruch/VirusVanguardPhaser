import { describe, expect, it } from 'vitest';
import {
  LEVEL5_MRHACKER_BULLET_DAMAGE,
  LEVEL5_MRHACKER_DAMAGE,
  LEVEL5_MRHACKER_HEALTH,
  LEVEL5_MRHACKER_SCORE_VALUE,
  advanceLevel5MrHackerSpawnState,
  advanceLevel5MrHackerBulletState,
  createInitialLevel5MrHackerSpawnState,
  resolveLevel5EnemyBulletPlayerCollisions,
  resolveLevel5MrHackerHealthBarTextureKey,
} from './level5MrHackerCombat.js';

describe('level5 MrHacker combat parity', () => {
  it('spawns MrHacker exactly once with legacy HP model values', () => {
    const initialState = createInitialLevel5MrHackerSpawnState();
    const firstSpawn = advanceLevel5MrHackerSpawnState(initialState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
    });
    const secondSpawn = advanceLevel5MrHackerSpawnState(firstSpawn.nextState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
    });

    expect(firstSpawn.spawnedEnemies).toHaveLength(1);
    expect(firstSpawn.spawnedEnemies[0].enemyId).toBe('level5-mrhacker-0');
    expect(firstSpawn.spawnedEnemies[0].centerX).toBeCloseTo(1400);
    expect(firstSpawn.spawnedEnemies[0].centerY).toBeCloseTo(430);
    expect(firstSpawn.spawnedEnemies[0].currentHealth).toBe(LEVEL5_MRHACKER_HEALTH);
    expect(firstSpawn.spawnedEnemies[0].damage).toBe(LEVEL5_MRHACKER_DAMAGE);
    expect(firstSpawn.spawnedEnemies[0].scoreValue).toBe(LEVEL5_MRHACKER_SCORE_VALUE);

    expect(secondSpawn.spawnedEnemies).toEqual([]);
  });

  it('maps boss HP directly to legacy health bar frame keys', () => {
    expect(resolveLevel5MrHackerHealthBarTextureKey(25)).toBe('bossbar-25');
    expect(resolveLevel5MrHackerHealthBarTextureKey(10)).toBe('bossbar-10');
    expect(resolveLevel5MrHackerHealthBarTextureKey(0)).toBe('bossbar-00');
  });

  it('clamps health bar frame key at the legacy bounds', () => {
    expect(resolveLevel5MrHackerHealthBarTextureKey(99)).toBe('bossbar-25');
    expect(resolveLevel5MrHackerHealthBarTextureKey(-4)).toBe('bossbar-00');
  });

  it('fires a three-bullet volley toward the dominant player axis when cooldown elapses', () => {
    const fireResult = advanceLevel5MrHackerBulletState(
      {
        msUntilNextShot: 0,
        nextBulletNumericId: 0,
      },
      {
        bossCenterX: 100,
        bossCenterY: 100,
        canFire: true,
        elapsedMs: 16,
        playerCenterX: 200,
        playerCenterY: 100,
        random: () => 0,
      },
    );

    expect(fireResult.spawnedBullets).toHaveLength(3);
    expect(fireResult.spawnedBullets[0].bulletId).toBe('level5-mrhacker-bullet-0');
    expect(fireResult.spawnedBullets[1].bulletId).toBe('level5-mrhacker-bullet-1');
    expect(fireResult.spawnedBullets[2].bulletId).toBe('level5-mrhacker-bullet-2');
    expect(fireResult.spawnedBullets[0].velocityX).toBeCloseTo(0.984807753, 6);
    expect(fireResult.spawnedBullets[0].velocityY).toBe(0);
    expect(fireResult.spawnedBullets[1].velocityX).toBeCloseTo(0.984807753, 6);
    expect(fireResult.spawnedBullets[1].velocityY).toBeCloseTo(0.173648178, 6);
    expect(fireResult.spawnedBullets[2].velocityX).toBeCloseTo(0.984807753, 6);
    expect(fireResult.spawnedBullets[2].velocityY).toBeCloseTo(-0.173648178, 6);
    expect(fireResult.spawnedBullets[0].damage).toBe(LEVEL5_MRHACKER_BULLET_DAMAGE);
    expect(fireResult.nextState.nextBulletNumericId).toBe(3);
    expect(fireResult.nextState.msUntilNextShot).toBe(100);
  });

  it('counts down boss firing cooldown without spawning bullets before timer reaches zero', () => {
    const result = advanceLevel5MrHackerBulletState(
      {
        msUntilNextShot: 300,
        nextBulletNumericId: 0,
      },
      {
        bossCenterX: 100,
        bossCenterY: 100,
        canFire: true,
        elapsedMs: 100,
        playerCenterX: 200,
        playerCenterY: 100,
        random: () => 0,
      },
    );

    expect(result.spawnedBullets).toEqual([]);
    expect(result.nextState.msUntilNextShot).toBe(200);
    expect(result.nextState.nextBulletNumericId).toBe(0);
  });

  it('applies player damage and destroys enemy bullets that overlap the player', () => {
    const collisionResult = resolveLevel5EnemyBulletPlayerCollisions({
      bullets: [
        {
          bulletId: 'level5-mrhacker-bullet-0',
          centerX: 100,
          centerY: 100,
          damage: LEVEL5_MRHACKER_BULLET_DAMAGE,
          height: 10,
          velocityX: 1,
          velocityY: 0,
          width: 10,
        },
        {
          bulletId: 'level5-mrhacker-bullet-1',
          centerX: 400,
          centerY: 400,
          damage: LEVEL5_MRHACKER_BULLET_DAMAGE,
          height: 10,
          velocityX: 1,
          velocityY: 0,
          width: 10,
        },
      ],
      player: {
        centerX: 100,
        centerY: 100,
        height: 20,
        width: 20,
      },
    });

    expect(collisionResult.destroyedBulletIds).toEqual(['level5-mrhacker-bullet-0']);
    expect(collisionResult.playerDamageDelta).toBe(LEVEL5_MRHACKER_BULLET_DAMAGE);
    expect(collisionResult.remainingBullets).toHaveLength(1);
    expect(collisionResult.remainingBullets[0].bulletId).toBe('level5-mrhacker-bullet-1');
  });
});
