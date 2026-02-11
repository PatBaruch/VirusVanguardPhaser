import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS } from './level0DialogueState.js';
import { LEVEL1_DIALOGUE_TEXTURE_KEYS } from './level1DialogueState.js';
import { LEVEL2_DIALOGUE_TEXTURE_KEYS } from './level2DialogueState.js';
import { LEVEL3_DIALOGUE_TEXTURE_KEYS } from './level3DialogueState.js';
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
        LEVEL1_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level1/Level1-${index}.png`);
        });
        LEVEL2_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level2/Level2-${index}.png`);
        });
        LEVEL3_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level3/Level3-${index}.png`);
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