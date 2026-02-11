import * as Phaser from 'phaser';
import {
  LEVEL5_MRHACKER_DAMAGE,
  LEVEL5_MRHACKER_HEALTH,
  LEVEL5_MRHACKER_SCORE_VALUE,
  LEVEL5_MRHACKER_TEXTURE_KEYS,
  Level5MrHackerEnemySnapshot,
} from '../scenes/level5MrHackerCombat.js';

/**
 * Level5 MrHacker boss prefab for parity migration.
 */
export default class MrHackerPrefab extends Phaser.GameObjects.Image {
  public static readonly BASE_TEXTURE_KEY: string = LEVEL5_MRHACKER_TEXTURE_KEYS[0];

  private enemyId: string;

  private velocityX: number;

  private velocityY: number;

  private currentHealth: number;

  private animationMsUntilNextFrame: number;

  private animationFrameIndex: number;

  public constructor(scene: Phaser.Scene, snapshot: Level5MrHackerEnemySnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, MrHackerPrefab.BASE_TEXTURE_KEY);
    this.enemyId = snapshot.enemyId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
    this.animationMsUntilNextFrame = 0;
    this.animationFrameIndex = 0;
    this.setOrigin(0.5, 0.5);
  }

  public toSnapshot(): Level5MrHackerEnemySnapshot {
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

  public applySnapshot(snapshot: Level5MrHackerEnemySnapshot): void {
    this.x = snapshot.centerX;
    this.y = snapshot.centerY;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.currentHealth = snapshot.currentHealth;
  }

  public advanceAnimation(elapsedMs: number): void {
    this.animationMsUntilNextFrame -= elapsedMs;
    if (this.animationMsUntilNextFrame > 0) {
      return;
    }

    this.animationMsUntilNextFrame = 150;
    this.animationFrameIndex = (this.animationFrameIndex + 1) % LEVEL5_MRHACKER_TEXTURE_KEYS.length;
    this.setTexture(LEVEL5_MRHACKER_TEXTURE_KEYS[this.animationFrameIndex]);
  }

  public decreaseHealthBy(amount: number): void {
    this.currentHealth = Math.max(0, this.currentHealth - amount);
  }

  public getCurrentHealth(): number {
    return this.currentHealth;
  }

  public getEnemyId(): string {
    return this.enemyId;
  }

  public static createInitialSnapshot(snapshot: Level5MrHackerEnemySnapshot): Level5MrHackerEnemySnapshot {
    return {
      ...snapshot,
      currentHealth: LEVEL5_MRHACKER_HEALTH,
      damage: LEVEL5_MRHACKER_DAMAGE,
      scoreValue: LEVEL5_MRHACKER_SCORE_VALUE,
    };
  }
}
