import { describe, expect, it } from 'vitest';
import {
  LEVEL3_WORM_CLEAR_SCORE_THRESHOLD,
  LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
  LEVEL3_WORM_SPAWN_INTERVAL_MS,
  advanceLevel3WormDuplicationState,
  advanceLevel3WormSpawnState,
  createInitialLevel3WormDuplicationState,
  createInitialLevel3WormSpawnState,
} from './level3WormCombat.js';

describe('level3 Worm combat parity', () => {
  it('spawns one Worm every 500ms while score is below clear threshold', () => {
    const randomValues: number[] = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6];
    let randomIndex: number = 0;
    const random = (): number => {
      const nextValue: number = randomValues[randomIndex] ?? 0;
      randomIndex += 1;
      return nextValue;
    };

    const initialState = createInitialLevel3WormSpawnState();
    const firstWave = advanceLevel3WormSpawnState(initialState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: LEVEL3_WORM_SPAWN_INTERVAL_MS,
      random,
      score: 590,
    });
    const secondWave = advanceLevel3WormSpawnState(firstWave.nextState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: LEVEL3_WORM_SPAWN_INTERVAL_MS,
      random,
      score: 590,
    });

    expect(firstWave.spawnedEnemies).toHaveLength(1);
    expect(secondWave.spawnedEnemies).toHaveLength(1);
    expect(firstWave.spawnedEnemies[0].enemyId).toBe('level3-worm-0');
    expect(secondWave.spawnedEnemies[0].enemyId).toBe('level3-worm-1');
  });

  it('stops spawning Worm enemies once clear threshold is met', () => {
    const result = advanceLevel3WormSpawnState(createInitialLevel3WormSpawnState(), {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 3000,
      random: () => 0.5,
      score: LEVEL3_WORM_CLEAR_SCORE_THRESHOLD,
    });

    expect(result.spawnedEnemies).toEqual([]);
  });

  it('duplicates each active Worm every 2000ms while score is below clear threshold', () => {
    const randomValues: number[] = [0.1, 0.2, 0.3, 0.4];
    let randomIndex: number = 0;
    const random = (): number => {
      const nextValue: number = randomValues[randomIndex] ?? 0;
      randomIndex += 1;
      return nextValue;
    };

    const result = advanceLevel3WormDuplicationState(createInitialLevel3WormDuplicationState(), {
      elapsedMs: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
      enemies: [
        {
          centerX: 200,
          centerY: 300,
          currentHealth: 1,
          damage: 5,
          enemyId: 'level3-worm-4',
          height: 20,
          scoreValue: 10,
          velocityX: -0.4,
          velocityY: -0.3,
          width: 20,
        },
      ],
      random,
      score: 590,
    });

    expect(result.duplicatedEnemies).toHaveLength(1);
    expect(result.duplicatedEnemies[0].enemyId).toBe('level3-worm-5');
    expect(result.duplicatedEnemies[0].centerX).toBe(200);
    expect(result.duplicatedEnemies[0].centerY).toBe(300);
    expect(result.nextState.msUntilNextDuplication).toBe(LEVEL3_WORM_DUPLICATION_INTERVAL_MS);
    expect(result.nextState.nextEnemyNumericId).toBe(6);
  });

  it('does not duplicate Worm enemies when clear threshold is met', () => {
    const result = advanceLevel3WormDuplicationState(createInitialLevel3WormDuplicationState(), {
      elapsedMs: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
      enemies: [
        {
          centerX: 200,
          centerY: 300,
          currentHealth: 1,
          damage: 5,
          enemyId: 'level3-worm-0',
          height: 20,
          scoreValue: 10,
          velocityX: -0.4,
          velocityY: -0.3,
          width: 20,
        },
      ],
      random: () => 0.5,
      score: LEVEL3_WORM_CLEAR_SCORE_THRESHOLD,
    });

    expect(result.duplicatedEnemies).toEqual([]);
  });
});
