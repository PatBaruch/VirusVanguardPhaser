import PhaserRuntime from './phaser/PhaserRuntime.js';
import { getRuntimeMode } from './runtime/RuntimeMode.js';
const gameCanvasElement = document.getElementById('game');
if (!(gameCanvasElement instanceof HTMLCanvasElement)) {
    throw new Error('Expected #game to be an HTMLCanvasElement');
}
const runtimeMode = getRuntimeMode();
const shouldExposeE2ERuntime = new URLSearchParams(window.location.search).get('e2e') === '1';
window.addEventListener('load', () => {
    if (runtimeMode === 'phaser') {
        const phaserRuntime = new PhaserRuntime(gameCanvasElement);
        phaserRuntime.start();
        if (shouldExposeE2ERuntime) {
            window.__VV_E2E_RUNTIME__ = phaserRuntime;
        }
    }
});
//# sourceMappingURL=app.js.map