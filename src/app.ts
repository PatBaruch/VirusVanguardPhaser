import PhaserRuntime from './phaser/PhaserRuntime.js';
import { getRuntimeMode } from './runtime/RuntimeMode.js';

interface E2ETestWindow extends Window {
  __VV_E2E_RUNTIME__?: PhaserRuntime;
}

const gameCanvasElement: HTMLElement | null = document.getElementById('game');
if (!(gameCanvasElement instanceof HTMLCanvasElement)) {
  throw new Error('Expected #game to be an HTMLCanvasElement');
}

const runtimeMode: 'phaser' = getRuntimeMode();
const shouldExposeE2ERuntime: boolean = new URLSearchParams(window.location.search).get('e2e') === '1';

window.addEventListener('load', () => {
  if (runtimeMode === 'phaser') {
    const phaserRuntime: PhaserRuntime = new PhaserRuntime(gameCanvasElement);
    phaserRuntime.start();

    if (shouldExposeE2ERuntime) {
      (window as E2ETestWindow).__VV_E2E_RUNTIME__ = phaserRuntime;
    }
  }
});
