import { describe, expect, it } from 'vitest';
import { LevelId } from '../config/parityConstants.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';
import { resolveSingleShotProjectileConfigs } from './singleShotPattern.js';

function createLevelSnapshot(
  levelId: LevelId,
  facingDirection: PlayerFacingDirection,
): {
  levelId: LevelId;
  facingDirection: PlayerFacingDirection;
  playerCenterX: number;
  playerCenterY: number;
} {
  return {
    facingDirection,
    levelId,
    playerCenterX: 320,
    playerCenterY: 180,
  };
}

describe('single-shot pattern parity', () => {
  it('returns exactly one projectile for each facing direction in Level1 and Level2', () => {
    const directions: readonly PlayerFacingDirection[] = [
      'E',
      'W',
      'N',
      'S',
      'NE',
      'SE',
      'NW',
      'SW',
    ];

    const expectedVelocities: Record<PlayerFacingDirection, { velocityX: number; velocityY: number }> = {
      E: { velocityX: 2, velocityY: 0 },
      W: { velocityX: -2, velocityY: 0 },
      N: { velocityX: 0, velocityY: -2 },
      S: { velocityX: 0, velocityY: 2 },
      NE: { velocityX: 2 / Math.sqrt(2), velocityY: -2 / Math.sqrt(2) },
      SE: { velocityX: 2 / Math.sqrt(2), velocityY: 2 / Math.sqrt(2) },
      NW: { velocityX: -2 / Math.sqrt(2), velocityY: -2 / Math.sqrt(2) },
      SW: { velocityX: -2 / Math.sqrt(2), velocityY: 2 / Math.sqrt(2) },
    };

    for (const levelId of [1, 2] as const) {
      for (const direction of directions) {
        const configs = resolveSingleShotProjectileConfigs(createLevelSnapshot(levelId, direction));

        expect(configs).toHaveLength(1);
        expect(configs[0]).toMatchObject({
          startX: 320,
          startY: 180,
          velocityX: expectedVelocities[direction].velocityX,
          velocityY: expectedVelocities[direction].velocityY,
        });
      }
    }
  });

  it('returns no projectile for levels outside Level1 and Level2', () => {
    const nonSingleShotLevels: readonly LevelId[] = [0, 3, 4, 5];

    for (const levelId of nonSingleShotLevels) {
      const configs = resolveSingleShotProjectileConfigs(createLevelSnapshot(levelId, 'E'));
      expect(configs).toEqual([]);
    }
  });
});
