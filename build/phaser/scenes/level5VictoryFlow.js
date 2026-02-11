import { SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY } from '../config/parityConstants.js';
export const INITIAL_SCORE_MULTIPLIER = 5;
export const LEVEL5_VICTORY_UNLOCK_SCORE = 1010;
export function advanceScoreMultiplier(currentMultiplier, isGameWon) {
    if (isGameWon) {
        return currentMultiplier;
    }
    return currentMultiplier * SCORE_MULTIPLIER_DECAY_PER_UPDATE_PARITY;
}
export function resolveLevel5CombatBackdropClass(snapshot) {
    if (snapshot.score >= LEVEL5_VICTORY_UNLOCK_SCORE && snapshot.activeCombatItemCount === 0) {
        return 'goNextLevel';
    }
    return 'level5';
}
export function resolveVictorySummaryText(snapshot) {
    return {
        finalScoreText: `Final Score: ${(snapshot.score * snapshot.multiplier).toFixed(0)}`,
        multiplierText: `Score Multiplier: ${snapshot.multiplier.toFixed(2)}`,
        restartPromptText: 'Press Space to Restart',
        scoreText: `Score: ${snapshot.score}`,
    };
}
export function shouldRestartFromVictory(snapshot) {
    return snapshot.hasTriggeredVictory && snapshot.isSpaceJustPressed;
}
//# sourceMappingURL=level5VictoryFlow.js.map