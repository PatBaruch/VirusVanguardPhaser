import * as Phaser from 'phaser';
import { LEVEL3_WORM_DAMAGE, LEVEL3_WORM_HEALTH, LEVEL3_WORM_SCORE_VALUE, } from '../scenes/level3WormCombat.js';
export default class WormPrefab extends Phaser.GameObjects.Image {
    static TEXTURE_KEY = 'enemy-worm';
    enemyId;
    velocityX;
    velocityY;
    currentHealth;
    constructor(scene, snapshot) {
        super(scene, snapshot.centerX, snapshot.centerY, WormPrefab.TEXTURE_KEY);
        this.enemyId = snapshot.enemyId;
        this.velocityX = snapshot.velocityX;
        this.velocityY = snapshot.velocityY;
        this.currentHealth = snapshot.currentHealth;
        this.setOrigin(0.5, 0.5);
    }
    toSnapshot() {
        return {
            centerX: this.x,
            centerY: this.y,
            currentHealth: this.currentHealth,
            damage: LEVEL3_WORM_DAMAGE,
            enemyId: this.enemyId,
            height: this.displayHeight,
            scoreValue: LEVEL3_WORM_SCORE_VALUE,
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
    getEnemyId() {
        return this.enemyId;
    }
    static createInitialSnapshot(snapshot) {
        return {
            ...snapshot,
            currentHealth: LEVEL3_WORM_HEALTH,
            damage: LEVEL3_WORM_DAMAGE,
            scoreValue: LEVEL3_WORM_SCORE_VALUE,
        };
    }
}
//# sourceMappingURL=WormPrefab.js.map