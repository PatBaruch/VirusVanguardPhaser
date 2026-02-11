export function resolvePlayerEnemyCollisionMatrix(snapshot) {
    const remainingEnemies = [];
    const destroyedEnemyIds = [];
    let playerDamageDelta = 0;
    for (const enemy of snapshot.enemies) {
        if (!isOverlap(snapshot.player, enemy)) {
            remainingEnemies.push(enemy);
            continue;
        }
        if (enemy.enemyClass === 'rvirus') {
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
//# sourceMappingURL=enemyCollisionMatrix.js.map