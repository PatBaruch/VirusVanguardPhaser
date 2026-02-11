export interface Level2RVirusEnemySnapshot {
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

export interface Level2RVirusSpawnState {
  msUntilNextSpawn: number;
  nextEnemyNumericId: number;
}

export interface Level2RVirusSpawnSnapshot {
  canSpawn: boolean;
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
  score: number;
  random: () => number;
}

export interface Level2RVirusSpawnResult {
  nextState: Level2RVirusSpawnState;
  spawnedEnemies: Level2RVirusEnemySnapshot[];
}

export interface Level2RVirusMotionSnapshot {
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
  stuckEnemyId: string | null;
}

export interface PlayerCollisionSnapshot {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface Level2RVirusAttachmentState {
  stuckEnemyId: string | null;
  msUntilNextDrain: number;
}

export interface Level2RVirusAttachmentResult {
  nextState: Level2RVirusAttachmentState;
  nextEnemies: Level2RVirusEnemySnapshot[];
  playerDamageDelta: number;
}

export const LEVEL2_RVIRUS_SPAWN_INTERVAL_MS: number = 1000;
export const LEVEL2_RVIRUS_DAMAGE: number = 5;
export const LEVEL2_RVIRUS_SCORE_VALUE: number = 10;
export const LEVEL2_RVIRUS_HEALTH: number = 5;
export const LEVEL2_RVIRUS_STUCK_HEALTH: number = 10;
export const LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS: number = 1500;
export const LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD: number = 400;
export const LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS: number = 1 / 2;
export const LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS: number = 0.3 / 2;

export function createInitialLevel2RVirusSpawnState(): Level2RVirusSpawnState {
  return {
    msUntilNextSpawn: LEVEL2_RVIRUS_SPAWN_INTERVAL_MS,
    nextEnemyNumericId: 0,
  };
}

export function createInitialLevel2RVirusAttachmentState(
  stuckEnemyId: string | null = null,
): Level2RVirusAttachmentState {
  return {
    msUntilNextDrain: LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS,
    stuckEnemyId,
  };
}

export function advanceLevel2RVirusSpawnState(
  previousState: Level2RVirusSpawnState,
  snapshot: Level2RVirusSpawnSnapshot,
): Level2RVirusSpawnResult {
  if (!snapshot.canSpawn || snapshot.score >= LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD) {
    return {
      nextState: previousState,
      spawnedEnemies: [],
    };
  }

  let msUntilNextSpawn: number = previousState.msUntilNextSpawn - snapshot.elapsedMs;
  let nextEnemyNumericId: number = previousState.nextEnemyNumericId;
  const spawnedEnemies: Level2RVirusEnemySnapshot[] = [];

  while (msUntilNextSpawn <= 0) {
    spawnedEnemies.push({
      centerX: snapshot.random() * snapshot.canvasWidth * 0.9,
      centerY: snapshot.random() * snapshot.canvasHeight * 0.86,
      currentHealth: LEVEL2_RVIRUS_HEALTH,
      damage: LEVEL2_RVIRUS_DAMAGE,
      enemyId: `level2-rvirus-${nextEnemyNumericId}`,
      height: 0,
      scoreValue: LEVEL2_RVIRUS_SCORE_VALUE,
      velocityX: snapshot.random() > 0.5
        ? -LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS
        : LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS,
      velocityY: snapshot.random() > 0.5
        ? -LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS
        : LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS,
      width: 0,
    });

    nextEnemyNumericId += 1;
    msUntilNextSpawn += LEVEL2_RVIRUS_SPAWN_INTERVAL_MS;
  }

  return {
    nextState: {
      msUntilNextSpawn,
      nextEnemyNumericId,
    },
    spawnedEnemies,
  };
}

export function advanceLevel2RVirusMotion(
  enemies: readonly Level2RVirusEnemySnapshot[],
  snapshot: Level2RVirusMotionSnapshot,
): Level2RVirusEnemySnapshot[] {
  const minX: number = snapshot.canvasWidth * 0.05;
  const maxX: number = snapshot.canvasWidth * 0.94;
  const minY: number = snapshot.canvasHeight * 0.1;
  const maxY: number = snapshot.canvasHeight * 0.92;

  return enemies.map((enemy: Level2RVirusEnemySnapshot) => {
    if (snapshot.stuckEnemyId !== null && enemy.enemyId === snapshot.stuckEnemyId) {
      return enemy;
    }

    let centerX: number = enemy.centerX + (enemy.velocityX * snapshot.elapsedMs);
    let centerY: number = enemy.centerY + (enemy.velocityY * snapshot.elapsedMs);
    let velocityX: number = enemy.velocityX;
    let velocityY: number = enemy.velocityY;

    const halfWidth: number = enemy.width / 2;
    const halfHeight: number = enemy.height / 2;

    if (centerY - halfHeight < minY) {
      centerY = minY + halfHeight;
      velocityY *= -1;
    }

    if (centerY + halfHeight > maxY) {
      centerY = maxY - halfHeight;
      velocityY *= -1;
    }

    if (centerX - halfWidth < minX) {
      centerX = minX + halfWidth;
      velocityX *= -1;
    }

    if (centerX + halfWidth > maxX) {
      centerX = maxX - halfWidth;
      velocityX *= -1;
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

export function resolveLevel2RVirusAttachment(
  previousState: Level2RVirusAttachmentState,
  snapshot: {
    player: PlayerCollisionSnapshot;
    enemies: readonly Level2RVirusEnemySnapshot[];
    elapsedMs: number;
  },
): Level2RVirusAttachmentResult {
  const nextEnemies: Level2RVirusEnemySnapshot[] = snapshot.enemies.map(
    (enemy: Level2RVirusEnemySnapshot) => ({ ...enemy }),
  );

  if (previousState.stuckEnemyId !== null) {
    const stuckEnemy = nextEnemies.find(
      (enemy: Level2RVirusEnemySnapshot) => enemy.enemyId === previousState.stuckEnemyId,
    );
    if (stuckEnemy !== undefined) {
      let msUntilNextDrain: number = previousState.msUntilNextDrain - snapshot.elapsedMs;
      let playerDamageDelta: number = 0;
      while (msUntilNextDrain <= 0) {
        playerDamageDelta += LEVEL2_RVIRUS_DAMAGE;
        msUntilNextDrain += LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS;
      }

      stuckEnemy.centerX = snapshot.player.centerX;
      stuckEnemy.centerY = snapshot.player.centerY;
      stuckEnemy.velocityX = 0;
      stuckEnemy.velocityY = 0;

      return {
        nextEnemies,
        nextState: {
          msUntilNextDrain,
          stuckEnemyId: stuckEnemy.enemyId,
        },
        playerDamageDelta,
      };
    }
  }

  const overlappingEnemy = nextEnemies.find((enemy: Level2RVirusEnemySnapshot) => isOverlap(snapshot.player, enemy));
  if (overlappingEnemy === undefined) {
    return {
      nextEnemies,
      nextState: {
        msUntilNextDrain: LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS,
        stuckEnemyId: null,
      },
      playerDamageDelta: 0,
    };
  }

  overlappingEnemy.currentHealth = Math.max(
    overlappingEnemy.currentHealth,
    LEVEL2_RVIRUS_STUCK_HEALTH,
  );
  overlappingEnemy.centerX = snapshot.player.centerX;
  overlappingEnemy.centerY = snapshot.player.centerY;
  overlappingEnemy.velocityX = 0;
  overlappingEnemy.velocityY = 0;

  return {
    nextEnemies,
    nextState: {
      msUntilNextDrain: LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS,
      stuckEnemyId: overlappingEnemy.enemyId,
    },
    playerDamageDelta: 0,
  };
}

function isOverlap(
  player: PlayerCollisionSnapshot,
  enemy: Level2RVirusEnemySnapshot,
): boolean {
  const playerLeft: number = player.centerX - player.width / 2;
  const playerRight: number = player.centerX + player.width / 2;
  const playerTop: number = player.centerY - player.height / 2;
  const playerBottom: number = player.centerY + player.height / 2;

  const enemyLeft: number = enemy.centerX - enemy.width / 2;
  const enemyRight: number = enemy.centerX + enemy.width / 2;
  const enemyTop: number = enemy.centerY - enemy.height / 2;
  const enemyBottom: number = enemy.centerY + enemy.height / 2;

  return playerRight > enemyLeft
    && playerLeft < enemyRight
    && playerBottom > enemyTop
    && playerTop < enemyBottom;
}
