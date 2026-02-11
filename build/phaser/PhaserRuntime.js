import * as Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';
export default class PhaserRuntime {
    canvas;
    game;
    constructor(canvas) {
        this.canvas = canvas;
        this.game = null;
    }
    start() {
        if (this.game !== null) {
            return;
        }
        this.game = new Phaser.Game({
            type: Phaser.CANVAS,
            canvas: this.canvas,
            width: window.innerWidth,
            height: window.innerHeight,
            backgroundColor: '#000000',
            scene: [BootScene, PreloadScene, GameScene],
        });
    }
    getGameInstance() {
        return this.game;
    }
}
//# sourceMappingURL=PhaserRuntime.js.map