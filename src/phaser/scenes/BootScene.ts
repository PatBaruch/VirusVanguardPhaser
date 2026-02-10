import * as Phaser from 'phaser';
import PreloadScene from './PreloadScene.js';

/**
 * Minimal boot scene shell for Phaser runtime lifecycle.
 */
export default class BootScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'BootScene';

  public constructor() {
    super(BootScene.SCENE_KEY);
  }

  public create(): void {
    this.scene.start(PreloadScene.SCENE_KEY);
  }
}
