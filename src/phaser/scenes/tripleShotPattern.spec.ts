import { describe, expect, it } from 'vitest';
import { LevelId } from '../config/parityConstants.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';
import { resolveTripleShotProjectileConfigs } from './tripleShotPattern.js';

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

describe('triple-shot pattern parity', () => {
  it('returns exactly three projectiles for each facing direction in Level4 and Level5', () => {
    const diagonalVelocity: number = 2 / Math.sqrt(2);
    const expectedConfigs: Record<PlayerFacingDirection, Array<{
      startX: number;
      startY: number;
      velocityX: number;
      velocityY: number;
    }>> = {
      E: [
        { startX: 330, startY: 190, velocityX: 2, velocityY: 1 },
        { startX: 330, startY: 190, velocityX: 2, velocityY: -1 },
        { startX: 320, startY: 180, velocityX: 2, velocityY: 0 },
      ],
      W: [
        { startX: 320, startY: 180, velocityX: -2, velocityY: 1 },
        { startX: 320, startY: 180, velocityX: -2, velocityY: -1 },
        { startX: 320, startY: 180, velocityX: -2, velocityY: 0 },
      ],
      N: [
        { startX: 320, startY: 180, velocityX: 1, velocityY: -2 },
        { startX: 320, startY: 180, velocityX: -1, velocityY: -2 },
        { startX: 320, startY: 180, velocityX: 0, velocityY: -2 },
      ],
      S: [
        { startX: 320, startY: 180, velocityX: 1, velocityY: 2 },
        { startX: 320, startY: 180, velocityX: -1, velocityY: 2 },
        { startX: 320, startY: 180, velocityX: 0, velocityY: 2 },
      ],
      NE: [
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: -diagonalVelocity },
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: -diagonalVelocity + 1 },
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: -diagonalVelocity - 1 },
      ],
      SE: [
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: diagonalVelocity },
        { startX: 320, startY: 180, velocityX: diagonalVelocity - 1, velocityY: diagonalVelocity },
        { startX: 320, startY: 180, velocityX: diagonalVelocity + 1, velocityY: diagonalVelocity },
      ],
      NW: [
        { startX: 320, startY: 180, velocityX: -diagonalVelocity, velocityY: -diagonalVelocity },
        { startX: 320, startY: 180, velocityX: -diagonalVelocity + 1, velocityY: -diagonalVelocity },
        { startX: 320, startY: 180, velocityX: -diagonalVelocity - 1, velocityY: -diagonalVelocity },
      ],
      SW: [
        { startX: 320, startY: 180, velocityX: -diagonalVelocity, velocityY: diagonalVelocity },
        { startX: 320, startY: 180, velocityX: -diagonalVelocity + 1, velocityY: diagonalVelocity },
        { startX: 320, startY: 180, velocityX: -diagonalVelocity - 1, velocityY: diagonalVelocity },
      ],
    };

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

    for (const levelId of [4, 5] as const) {
      for (const direction of directions) {
        const configs = resolveTripleShotProjectileConfigs(createLevelSnapshot(levelId, direction));
        expect(configs).toEqual(expectedConfigs[direction]);
      }
    }
  });

  it('returns no projectiles outside Level4 and Level5', () => {
    const nonTripleShotLevels: readonly LevelId[] = [0, 1, 2, 3];

    for (const levelId of nonTripleShotLevels) {
      const configs = resolveTripleShotProjectileConfigs(createLevelSnapshot(levelId, 'E'));
      expect(configs).toEqual([]);
    }
  });
});
