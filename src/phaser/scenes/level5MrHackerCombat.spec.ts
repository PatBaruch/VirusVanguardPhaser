import { describe, expect, it } from 'vitest';
import {
  LEVEL5_MRHACKER_DAMAGE,
  LEVEL5_MRHACKER_HEALTH,
  LEVEL5_MRHACKER_SCORE_VALUE,
  advanceLevel5MrHackerSpawnState,
  createInitialLevel5MrHackerSpawnState,
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
});
