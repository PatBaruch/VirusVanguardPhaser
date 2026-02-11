import * as Phaser from 'phaser';
import { LEVEL5_MRHACKER_DAMAGE, LEVEL5_MRHACKER_HEALTH, LEVEL5_MRHACKER_SCORE_VALUE, LEVEL5_MRHACKER_TEXTURE_KEYS, } from '../scenes/level5MrHackerCombat.js';
export default class MrHackerPrefab extends Phaser.GameObjects.Image {
    static BASE_TEXTURE_KEY = LEVEL5_MRHACKER_TEXTURE_KEYS[0];
    enemyId;
    velocityX;
    velocityY;
    currentHealth;
    animationMsUntilNextFrame;
    animationFrameIndex;
    constructor(scene, snapshot) {
        super(scene, snapshot.centerX, snapshot.centerY, MrHackerPrefab.BASE_TEXTURE_KEY);
        this.enemyId = snapshot.enemyId;
        this.velocityX = snapshot.velocityX;
        this.velocityY = snapshot.velocityY;
        this.currentHealth = snapshot.currentHealth;
        this.animationMsUntilNextFrame = 0;
        this.animationFrameIndex = 0;
        this.setOrigin(0.5, 0.5);
    }
    toSnapshot() {
        return {
            centerX: this.x,
            centerY: this.y,
            currentHealth: this.currentHealth,
            damage: LEVEL5_MRHACKER_DAMAGE,
            enemyId: this.enemyId,
            height: this.displayHeight,
            scoreValue: LEVEL5_MRHACKER_SCORE_VALUE,
            velocityX: this.velocityX,
            velocityY: this.velocityY,
            width: this.displayWidth,
        };
    }
    applySnapshot(snapshot) {
        this.x = snapshot.centerX;
        this.y = snapshot.centerY;
        this.velocityX = snapshot.velocityX;
        this.velocityY = snapshot.velocityY;
        this.currentHealth = snapshot.currentHealth;
    }
    advanceAnimation(elapsedMs) {
        this.animationMsUntilNextFrame -= elapsedMs;
        if (this.animationMsUntilNextFrame > 0) {
            return;
        }
        this.animationMsUntilNextFrame = 150;
        this.animationFrameIndex = (this.animationFrameIndex + 1) % LEVEL5_MRHACKER_TEXTURE_KEYS.length;
        this.setTexture(LEVEL5_MRHACKER_TEXTURE_KEYS[this.animationFrameIndex]);
    }
    decreaseHealthBy(amount) {
        this.currentHealth = Math.max(0, this.currentHealth - amount);
    }
    getCurrentHealth() {
        return this.currentHealth;
    }
    getEnemyId() {
        return this.enemyId;
    }
    static createInitialSnapshot(snapshot) {
        return {
            ...snapshot,
            currentHealth: LEVEL5_MRHACKER_HEALTH,
            damage: LEVEL5_MRHACKER_DAMAGE,
            scoreValue: LEVEL5_MRHACKER_SCORE_VALUE,
        };
    }
}
//# sourceMappingURL=MrHackerPrefab.js.map