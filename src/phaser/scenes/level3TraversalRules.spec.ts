import { describe, expect, it } from 'vitest';
import {
  canMoveWithinLevel3Bounds,
  isLevel3ToLevel4TransitionTriggered,
  Level3TraversalSnapshot,
} from './level3TraversalRules.js';

function createSnapshot(overrides: Partial<Level3TraversalSnapshot> = {}): Level3TraversalSnapshot {
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

describe('level3 traversal rules parity', () => {
  it('blocks right movement when player reaches max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: (0.91 * 1920) - (64 / 2),
    });

    expect(canMoveWithinLevel3Bounds(snapshot, 'E')).toBe(false);
  });

  it('allows right movement while player is still below max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: ((0.91 * 1920) - (64 / 2)) - 0.0001,
    });

    expect(canMoveWithinLevel3Bounds(snapshot, 'E')).toBe(true);
  });

  it('blocks north-east movement when player is above min-y threshold', () => {
    const snapshot = createSnapshot({
      playerY: 0.1 * 1080,
    });

    expect(canMoveWithinLevel3Bounds(snapshot, 'NE')).toBe(false);
  });

  it('triggers Level4 transition only inside legacy transition corridor', () => {
    const activeTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2) + 0.001,
      playerY: (0.5 * 1080) - (64 / 2),
    });
    const blockedTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2),
      playerY: (0.5 * 1080) - (64 / 2),
    });

    expect(isLevel3ToLevel4TransitionTriggered(activeTransitionSnapshot)).toBe(true);
    expect(isLevel3ToLevel4TransitionTriggered(blockedTransitionSnapshot)).toBe(false);
  });
});
