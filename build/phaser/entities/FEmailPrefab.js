import * as Phaser from 'phaser';
import { FEMAIL_DAMAGE, FEMAIL_HEALTH, FEMAIL_SCORE_VALUE, } from '../scenes/level1FEmailCombat.js';
export default class FEmailPrefab extends Phaser.GameObjects.Image {
    static TEXTURE_KEY = 'enemy-femail';
    enemyId;
    velocityX;
    velocityY;
    currentHealth;
    constructor(scene, snapshot) {
        super(scene, snapshot.centerX, snapshot.centerY, FEmailPrefab.TEXTURE_KEY);
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
            damage: FEMAIL_DAMAGE,
            enemyId: this.enemyId,
            height: this.displayHeight,
            scoreValue: FEMAIL_SCORE_VALUE,
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
            currentHealth: FEMAIL_HEALTH,
            damage: FEMAIL_DAMAGE,
            scoreValue: FEMAIL_SCORE_VALUE,
        };
    }
}
//# sourceMappingURL=FEmailPrefab.js.map