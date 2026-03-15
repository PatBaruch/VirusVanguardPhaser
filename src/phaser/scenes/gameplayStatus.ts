export interface GameplayHudTextSnapshot {
  activeLevelId: 0 | 1 | 2 | 3 | 4 | 5;
  playerHealth: number;
  score: number;
  scoreMultiplier: number;
}

export interface GameplayHudText {
  health: string;
  level: string;
  multiplier: string;
  score: string;
}

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
  return {
    health: `Health: ${Math.max(0, Math.floor(snapshot.playerHealth))}`,
    level: `Level: ${snapshot.activeLevelId}`,
    multiplier: `Multiplier: x${snapshot.scoreMultiplier.toFixed(2)}`,
    score: `Score: ${snapshot.score}`,
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
