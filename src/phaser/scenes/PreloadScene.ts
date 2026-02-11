import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS } from './level0DialogueState.js';
import { LEVEL1_DIALOGUE_TEXTURE_KEYS } from './level1DialogueState.js';
import { LEVEL2_DIALOGUE_TEXTURE_KEYS } from './level2DialogueState.js';
import { LEVEL3_DIALOGUE_TEXTURE_KEYS } from './level3DialogueState.js';
import {
  PLAYER_FACING_DIRECTIONS,
  PLAYER_FACING_TEXTURE_KEYS,
  PlayerFacingDirection,
} from '../entities/playerFacingState.js';

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

    LEVEL1_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey: string, index: number) => {
      this.load.image(dialogueTextureKey, `./assets/Dialogue-Level1/Level1-${index}.png`);
    });

    LEVEL2_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey: string, index: number) => {
      this.load.image(dialogueTextureKey, `./assets/Dialogue-Level2/Level2-${index}.png`);
    });

    LEVEL3_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey: string, index: number) => {
      this.load.image(dialogueTextureKey, `./assets/Dialogue-Level3/Level3-${index}.png`);
    });

    PLAYER_FACING_DIRECTIONS.forEach((direction: PlayerFacingDirection) => {
      this.load.image(
        PLAYER_FACING_TEXTURE_KEYS[direction],
        `./assets/Player-${direction}.png`,
      );
    });
  }

  public create(): void {
    this.scene.start(GameScene.SCENE_KEY);
  }
}
