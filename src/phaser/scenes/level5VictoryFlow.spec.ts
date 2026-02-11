import { describe, expect, it } from 'vitest';
import {
  INITIAL_SCORE_MULTIPLIER,
  LEVEL5_VICTORY_UNLOCK_SCORE,
  advanceScoreMultiplier,
  resolveLevel5CombatBackdropClass,
  resolveVictorySummaryText,
  shouldRestartFromVictory,
} from './level5VictoryFlow.js';

describe('level5 victory flow parity', () => {
  it('decays score multiplier every update before the game is won', () => {
    const multiplier = advanceScoreMultiplier(INITIAL_SCORE_MULTIPLIER, false);

    expect(multiplier).toBeCloseTo(4.9995);
  });

  it('keeps score multiplier frozen after the game is won', () => {
    const multiplier = advanceScoreMultiplier(3.25, true);

    expect(multiplier).toBe(3.25);
  });

  it('switches level5 backdrop to goNextLevel once boss arena is clear and score is unlocked', () => {
    const backdropClass = resolveLevel5CombatBackdropClass({
      activeCombatItemCount: 0,
      score: LEVEL5_VICTORY_UNLOCK_SCORE,
    });

    expect(backdropClass).toBe('goNextLevel');
  });

  it('keeps level5 backdrop while combat is still active', () => {
    const backdropClass = resolveLevel5CombatBackdropClass({
      activeCombatItemCount: 1,
      score: 9999,
    });

    expect(backdropClass).toBe('level5');
  });

  it('formats legacy victory text with final multiplier and rounded final score', () => {
    const summary = resolveVictorySummaryText({
      multiplier: 3.456,
      score: 1234,
    });

    expect(summary.scoreText).toBe('Score: 1234');
    expect(summary.multiplierText).toBe('Score Multiplier: 3.46');
    expect(summary.finalScoreText).toBe('Final Score: 4265');
    expect(summary.restartPromptText).toBe('Press Space to Restart');
  });

  it('only allows restart input from the victory state', () => {
    expect(shouldRestartFromVictory({
      hasTriggeredVictory: false,
      isSpaceJustPressed: true,
    })).toBe(false);
    expect(shouldRestartFromVictory({
      hasTriggeredVictory: true,
      isSpaceJustPressed: false,
    })).toBe(false);
    expect(shouldRestartFromVictory({
      hasTriggeredVictory: true,
      isSpaceJustPressed: true,
    })).toBe(true);
  });
});
