import { describe, expect, it } from 'vitest';
import {
  LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD,
  LEVEL2_RVIRUS_DAMAGE,
  LEVEL2_RVIRUS_HEALTH,
  LEVEL2_RVIRUS_INFECTION_LANE_TICK_DAMAGE,
  LEVEL2_RVIRUS_STUCK_HEALTH,
  advanceLevel2RVirusSpawnState,
  createInitialLevel2RVirusAttachmentState,
  createInitialLevel2RVirusInfectionPressureState,
  createInitialLevel2RVirusSpawnState,
  resolveLevel2InfectionPressure,
  resolveLevel2RVirusAttachment,
} from './level2RVirusCombat.js';

describe('level2 RVirus combat parity', () => {
  it('spawns one RVirus every 1000ms while score is below clear threshold', () => {
    const randomValues: number[] = [0.1, 0.2, 0.8, 0.9, 0.3, 0.7, 0.4, 0.6];
    let randomIndex: number = 0;
    const random = (): number => {
      const nextValue: number = randomValues[randomIndex] ?? 0;
      randomIndex += 1;
      return nextValue;
    };

    const initialState = createInitialLevel2RVirusSpawnState();
    const firstWave = advanceLevel2RVirusSpawnState(initialState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 1000,
      random,
      score: 390,
    });
    const secondWave = advanceLevel2RVirusSpawnState(firstWave.nextState, {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 1000,
      random,
      score: 390,
    });

    expect(firstWave.spawnedEnemies).toHaveLength(1);
    expect(secondWave.spawnedEnemies).toHaveLength(1);
    expect(firstWave.spawnedEnemies[0].enemyId).toBe('level2-rvirus-0');
    expect(secondWave.spawnedEnemies[0].enemyId).toBe('level2-rvirus-1');
    expect(firstWave.spawnedEnemies[0].currentHealth).toBe(1);
    expect(LEVEL2_RVIRUS_HEALTH).toBe(1);
  });

  it('stops spawning RVirus enemies once clear threshold is met', () => {
    const result = advanceLevel2RVirusSpawnState(createInitialLevel2RVirusSpawnState(), {
      canSpawn: true,
      canvasHeight: 1000,
      canvasWidth: 2000,
      elapsedMs: 3000,
      random: () => 0.5,
      score: LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD,
    });

    expect(result.spawnedEnemies).toEqual([]);
  });

  it('sticks RVirus to player on overlap and boosts stuck health model', () => {
    const result = resolveLevel2RVirusAttachment(
      {
        msUntilNextDrain: 1500,
        stuckEnemyId: null,
      },
      {
        elapsedMs: 16,
        enemies: [
          {
            centerX: 50,
            centerY: 50,
            currentHealth: 5,
            damage: 5,
            enemyId: 'rvirus-0',
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
      },
    );

    expect(result.nextState.stuckEnemyId).toBe('rvirus-0');
    expect(result.nextState.msUntilNextDrain).toBe(1500);
    expect(result.playerDamageDelta).toBe(0);
    expect(result.nextEnemies[0].currentHealth).toBe(LEVEL2_RVIRUS_STUCK_HEALTH);
  });

  it('applies periodic damage while stuck and keeps enemy attached to player', () => {
    const result = resolveLevel2RVirusAttachment(
      createInitialLevel2RVirusAttachmentState('rvirus-0'),
      {
        elapsedMs: 1600,
        enemies: [
          {
            centerX: 10,
            centerY: 20,
            currentHealth: LEVEL2_RVIRUS_STUCK_HEALTH,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-0',
            height: 20,
            scoreValue: 10,
            velocityX: 1,
            velocityY: 1,
            width: 20,
          },
        ],
        player: {
          centerX: 200,
          centerY: 300,
          height: 20,
          width: 20,
        },
      },
    );

    expect(result.playerDamageDelta).toBe(LEVEL2_RVIRUS_DAMAGE);
    expect(result.nextState.stuckEnemyId).toBe('rvirus-0');
    expect(result.nextState.msUntilNextDrain).toBe(1400);
    expect(result.nextEnemies[0].centerX).toBe(200);
    expect(result.nextEnemies[0].centerY).toBe(300);
  });

  it('damages the player and removes extra overlapping RVirus while one remains stuck', () => {
    const result = resolveLevel2RVirusAttachment(
      createInitialLevel2RVirusAttachmentState('rvirus-stuck'),
      {
        elapsedMs: 16,
        enemies: [
          {
            centerX: 120,
            centerY: 160,
            currentHealth: LEVEL2_RVIRUS_STUCK_HEALTH,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-stuck',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
          {
            centerX: 120,
            centerY: 160,
            currentHealth: 5,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-extra',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
        ],
        player: {
          centerX: 120,
          centerY: 160,
          height: 20,
          width: 20,
        },
      },
    );

    expect(result.nextState.stuckEnemyId).toBe('rvirus-stuck');
    expect(result.playerDamageDelta).toBe(LEVEL2_RVIRUS_DAMAGE);
    expect(result.nextEnemies.map((enemy) => enemy.enemyId)).toEqual(['rvirus-stuck']);
  });

  it('sticks one RVirus and removes other overlapping RViruses on the first collision frame', () => {
    const result = resolveLevel2RVirusAttachment(
      createInitialLevel2RVirusAttachmentState(),
      {
        elapsedMs: 16,
        enemies: [
          {
            centerX: 120,
            centerY: 160,
            currentHealth: 5,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-stuck',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
          {
            centerX: 120,
            centerY: 160,
            currentHealth: 5,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-extra',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
        ],
        player: {
          centerX: 120,
          centerY: 160,
          height: 20,
          width: 20,
        },
      },
    );

    expect(result.nextState.stuckEnemyId).toBe('rvirus-stuck');
    expect(result.playerDamageDelta).toBe(LEVEL2_RVIRUS_DAMAGE);
    expect(result.nextEnemies.map((enemy) => enemy.enemyId)).toEqual(['rvirus-stuck']);
    expect(result.nextEnemies[0].currentHealth).toBe(LEVEL2_RVIRUS_STUCK_HEALTH);
  });

  it('creates one infection lane from an active free RVirus and marks the player as pressured inside it', () => {
    const result = resolveLevel2InfectionPressure(
      createInitialLevel2RVirusInfectionPressureState(),
      {
        canvasWidth: 1000,
        elapsedMs: 500,
        enemies: [
          {
            centerX: 420,
            centerY: 160,
            currentHealth: 1,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-lane',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
        ],
        player: {
          centerX: 430,
          centerY: 200,
          height: 20,
          width: 20,
        },
        stuckEnemyId: null,
      },
    );

    expect(result.hazardZones).toHaveLength(1);
    expect(result.playerPressureState).toBe('infectedZone');
    expect(result.playerDamageDelta).toBe(0);
  });

  it('applies infection-lane damage on its tick while the player stays inside the active lane', () => {
    const result = resolveLevel2InfectionPressure(
      {
        msUntilNextTick: 200,
      },
      {
        canvasWidth: 1000,
        elapsedMs: 300,
        enemies: [
          {
            centerX: 420,
            centerY: 160,
            currentHealth: 1,
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: 'rvirus-lane',
            height: 20,
            scoreValue: 10,
            velocityX: 0,
            velocityY: 0,
            width: 20,
          },
        ],
        player: {
          centerX: 430,
          centerY: 200,
          height: 20,
          width: 20,
        },
        stuckEnemyId: null,
      },
    );

    expect(result.playerPressureState).toBe('infectedZone');
    expect(result.playerDamageDelta).toBe(LEVEL2_RVIRUS_INFECTION_LANE_TICK_DAMAGE);
    expect(result.nextState.msUntilNextTick).toBeGreaterThan(0);
  });
});
