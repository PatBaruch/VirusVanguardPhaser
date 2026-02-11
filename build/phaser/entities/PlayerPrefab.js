import * as Phaser from 'phaser';
import { createInitialPlayerFacingState, setPlayerFacingDirection, } from './playerFacingState.js';
export default class PlayerPrefab extends Phaser.GameObjects.Sprite {
    static INITIAL_POSITION_X = 180;
    static INITIAL_POSITION_Y = 490;
    facingState;
    constructor(scene) {
        const initialFacingState = createInitialPlayerFacingState();
        super(scene, PlayerPrefab.INITIAL_POSITION_X, PlayerPrefab.INITIAL_POSITION_Y, initialFacingState.textureKey);
        this.facingState = initialFacingState;
        this.setOrigin(0, 0);
        this.setVisible(false);
    }
    getFacingDirection() {
        return this.facingState.direction;
    }
    setFacingDirection(direction) {
        this.facingState = setPlayerFacingDirection(this.facingState, direction);
        this.setTexture(this.facingState.textureKey);
    }
}
//# sourceMappingURL=PlayerPrefab.js.map