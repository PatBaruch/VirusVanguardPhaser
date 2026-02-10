import * as Phaser from 'phaser';
import GameScene from './GameScene.js';

/**
 * Minimal preload scene shell for Phaser runtime lifecycle.
 */
export default class PreloadScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'PreloadScene';

  public constructor() {
    super(PreloadScene.SCENE_KEY);
  }

  public preload(): void {
  }

  public create(): void {
    this.scene.start(GameScene.SCENE_KEY);
  }
}
