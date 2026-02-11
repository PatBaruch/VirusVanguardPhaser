import { describe, expect, it } from 'vitest';
import { MOVEMENT_PARITY } from '../config/parityConstants.js';
import {
  MovementInputState,
  resolvePlayerMovementStep,
} from './playerMovementStep.js';

function createInputState(overrides: Partial<MovementInputState> = {}): MovementInputState {
  return {
    down: false,
    left: false,
    right: false,
    up: false,
    ...overrides,
  };
}

describe('player movement step parity', () => {
  it('keeps the player still when no movement keys are held', () => {
    const movementStep = resolvePlayerMovementStep(createInputState());

    expect(movementStep).toEqual({
      deltaX: 0,
      deltaY: 0,
      facingDirection: null,
      isMoving: false,
    });
  });

  it('moves north-east with diagonal normalization when up and right are held', () => {
    const movementStep = resolvePlayerMovementStep(
      createInputState({ right: true, up: true }),
    );

    expect(movementStep.deltaX).toBe(MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
    expect(movementStep.deltaY).toBe(-MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
    expect(movementStep.facingDirection).toBe('NE');
    expect(movementStep.isMoving).toBe(true);
  });

  it('moves south-west with diagonal normalization when down and left are held', () => {
    const movementStep = resolvePlayerMovementStep(
      createInputState({ down: true, left: true }),
    );

    expect(movementStep.deltaX).toBe(-MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
    expect(movementStep.deltaY).toBe(MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
    expect(movementStep.facingDirection).toBe('SW');
    expect(movementStep.isMoving).toBe(true);
  });

  it('matches legacy precedence by preferring up-right when up, right, and down are all held', () => {
    const movementStep = resolvePlayerMovementStep(
      createInputState({ down: true, right: true, up: true }),
    );

    expect(movementStep.facingDirection).toBe('NE');
    expect(movementStep.deltaX).toBe(MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
    expect(movementStep.deltaY).toBe(-MOVEMENT_PARITY.playerMoveSpeedPerFrame * MOVEMENT_PARITY.diagonalNormalizationFactor);
  });

  it('matches legacy precedence by preferring up when up and down are both held', () => {
    const movementStep = resolvePlayerMovementStep(
      createInputState({ down: true, up: true }),
    );

    expect(movementStep.facingDirection).toBe('N');
    expect(movementStep.deltaX).toBe(0);
    expect(movementStep.deltaY).toBe(-MOVEMENT_PARITY.playerMoveSpeedPerFrame);
    expect(movementStep.isMoving).toBe(true);
  });
});
