export function resolveProjectileHitResolution(snapshot) {
    const targetById = new Map(snapshot.targets.map((target) => [target.targetId, { ...target }]));
    const remainingProjectiles = [];
    const destroyedProjectileIds = [];
    const destroyedTargetIds = [];
    const deathEffectSpawns = [];
    let scoreDelta = 0;
    for (const projectile of snapshot.projectiles) {
        let didProjectileHitTarget = false;
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
function isCollisionOverlapping(projectile, target) {
    const projectileLeft = projectile.centerX - projectile.width / 2;
    const projectileRight = projectile.centerX + projectile.width / 2;
    const projectileTop = projectile.centerY - projectile.height / 2;
    const projectileBottom = projectile.centerY + projectile.height / 2;
    const targetLeft = target.centerX - target.width / 2;
    const targetRight = target.centerX + target.width / 2;
    const targetTop = target.centerY - target.height / 2;
    const targetBottom = target.centerY + target.height / 2;
    return (projectileRight > targetLeft
        && projectileLeft < targetRight
        && projectileBottom > targetTop
        && projectileTop < targetBottom);
}
//# sourceMappingURL=projectileHitResolution.js.map