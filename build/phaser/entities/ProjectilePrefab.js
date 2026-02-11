import * as Phaser from 'phaser';
import { LEVEL_BOUNDS_PARITY } from '../config/parityConstants.js';
import { advanceProjectileMotion, isProjectileOutsideWorldBounds, resolveProjectileWorldBounds, } from './projectileMotion.js';
export default class ProjectilePrefab extends Phaser.GameObjects.Image {
    static TEXTURE_KEY = 'projectile-base';
    velocityX;
    velocityY;
    constructor(scene, config) {
        super(scene, config.startX, config.startY, ProjectilePrefab.TEXTURE_KEY);
        this.velocityX = config.velocityX;
        this.velocityY = config.velocityY;
        this.setOrigin(0.5, 0.5);
    }
    updateMotion(elapsedMs) {
        const nextMotionState = advanceProjectileMotion({
            positionX: this.x,
            positionY: this.y,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
        }, elapsedMs);
        this.x = nextMotionState.positionX;
        this.y = nextMotionState.positionY;
    }
    isOutsideCombatWorldBounds(canvasWidth, canvasHeight) {
        const combatLevelBounds = LEVEL_BOUNDS_PARITY[1];
        const worldBounds = resolveProjectileWorldBounds({
            canvasHeight,
            canvasWidth,
            maxXRatio: combatLevelBounds.maxXRatio,
            maxYRatio: combatLevelBounds.maxYRatio,
            minXRatio: combatLevelBounds.minXRatio,
            minYRatio: combatLevelBounds.minYRatio,
        });
        return isProjectileOutsideWorldBounds({
            positionX: this.x,
            positionY: this.y,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
        }, worldBounds);
    }
}
//# sourceMappingURL=ProjectilePrefab.js.map