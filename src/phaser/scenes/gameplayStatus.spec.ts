import { describe, expect, test } from 'vitest';

import {
  resolveNextPlayerRecoveryMsRemaining,
  resolvePlayerDamageRecovery,
  resolveGameplayHudText,
  resolvePlayerStateClass,
  shouldTriggerGameOver,
} from './gameplayStatus.js';

describe('gameplay status helpers', () => {
  test('formats HUD text with level, score, health, and multiplier', () => {
    const hudText = resolveGameplayHudText({
      activeLevelId: 3,
      activeCombatItemCount: 2,
      controlsHint: 'WASD move | Space fire',
      lastCombatFeedback: 'enemyHit',
      playerHealth: 87,
      score: 420,
      scoreMultiplier: 2.25,
    });

    expect(hudText).toEqual({
      controls: 'Controls: WASD move | Space fire',
      health: 'Health: 87',
      level: 'Level: 3',
      multiplier: 'Multiplier: x2.25',
      score: 'Score: 420',
      status: 'Status: Hit confirmed',
    });
  });

  test('surfaces explicit exit-open messaging when the room is clear', () => {
    const hudText = resolveGameplayHudText({
      activeLevelId: 2,
      activeCombatItemCount: 0,
      controlsHint: 'WASD move | Space fire',
      lastCombatFeedback: 'none',
      playerHealth: 100,
      score: 400,
      scoreMultiplier: 1,
    });

    expect(hudText.status).toBe('Status: Exit open -> move right');
  });

  test('triggers game over only when health reaches zero before victory', () => {
    expect(shouldTriggerGameOver({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: false,
      playerHealth: 0,
    })).toBe(true);

    expect(shouldTriggerGameOver({
      hasTriggeredGameOver: true,
      hasTriggeredVictory: false,
      playerHealth: 0,
    })).toBe(false);

    expect(shouldTriggerGameOver({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: true,
      playerHealth: 0,
    })).toBe(false);

    expect(shouldTriggerGameOver({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: false,
      playerHealth: 1,
    })).toBe(false);
  });

  test('maps game-over and victory states to deterministic CSS classes', () => {
    expect(resolvePlayerStateClass({
      hasTriggeredGameOver: true,
      hasTriggeredVictory: false,
      playerRecoveryMsRemaining: 0,
    })).toBe('gameOver');

    expect(resolvePlayerStateClass({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: true,
      playerRecoveryMsRemaining: 0,
    })).toBe('victory');

    expect(resolvePlayerStateClass({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: false,
      playerRecoveryMsRemaining: 450,
    })).toBe('recovering');

    expect(resolvePlayerStateClass({
      hasTriggeredGameOver: false,
      hasTriggeredVictory: false,
      playerRecoveryMsRemaining: 0,
    })).toBe('active');
  });

  test('blocks repeated damage during the recovery window and allows damage again after it expires', () => {
    const firstHit = resolvePlayerDamageRecovery({
      damageDelta: 10,
      playerRecoveryMsRemaining: 0,
      recoveryDurationMs: 450,
    });

    expect(firstHit.appliedDamage).toBe(10);
    expect(firstHit.nextPlayerRecoveryMsRemaining).toBe(450);

    const blockedHit = resolvePlayerDamageRecovery({
      damageDelta: 10,
      playerRecoveryMsRemaining: firstHit.nextPlayerRecoveryMsRemaining,
      recoveryDurationMs: 450,
    });

    expect(blockedHit.appliedDamage).toBe(0);
    expect(blockedHit.nextPlayerRecoveryMsRemaining).toBe(firstHit.nextPlayerRecoveryMsRemaining);

    const recoveredWindow = resolveNextPlayerRecoveryMsRemaining(
      firstHit.nextPlayerRecoveryMsRemaining,
      500,
    );

    const postRecoveryHit = resolvePlayerDamageRecovery({
      damageDelta: 10,
      playerRecoveryMsRemaining: recoveredWindow,
      recoveryDurationMs: 450,
    });

    expect(postRecoveryHit.appliedDamage).toBe(10);
    expect(postRecoveryHit.nextPlayerRecoveryMsRemaining).toBe(450);
  });
});
