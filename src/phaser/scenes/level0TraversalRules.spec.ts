import { describe, expect, it } from 'vitest';
import {
  canMoveWithinLevel0Bounds,
  isLevel0ToLevel1TransitionTriggered,
  Level0TraversalSnapshot,
} from './level0TraversalRules.js';

function createSnapshot(overrides: Partial<Level0TraversalSnapshot> = {}): Level0TraversalSnapshot {
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

describe('level0 traversal rules parity', () => {
  it('blocks right movement when player reaches max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: (0.73 * 1920) - (64 / 2),
    });

    expect(canMoveWithinLevel0Bounds(snapshot, 'E')).toBe(false);
  });

  it('allows right movement while player is still below max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: ((0.73 * 1920) - (64 / 2)) - 0.0001,
    });

    expect(canMoveWithinLevel0Bounds(snapshot, 'E')).toBe(true);
  });

  it('blocks north-east movement when player is above min-y threshold', () => {
    const snapshot = createSnapshot({
      playerY: 0.22 * 1080,
    });

    expect(canMoveWithinLevel0Bounds(snapshot, 'NE')).toBe(false);
  });

  it('triggers Level1 transition only inside legacy transition corridor', () => {
    const activeTransitionSnapshot = createSnapshot({
      playerX: (0.72 * 1920) - (64 / 2) + 0.001,
      playerY: (0.5 * 1080) - (64 / 2),
    });
    const blockedTransitionSnapshot = createSnapshot({
      playerX: (0.72 * 1920) - (64 / 2),
      playerY: (0.5 * 1080) - (64 / 2),
    });

    expect(isLevel0ToLevel1TransitionTriggered(activeTransitionSnapshot)).toBe(true);
    expect(isLevel0ToLevel1TransitionTriggered(blockedTransitionSnapshot)).toBe(false);
  });
});
