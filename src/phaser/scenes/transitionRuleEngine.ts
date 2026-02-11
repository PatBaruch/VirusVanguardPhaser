import { LEVEL_SCORE_THRESHOLDS_PARITY, LevelId } from '../config/parityConstants.js';

export function canTriggerLevelTransition(
  fromLevel: LevelId,
  score: number,
  activeItemCount: number,
): boolean {
  if (fromLevel === 0) {
    return true;
  }

  const scoreThreshold: number = LEVEL_SCORE_THRESHOLDS_PARITY[fromLevel];
  return score >= scoreThreshold && activeItemCount === 0;
}
