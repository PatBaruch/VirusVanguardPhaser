import { describe, expect, it } from 'vitest';
import { canTriggerLevelTransition } from './transitionRuleEngine.js';

describe('transition rule engine parity', () => {
  it('allows Level0 to Level1 transition without score or item predicates', () => {
    expect(canTriggerLevelTransition(0, 0, 99)).toBe(true);
  });

  it('blocks Level1 to Level2 transition when score threshold is not met', () => {
    expect(canTriggerLevelTransition(1, 199, 0)).toBe(false);
  });

  it('blocks transition when combat items are still active', () => {
    expect(canTriggerLevelTransition(2, 400, 1)).toBe(false);
  });

  it('allows transition when score threshold is met and no items remain', () => {
    expect(canTriggerLevelTransition(3, 600, 0)).toBe(true);
  });

  it('applies Level4 score gate before entering Level5', () => {
    expect(canTriggerLevelTransition(4, 999, 0)).toBe(false);
    expect(canTriggerLevelTransition(4, 1000, 0)).toBe(true);
  });

  it('requires item-clear predicate for Level5 victory transition', () => {
    expect(canTriggerLevelTransition(5, 0, 1)).toBe(false);
    expect(canTriggerLevelTransition(5, 0, 0)).toBe(true);
  });
});
