import * as Phaser from 'phaser';
import {
  FEMAIL_DAMAGE,
  FEMAIL_HEALTH,
  FEMAIL_SCORE_VALUE,
  Level1FEmailEnemySnapshot,
} from '../scenes/level1FEmailCombat.js';

/**
 * Level1 FEmail enemy prefab for parity migration.
 */
export default class FEmailPrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'enemy-femail';

  private enemyId: string;

  private velocityX: number;

  private velocityY: number;

  private currentHealth: number;

  public constructor(scene: Phaser.Scene, snapshot: Level1FEmailEnemySnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, FEmailPrefab.TEXTURE_KEY);
    this.enemyId = snapshot.enemyId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
    this.setOrigin(0.5, 0.5);
  }

  public toSnapshot(): Level1FEmailEnemySnapshot {
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

  public applySnapshot(snapshot: Level1FEmailEnemySnapshot): void {
    this.x = snapshot.centerX;
    this.y = snapshot.centerY;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
  }

  public getEnemyId(): string {
    return this.enemyId;
  }

  public static createInitialSnapshot(snapshot: Level1FEmailEnemySnapshot): Level1FEmailEnemySnapshot {
    return {
      ...snapshot,
      currentHealth: FEMAIL_HEALTH,
      damage: FEMAIL_DAMAGE,
      scoreValue: FEMAIL_SCORE_VALUE,
    };
  }
}
