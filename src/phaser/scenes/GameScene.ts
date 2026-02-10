import * as Phaser from 'phaser';

/**
 * Minimal game scene shell for Phaser runtime lifecycle.
 */
export default class GameScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'GameScene';

  public constructor() {
    super(GameScene.SCENE_KEY);
  }

  public create(): void {
  }

  public override update(): void {
  }
}
