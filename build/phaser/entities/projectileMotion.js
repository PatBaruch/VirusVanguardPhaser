export function advanceProjectileMotion(motionState, elapsedMs) {
    return {
        positionX: motionState.positionX + (motionState.velocityX * elapsedMs),
        positionY: motionState.positionY + (motionState.velocityY * elapsedMs),
        velocityX: motionState.velocityX,
        velocityY: motionState.velocityY,
    };
}
export function resolveProjectileWorldBounds(snapshot) {
    return {
        maxX: snapshot.maxXRatio * snapshot.canvasWidth,
        maxY: snapshot.maxYRatio * snapshot.canvasHeight,
        minX: snapshot.minXRatio * snapshot.canvasWidth,
        minY: snapshot.minYRatio * snapshot.canvasHeight,
    };
}
export function isProjectileOutsideWorldBounds(motionState, worldBounds) {
    return motionState.positionX < worldBounds.minX * 0.9
        || motionState.positionX > worldBounds.maxX * 1.05
        || motionState.positionY < worldBounds.minY * 0.9
        || motionState.positionY > worldBounds.maxY * 1.05;
}
//# sourceMappingURL=projectileMotion.js.map