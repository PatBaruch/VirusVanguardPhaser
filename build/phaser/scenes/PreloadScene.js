import * as Phaser from 'phaser';
import GameScene from './GameScene.js';
export default class PreloadScene extends Phaser.Scene {
    static SCENE_KEY = 'PreloadScene';
    constructor() {
        super(PreloadScene.SCENE_KEY);
    }
    preload() {
    }
    create() {
        this.scene.start(GameScene.SCENE_KEY);
    }
}
//# sourceMappingURL=PreloadScene.js.map