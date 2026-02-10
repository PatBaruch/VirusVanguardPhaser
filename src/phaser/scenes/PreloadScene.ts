import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS } from './level0DialogueState.js';

/**
 * Minimal preload scene shell for Phaser runtime lifecycle.
 */
export default class PreloadScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'PreloadScene';

  public constructor() {
    super(PreloadScene.SCENE_KEY);
  }

  public preload(): void {
    LEVEL0_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey: string, index: number) => {
      this.load.image(dialogueTextureKey, `./assets/Dialogue-Level0/Level0-${index}.png`);
    });
  }

  public create(): void {
    this.scene.start(GameScene.SCENE_KEY);
  }
}
