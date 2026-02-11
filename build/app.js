import PhaserRuntime from './phaser/PhaserRuntime.js';
import { getRuntimeMode } from './runtime/RuntimeMode.js';
const gameCanvasElement = document.getElementById('game');
if (!(gameCanvasElement instanceof HTMLCanvasElement)) {
    throw new Error('Expected #game to be an HTMLCanvasElement');
}
const runtimeMode = getRuntimeMode();
window.addEventListener('load', () => {
    if (runtimeMode === 'phaser') {
        const phaserRuntime = new PhaserRuntime(gameCanvasElement);
        phaserRuntime.start();
    }
});
//# sourceMappingURL=app.js.map