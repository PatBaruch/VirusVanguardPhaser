import { LEVEL_SCORE_THRESHOLDS_PARITY } from '../config/parityConstants.js';
export function canTriggerLevelTransition(fromLevel, score, activeItemCount) {
    if (fromLevel === 0) {
        return true;
    }
    const scoreThreshold = LEVEL_SCORE_THRESHOLDS_PARITY[fromLevel];
    return score >= scoreThreshold && activeItemCount === 0;
}
//# sourceMappingURL=transitionRuleEngine.js.map