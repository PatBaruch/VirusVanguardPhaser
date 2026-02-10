import * as Phaser from 'phaser';
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
            scene: {
                create: () => {
                },
            },
        });
    }
}
//# sourceMappingURL=PhaserRuntime.js.map