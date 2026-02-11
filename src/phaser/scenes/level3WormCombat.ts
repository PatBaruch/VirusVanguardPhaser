import {
  resolvePlayerEnemyCollisionMatrix,
} from './enemyCollisionMatrix.js';

export interface Level3WormEnemySnapshot {
  enemyId: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  currentHealth: number;
  damage: number;
  scoreValue: number;
}

export interface Level3WormSpawnState {
  msUntilNextSpawn: number;
  nextEnemyNumericId: number;
}

export interface Level3WormSpawnSnapshot {
  canSpawn: boolean;
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
  score: number;
  random: () => number;
}

export interface Level3WormSpawnResult {
  nextState: Level3WormSpawnState;
  spawnedEnemies: Level3WormEnemySnapshot[];
}

export interface Level3WormDuplicationState {
  msUntilNextDuplication: number;
  nextEnemyNumericId: number;
}

export interface Level3WormDuplicationSnapshot {
  elapsedMs: number;
  enemies: readonly Level3WormEnemySnapshot[];
  score: number;
  random: () => number;
}

export interface Level3WormDuplicationResult {
  nextState: Level3WormDuplicationState;
  duplicatedEnemies: Level3WormEnemySnapshot[];
}

export interface Level3WormMotionSnapshot {
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
}

export interface PlayerCollisionSnapshot {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface Level3PlayerEnemyCollisionResult {
  remainingEnemies: Level3WormEnemySnapshot[];
  destroyedEnemyIds: string[];
  playerDamageDelta: number;
}

export const LEVEL3_WORM_SPAWN_INTERVAL_MS: number = 500;
export const LEVEL3_WORM_DUPLICATION_INTERVAL_MS: number = 2000;
export const LEVEL3_WORM_DAMAGE: number = 5;
export const LEVEL3_WORM_SCORE_VALUE: number = 10;
export const LEVEL3_WORM_HEALTH: number = 1;
export const LEVEL3_WORM_CLEAR_SCORE_THRESHOLD: number = 600;

const LEVEL3_WORM_HORIZONTAL_BASE_SPEED: number = 0.3;
const LEVEL3_WORM_HORIZONTAL_RANDOM_SCALE: number = 0.4;
const LEVEL3_WORM_VERTICAL_BASE_SPEED: number = 0.3;
const LEVEL3_WORM_VERTICAL_RANDOM_SCALE: number = 0.2;
const LEVEL3_WORM_BOUNCE_DAMPING: number = 0.8;

export function createInitialLevel3WormSpawnState(): Level3WormSpawnState {
  return {
    msUntilNextSpawn: LEVEL3_WORM_SPAWN_INTERVAL_MS,
    nextEnemyNumericId: 0,
  };
}

export function createInitialLevel3WormDuplicationState(): Level3WormDuplicationState {
  return {
    msUntilNextDuplication: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
    nextEnemyNumericId: 0,
  };
}

export function advanceLevel3WormSpawnState(
  previousState: Level3WormSpawnState,
  snapshot: Level3WormSpawnSnapshot,
): Level3WormSpawnResult {
  if (!snapshot.canSpawn || snapshot.score >= LEVEL3_WORM_CLEAR_SCORE_THRESHOLD) {
    return {
      nextState: previousState,
      spawnedEnemies: [],
    };
  }

  let msUntilNextSpawn: number = previousState.msUntilNextSpawn - snapshot.elapsedMs;
  let nextEnemyNumericId: number = previousState.nextEnemyNumericId;
  const spawnedEnemies: Level3WormEnemySnapshot[] = [];

  while (msUntilNextSpawn <= 0) {
    spawnedEnemies.push(createSpawnedWormSnapshot({
      canvasHeight: snapshot.canvasHeight,
      canvasWidth: snapshot.canvasWidth,
      enemyId: `level3-worm-${nextEnemyNumericId}`,
      random: snapshot.random,
    }));

    nextEnemyNumericId += 1;
    msUntilNextSpawn += LEVEL3_WORM_SPAWN_INTERVAL_MS;
  }

  return {
    nextState: {
      msUntilNextSpawn,
      nextEnemyNumericId,
    },
    spawnedEnemies,
  };
}

export function advanceLevel3WormDuplicationState(
  previousState: Level3WormDuplicationState,
  snapshot: Level3WormDuplicationSnapshot,
): Level3WormDuplicationResult {
  if (snapshot.score >= LEVEL3_WORM_CLEAR_SCORE_THRESHOLD) {
    return {
      nextState: {
        ...previousState,
        msUntilNextDuplication: Math.max(0, previousState.msUntilNextDuplication - snapshot.elapsedMs),
      },
      duplicatedEnemies: [],
    };
  }

  const msUntilNextDuplication: number = previousState.msUntilNextDuplication - snapshot.elapsedMs;
  if (msUntilNextDuplication > 0) {
    return {
      nextState: {
        ...previousState,
        msUntilNextDuplication,
      },
      duplicatedEnemies: [],
    };
  }

  if (snapshot.enemies.length === 0) {
    return {
      nextState: {
        ...previousState,
        msUntilNextDuplication: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
      },
      duplicatedEnemies: [],
    };
  }

  let nextEnemyNumericId: number = Math.max(
    previousState.nextEnemyNumericId,
    resolveNextEnemyNumericIdFromSnapshots(snapshot.enemies),
  );

  const duplicatedEnemies: Level3WormEnemySnapshot[] = snapshot.enemies.map((enemy: Level3WormEnemySnapshot) => {
    const duplicatedEnemy: Level3WormEnemySnapshot = {
      ...enemy,
      currentHealth: LEVEL3_WORM_HEALTH,
      enemyId: `level3-worm-${nextEnemyNumericId}`,
      velocityX: -((LEVEL3_WORM_HORIZONTAL_RANDOM_SCALE * snapshot.random()) + LEVEL3_WORM_HORIZONTAL_BASE_SPEED),
      velocityY: -((LEVEL3_WORM_VERTICAL_RANDOM_SCALE * snapshot.random()) + LEVEL3_WORM_VERTICAL_BASE_SPEED),
    };
    nextEnemyNumericId += 1;
    return duplicatedEnemy;
  });

  return {
    nextState: {
      msUntilNextDuplication: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
      nextEnemyNumericId,
    },
    duplicatedEnemies,
  };
}

export function advanceLevel3WormMotion(
  enemies: readonly Level3WormEnemySnapshot[],
  snapshot: Level3WormMotionSnapshot,
): Level3WormEnemySnapshot[] {
  const minX: number = snapshot.canvasWidth * 0.05;
  const maxX: number = snapshot.canvasWidth * 0.94;
  const minY: number = snapshot.canvasHeight * 0.1;
  const maxY: number = snapshot.canvasHeight * 0.92;

  return enemies.map((enemy: Level3WormEnemySnapshot) => {
    let centerX: number = enemy.centerX + (enemy.velocityX * snapshot.elapsedMs);
    let centerY: number = enemy.centerY + (enemy.velocityY * snapshot.elapsedMs);
    let velocityX: number = enemy.velocityX;
    let velocityY: number = enemy.velocityY;

    const halfWidth: number = enemy.width / 2;
    const halfHeight: number = enemy.height / 2;

    if (centerY - halfHeight < minY) {
      centerY = minY + halfHeight;
      velocityY = Math.abs(velocityY) * LEVEL3_WORM_BOUNCE_DAMPING;
    }

    if (centerY + halfHeight > maxY) {
      centerY = maxY - halfHeight;
      velocityY = -Math.abs(velocityY) * LEVEL3_WORM_BOUNCE_DAMPING;
    }

    if (centerX - halfWidth < minX) {
      centerX = minX + halfWidth;
      velocityX = Math.abs(velocityX) * LEVEL3_WORM_BOUNCE_DAMPING;
    }

    if (centerX + halfWidth > maxX) {
      centerX = maxX - halfWidth;
      velocityX = -Math.abs(velocityX) * LEVEL3_WORM_BOUNCE_DAMPING;
    }

    return {
      ...enemy,
      centerX,
      centerY,
      velocityX,
      velocityY,
    };
  });
}

export function resolveLevel3PlayerEnemyCollisions(snapshot: {
  player: PlayerCollisionSnapshot;
  enemies: readonly Level3WormEnemySnapshot[];
}): Level3PlayerEnemyCollisionResult {
  const matrixResult = resolvePlayerEnemyCollisionMatrix({
    enemies: snapshot.enemies.map((enemy: Level3WormEnemySnapshot) => ({
      centerX: enemy.centerX,
      centerY: enemy.centerY,
      damage: enemy.damage,
      enemyClass: 'worm',
      enemyId: enemy.enemyId,
      height: enemy.height,
      width: enemy.width,
    })),
    player: snapshot.player,
  });

  const remainingEnemyIds: Set<string> = new Set(
    matrixResult.remainingEnemies.map((enemy) => enemy.enemyId),
  );
  const remainingEnemies: Level3WormEnemySnapshot[] = snapshot.enemies.filter(
    (enemy: Level3WormEnemySnapshot) => remainingEnemyIds.has(enemy.enemyId),
  );

  return {
    destroyedEnemyIds: matrixResult.destroyedEnemyIds,
    playerDamageDelta: matrixResult.playerDamageDelta,
    remainingEnemies,
  };
}

function createSpawnedWormSnapshot(snapshot: {
  canvasWidth: number;
  canvasHeight: number;
  enemyId: string;
  random: () => number;
}): Level3WormEnemySnapshot {
  return {
    centerX: snapshot.canvasWidth * 0.45 + (snapshot.random() * snapshot.canvasWidth * 0.45),
    centerY: snapshot.random() * snapshot.canvasHeight * 0.86,
    currentHealth: LEVEL3_WORM_HEALTH,
    damage: LEVEL3_WORM_DAMAGE,
    enemyId: snapshot.enemyId,
    height: 0,
    scoreValue: LEVEL3_WORM_SCORE_VALUE,
    velocityX: -((LEVEL3_WORM_HORIZONTAL_RANDOM_SCALE * snapshot.random()) + LEVEL3_WORM_HORIZONTAL_BASE_SPEED),
    velocityY: -((LEVEL3_WORM_VERTICAL_RANDOM_SCALE * snapshot.random()) + LEVEL3_WORM_VERTICAL_BASE_SPEED),
    width: 0,
  };
}

function resolveNextEnemyNumericIdFromSnapshots(enemies: readonly Level3WormEnemySnapshot[]): number {
  let maxNumericId: number = -1;
  for (const enemy of enemies) {
    const match: RegExpMatchArray | null = enemy.enemyId.match(/^level3-worm-(\d+)$/);
    if (match !== null) {
      maxNumericId = Math.max(maxNumericId, Number.parseInt(match[1], 10));
    }
  }

  return maxNumericId + 1;
}
