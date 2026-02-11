import { LevelId } from '../config/parityConstants.js';
import { ProjectilePrefabConfig } from '../entities/ProjectilePrefab.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';

export interface DualShotPatternSnapshot {
  facingDirection: PlayerFacingDirection;
  levelId: LevelId;
  playerCenterX: number;
  playerCenterY: number;
}

const DUAL_SHOT_PROJECTILE_SPEED_PARITY: number = 2;

export function resolveDualShotProjectileConfigs(
  snapshot: DualShotPatternSnapshot,
): ProjectilePrefabConfig[] {
  if (snapshot.levelId !== 3) {
    return [];
  }

  const diagonalVelocity: number = DUAL_SHOT_PROJECTILE_SPEED_PARITY / Math.sqrt(2);

  if (snapshot.facingDirection === 'E') {
    return [
      {
        startX: snapshot.playerCenterX + 10,
        startY: snapshot.playerCenterY + 15,
        velocityX: DUAL_SHOT_PROJECTILE_SPEED_PARITY,
        velocityY: 0,
      },
      {
        startX: snapshot.playerCenterX + 10,
        startY: snapshot.playerCenterY - 15,
        velocityX: DUAL_SHOT_PROJECTILE_SPEED_PARITY,
        velocityY: 0,
      },
    ];
  }

  if (snapshot.facingDirection === 'W') {
    return [
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY + 15,
        velocityX: -DUAL_SHOT_PROJECTILE_SPEED_PARITY,
        velocityY: 0,
      },
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY - 15,
        velocityX: -DUAL_SHOT_PROJECTILE_SPEED_PARITY,
        velocityY: 0,
      },
    ];
  }

  if (snapshot.facingDirection === 'N') {
    return [
      {
        startX: snapshot.playerCenterX + 15,
        startY: snapshot.playerCenterY,
        velocityX: 0,
        velocityY: -DUAL_SHOT_PROJECTILE_SPEED_PARITY,
      },
      {
        startX: snapshot.playerCenterX - 15,
        startY: snapshot.playerCenterY,
        velocityX: 0,
        velocityY: -DUAL_SHOT_PROJECTILE_SPEED_PARITY,
      },
    ];
  }

  if (snapshot.facingDirection === 'S') {
    return [
      {
        startX: snapshot.playerCenterX + 15,
        startY: snapshot.playerCenterY,
        velocityX: 0,
        velocityY: DUAL_SHOT_PROJECTILE_SPEED_PARITY,
      },
      {
        startX: snapshot.playerCenterX - 15,
        startY: snapshot.playerCenterY,
        velocityX: 0,
        velocityY: DUAL_SHOT_PROJECTILE_SPEED_PARITY,
      },
    ];
  }

  if (snapshot.facingDirection === 'NE') {
    return [
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY,
        velocityX: diagonalVelocity,
        velocityY: -diagonalVelocity,
      },
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY - 30,
        velocityX: diagonalVelocity,
        velocityY: -diagonalVelocity,
      },
    ];
  }

  if (snapshot.facingDirection === 'SE') {
    return [
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY,
        velocityX: diagonalVelocity,
        velocityY: diagonalVelocity,
      },
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY - 30,
        velocityX: diagonalVelocity,
        velocityY: diagonalVelocity,
      },
    ];
  }

  if (snapshot.facingDirection === 'NW') {
    return [
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY,
        velocityX: -diagonalVelocity,
        velocityY: -diagonalVelocity,
      },
      {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY - 30,
        velocityX: -diagonalVelocity,
        velocityY: -diagonalVelocity,
      },
    ];
  }

  return [
    {
      startX: snapshot.playerCenterX,
      startY: snapshot.playerCenterY,
      velocityX: -diagonalVelocity,
      velocityY: diagonalVelocity,
    },
    {
      startX: snapshot.playerCenterX,
      startY: snapshot.playerCenterY - 30,
      velocityX: -diagonalVelocity,
      velocityY: diagonalVelocity,
    },
  ];
}
