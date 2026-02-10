import * as Phaser from 'phaser';
import PreloadScene from './PreloadScene.js';
export default class BootScene extends Phaser.Scene {
    static SCENE_KEY = 'BootScene';
    constructor() {
        super(BootScene.SCENE_KEY);
    }
    create() {
        this.scene.start(PreloadScene.SCENE_KEY);
    }
}
//# sourceMappingURL=BootScene.js.map