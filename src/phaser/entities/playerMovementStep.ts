import { MOVEMENT_PARITY } from '../config/parityConstants.js';
import { PlayerFacingDirection } from './playerFacingState.js';

export interface MovementInputState {
  down: boolean;
  left: boolean;
  right: boolean;
  up: boolean;
}

export interface PlayerMovementStep {
  deltaX: number;
  deltaY: number;
  facingDirection: PlayerFacingDirection | null;
  isMoving: boolean;
}

export function resolvePlayerMovementStep(inputState: MovementInputState): PlayerMovementStep {
  const moveSpeed: number = MOVEMENT_PARITY.playerMoveSpeedPerFrame;
  const diagonalMoveSpeed: number = moveSpeed * MOVEMENT_PARITY.diagonalNormalizationFactor;

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
