import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS } from './level0DialogueState.js';
import { LEVEL1_DIALOGUE_TEXTURE_KEYS } from './level1DialogueState.js';
import { LEVEL2_DIALOGUE_TEXTURE_KEYS } from './level2DialogueState.js';
import { LEVEL3_DIALOGUE_TEXTURE_KEYS } from './level3DialogueState.js';
import { LEVEL4_DIALOGUE_TEXTURE_KEYS } from './level4DialogueState.js';
import { LEVEL5_DIALOGUE_TEXTURE_KEYS } from './level5DialogueState.js';
import { PLAYER_FACING_DIRECTIONS, PLAYER_FACING_TEXTURE_KEYS, } from '../entities/playerFacingState.js';
import ProjectilePrefab from '../entities/ProjectilePrefab.js';
import FEmailPrefab from '../entities/FEmailPrefab.js';
import RVirusPrefab from '../entities/RVirusPrefab.js';
import WormPrefab from '../entities/WormPrefab.js';
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
        LEVEL4_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level4/Level4-${index}.png`);
        });
        LEVEL5_DIALOGUE_TEXTURE_KEYS.forEach((dialogueTextureKey, index) => {
            this.load.image(dialogueTextureKey, `./assets/Dialogue-Level5/Level5-${index}.png`);
        });
        PLAYER_FACING_DIRECTIONS.forEach((direction) => {
            this.load.image(PLAYER_FACING_TEXTURE_KEYS[direction], `./assets/Player-${direction}.png`);
        });
        this.load.image(ProjectilePrefab.TEXTURE_KEY, './assets/Bullet-Sprite/PBsprite_0.png');
        this.load.image(FEmailPrefab.TEXTURE_KEY, './assets/FishingMail-Sprite/FMsprite_00.png');
        this.load.image(RVirusPrefab.TEXTURE_KEY, './assets/Resident-Sprite/Rsprite_0.png');
        this.load.image(WormPrefab.TEXTURE_KEY, './assets/Worm-Sprite/Wsprite_0.png');
    }
    create() {
        this.scene.start(GameScene.SCENE_KEY);
    }
}
//# sourceMappingURL=PreloadScene.js.map