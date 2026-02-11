import { describe, expect, it } from 'vitest';
import {
  canMoveWithinLevel2Bounds,
  isLevel2ToLevel3TransitionTriggered,
  Level2TraversalSnapshot,
} from './level2TraversalRules.js';

function createSnapshot(overrides: Partial<Level2TraversalSnapshot> = {}): Level2TraversalSnapshot {
  return {
    canvasHeight: 1080,
    canvasWidth: 1920,
    playerHeight: 64,
    playerWidth: 64,
    playerX: 180,
    playerY: 490,
    ...overrides,
  };
}

describe('level2 traversal rules parity', () => {
  it('blocks right movement when player reaches max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: (0.91 * 1920) - (64 / 2),
    });

    expect(canMoveWithinLevel2Bounds(snapshot, 'E')).toBe(false);
  });

  it('allows right movement while player is still below max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: ((0.91 * 1920) - (64 / 2)) - 0.0001,
    });

    expect(canMoveWithinLevel2Bounds(snapshot, 'E')).toBe(true);
  });

  it('blocks north-east movement when player is above min-y threshold', () => {
    const snapshot = createSnapshot({
      playerY: 0.1 * 1080,
    });

    expect(canMoveWithinLevel2Bounds(snapshot, 'NE')).toBe(false);
  });

  it('triggers Level3 transition only inside legacy transition corridor', () => {
    const activeTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2) + 0.001,
      playerY: (0.5 * 1080) - (64 / 2),
    });
    const blockedTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2),
      playerY: (0.5 * 1080) - (64 / 2),
    });

    expect(isLevel2ToLevel3TransitionTriggered(activeTransitionSnapshot)).toBe(true);
    expect(isLevel2ToLevel3TransitionTriggered(blockedTransitionSnapshot)).toBe(false);
  });
});
