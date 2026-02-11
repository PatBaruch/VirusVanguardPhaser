import * as Phaser from 'phaser';
import BootScene from './scenes/BootScene.js';
import GameScene from './scenes/GameScene.js';
import PreloadScene from './scenes/PreloadScene.js';

/**
 * Temporary Phaser runtime bootstrap.
 * Scene lifecycle work will be introduced in PR-002.
 */
export default class PhaserRuntime {
  private canvas: HTMLCanvasElement;

  private game: Phaser.Game | null;

  public constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.game = null;
  }

  public start(): void {
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

  public getGameInstance(): Phaser.Game | null {
    return this.game;
  }
}
