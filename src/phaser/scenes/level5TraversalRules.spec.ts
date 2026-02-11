import { describe, expect, it } from 'vitest';
import {
  canMoveWithinLevel5Bounds,
  isLevel5VictoryTriggered,
  Level5TraversalSnapshot,
} from './level5TraversalRules.js';

function createSnapshot(overrides: Partial<Level5TraversalSnapshot> = {}): Level5TraversalSnapshot {
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

describe('level5 traversal rules parity', () => {
  it('blocks right movement when player reaches max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: (0.91 * 1920) - (64 / 2),
    });

    expect(canMoveWithinLevel5Bounds(snapshot, 'E')).toBe(false);
  });

  it('allows right movement while player is still below max-x threshold', () => {
    const snapshot = createSnapshot({
      playerX: ((0.91 * 1920) - (64 / 2)) - 0.0001,
    });

    expect(canMoveWithinLevel5Bounds(snapshot, 'E')).toBe(true);
  });

  it('triggers non-combat victory only inside legacy victory corridor', () => {
    const activeVictorySnapshot = createSnapshot({
      playerX: (0.89 * 1920) - (64 / 2) + 0.001,
      playerY: (0.5 * 1080) - (64 / 2),
    });
    const blockedVictorySnapshot = createSnapshot({
      playerX: (0.89 * 1920) - (64 / 2),
      playerY: (0.5 * 1080) - (64 / 2),
    });

    expect(isLevel5VictoryTriggered(activeVictorySnapshot)).toBe(true);
    expect(isLevel5VictoryTriggered(blockedVictorySnapshot)).toBe(false);
  });
});
