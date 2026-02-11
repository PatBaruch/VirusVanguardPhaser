import { describe, expect, it } from 'vitest';
import {
  LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD,
  LEVEL4_TROJAN_DAMAGE,
  LEVEL4_TROJAN_SPAWN_INTERVAL_MS,
  advanceLevel4TrojanMotion,
  advanceLevel4TrojanSpawnState,
  createInitialLevel4TrojanSpawnState,
  resolveLevel4TrojanBreaches,
  resolveLevel4TrojanProjectileHits,
} from './level4TrojanCombat.js';

describe('level4 Trojan combat parity', () => {
  it('spawns one Trojan every 2000ms while score is below clear threshold', () => {
    const randomValues: number[] = [0.2, 0.9, 0.4, 0.8];
    let randomIndex: number = 0;
    const random = (): number => {
      const nextValue: number = randomValues[randomIndex] ?? 0;
      randomIndex += 1;
      return nextValue;
    };

    const initialState = createInitialLevel4TrojanSpawnState();
    const firstWave = advanceLevel4TrojanSpawnState(initialState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: LEVEL4_TROJAN_SPAWN_INTERVAL_MS,
      random,
      score: 990,
    });
    const secondWave = advanceLevel4TrojanSpawnState(firstWave.nextState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: LEVEL4_TROJAN_SPAWN_INTERVAL_MS,
      random,
      score: 990,
    });

    expect(firstWave.spawnedEnemies).toHaveLength(1);
    expect(secondWave.spawnedEnemies).toHaveLength(1);
    expect(firstWave.spawnedEnemies[0].enemyId).toBe('level4-trojan-0');
    expect(firstWave.spawnedEnemies[0].centerX).toBeCloseTo(1780);
    expect(firstWave.spawnedEnemies[0].centerY).toBeCloseTo(252);
    expect(firstWave.spawnedEnemies[0].velocityX).toBeCloseTo(-0.2);
    expect(secondWave.spawnedEnemies[0].enemyId).toBe('level4-trojan-1');
  });

  it('stops spawning Trojan enemies once clear threshold is met', () => {
    const result = advanceLevel4TrojanSpawnState(createInitialLevel4TrojanSpawnState(), {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 3000,
      random: () => 0.5,
      score: LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD,
    });

    expect(result.spawnedEnemies).toEqual([]);
  });

  it('moves Trojans horizontally to the left each update', () => {
    const movedEnemies = advanceLevel4TrojanMotion(
      [{
        centerX: 1780,
        centerY: 200,
        currentHealth: 1,
        damage: 5,
        enemyId: 'level4-trojan-0',
        height: 20,
        scoreValue: 10,
        velocityX: -0.2,
        velocityY: 0,
        width: 20,
      }],
      {
        elapsedMs: 100,
      },
    );

    expect(movedEnemies[0].centerX).toBeCloseTo(1760);
    expect(movedEnemies[0].centerY).toBeCloseTo(200);
  });

  it('applies breach damage and split spawns when Trojans cross the left boundary', () => {
    const result = resolveLevel4TrojanBreaches({
      enemies: [{
        centerX: 45,
        centerY: 300,
        currentHealth: 1,
        damage: LEVEL4_TROJAN_DAMAGE,
        enemyId: 'level4-trojan-0',
        height: 20,
        scoreValue: 10,
        velocityX: -0.2,
        velocityY: 0,
        width: 20,
      }],
      minX: 50,
    });

    expect(result.breachedEnemyIds).toEqual(['level4-trojan-0']);
    expect(result.remainingEnemies).toEqual([]);
    expect(result.playerDamageDelta).toBe(LEVEL4_TROJAN_DAMAGE);
    expect(result.splitSpawns).toHaveLength(1);
    expect(result.splitSpawns[0].impactX).toBe(45);
    expect(result.splitSpawns[0].impactY).toBe(300);
  });

  it('splits Trojan into FEmail, RVirus, and Worm when hit by a projectile', () => {
    const result = resolveLevel4TrojanProjectileHits({
      projectiles: [{
        centerX: 300,
        centerY: 400,
        damage: 1,
        height: 10,
        projectileId: 'projectile-0',
        width: 10,
      }],
      trojans: [{
        centerX: 300,
        centerY: 400,
        currentHealth: 1,
        damage: LEVEL4_TROJAN_DAMAGE,
        enemyId: 'level4-trojan-0',
        height: 20,
        scoreValue: 10,
        velocityX: -0.2,
        velocityY: 0,
        width: 20,
      }],
    });

    expect(result.destroyedProjectileIds).toEqual(['projectile-0']);
    expect(result.destroyedTrojanIds).toEqual(['level4-trojan-0']);
    expect(result.splitSpawns).toHaveLength(1);
    expect(result.splitSpawns[0].impactX).toBe(300);
    expect(result.splitSpawns[0].impactY).toBe(400);
    expect(result.scoreDelta).toBe(10);
  });
});
