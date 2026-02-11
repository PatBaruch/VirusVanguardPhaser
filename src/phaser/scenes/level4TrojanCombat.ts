import { CombatProjectileSnapshot } from './projectileHitResolution.js';
import {
  resolvePlayerEnemyCollisionMatrix,
} from './enemyCollisionMatrix.js';

export interface Level4TrojanEnemySnapshot {
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

export interface Level4TrojanSpawnState {
  msUntilNextSpawn: number;
  nextEnemyNumericId: number;
}

export interface Level4TrojanSpawnSnapshot {
  canSpawn: boolean;
  canvasWidth: number;
  canvasHeight: number;
  elapsedMs: number;
  score: number;
  random: () => number;
}

export interface Level4TrojanSpawnResult {
  nextState: Level4TrojanSpawnState;
  spawnedEnemies: Level4TrojanEnemySnapshot[];
}

export interface Level4TrojanMotionSnapshot {
  elapsedMs: number;
}

export interface TrojanSplitSpawnSnapshot {
  impactX: number;
  impactY: number;
}

export interface PlayerCollisionSnapshot {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface Level4PlayerEnemyCollisionResult {
  remainingEnemies: Level4TrojanEnemySnapshot[];
  destroyedEnemyIds: string[];
  playerDamageDelta: number;
}

export interface Level4TrojanBreachResult {
  remainingEnemies: Level4TrojanEnemySnapshot[];
  breachedEnemyIds: string[];
  playerDamageDelta: number;
  splitSpawns: TrojanSplitSpawnSnapshot[];
}

export interface Level4TrojanProjectileHitResult {
  remainingProjectiles: CombatProjectileSnapshot[];
  remainingTrojans: Level4TrojanEnemySnapshot[];
  destroyedProjectileIds: string[];
  destroyedTrojanIds: string[];
  splitSpawns: TrojanSplitSpawnSnapshot[];
  scoreDelta: number;
}

export const LEVEL4_TROJAN_SPAWN_INTERVAL_MS: number = 2000;
export const LEVEL4_TROJAN_DAMAGE: number = 5;
export const LEVEL4_TROJAN_SCORE_VALUE: number = 10;
export const LEVEL4_TROJAN_HEALTH: number = 1;
export const LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD: number = 1000;
export const LEVEL4_TROJAN_FAST_SPEED_X_PER_MS: number = -(0.4 / 2);
export const LEVEL4_TROJAN_SLOW_SPEED_X_PER_MS: number = -(0.4 / 2) * 0.7;

export function createInitialLevel4TrojanSpawnState(): Level4TrojanSpawnState {
  return {
    msUntilNextSpawn: LEVEL4_TROJAN_SPAWN_INTERVAL_MS,
    nextEnemyNumericId: 0,
  };
}

export function advanceLevel4TrojanSpawnState(
  previousState: Level4TrojanSpawnState,
  snapshot: Level4TrojanSpawnSnapshot,
): Level4TrojanSpawnResult {
  if (!snapshot.canSpawn || snapshot.score >= LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD) {
    return {
      nextState: previousState,
      spawnedEnemies: [],
    };
  }

  let msUntilNextSpawn: number = previousState.msUntilNextSpawn - snapshot.elapsedMs;
  let nextEnemyNumericId: number = previousState.nextEnemyNumericId;
  const spawnedEnemies: Level4TrojanEnemySnapshot[] = [];

  while (msUntilNextSpawn <= 0) {
    spawnedEnemies.push({
      centerX: snapshot.canvasWidth * 0.89,
      centerY: (snapshot.random() * snapshot.canvasHeight * 0.76) + (snapshot.canvasHeight * 0.1),
      currentHealth: LEVEL4_TROJAN_HEALTH,
      damage: LEVEL4_TROJAN_DAMAGE,
      enemyId: `level4-trojan-${nextEnemyNumericId}`,
      height: 0,
      scoreValue: LEVEL4_TROJAN_SCORE_VALUE,
      velocityX: snapshot.random() > 0.7
        ? LEVEL4_TROJAN_FAST_SPEED_X_PER_MS
        : LEVEL4_TROJAN_SLOW_SPEED_X_PER_MS,
      velocityY: 0,
      width: 0,
    });

    nextEnemyNumericId += 1;
    msUntilNextSpawn += LEVEL4_TROJAN_SPAWN_INTERVAL_MS;
  }

  return {
    nextState: {
      msUntilNextSpawn,
      nextEnemyNumericId,
    },
    spawnedEnemies,
  };
}

export function advanceLevel4TrojanMotion(
  enemies: readonly Level4TrojanEnemySnapshot[],
  snapshot: Level4TrojanMotionSnapshot,
): Level4TrojanEnemySnapshot[] {
  return enemies.map((enemy: Level4TrojanEnemySnapshot) => ({
    ...enemy,
    centerX: enemy.centerX + (enemy.velocityX * snapshot.elapsedMs),
    centerY: enemy.centerY + (enemy.velocityY * snapshot.elapsedMs),
  }));
}

export function resolveLevel4TrojanBreaches(snapshot: {
  enemies: readonly Level4TrojanEnemySnapshot[];
  minX: number;
}): Level4TrojanBreachResult {
  const remainingEnemies: Level4TrojanEnemySnapshot[] = [];
  const breachedEnemyIds: string[] = [];
  const splitSpawns: TrojanSplitSpawnSnapshot[] = [];
  let playerDamageDelta: number = 0;

  for (const enemy of snapshot.enemies) {
    const leftEdge: number = enemy.centerX - (enemy.width / 2);
    if (leftEdge >= snapshot.minX) {
      remainingEnemies.push(enemy);
      continue;
    }

    breachedEnemyIds.push(enemy.enemyId);
    splitSpawns.push({
      impactX: enemy.centerX,
      impactY: enemy.centerY,
    });
    playerDamageDelta += enemy.damage;
  }

  return {
    breachedEnemyIds,
    playerDamageDelta,
    remainingEnemies,
    splitSpawns,
  };
}

export function resolveLevel4TrojanPlayerCollisions(snapshot: {
  player: PlayerCollisionSnapshot;
  enemies: readonly Level4TrojanEnemySnapshot[];
}): Level4PlayerEnemyCollisionResult {
  const matrixResult = resolvePlayerEnemyCollisionMatrix({
    enemies: snapshot.enemies.map((enemy: Level4TrojanEnemySnapshot) => ({
      centerX: enemy.centerX,
      centerY: enemy.centerY,
      damage: enemy.damage,
      enemyClass: 'trojan',
      enemyId: enemy.enemyId,
      height: enemy.height,
      width: enemy.width,
    })),
    player: snapshot.player,
  });

  const remainingEnemyIds: Set<string> = new Set(
    matrixResult.remainingEnemies.map((enemy) => enemy.enemyId),
  );
  const remainingEnemies: Level4TrojanEnemySnapshot[] = snapshot.enemies.filter(
    (enemy: Level4TrojanEnemySnapshot) => remainingEnemyIds.has(enemy.enemyId),
  );

  return {
    destroyedEnemyIds: matrixResult.destroyedEnemyIds,
    playerDamageDelta: matrixResult.playerDamageDelta,
    remainingEnemies,
  };
}

export function resolveLevel4TrojanProjectileHits(snapshot: {
  projectiles: readonly CombatProjectileSnapshot[];
  trojans: readonly Level4TrojanEnemySnapshot[];
}): Level4TrojanProjectileHitResult {
  const trojanById: Map<string, Level4TrojanEnemySnapshot> = new Map(
    snapshot.trojans.map((trojan: Level4TrojanEnemySnapshot) => [trojan.enemyId, { ...trojan }]),
  );
  const remainingProjectiles: CombatProjectileSnapshot[] = [];
  const destroyedProjectileIds: string[] = [];
  const destroyedTrojanIds: string[] = [];
  const splitSpawns: TrojanSplitSpawnSnapshot[] = [];
  let scoreDelta: number = 0;

  for (const projectile of snapshot.projectiles) {
    let didProjectileHitTrojan: boolean = false;

    for (const trojan of trojanById.values()) {
      if (!isCollisionOverlapping(projectile, trojan)) {
        continue;
      }

      didProjectileHitTrojan = true;
      destroyedProjectileIds.push(projectile.projectileId);
      trojan.currentHealth -= projectile.damage;

      if (trojan.currentHealth <= 0) {
        destroyedTrojanIds.push(trojan.enemyId);
        scoreDelta += trojan.scoreValue;
        splitSpawns.push({
          impactX: projectile.centerX,
          impactY: projectile.centerY,
        });
        trojanById.delete(trojan.enemyId);
      }

      break;
    }

    if (!didProjectileHitTrojan) {
      remainingProjectiles.push(projectile);
    }
  }

  return {
    destroyedProjectileIds,
    destroyedTrojanIds,
    remainingProjectiles,
    remainingTrojans: Array.from(trojanById.values()),
    scoreDelta,
    splitSpawns,
  };
}

function isCollisionOverlapping(
  projectile: CombatProjectileSnapshot,
  trojan: Level4TrojanEnemySnapshot,
): boolean {
  const projectileLeft: number = projectile.centerX - projectile.width / 2;
  const projectileRight: number = projectile.centerX + projectile.width / 2;
  const projectileTop: number = projectile.centerY - projectile.height / 2;
  const projectileBottom: number = projectile.centerY + projectile.height / 2;

  const targetLeft: number = trojan.centerX - trojan.width / 2;
  const targetRight: number = trojan.centerX + trojan.width / 2;
  const targetTop: number = trojan.centerY - trojan.height / 2;
  const targetBottom: number = trojan.centerY + trojan.height / 2;

  return (
    projectileRight > targetLeft
    && projectileLeft < targetRight
    && projectileBottom > targetTop
    && projectileTop < targetBottom
  );
}
