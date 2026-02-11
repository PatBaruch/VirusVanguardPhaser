export const LEVEL4_TROJAN_SPAWN_INTERVAL_MS = 2000;
export const LEVEL4_TROJAN_DAMAGE = 5;
export const LEVEL4_TROJAN_SCORE_VALUE = 10;
export const LEVEL4_TROJAN_HEALTH = 1;
export const LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD = 1000;
export const LEVEL4_TROJAN_FAST_SPEED_X_PER_MS = -(0.4 / 2);
export const LEVEL4_TROJAN_SLOW_SPEED_X_PER_MS = -(0.4 / 2) * 0.7;
export function createInitialLevel4TrojanSpawnState() {
    return {
        msUntilNextSpawn: LEVEL4_TROJAN_SPAWN_INTERVAL_MS,
        nextEnemyNumericId: 0,
    };
}
export function advanceLevel4TrojanSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn || snapshot.score >= LEVEL4_TROJAN_CLEAR_SCORE_THRESHOLD) {
        return {
            nextState: previousState,
            spawnedEnemies: [],
        };
    }
    let msUntilNextSpawn = previousState.msUntilNextSpawn - snapshot.elapsedMs;
    let nextEnemyNumericId = previousState.nextEnemyNumericId;
    const spawnedEnemies = [];
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
export function advanceLevel4TrojanMotion(enemies, snapshot) {
    return enemies.map((enemy) => ({
        ...enemy,
        centerX: enemy.centerX + (enemy.velocityX * snapshot.elapsedMs),
        centerY: enemy.centerY + (enemy.velocityY * snapshot.elapsedMs),
    }));
}
export function resolveLevel4TrojanBreaches(snapshot) {
    const remainingEnemies = [];
    const breachedEnemyIds = [];
    const splitSpawns = [];
    let playerDamageDelta = 0;
    for (const enemy of snapshot.enemies) {
        const leftEdge = enemy.centerX - (enemy.width / 2);
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
export function resolveLevel4TrojanProjectileHits(snapshot) {
    const trojanById = new Map(snapshot.trojans.map((trojan) => [trojan.enemyId, { ...trojan }]));
    const remainingProjectiles = [];
    const destroyedProjectileIds = [];
    const destroyedTrojanIds = [];
    const splitSpawns = [];
    let scoreDelta = 0;
    for (const projectile of snapshot.projectiles) {
        let didProjectileHitTrojan = false;
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
function isCollisionOverlapping(projectile, trojan) {
    const projectileLeft = projectile.centerX - projectile.width / 2;
    const projectileRight = projectile.centerX + projectile.width / 2;
    const projectileTop = projectile.centerY - projectile.height / 2;
    const projectileBottom = projectile.centerY + projectile.height / 2;
    const targetLeft = trojan.centerX - trojan.width / 2;
    const targetRight = trojan.centerX + trojan.width / 2;
    const targetTop = trojan.centerY - trojan.height / 2;
    const targetBottom = trojan.centerY + trojan.height / 2;
    return (projectileRight > targetLeft
        && projectileLeft < targetRight
        && projectileBottom > targetTop
        && projectileTop < targetBottom);
}
//# sourceMappingURL=level4TrojanCombat.js.map