const TRIPLE_SHOT_PROJECTILE_SPEED_PARITY = 2;
export function resolveTripleShotProjectileConfigs(snapshot) {
    if (snapshot.levelId !== 4 && snapshot.levelId !== 5) {
        return [];
    }
    const diagonalVelocity = TRIPLE_SHOT_PROJECTILE_SPEED_PARITY / Math.sqrt(2);
    if (snapshot.facingDirection === 'E') {
        return [
            {
                startX: snapshot.playerCenterX + 10,
                startY: snapshot.playerCenterY + 10,
                velocityX: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: 1,
            },
            {
                startX: snapshot.playerCenterX + 10,
                startY: snapshot.playerCenterY + 10,
                velocityX: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: -1,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: 0,
            },
        ];
    }
    if (snapshot.facingDirection === 'W') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: 1,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: -1,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
                velocityY: 0,
            },
        ];
    }
    if (snapshot.facingDirection === 'N') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: 1,
                velocityY: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -1,
                velocityY: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: 0,
                velocityY: -TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
        ];
    }
    if (snapshot.facingDirection === 'S') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: 1,
                velocityY: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -1,
                velocityY: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: 0,
                velocityY: TRIPLE_SHOT_PROJECTILE_SPEED_PARITY,
            },
        ];
    }
    if (snapshot.facingDirection === 'NE') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity,
                velocityY: -diagonalVelocity,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity,
                velocityY: -diagonalVelocity + 1,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity,
                velocityY: -diagonalVelocity - 1,
            },
        ];
    }
    if (snapshot.facingDirection === 'SE') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity,
                velocityY: diagonalVelocity,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity - 1,
                velocityY: diagonalVelocity,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: diagonalVelocity + 1,
                velocityY: diagonalVelocity,
            },
        ];
    }
    if (snapshot.facingDirection === 'NW') {
        return [
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -diagonalVelocity,
                velocityY: -diagonalVelocity,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -diagonalVelocity + 1,
                velocityY: -diagonalVelocity,
            },
            {
                startX: snapshot.playerCenterX,
                startY: snapshot.playerCenterY,
                velocityX: -diagonalVelocity - 1,
                velocityY: -diagonalVelocity,
            },
        ];
    }
    return [
        {
            startX: snapshot.playerCenterX,
            startY: snapshot.playerCenterY,
            velocityX: -diagonalVelocity,
            velocityY: diagonalVelocity,
        },
        {
            startX: snapshot.playerCenterX,
            startY: snapshot.playerCenterY,
            velocityX: -diagonalVelocity + 1,
            velocityY: diagonalVelocity,
        },
        {
            startX: snapshot.playerCenterX,
            startY: snapshot.playerCenterY,
            velocityX: -diagonalVelocity - 1,
            velocityY: diagonalVelocity,
        },
    ];
}
//# sourceMappingURL=tripleShotPattern.js.map