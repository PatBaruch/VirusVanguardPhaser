import { resolvePlayerEnemyCollisionMatrix, } from './enemyCollisionMatrix.js';
export const LEVEL1_FEMAIL_SPAWN_INTERVAL_MS = 500;
export const FEMAIL_HORIZONTAL_SPEED_PER_MS = 0.75 / 2;
export const FEMAIL_VERTICAL_SPEED_PER_MS = 0.25 / 2;
export const FEMAIL_DAMAGE = 5;
export const FEMAIL_SCORE_VALUE = 10;
export const FEMAIL_HEALTH = 1;
export const LEVEL1_CLEAR_SCORE_THRESHOLD = 200;
export function createInitialLevel1FEmailSpawnState() {
    return {
        msUntilNextSpawn: LEVEL1_FEMAIL_SPAWN_INTERVAL_MS,
        nextEnemyNumericId: 0,
    };
}
export function advanceLevel1FEmailSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn || snapshot.score >= LEVEL1_CLEAR_SCORE_THRESHOLD) {
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
export function advanceLevel1FEmailMotion(enemies, snapshot) {
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
export function resolveLevel1PlayerEnemyCollisions(snapshot) {
    const matrixResult = resolvePlayerEnemyCollisionMatrix({
        enemies: snapshot.enemies.map((enemy) => ({
            centerX: enemy.centerX,
            centerY: enemy.centerY,
            damage: enemy.damage,
            enemyClass: 'femail',
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
//# sourceMappingURL=level1FEmailCombat.js.map