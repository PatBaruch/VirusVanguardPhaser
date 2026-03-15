export interface GameplayHudTextSnapshot {
  activeLevelId: 0 | 1 | 2 | 3 | 4 | 5;
  activeCombatItemCount: number;
  controlsHint: string;
  lastCombatFeedback: CombatFeedbackState;
  playerHealth: number;
  score: number;
  scoreMultiplier: number;
  statusOverride?: string | null;
}

export interface GameplayHudText {
  controls: string;
  health: string;
  level: string;
  multiplier: string;
  score: string;
  status: string;
}

export type CombatFeedbackState = 'enemyDeath' | 'enemyHit' | 'none' | 'playerDamaged';

export interface GameOverTriggerSnapshot {
  hasTriggeredGameOver: boolean;
  hasTriggeredVictory: boolean;
  playerHealth: number;
}

export interface PlayerStateClassSnapshot {
  hasTriggeredGameOver: boolean;
  hasTriggeredVictory: boolean;
  playerRecoveryMsRemaining: number;
}

export interface PlayerDamageRecoverySnapshot {
  damageDelta: number;
  playerRecoveryMsRemaining: number;
  recoveryDurationMs: number;
}

export interface PlayerDamageRecoveryResolution {
  appliedDamage: number;
  nextPlayerRecoveryMsRemaining: number;
}

export function resolveGameplayHudText(snapshot: GameplayHudTextSnapshot): GameplayHudText {
  const isExitOpen = snapshot.activeLevelId !== 0
    && snapshot.activeCombatItemCount === 0
    && ((snapshot.activeLevelId === 1 && snapshot.score >= 200)
      || (snapshot.activeLevelId === 2 && snapshot.score >= 400)
      || (snapshot.activeLevelId === 3 && snapshot.score >= 600)
      || (snapshot.activeLevelId === 4 && snapshot.score >= 1000)
      || snapshot.activeLevelId === 5);

  const status = snapshot.lastCombatFeedback === 'enemyDeath'
    ? 'Status: Threat eliminated'
    : snapshot.lastCombatFeedback === 'enemyHit'
      ? 'Status: Hit confirmed'
      : snapshot.statusOverride !== undefined && snapshot.statusOverride !== null
        ? snapshot.statusOverride
      : snapshot.lastCombatFeedback === 'playerDamaged'
        ? 'Status: Under attack'
        : isExitOpen
          ? 'Status: Exit open -> move right'
          : 'Status: Clear the room';

  return {
    controls: `Controls: ${snapshot.controlsHint}`,
    health: `Health: ${Math.max(0, Math.floor(snapshot.playerHealth))}`,
    level: `Level: ${snapshot.activeLevelId}`,
    multiplier: `Multiplier: x${snapshot.scoreMultiplier.toFixed(2)}`,
    score: `Score: ${snapshot.score}`,
    status,
  };
}

export function shouldTriggerGameOver(snapshot: GameOverTriggerSnapshot): boolean {
  return !snapshot.hasTriggeredGameOver
    && !snapshot.hasTriggeredVictory
    && snapshot.playerHealth <= 0;
}

export function resolveNextPlayerRecoveryMsRemaining(
  playerRecoveryMsRemaining: number,
  elapsedMs: number,
): number {
  return Math.max(0, playerRecoveryMsRemaining - elapsedMs);
}

export function resolvePlayerDamageRecovery(
  snapshot: PlayerDamageRecoverySnapshot,
): PlayerDamageRecoveryResolution {
  if (snapshot.damageDelta <= 0) {
    return {
      appliedDamage: 0,
      nextPlayerRecoveryMsRemaining: Math.max(0, snapshot.playerRecoveryMsRemaining),
    };
  }

  if (snapshot.playerRecoveryMsRemaining > 0) {
    return {
      appliedDamage: 0,
      nextPlayerRecoveryMsRemaining: snapshot.playerRecoveryMsRemaining,
    };
  }

  return {
    appliedDamage: snapshot.damageDelta,
    nextPlayerRecoveryMsRemaining: snapshot.recoveryDurationMs,
  };
}

export function resolvePlayerStateClass(snapshot: PlayerStateClassSnapshot): 'active' | 'recovering' | 'gameOver' | 'victory' {
  if (snapshot.hasTriggeredGameOver) {
    return 'gameOver';
  }

  if (snapshot.hasTriggeredVictory) {
    return 'victory';
  }

  if (snapshot.playerRecoveryMsRemaining > 0) {
    return 'recovering';
  }

  return 'active';
}
