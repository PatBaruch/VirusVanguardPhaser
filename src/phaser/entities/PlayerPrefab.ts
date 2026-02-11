import * as Phaser from 'phaser';
import {
  PlayerFacingDirection,
  PlayerFacingState,
  createInitialPlayerFacingState,
  setPlayerFacingDirection,
} from './playerFacingState.js';

/**
 * Player prefab shell used by Phaser migration scenes.
 */
export default class PlayerPrefab extends Phaser.GameObjects.Sprite {
  public static readonly INITIAL_POSITION_X: number = 180;

  public static readonly INITIAL_POSITION_Y: number = 490;

  private facingState: PlayerFacingState;

  public constructor(scene: Phaser.Scene) {
    const initialFacingState: PlayerFacingState = createInitialPlayerFacingState();
    super(
      scene,
      PlayerPrefab.INITIAL_POSITION_X,
      PlayerPrefab.INITIAL_POSITION_Y,
      initialFacingState.textureKey,
    );

    this.facingState = initialFacingState;
    this.setOrigin(0, 0);
    this.setVisible(false);
  }

  public getFacingDirection(): PlayerFacingDirection {
    return this.facingState.direction;
  }

  public setFacingDirection(direction: PlayerFacingDirection): void {
    this.facingState = setPlayerFacingDirection(this.facingState, direction);
    this.setTexture(this.facingState.textureKey);
  }
}
