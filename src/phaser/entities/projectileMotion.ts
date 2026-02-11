export interface ProjectileMotionState {
  positionX: number;
  positionY: number;
  velocityX: number;
  velocityY: number;
}

export interface ProjectileWorldBounds {
  maxX: number;
  maxY: number;
  minX: number;
  minY: number;
}

export interface ProjectileWorldBoundsRatios {
  maxXRatio: number;
  maxYRatio: number;
  minXRatio: number;
  minYRatio: number;
}

export interface ProjectileWorldBoundsSnapshot extends ProjectileWorldBoundsRatios {
  canvasHeight: number;
  canvasWidth: number;
}

export function advanceProjectileMotion(
  motionState: ProjectileMotionState,
  elapsedMs: number,
): ProjectileMotionState {
  return {
    positionX: motionState.positionX + (motionState.velocityX * elapsedMs),
    positionY: motionState.positionY + (motionState.velocityY * elapsedMs),
    velocityX: motionState.velocityX,
    velocityY: motionState.velocityY,
  };
}

export function resolveProjectileWorldBounds(
  snapshot: ProjectileWorldBoundsSnapshot,
): ProjectileWorldBounds {
  return {
    maxX: snapshot.maxXRatio * snapshot.canvasWidth,
    maxY: snapshot.maxYRatio * snapshot.canvasHeight,
    minX: snapshot.minXRatio * snapshot.canvasWidth,
    minY: snapshot.minYRatio * snapshot.canvasHeight,
  };
}

export function isProjectileOutsideWorldBounds(
  motionState: ProjectileMotionState,
  worldBounds: ProjectileWorldBounds,
): boolean {
  return motionState.positionX < worldBounds.minX * 0.9
    || motionState.positionX > worldBounds.maxX * 1.05
    || motionState.positionY < worldBounds.minY * 0.9
    || motionState.positionY > worldBounds.maxY * 1.05;
}
