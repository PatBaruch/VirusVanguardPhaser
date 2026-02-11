import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS } from './level0DialogueState.js';
import { PLAYER_FACING_DIRECTIONS, PLAYER_FACING_TEXTURE_KEYS, } from '../entities/playerFacingState.js';
export default class PreloadScene extends Phaser.Scene {
    static SCENE_KEY = 'PreloadScene';
    constructor() {
        super(PreloadScene.SCENE_KEY);
    }
    preload() {
        LEVEL0_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level0/Level0-${index}.png`);
        });
        PLAYER_FACING_DIRECTIONS.forEach((direction) => {
            this.load.image(PLAYER_FACING_TEXTURE_KEYS[direction], `./assets/Player-${direction}.png`);
        });
    }
    create() {
        this.scene.start(GameScene.SCENE_KEY);
    }
}
//# sourceMappingURL=PreloadScene.js.map