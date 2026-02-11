import * as Phaser from 'phaser';
import { LEVEL_BOUNDS_PARITY } from '../config/parityConstants.js';
import {
  ProjectileMotionState,
  advanceProjectileMotion,
  isProjectileOutsideWorldBounds,
  resolveProjectileWorldBounds,
} from './projectileMotion.js';

export interface ProjectilePrefabConfig {
  startX: number;
  startY: number;
  velocityX: number;
  velocityY: number;
}

/**
 * Base projectile entity used by Phaser shooting systems.
 */
export default class ProjectilePrefab extends Phaser.GameObjects.Image {
  public static readonly TEXTURE_KEY: string = 'projectile-base';

  private velocityX: number;

  private velocityY: number;

  public constructor(scene: Phaser.Scene, config: ProjectilePrefabConfig) {
    super(scene, config.startX, config.startY, ProjectilePrefab.TEXTURE_KEY);
    this.velocityX = config.velocityX;
    this.velocityY = config.velocityY;
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
}
