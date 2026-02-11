import { describe, expect, it } from 'vitest';
import { LEVEL_BOUNDS_PARITY } from '../config/parityConstants.js';
import {
  ProjectileMotionState,
  ProjectileWorldBounds,
  advanceProjectileMotion,
  isProjectileOutsideWorldBounds,
  resolveProjectileWorldBounds,
} from './projectileMotion.js';

function createProjectileMotionState(
  overrides: Partial<ProjectileMotionState> = {},
): ProjectileMotionState {
  return {
    positionX: 400,
    positionY: 300,
    velocityX: 2,
    velocityY: -1,
    ...overrides,
  };
}

describe('projectile motion parity', () => {
  it('advances projectile position using elapsed milliseconds and velocity', () => {
    const motionState = createProjectileMotionState();

    const updatedMotionState = advanceProjectileMotion(motionState, 16);

    expect(updatedMotionState).toEqual({
      positionX: 432,
      positionY: 284,
      velocityX: 2,
      velocityY: -1,
    });
  });

  it('resolves projectile world bounds from canvas dimensions and level parity ratios', () => {
    const combatBoundsParity = LEVEL_BOUNDS_PARITY[1];

    const worldBounds = resolveProjectileWorldBounds({
      canvasHeight: 1080,
      canvasWidth: 1920,
      maxXRatio: combatBoundsParity.maxXRatio,
      maxYRatio: combatBoundsParity.maxYRatio,
      minXRatio: combatBoundsParity.minXRatio,
      minYRatio: combatBoundsParity.minYRatio,
    });

    expect(worldBounds).toEqual({
      maxX: 1747.2,
      maxY: 928.8,
      minX: 96,
      minY: 108,
    });
  });

  it('keeps projectile active while it remains inside culling thresholds', () => {
    const worldBounds: ProjectileWorldBounds = {
      maxX: 1747.2,
      maxY: 928.8,
      minX: 96,
      minY: 108,
    };

    const isOutside = isProjectileOutsideWorldBounds(
      createProjectileMotionState({
        positionX: worldBounds.minX * 0.95,
        positionY: worldBounds.maxY,
      }),
      worldBounds,
    );

    expect(isOutside).toBe(false);
  });

  it('culls projectile after it exits min and max threshold margins', () => {
    const worldBounds: ProjectileWorldBounds = {
      maxX: 1747.2,
      maxY: 928.8,
      minX: 96,
      minY: 108,
    };

    expect(
      isProjectileOutsideWorldBounds(
        createProjectileMotionState({
          positionX: worldBounds.minX * 0.9 - 0.01,
        }),
        worldBounds,
      ),
    ).toBe(true);

    expect(
      isProjectileOutsideWorldBounds(
        createProjectileMotionState({
          positionX: worldBounds.maxX * 1.05 + 0.01,
        }),
        worldBounds,
      ),
    ).toBe(true);

    expect(
      isProjectileOutsideWorldBounds(
        createProjectileMotionState({
          positionY: worldBounds.minY * 0.9 - 0.01,
        }),
        worldBounds,
      ),
    ).toBe(true);

    expect(
      isProjectileOutsideWorldBounds(
        createProjectileMotionState({
          positionY: worldBounds.maxY * 1.05 + 0.01,
        }),
        worldBounds,
      ),
    ).toBe(true);
  });
});
