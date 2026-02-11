export interface Level1FEmailEnemySnapshot {
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

export interface Level1FEmailSpawnState {
  msUntilNextSpawn: number;
  nextEnemyNumericId: number;
}

export interface Level1FEmailSpawnSnapshot {
  canSpawn: boolean;
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
  score: number;
  random: () => number;
}

export interface Level1FEmailSpawnResult {
  nextState: Level1FEmailSpawnState;
  spawnedEnemies: Level1FEmailEnemySnapshot[];
}

export interface Level1FEmailMotionSnapshot {
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

export interface Level1PlayerEnemyCollisionResult {
  remainingEnemies: Level1FEmailEnemySnapshot[];
  destroyedEnemyIds: string[];
  playerDamageDelta: number;
}

export const LEVEL1_FEMAIL_SPAWN_INTERVAL_MS: number = 500;
export const FEMAIL_HORIZONTAL_SPEED_PER_MS: number = 0.75 / 2;
export const FEMAIL_VERTICAL_SPEED_PER_MS: number = 0.25 / 2;
export const FEMAIL_DAMAGE: number = 5;
export const FEMAIL_SCORE_VALUE: number = 10;
export const FEMAIL_HEALTH: number = 1;
export const LEVEL1_CLEAR_SCORE_THRESHOLD: number = 200;

export function createInitialLevel1FEmailSpawnState(): Level1FEmailSpawnState {
  return {
    msUntilNextSpawn: LEVEL1_FEMAIL_SPAWN_INTERVAL_MS,
    nextEnemyNumericId: 0,
  };
}

export function advanceLevel1FEmailSpawnState(
  previousState: Level1FEmailSpawnState,
  snapshot: Level1FEmailSpawnSnapshot,
): Level1FEmailSpawnResult {
  if (!snapshot.canSpawn || snapshot.score >= LEVEL1_CLEAR_SCORE_THRESHOLD) {
    return {
      nextState: previousState,
      spawnedEnemies: [],
    };
  }

  let msUntilNextSpawn: number = previousState.msUntilNextSpawn - snapshot.elapsedMs;
  let nextEnemyNumericId: number = previousState.nextEnemyNumericId;
  const spawnedEnemies: Level1FEmailEnemySnapshot[] = [];

  while (msUntilNextSpawn <= 0) {
    spawnedEnemies.push({
      centerX: snapshot.random() * snapshot.canvasWidth * 0.9,
      centerY: snapshot.random() * snapshot.canvasHeight * 0.86,
      currentHealth: FEMAIL_HEALTH,
      damage: FEMAIL_DAMAGE,
      enemyId: `level1-femail-${nextEnemyNumericId}`,
      height: 0,
      scoreValue: FEMAIL_SCORE_VALUE,
      velocityX: snapshot.random() > 0.5
        ? -FEMAIL_HORIZONTAL_SPEED_PER_MS
        : FEMAIL_HORIZONTAL_SPEED_PER_MS,
      velocityY: snapshot.random() > 0.5
        ? -FEMAIL_VERTICAL_SPEED_PER_MS
        : FEMAIL_VERTICAL_SPEED_PER_MS,
      width: 0,
    });

    nextEnemyNumericId += 1;
    msUntilNextSpawn += LEVEL1_FEMAIL_SPAWN_INTERVAL_MS;
  }

  return {
    nextState: {
      msUntilNextSpawn,
      nextEnemyNumericId,
    },
    spawnedEnemies,
  };
}

export function advanceLevel1FEmailMotion(
  enemies: readonly Level1FEmailEnemySnapshot[],
  snapshot: Level1FEmailMotionSnapshot,
): Level1FEmailEnemySnapshot[] {
  const minX: number = snapshot.canvasWidth * 0.05;
  const maxX: number = snapshot.canvasWidth * 0.94;
  const minY: number = snapshot.canvasHeight * 0.1;
  const maxY: number = snapshot.canvasHeight * 0.92;

  return enemies.map((enemy: Level1FEmailEnemySnapshot) => {
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

export function resolveLevel1PlayerEnemyCollisions(snapshot: {
  player: PlayerCollisionSnapshot;
  enemies: readonly Level1FEmailEnemySnapshot[];
}): Level1PlayerEnemyCollisionResult {
  const remainingEnemies: Level1FEmailEnemySnapshot[] = [];
  const destroyedEnemyIds: string[] = [];
  let playerDamageDelta: number = 0;

  for (const enemy of snapshot.enemies) {
    if (!isOverlap(snapshot.player, enemy)) {
      remainingEnemies.push(enemy);
      continue;
    }

    destroyedEnemyIds.push(enemy.enemyId);
    playerDamageDelta += enemy.damage;
  }

  return {
    destroyedEnemyIds,
    playerDamageDelta,
    remainingEnemies,
  };
}

function isOverlap(
  player: PlayerCollisionSnapshot,
  enemy: Level1FEmailEnemySnapshot,
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
