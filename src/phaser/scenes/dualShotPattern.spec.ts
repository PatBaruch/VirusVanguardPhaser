import { describe, expect, it } from 'vitest';
import { LevelId } from '../config/parityConstants.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';
import { resolveDualShotProjectileConfigs } from './dualShotPattern.js';

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

describe('dual-shot pattern parity', () => {
  it('returns exactly two projectiles for each facing direction in Level3', () => {
    const diagonalVelocity: number = 2 / Math.sqrt(2);
    const expectedConfigs: Record<PlayerFacingDirection, Array<{
      startX: number;
      startY: number;
      velocityX: number;
      velocityY: number;
    }>> = {
      E: [
        { startX: 330, startY: 195, velocityX: 2, velocityY: 0 },
        { startX: 330, startY: 165, velocityX: 2, velocityY: 0 },
      ],
      W: [
        { startX: 320, startY: 195, velocityX: -2, velocityY: 0 },
        { startX: 320, startY: 165, velocityX: -2, velocityY: 0 },
      ],
      N: [
        { startX: 335, startY: 180, velocityX: 0, velocityY: -2 },
        { startX: 305, startY: 180, velocityX: 0, velocityY: -2 },
      ],
      S: [
        { startX: 335, startY: 180, velocityX: 0, velocityY: 2 },
        { startX: 305, startY: 180, velocityX: 0, velocityY: 2 },
      ],
      NE: [
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: -diagonalVelocity },
        { startX: 320, startY: 150, velocityX: diagonalVelocity, velocityY: -diagonalVelocity },
      ],
      SE: [
        { startX: 320, startY: 180, velocityX: diagonalVelocity, velocityY: diagonalVelocity },
        { startX: 320, startY: 150, velocityX: diagonalVelocity, velocityY: diagonalVelocity },
      ],
      NW: [
        { startX: 320, startY: 180, velocityX: -diagonalVelocity, velocityY: -diagonalVelocity },
        { startX: 320, startY: 150, velocityX: -diagonalVelocity, velocityY: -diagonalVelocity },
      ],
      SW: [
        { startX: 320, startY: 180, velocityX: -diagonalVelocity, velocityY: diagonalVelocity },
        { startX: 320, startY: 150, velocityX: -diagonalVelocity, velocityY: diagonalVelocity },
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

    for (const direction of directions) {
      const configs = resolveDualShotProjectileConfigs(createLevelSnapshot(3, direction));
      expect(configs).toEqual(expectedConfigs[direction]);
    }
  });

  it('returns no projectiles outside Level3', () => {
    const nonDualShotLevels: readonly LevelId[] = [0, 1, 2, 4, 5];

    for (const levelId of nonDualShotLevels) {
      const configs = resolveDualShotProjectileConfigs(createLevelSnapshot(levelId, 'E'));
      expect(configs).toEqual([]);
    }
  });
});
