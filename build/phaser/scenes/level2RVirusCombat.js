export const LEVEL2_RVIRUS_SPAWN_INTERVAL_MS = 1000;
export const LEVEL2_RVIRUS_DAMAGE = 5;
export const LEVEL2_RVIRUS_SCORE_VALUE = 10;
export const LEVEL2_RVIRUS_HEALTH = 5;
export const LEVEL2_RVIRUS_STUCK_HEALTH = 10;
export const LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS = 1500;
export const LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD = 400;
export const LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS = 1 / 2;
export const LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS = 0.3 / 2;
export function createInitialLevel2RVirusSpawnState() {
    return {
        msUntilNextSpawn: LEVEL2_RVIRUS_SPAWN_INTERVAL_MS,
        nextEnemyNumericId: 0,
    };
}
export function createInitialLevel2RVirusAttachmentState(stuckEnemyId = null) {
    return {
        msUntilNextDrain: LEVEL2_RVIRUS_HP_DRAIN_INTERVAL_MS,
        stuckEnemyId,
    };
}
export function advanceLevel2RVirusSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn || snapshot.score >= LEVEL2_RVIRUS_CLEAR_SCORE_THRESHOLD) {
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
export function advanceLevel2RVirusMotion(enemies, snapshot) {
    const minX = snapshot.canvasWidth * 0.05;
    const maxX = snapshot.canvasWidth * 0.94;
    const minY = snapshot.canvasHeight * 0.1;
    const maxY = snapshot.canvasHeight * 0.92;
    return enemies.map((enemy) => {
        if (snapshot.stuckEnemyId !== null && enemy.enemyId === snapshot.stuckEnemyId) {
            return enemy;
        }
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
export function resolveLevel2RVirusAttachment(previousState, snapshot) {
    const nextEnemies = snapshot.enemies.map((enemy) => ({ ...enemy }));
    if (previousState.stuckEnemyId !== null) {
        const stuckEnemy = nextEnemies.find((enemy) => enemy.enemyId === previousState.stuckEnemyId);
        if (stuckEnemy !== undefined) {
            let msUntilNextDrain = previousState.msUntilNextDrain - snapshot.elapsedMs;
            let playerDamageDelta = 0;
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
    const overlappingEnemy = nextEnemies.find((enemy) => isOverlap(snapshot.player, enemy));
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
    overlappingEnemy.currentHealth = Math.max(overlappingEnemy.currentHealth, LEVEL2_RVIRUS_STUCK_HEALTH);
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
function isOverlap(player, enemy) {
    const playerLeft = player.centerX - player.width / 2;
    const playerRight = player.centerX + player.width / 2;
    const playerTop = player.centerY - player.height / 2;
    const playerBottom = player.centerY + player.height / 2;
    const enemyLeft = enemy.centerX - enemy.width / 2;
    const enemyRight = enemy.centerX + enemy.width / 2;
    const enemyTop = enemy.centerY - enemy.height / 2;
    const enemyBottom = enemy.centerY + enemy.height / 2;
    return playerRight > enemyLeft
        && playerLeft < enemyRight
        && playerBottom > enemyTop
        && playerTop < enemyBottom;
}
//# sourceMappingURL=level2RVirusCombat.js.map