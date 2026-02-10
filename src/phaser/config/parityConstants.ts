export type LevelId = 0 | 1 | 2 | 3 | 4 | 5;

export interface MovementParityConstants {
  diagonalNormalizationFactor: number;
  playerMoveSpeedPerFrame: number;
}

export interface BoundsParityConstants {
  maxXRatio: number;
  maxYRatio: number;
  minXRatio: number;
  minYRatio: number;
  subtractHalfPlayerHeightAtMaxY: boolean;
  subtractHalfPlayerWidthAtMaxX: boolean;
}

export interface TransitionBoundsParityConstants {
  entranceXRatio: number;
  maxYRatio: number;
  minYRatio: number;
}

export const MOVEMENT_PARITY: MovementParityConstants = {
  diagonalNormalizationFactor: Math.SQRT1_2,
  playerMoveSpeedPerFrame: 6,
};

export const LEVEL_BOUNDS_PARITY: Record<LevelId, BoundsParityConstants> = {
  0: {
    maxXRatio: 0.73,
    maxYRatio: 0.7,
    minXRatio: 0.05,
    minYRatio: 0.22,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
  1: {
    maxXRatio: 0.91,
    maxYRatio: 0.86,
    minXRatio: 0.05,
    minYRatio: 0.1,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
  2: {
    maxXRatio: 0.91,
    maxYRatio: 0.86,
    minXRatio: 0.05,
    minYRatio: 0.1,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
  3: {
    maxXRatio: 0.91,
    maxYRatio: 0.86,
    minXRatio: 0.05,
    minYRatio: 0.1,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
  4: {
    maxXRatio: 0.91,
    maxYRatio: 0.86,
    minXRatio: 0.05,
    minYRatio: 0.1,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
  5: {
    maxXRatio: 0.91,
    maxYRatio: 0.86,
    minXRatio: 0.05,
    minYRatio: 0.1,
    subtractHalfPlayerHeightAtMaxY: true,
    subtractHalfPlayerWidthAtMaxX: true,
  },
};

export const LEVEL_TRANSITION_BOUNDS_PARITY: Record<LevelId, TransitionBoundsParityConstants> = {
  0: {
    entranceXRatio: 0.72,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
  1: {
    entranceXRatio: 0.9,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
  2: {
    entranceXRatio: 0.9,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
  3: {
    entranceXRatio: 0.9,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
  4: {
    entranceXRatio: 0.9,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
  5: {
    entranceXRatio: 0.89,
    maxYRatio: 0.59,
    minYRatio: 0.4,
  },
};

export const LEVEL_SCORE_THRESHOLDS_PARITY: Record<LevelId, number> = {
  0: 0,
  1: 200,
  2: 400,
  3: 600,
  4: 1000,
  5: 0,
};

export const LEVEL_ENEMY_SPAWN_INTERVAL_MS_PARITY: Partial<Record<LevelId, number>> = {
  1: 500,
  2: 1000,
  3: 500,
  4: 2000,
};

export const WORM_DUPLICATION_INTERVAL_MS_PARITY: Partial<Record<LevelId, number>> = {
  3: 2000,
  4: 3000,
};

export const RVIRUS_PLAYER_DRAIN_INTERVAL_MS_PARITY: number = 1500;

export const BOSS_MINION_SPAWN_INTERVAL_MS_PARITY: number = 3000;

export const SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY: number = 0.9999;
