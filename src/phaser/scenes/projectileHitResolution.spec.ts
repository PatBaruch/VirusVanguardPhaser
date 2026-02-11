import { describe, expect, it } from 'vitest';
import {
  CombatProjectileSnapshot,
  CombatTargetSnapshot,
  resolveProjectileHitResolution,
} from './projectileHitResolution.js';

function createProjectile(projectileId: string, centerX: number, centerY: number): CombatProjectileSnapshot {
  return {
    centerX,
    centerY,
    damage: 1,
    height: 10,
    projectileId,
    width: 10,
  };
}

function createTarget(targetId: string, centerX: number, centerY: number, health: number): CombatTargetSnapshot {
  return {
    centerX,
    centerY,
    currentHealth: health,
    height: 20,
    scoreValue: 10,
    targetId,
    width: 20,
  };
}

describe('projectile hit resolution parity', () => {
  it('keeps projectile and target active when no overlap occurs', () => {
    const result = resolveProjectileHitResolution({
      projectiles: [createProjectile('projectile-1', 20, 20)],
      targets: [createTarget('target-1', 200, 200, 1)],
    });

    expect(result.remainingProjectiles).toHaveLength(1);
    expect(result.remainingTargets).toHaveLength(1);
    expect(result.scoreDelta).toBe(0);
    expect(result.deathEffectSpawns).toEqual([]);
  });

  it('removes projectile and defeated target, spawns death effect, and returns score hook delta', () => {
    const result = resolveProjectileHitResolution({
      projectiles: [createProjectile('projectile-1', 100, 100)],
      targets: [createTarget('target-1', 100, 100, 1)],
    });

    expect(result.remainingProjectiles).toEqual([]);
    expect(result.remainingTargets).toEqual([]);
    expect(result.destroyedProjectileIds).toEqual(['projectile-1']);
    expect(result.destroyedTargetIds).toEqual(['target-1']);
    expect(result.scoreDelta).toBe(10);
    expect(result.deathEffectSpawns).toEqual([{ centerX: 100, centerY: 100 }]);
  });

  it('decrements target health without score when target survives hit', () => {
    const result = resolveProjectileHitResolution({
      projectiles: [createProjectile('projectile-1', 100, 100)],
      targets: [createTarget('target-1', 100, 100, 3)],
    });

    expect(result.remainingProjectiles).toEqual([]);
    expect(result.destroyedProjectileIds).toEqual(['projectile-1']);
    expect(result.destroyedTargetIds).toEqual([]);
    expect(result.scoreDelta).toBe(0);
    expect(result.remainingTargets).toEqual([
      {
        centerX: 100,
        centerY: 100,
        currentHealth: 2,
        height: 20,
        scoreValue: 10,
        targetId: 'target-1',
        width: 20,
      },
    ]);
    expect(result.deathEffectSpawns).toEqual([{ centerX: 100, centerY: 100 }]);
  });

  it('resolves sequential projectile hits against a single target deterministically', () => {
    const result = resolveProjectileHitResolution({
      projectiles: [
        createProjectile('projectile-1', 100, 100),
        createProjectile('projectile-2', 100, 100),
      ],
      targets: [createTarget('target-1', 100, 100, 2)],
    });

    expect(result.remainingProjectiles).toEqual([]);
    expect(result.remainingTargets).toEqual([]);
    expect(result.destroyedProjectileIds).toEqual(['projectile-1', 'projectile-2']);
    expect(result.destroyedTargetIds).toEqual(['target-1']);
    expect(result.scoreDelta).toBe(10);
    expect(result.deathEffectSpawns).toEqual([
      { centerX: 100, centerY: 100 },
      { centerX: 100, centerY: 100 },
    ]);
  });
});
