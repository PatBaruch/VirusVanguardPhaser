import * as Phaser from 'phaser';
import {
  LEVEL4_TROJAN_DAMAGE,
  LEVEL4_TROJAN_HEALTH,
  LEVEL4_TROJAN_SCORE_VALUE,
  Level4TrojanEnemySnapshot,
} from '../scenes/level4TrojanCombat.js';

/**
 * Level4 Trojan enemy prefab for parity migration.
 */
export default class TrojanPrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'enemy-trojan';

  private enemyId: string;

  private velocityX: number;

  private velocityY: number;

  private currentHealth: number;

  public constructor(scene: Phaser.Scene, snapshot: Level4TrojanEnemySnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, TrojanPrefab.TEXTURE_KEY);
    this.enemyId = snapshot.enemyId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
    this.setOrigin(0.5, 0.5);
  }

  public toSnapshot(): Level4TrojanEnemySnapshot {
    return {
      centerX: this.x,
      centerY: this.y,
      currentHealth: this.currentHealth,
      damage: LEVEL4_TROJAN_DAMAGE,
      enemyId: this.enemyId,
      height: this.displayHeight,
      scoreValue: LEVEL4_TROJAN_SCORE_VALUE,
      velocityX: this.velocityX,
      velocityY: this.velocityY,
      width: this.displayWidth,
    };
  }

  public applySnapshot(snapshot: Level4TrojanEnemySnapshot): void {
    this.x = snapshot.centerX;
    this.y = snapshot.centerY;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
  }

  public getEnemyId(): string {
    return this.enemyId;
  }

  public static createInitialSnapshot(snapshot: Level4TrojanEnemySnapshot): Level4TrojanEnemySnapshot {
    return {
      ...snapshot,
      currentHealth: LEVEL4_TROJAN_HEALTH,
      damage: LEVEL4_TROJAN_DAMAGE,
      scoreValue: LEVEL4_TROJAN_SCORE_VALUE,
    };
  }
}
