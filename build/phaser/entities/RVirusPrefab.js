import * as Phaser from 'phaser';
import { LEVEL2_RVIRUS_DAMAGE, LEVEL2_RVIRUS_HEALTH, LEVEL2_RVIRUS_SCORE_VALUE, } from '../scenes/level2RVirusCombat.js';
export default class RVirusPrefab extends Phaser.GameObjects.Image {
    static TEXTURE_KEY = 'enemy-rvirus';
    enemyId;
    velocityX;
    velocityY;
    currentHealth;
    constructor(scene, snapshot) {
        super(scene, snapshot.centerX, snapshot.centerY, RVirusPrefab.TEXTURE_KEY);
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
            damage: LEVEL2_RVIRUS_DAMAGE,
            enemyId: this.enemyId,
            height: this.displayHeight,
            scoreValue: LEVEL2_RVIRUS_SCORE_VALUE,
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
            currentHealth: LEVEL2_RVIRUS_HEALTH,
            damage: LEVEL2_RVIRUS_DAMAGE,
            scoreValue: LEVEL2_RVIRUS_SCORE_VALUE,
        };
    }
}
//# sourceMappingURL=RVirusPrefab.js.map