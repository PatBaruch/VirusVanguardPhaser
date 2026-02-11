import * as Phaser from 'phaser';
import { LEVEL_BOUNDS_PARITY } from '../config/parityConstants.js';
import { advanceProjectileMotion, isProjectileOutsideWorldBounds, resolveProjectileWorldBounds, } from './projectileMotion.js';
import { LEVEL5_MRHACKER_BULLET_DAMAGE, } from '../scenes/level5MrHackerCombat.js';
export default class EnemyBulletPrefab extends Phaser.GameObjects.Image {
    static TEXTURE_KEY = 'enemy-bullet-base';
    bulletId;
    velocityX;
    velocityY;
    constructor(scene, snapshot) {
        super(scene, snapshot.centerX, snapshot.centerY, EnemyBulletPrefab.TEXTURE_KEY);
        this.bulletId = snapshot.bulletId;
        this.velocityX = snapshot.velocityX;
        this.velocityY = snapshot.velocityY;
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
    toSnapshot() {
        return {
            bulletId: this.bulletId,
            centerX: this.x,
            centerY: this.y,
            damage: LEVEL5_MRHACKER_BULLET_DAMAGE,
            height: this.displayHeight,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            width: this.displayWidth,
        };
    }
    getBulletId() {
        return this.bulletId;
    }
}
//# sourceMappingURL=EnemyBulletPrefab.js.map