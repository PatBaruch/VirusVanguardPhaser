import { LevelId } from '../config/parityConstants.js';
import { ProjectilePrefabConfig } from '../entities/ProjectilePrefab.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';

export interface SingleShotPatternSnapshot {
  facingDirection: PlayerFacingDirection;
  levelId: LevelId;
  playerCenterX: number;
  playerCenterY: number;
}

const SINGLE_SHOT_PROJECTILE_SPEED_PARITY: number = 2;

export function resolveSingleShotProjectileConfigs(
  snapshot: SingleShotPatternSnapshot,
): ProjectilePrefabConfig[] {
  if (snapshot.levelId !== 1 && snapshot.levelId !== 2) {
    return [];
  }

  const diagonalVelocity: number = SINGLE_SHOT_PROJECTILE_SPEED_PARITY / Math.sqrt(2);
  const projectileStart = {
    startX: snapshot.playerCenterX,
    startY: snapshot.playerCenterY,
  };

  if (snapshot.facingDirection === 'E') {
    return [{ ...projectileStart, velocityX: SINGLE_SHOT_PROJECTILE_SPEED_PARITY, velocityY: 0 }];
  }

  if (snapshot.facingDirection === 'W') {
    return [{ ...projectileStart, velocityX: -SINGLE_SHOT_PROJECTILE_SPEED_PARITY, velocityY: 0 }];
  }

  if (snapshot.facingDirection === 'N') {
    return [{ ...projectileStart, velocityX: 0, velocityY: -SINGLE_SHOT_PROJECTILE_SPEED_PARITY }];
  }

  if (snapshot.facingDirection === 'S') {
    return [{ ...projectileStart, velocityX: 0, velocityY: SINGLE_SHOT_PROJECTILE_SPEED_PARITY }];
  }

  if (snapshot.facingDirection === 'NE') {
    return [{ ...projectileStart, velocityX: diagonalVelocity, velocityY: -diagonalVelocity }];
  }

  if (snapshot.facingDirection === 'SE') {
    return [{ ...projectileStart, velocityX: diagonalVelocity, velocityY: diagonalVelocity }];
  }

  if (snapshot.facingDirection === 'NW') {
    return [{ ...projectileStart, velocityX: -diagonalVelocity, velocityY: -diagonalVelocity }];
  }

  return [{ ...projectileStart, velocityX: -diagonalVelocity, velocityY: diagonalVelocity }];
}
