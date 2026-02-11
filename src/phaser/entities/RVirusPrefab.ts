import * as Phaser from 'phaser';
import {
  LEVEL2_RVIRUS_DAMAGE,
  LEVEL2_RVIRUS_HEALTH,
  LEVEL2_RVIRUS_SCORE_VALUE,
  Level2RVirusEnemySnapshot,
} from '../scenes/level2RVirusCombat.js';

/**
 * Level2 RVirus enemy prefab for parity migration.
 */
export default class RVirusPrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'enemy-rvirus';

  private enemyId: string;

  private velocityX: number;

  private velocityY: number;

  private currentHealth: number;

  public constructor(scene: Phaser.Scene, snapshot: Level2RVirusEnemySnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, RVirusPrefab.TEXTURE_KEY);
    this.enemyId = snapshot.enemyId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
    this.setOrigin(0.5, 0.5);
  }

  public toSnapshot(): Level2RVirusEnemySnapshot {
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

  public applySnapshot(snapshot: Level2RVirusEnemySnapshot): void {
    this.x = snapshot.centerX;
    this.y = snapshot.centerY;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
  }

  public getEnemyId(): string {
    return this.enemyId;
  }

  public static createInitialSnapshot(snapshot: Level2RVirusEnemySnapshot): Level2RVirusEnemySnapshot {
    return {
      ...snapshot,
      currentHealth: LEVEL2_RVIRUS_HEALTH,
      damage: LEVEL2_RVIRUS_DAMAGE,
      scoreValue: LEVEL2_RVIRUS_SCORE_VALUE,
    };
  }
}
