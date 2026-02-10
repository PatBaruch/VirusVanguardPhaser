import VirusVanguard from './VirusVanguard.js';
import PhaserRuntime from './phaser/PhaserRuntime.js';
import { getRuntimeMode } from './runtime/RuntimeMode.js';

const gameCanvasElement: HTMLElement | null = document.getElementById('game');
if (!(gameCanvasElement instanceof HTMLCanvasElement)) {
  throw new Error('Expected #game to be an HTMLCanvasElement');
}

const runtimeMode: 'legacy' | 'phaser' = getRuntimeMode();

window.addEventListener('load', () => {
  if (runtimeMode === 'phaser') {
    const phaserRuntime: PhaserRuntime = new PhaserRuntime(gameCanvasElement);
    phaserRuntime.start();
    return;
  }

  const legacyRuntime: VirusVanguard = new VirusVanguard(gameCanvasElement);
  legacyRuntime.start();
});
