import { describe, expect, it } from 'vitest';
import {
  canMoveWithinLevel4Bounds,
  isLevel4ToLevel5TransitionTriggered,
  Level4TraversalSnapshot,
} from './level4TraversalRules.js';

function createSnapshot(overrides: Partial<Level4TraversalSnapshot> = {}): Level4TraversalSnapshot {
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

describe('level4 traversal rules parity', () => {
  it('blocks right movement when player reaches max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: (0.91 * 1920) - (64 / 2),
    });

    expect(canMoveWithinLevel4Bounds(snapshot, 'E')).toBe(false);
  });

  it('allows right movement while player is still below max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: ((0.91 * 1920) - (64 / 2)) - 0.0001,
    });

    expect(canMoveWithinLevel4Bounds(snapshot, 'E')).toBe(true);
  });

  it('blocks north-east movement when player is above min-y threshold', () => {
    const snapshot = createSnapshot({
      playerY: 0.1 * 1080,
    });

    expect(canMoveWithinLevel4Bounds(snapshot, 'NE')).toBe(false);
  });

  it('triggers Level5 transition only inside legacy transition corridor', () => {
    const activeTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2) + 0.001,
      playerY: (0.5 * 1080) - (64 / 2),
    });
    const blockedTransitionSnapshot = createSnapshot({
      playerX: (0.9 * 1920) - (64 / 2),
      playerY: (0.5 * 1080) - (64 / 2),
    });

    expect(isLevel4ToLevel5TransitionTriggered(activeTransitionSnapshot)).toBe(true);
    expect(isLevel4ToLevel5TransitionTriggered(blockedTransitionSnapshot)).toBe(false);
  });
});
