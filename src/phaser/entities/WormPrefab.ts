import * as Phaser from 'phaser';
import {
  LEVEL3_WORM_DAMAGE,
  LEVEL3_WORM_HEALTH,
  LEVEL3_WORM_SCORE_VALUE,
  Level3WormEnemySnapshot,
} from '../scenes/level3WormCombat.js';

/**
 * Level3 Worm enemy prefab for parity migration.
 */
export default class WormPrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'enemy-worm';

  private enemyId: string;

  private velocityX: number;

  private velocityY: number;

  private currentHealth: number;

  public constructor(scene: Phaser.Scene, snapshot: Level3WormEnemySnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, WormPrefab.TEXTURE_KEY);
    this.enemyId = snapshot.enemyId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
    this.setOrigin(0.5, 0.5);
  }

  public toSnapshot(): Level3WormEnemySnapshot {
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

  public applySnapshot(snapshot: Level3WormEnemySnapshot): void {
    this.x = snapshot.centerX;
    this.y = snapshot.centerY;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
  }

  public getEnemyId(): string {
    return this.enemyId;
  }

  public static createInitialSnapshot(snapshot: Level3WormEnemySnapshot): Level3WormEnemySnapshot {
    return {
      ...snapshot,
      currentHealth: LEVEL3_WORM_HEALTH,
      damage: LEVEL3_WORM_DAMAGE,
      scoreValue: LEVEL3_WORM_SCORE_VALUE,
    };
  }
}
