import { resolvePlayerEnemyCollisionMatrix, } from './enemyCollisionMatrix.js';
export const LEVEL3_WORM_SPAWN_INTERVAL_MS = 500;
export const LEVEL3_WORM_DUPLICATION_INTERVAL_MS = 2000;
export const LEVEL3_WORM_DAMAGE = 5;
export const LEVEL3_WORM_SCORE_VALUE = 10;
export const LEVEL3_WORM_HEALTH = 1;
export const LEVEL3_WORM_CLEAR_SCORE_THRESHOLD = 600;
const LEVEL3_WORM_HORIZONTAL_BASE_SPEED = 0.3;
const LEVEL3_WORM_HORIZONTAL_RANDOM_SCALE = 0.4;
const LEVEL3_WORM_VERTICAL_BASE_SPEED = 0.3;
const LEVEL3_WORM_VERTICAL_RANDOM_SCALE = 0.2;
const LEVEL3_WORM_BOUNCE_DAMPING = 0.8;
export function createInitialLevel3WormSpawnState() {
    return {
        msUntilNextSpawn: LEVEL3_WORM_SPAWN_INTERVAL_MS,
        nextEnemyNumericId: 0,
    };
}
export function createInitialLevel3WormDuplicationState() {
    return {
        msUntilNextDuplication: LEVEL3_WORM_DUPLICATION_INTERVAL_MS,
        nextEnemyNumericId: 0,
    };
}
export function advanceLevel3WormSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn || snapshot.score >= LEVEL3_WORM_CLEAR_SCORE_THRESHOLD) {
        return {
            nextState: previousState,
            spawnedEnemies: [],
        };
    }
    let msUntilNextSpawn = previousState.msUntilNextSpawn - snapshot.elapsedMs;
    let nextEnemyNumericId = previousState.nextEnemyNumericId;
    const spawnedEnemies = [];
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
export function advanceLevel3WormDuplicationState(previousState, snapshot) {
    if (snapshot.score >= LEVEL3_WORM_CLEAR_SCORE_THRESHOLD) {
        return {
            nextState: {
                ...previousState,
                msUntilNextDuplication: Math.max(0, previousState.msUntilNextDuplication - snapshot.elapsedMs),
            },
            duplicatedEnemies: [],
        };
    }
    const msUntilNextDuplication = previousState.msUntilNextDuplication - snapshot.elapsedMs;
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
    let nextEnemyNumericId = Math.max(previousState.nextEnemyNumericId, resolveNextEnemyNumericIdFromSnapshots(snapshot.enemies));
    const duplicatedEnemies = snapshot.enemies.map((enemy) => {
        const duplicatedEnemy = {
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
export function advanceLevel3WormMotion(enemies, snapshot) {
    const minX = snapshot.canvasWidth * 0.05;
    const maxX = snapshot.canvasWidth * 0.94;
    const minY = snapshot.canvasHeight * 0.1;
    const maxY = snapshot.canvasHeight * 0.92;
    return enemies.map((enemy) => {
        let centerX = enemy.centerX + (enemy.velocityX * snapshot.elapsedMs);
        let centerY = enemy.centerY + (enemy.velocityY * snapshot.elapsedMs);
        let velocityX = enemy.velocityX;
        let velocityY = enemy.velocityY;
        const halfWidth = enemy.width / 2;
        const halfHeight = enemy.height / 2;
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
export function resolveLevel3PlayerEnemyCollisions(snapshot) {
    const matrixResult = resolvePlayerEnemyCollisionMatrix({
        enemies: snapshot.enemies.map((enemy) => ({
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
    const remainingEnemyIds = new Set(matrixResult.remainingEnemies.map((enemy) => enemy.enemyId));
    const remainingEnemies = snapshot.enemies.filter((enemy) => remainingEnemyIds.has(enemy.enemyId));
    return {
        destroyedEnemyIds: matrixResult.destroyedEnemyIds,
        playerDamageDelta: matrixResult.playerDamageDelta,
        remainingEnemies,
    };
}
function createSpawnedWormSnapshot(snapshot) {
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
function resolveNextEnemyNumericIdFromSnapshots(enemies) {
    let maxNumericId = -1;
    for (const enemy of enemies) {
        const match = enemy.enemyId.match(/^level3-worm-(\d+)$/);
        if (match !== null) {
            maxNumericId = Math.max(maxNumericId, Number.parseInt(match[1], 10));
        }
    }
    return maxNumericId + 1;
}
//# sourceMappingURL=level3WormCombat.js.map