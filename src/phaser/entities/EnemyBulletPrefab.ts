import * as Phaser from 'phaser';
import { LEVEL_BOUNDS_PARITY } from '../config/parityConstants.js';
import {
  ProjectileMotionState,
  advanceProjectileMotion,
  isProjectileOutsideWorldBounds,
  resolveProjectileWorldBounds,
} from './projectileMotion.js';
import {
  LEVEL5_MRHACKER_BULLET_DAMAGE,
  Level5MrHackerBulletSnapshot,
} from '../scenes/level5MrHackerCombat.js';

/**
 * Enemy bullet entity for Level5 MrHacker volley attacks.
 */
export default class EnemyBulletPrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'enemy-bullet-base';

  private bulletId: string;

  private velocityX: number;

  private velocityY: number;

  public constructor(scene: Phaser.Scene, snapshot: Level5MrHackerBulletSnapshot) {
    super(scene, snapshot.centerX, snapshot.centerY, EnemyBulletPrefab.TEXTURE_KEY);
    this.bulletId = snapshot.bulletId;
    this.velocityX = snapshot.velocityX;
    this.velocityY = snapshot.velocityY;
    this.setOrigin(0.5, 0.5);
  }

  public updateMotion(elapsedMs: number): void {
    const nextMotionState: ProjectileMotionState = advanceProjectileMotion(
      {
        positionX: this.x,
        positionY: this.y,
        velocityX: this.velocityX,
        velocityY: this.velocityY,
      },
      elapsedMs,
    );

    this.x = nextMotionState.positionX;
    this.y = nextMotionState.positionY;
  }

  public isOutsideCombatWorldBounds(canvasWidth: number, canvasHeight: number): boolean {
    const combatLevelBounds = LEVEL_BOUNDS_PARITY[1];
    const worldBounds = resolveProjectileWorldBounds({
      canvasHeight,
      canvasWidth,
      maxXRatio: combatLevelBounds.maxXRatio,
      maxYRatio: combatLevelBounds.maxYRatio,
      minXRatio: combatLevelBounds.minXRatio,
      minYRatio: combatLevelBounds.minYRatio,
    });

    return isProjectileOutsideWorldBounds(
      {
        positionX: this.x,
        positionY: this.y,
        velocityX: this.velocityX,
        velocityY: this.velocityY,
      },
      worldBounds,
    );
  }

  public toSnapshot(): Level5MrHackerBulletSnapshot {
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

  public getBulletId(): string {
    return this.bulletId;
  }
}
