import { LEVEL_BOUNDS_PARITY, LEVEL_TRANSITION_BOUNDS_PARITY } from '../config/parityConstants.js';
import { PlayerFacingDirection } from '../entities/playerFacingState.js';

export interface Level5TraversalSnapshot {
  canvasHeight: number;
  canvasWidth: number;
  playerHeight: number;
  playerWidth: number;
  playerX: number;
  playerY: number;
}

function resolveLevel5Bounds(snapshot: Level5TraversalSnapshot): {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
} {
  const boundsParity = LEVEL_BOUNDS_PARITY[5];
  const maxXOffset = boundsParity.subtractHalfPlayerWidthAtMaxX ? snapshot.playerWidth / 2 : 0;
  const maxYOffset = boundsParity.subtractHalfPlayerHeightAtMaxY ? snapshot.playerHeight / 2 : 0;

  return {
    maxX: (boundsParity.maxXRatio * snapshot.canvasWidth) - maxXOffset,
    maxY: (boundsParity.maxYRatio * snapshot.canvasHeight) - maxYOffset,
    minX: boundsParity.minXRatio * snapshot.canvasWidth,
    minY: boundsParity.minYRatio * snapshot.canvasHeight,
  };
}

export function canMoveWithinLevel5Bounds(
  snapshot: Level5TraversalSnapshot,
  facingDirection: PlayerFacingDirection,
): boolean {
  const levelBounds = resolveLevel5Bounds(snapshot);

  switch (facingDirection) {
    case 'NE':
      return snapshot.playerY > levelBounds.minY && snapshot.playerX < levelBounds.maxX;
    case 'SE':
      return snapshot.playerY < levelBounds.maxY && snapshot.playerX < levelBounds.maxX;
    case 'NW':
      return snapshot.playerY > levelBounds.minY && snapshot.playerX > levelBounds.minX;
    case 'SW':
      return snapshot.playerY < levelBounds.maxY && snapshot.playerX > levelBounds.minX;
    case 'N':
      return snapshot.playerY > levelBounds.minY;
    case 'W':
      return snapshot.playerX > levelBounds.minX;
    case 'S':
      return snapshot.playerY < levelBounds.maxY;
    case 'E':
      return snapshot.playerX < levelBounds.maxX;
    default:
      return false;
  }
}

export function isLevel5VictoryTriggered(snapshot: Level5TraversalSnapshot): boolean {
  const transitionParity = LEVEL_TRANSITION_BOUNDS_PARITY[5];
  const halfPlayerHeight = snapshot.playerHeight / 2;
  const halfPlayerWidth = snapshot.playerWidth / 2;

  return snapshot.playerX > (transitionParity.entranceXRatio * snapshot.canvasWidth) - halfPlayerWidth
    && snapshot.playerY < (transitionParity.maxYRatio * snapshot.canvasHeight) - halfPlayerHeight
    && snapshot.playerY > (transitionParity.minYRatio * snapshot.canvasHeight) - halfPlayerHeight;
}
