export interface CombatProjectileSnapshot {
  projectileId: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  damage: number;
}

export interface CombatTargetSnapshot {
  targetId: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  currentHealth: number;
  scoreValue: number;
}

export interface DeathEffectSpawnSnapshot {
  centerX: number;
  centerY: number;
}

export interface ProjectileHitResolutionResult {
  remainingProjectiles: CombatProjectileSnapshot[];
  remainingTargets: CombatTargetSnapshot[];
  destroyedProjectileIds: string[];
  destroyedTargetIds: string[];
  deathEffectSpawns: DeathEffectSpawnSnapshot[];
  scoreDelta: number;
}

export function resolveProjectileHitResolution(snapshot: {
  projectiles: readonly CombatProjectileSnapshot[];
  targets: readonly CombatTargetSnapshot[];
}): ProjectileHitResolutionResult {
  const targetById: Map<string, CombatTargetSnapshot> = new Map(
    snapshot.targets.map((target: CombatTargetSnapshot) => [target.targetId, { ...target }]),
  );
  const remainingProjectiles: CombatProjectileSnapshot[] = [];
  const destroyedProjectileIds: string[] = [];
  const destroyedTargetIds: string[] = [];
  const deathEffectSpawns: DeathEffectSpawnSnapshot[] = [];
  let scoreDelta: number = 0;

  for (const projectile of snapshot.projectiles) {
    let didProjectileHitTarget: boolean = false;

    for (const target of targetById.values()) {
      if (!isCollisionOverlapping(projectile, target)) {
        continue;
      }

      didProjectileHitTarget = true;
      destroyedProjectileIds.push(projectile.projectileId);
      deathEffectSpawns.push({
        centerX: projectile.centerX,
        centerY: projectile.centerY,
      });

      target.currentHealth -= projectile.damage;
      if (target.currentHealth <= 0) {
        destroyedTargetIds.push(target.targetId);
        scoreDelta += target.scoreValue;
        targetById.delete(target.targetId);
      }

      break;
    }

    if (!didProjectileHitTarget) {
      remainingProjectiles.push(projectile);
    }
  }

  return {
    deathEffectSpawns,
    destroyedProjectileIds,
    destroyedTargetIds,
    remainingProjectiles,
    remainingTargets: Array.from(targetById.values()),
    scoreDelta,
  };
}

function isCollisionOverlapping(
  projectile: CombatProjectileSnapshot,
  target: CombatTargetSnapshot,
): boolean {
  const projectileLeft: number = projectile.centerX - projectile.width / 2;
  const projectileRight: number = projectile.centerX + projectile.width / 2;
  const projectileTop: number = projectile.centerY - projectile.height / 2;
  const projectileBottom: number = projectile.centerY + projectile.height / 2;

  const targetLeft: number = target.centerX - target.width / 2;
  const targetRight: number = target.centerX + target.width / 2;
  const targetTop: number = target.centerY - target.height / 2;
  const targetBottom: number = target.centerY + target.height / 2;

  return (
    projectileRight > targetLeft
    && projectileLeft < targetRight
    && projectileBottom > targetTop
    && projectileTop < targetBottom
  );
}
