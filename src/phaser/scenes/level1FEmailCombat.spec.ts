import { describe, expect, it } from 'vitest';
import {
  FEMAIL_SCORE_VALUE,
  advanceLevel1FEmailMotion,
  advanceLevel1FEmailSpawnState,
  createInitialLevel1FEmailSpawnState,
  resolveLevel1PlayerEnemyCollisions,
} from './level1FEmailCombat.js';

describe('level1 FEmail combat parity', () => {
  it('spawns one FEmail every 500ms while score is below clear threshold', () => {
    const randomValues: number[] = [0.1, 0.2, 0.8, 0.2, 0.3, 0.4, 0.3, 0.9];
    let randomIndex: number = 0;
    const random = (): number => {
      const nextValue: number = randomValues[randomIndex] ?? 0;
      randomIndex += 1;
      return nextValue;
    };

    const initialState = createInitialLevel1FEmailSpawnState();
    const firstWave = advanceLevel1FEmailSpawnState(initialState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 500,
      random,
      score: 190,
    });
    const secondWave = advanceLevel1FEmailSpawnState(firstWave.nextState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 500,
      random,
      score: 190,
    });

    expect(firstWave.spawnedEnemies).toHaveLength(1);
    expect(secondWave.spawnedEnemies).toHaveLength(1);
    expect(firstWave.spawnedEnemies[0].scoreValue).toBe(FEMAIL_SCORE_VALUE);
    expect(firstWave.spawnedEnemies[0].enemyId).toBe('level1-femail-0');
    expect(secondWave.spawnedEnemies[0].enemyId).toBe('level1-femail-1');
  });

  it('stops spawning FEmail enemies once score clear threshold is met', () => {
    const result = advanceLevel1FEmailSpawnState(createInitialLevel1FEmailSpawnState(), {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 2000,
      random: () => 0.5,
      score: 200,
    });

    expect(result.spawnedEnemies).toEqual([]);
  });

  it('bounces FEmail movement off level bounds', () => {
    const nextEnemies = advanceLevel1FEmailMotion(
      [
        {
          centerX: 13,
          centerY: 20,
          currentHealth: 1,
          damage: 5,
          enemyId: 'enemy-1',
          height: 20,
          scoreValue: 10,
          velocityX: -1,
          velocityY: -1,
          width: 20,
        },
      ],
      {
        canvasHeight: 200,
        canvasWidth: 200,
        elapsedMs: 5,
      },
    );

    expect(nextEnemies[0].centerX).toBe(20);
    expect(nextEnemies[0].centerY).toBe(30);
    expect(nextEnemies[0].velocityX).toBe(1);
    expect(nextEnemies[0].velocityY).toBe(1);
  });

  it('removes enemy on player collision and applies damage', () => {
    const collisionResult = resolveLevel1PlayerEnemyCollisions({
      enemies: [
        {
          centerX: 50,
          centerY: 50,
          currentHealth: 1,
          damage: 5,
          enemyId: 'enemy-1',
          height: 20,
          scoreValue: 10,
          velocityX: 0,
          velocityY: 0,
          width: 20,
        },
      ],
      player: {
        centerX: 50,
        centerY: 50,
        height: 20,
        width: 20,
      },
    });

    expect(collisionResult.playerDamageDelta).toBe(5);
    expect(collisionResult.destroyedEnemyIds).toEqual(['enemy-1']);
    expect(collisionResult.remainingEnemies).toEqual([]);
  });
});
