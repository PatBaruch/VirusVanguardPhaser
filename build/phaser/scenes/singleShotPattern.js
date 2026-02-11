const SINGLE_SHOT_PROJECTILE_SPEED_PARITY = 2;
export function resolveSingleShotProjectileConfigs(snapshot) {
    if (snapshot.levelId !== 1 && snapshot.levelId !== 2) {
        return [];
    }
    const diagonalVelocity = SINGLE_SHOT_PROJECTILE_SPEED_PARITY / Math.sqrt(2);
    const projectileStart = {
        startX: snapshot.playerCenterX,
        startY: snapshot.playerCenterY,
    };
    if (snapshot.facingDirection === 'E') {
        return [{ ...projectileStart, velocityX: SINGLE_SHOT_PROJECTILE_SPEED_PARITY, velocityY: 0 }];
    }
    if (snapshot.facingDirection === 'W') {
        return [{ ...projectileStart, velocityX: -SINGLE_SHOT_PROJECTILE_SPEED_PARITY, velocityY: 0 }];
    }
    if (snapshot.facingDirection === 'N') {
        return [{ ...projectileStart, velocityX: 0, velocityY: -SINGLE_SHOT_PROJECTILE_SPEED_PARITY }];
    }
    if (snapshot.facingDirection === 'S') {
        return [{ ...projectileStart, velocityX: 0, velocityY: SINGLE_SHOT_PROJECTILE_SPEED_PARITY }];
    }
    if (snapshot.facingDirection === 'NE') {
        return [{ ...projectileStart, velocityX: diagonalVelocity, velocityY: -diagonalVelocity }];
    }
    if (snapshot.facingDirection === 'SE') {
        return [{ ...projectileStart, velocityX: diagonalVelocity, velocityY: diagonalVelocity }];
    }
    if (snapshot.facingDirection === 'NW') {
        return [{ ...projectileStart, velocityX: -diagonalVelocity, velocityY: -diagonalVelocity }];
    }
    return [{ ...projectileStart, velocityX: -diagonalVelocity, velocityY: diagonalVelocity }];
}
//# sourceMappingURL=singleShotPattern.js.map