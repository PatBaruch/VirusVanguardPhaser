import { MOVEMENT_PARITY } from '../config/parityConstants.js';
export function resolvePlayerMovementStep(inputState) {
    const moveSpeed = MOVEMENT_PARITY.playerMoveSpeedPerFrame;
    const diagonalMoveSpeed = moveSpeed * MOVEMENT_PARITY.diagonalNormalizationFactor;
    if (inputState.up && inputState.right) {
        return {
            deltaX: diagonalMoveSpeed,
            deltaY: -diagonalMoveSpeed,
            facingDirection: 'NE',
            isMoving: true,
        };
    }
    if (inputState.down && inputState.right) {
        return {
            deltaX: diagonalMoveSpeed,
            deltaY: diagonalMoveSpeed,
            facingDirection: 'SE',
            isMoving: true,
        };
    }
    if (inputState.up && inputState.left) {
        return {
            deltaX: -diagonalMoveSpeed,
            deltaY: -diagonalMoveSpeed,
            facingDirection: 'NW',
            isMoving: true,
        };
    }
    if (inputState.down && inputState.left) {
        return {
            deltaX: -diagonalMoveSpeed,
            deltaY: diagonalMoveSpeed,
            facingDirection: 'SW',
            isMoving: true,
        };
    }
    if (inputState.up) {
        return {
            deltaX: 0,
            deltaY: -moveSpeed,
            facingDirection: 'N',
            isMoving: true,
        };
    }
    if (inputState.left) {
        return {
            deltaX: -moveSpeed,
            deltaY: 0,
            facingDirection: 'W',
            isMoving: true,
        };
    }
    if (inputState.down) {
        return {
            deltaX: 0,
            deltaY: moveSpeed,
            facingDirection: 'S',
            isMoving: true,
        };
    }
    if (inputState.right) {
        return {
            deltaX: moveSpeed,
            deltaY: 0,
            facingDirection: 'E',
            isMoving: true,
        };
    }
    return {
        deltaX: 0,
        deltaY: 0,
        facingDirection: null,
        isMoving: false,
    };
}
//# sourceMappingURL=playerMovementStep.js.map