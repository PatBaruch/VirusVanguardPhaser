import { SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY } from '../config/parityConstants.js';

export const INITIAL_SCORE_MULTIPLIER: number = 5;

export const LEVEL5_VICTORY_UNLOCK_SCORE: number = 1010;

export interface Level5CombatBackdropSnapshot {
  score: number;
  activeCombatItemCount: number;
}

export interface Level5VictorySummarySnapshot {
  score: number;
  multiplier: number;
}

export interface Level5VictorySummaryText {
  scoreText: string;
  multiplierText: string;
  finalScoreText: string;
  restartPromptText: string;
}

export interface Level5VictoryRestartSnapshot {
  hasTriggeredVictory: boolean;
  isSpaceJustPressed: boolean;
}

export function advanceScoreMultiplier(currentMultiplier: number, isGameWon: boolean): number {
  if (isGameWon) {
    return currentMultiplier;
  }

  return currentMultiplier * SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY;
}

export function resolveLevel5CombatBackdropClass(snapshot: Level5CombatBackdropSnapshot): 'level5' | 'goNextLevel' {
  if (snapshot.score >= LEVEL5_VICTORY_UNLOCK_SCORE && snapshot.activeCombatItemCount === 0) {
    return 'goNextLevel';
  }

  return 'level5';
}

export function resolveVictorySummaryText(snapshot: Level5VictorySummarySnapshot): Level5VictorySummaryText {
  return {
    finalScoreText: `Final Score: ${(snapshot.score * snapshot.multiplier).toFixed(0)}`,
    multiplierText: `Score Multiplier: ${snapshot.multiplier.toFixed(2)}`,
    restartPromptText: 'Press Space to Restart',
    scoreText: `Score: ${snapshot.score}`,
  };
}

export function shouldRestartFromVictory(snapshot: Level5VictoryRestartSnapshot): boolean {
  return snapshot.hasTriggeredVictory && snapshot.isSpaceJustPressed;
}
