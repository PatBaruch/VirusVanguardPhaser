import { describe, expect, it } from 'vitest';
import {
  BOSS_MINION_SPAWN_INTERVAL_MS_PARITY,
  LEVEL_BOUNDS_PARITY,
  LEVEL_ENEMY_SPAWN_INTERVAL_MS_PARITY,
  LEVEL_SCORE_THRESHOLDS_PARITY,
  MOVEMENT_PARITY,
  RVIRUS_PLAYER_DRAIN_INTERVAL_MS_PARITY,
  SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY,
  WORM_DUPLICATION_INTERVAL_MS_PARITY,
} from './parityConstants.js';

describe('parity constants', () => {
  it('matches movement parity constants', () => {
    expect(MOVEMENT_PARITY.diagonalNormalizationFactor).toBe(Math.SQRT1_2);
    expect(MOVEMENT_PARITY.playerMoveSpeedPerFrame).toBe(6);
  });

  it('keeps legacy score thresholds per level', () => {
    expect(LEVEL_SCORE_THRESHOLDS_PARITY).toEqual({
      0: 0,
      1: 200,
      2: 400,
      3: 600,
      4: 1000,
      5: 0,
    });
  });

  it('defines expected level bounds envelope values', () => {
    expect(LEVEL_BOUNDS_PARITY[0]).toEqual({
      maxXRatio: 0.73,
      maxYRatio: 0.7,
      minXRatio: 0.05,
      minYRatio: 0.22,
      subtractHalfPlayerHeightAtMaxY: true,
      subtractHalfPlayerWidthAtMaxX: true,
    });

    expect(LEVEL_BOUNDS_PARITY[1]).toEqual({
      maxXRatio: 0.91,
      maxYRatio: 0.86,
      minXRatio: 0.05,
      minYRatio: 0.1,
      subtractHalfPlayerHeightAtMaxY: true,
      subtractHalfPlayerWidthAtMaxX: true,
    });
  });

  it('matches spawn and timer parity constants', () => {
    expect(LEVEL_ENEMY_SPAWN_INTERVAL_MS_PARITY).toEqual({
      1: 500,
      2: 1000,
      3: 500,
      4: 2000,
    });
    expect(WORM_DUPLICATION_INTERVAL_MS_PARITY).toEqual({
      3: 2000,
      4: 3000,
    });
    expect(RVIRUS_PLAYER_DRAIN_INTERVAL_MS_PARITY).toBe(1500);
    expect(BOSS_MINION_SPAWN_INTERVAL_MS_PARITY).toBe(3000);
    expect(SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY).toBe(0.9999);
  });
});
