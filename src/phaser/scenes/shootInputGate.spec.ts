import { describe, expect, it } from 'vitest';
import { canAcceptShootInput } from './shootInputGate.js';

describe('shoot input gate parity', () => {
  it('blocks shoot input in Level0', () => {
    expect(canAcceptShootInput(0)).toBe(false);
  });

  it('allows shoot input in combat levels', () => {
    expect(canAcceptShootInput(1)).toBe(true);
    expect(canAcceptShootInput(2)).toBe(true);
    expect(canAcceptShootInput(3)).toBe(true);
    expect(canAcceptShootInput(4)).toBe(true);
    expect(canAcceptShootInput(5)).toBe(true);
  });
});
