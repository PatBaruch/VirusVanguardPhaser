export interface Level5MrHackerEnemySnapshot {
  enemyId: string;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  currentHealth: number;
  damage: number;
  scoreValue: number;
}

export interface Level5MrHackerSpawnState {
  hasSpawned: boolean;
}

export interface Level5MrHackerSpawnSnapshot {
  canSpawn: boolean;
  canvasWidth: number;
  canvasHeight: number;
}

export interface Level5MrHackerSpawnResult {
  nextState: Level5MrHackerSpawnState;
  spawnedEnemies: Level5MrHackerEnemySnapshot[];
}

export const LEVEL5_MRHACKER_DAMAGE: number = 20;
export const LEVEL5_MRHACKER_HEALTH: number = 25;
export const LEVEL5_MRHACKER_SCORE_VALUE: number = 100;

export const LEVEL5_MRHACKER_TEXTURE_KEYS: readonly string[] = [
  'mrhacker-0',
  'mrhacker-1',
  'mrhacker-2',
];

export const LEVEL5_MRHACKER_HEALTH_BAR_TEXTURE_KEYS: readonly string[] = [
  'bossbar-00',
  'bossbar-01',
  'bossbar-02',
  'bossbar-03',
  'bossbar-04',
  'bossbar-05',
  'bossbar-06',
  'bossbar-07',
  'bossbar-08',
  'bossbar-09',
  'bossbar-10',
  'bossbar-11',
  'bossbar-12',
  'bossbar-13',
  'bossbar-14',
  'bossbar-15',
  'bossbar-16',
  'bossbar-17',
  'bossbar-18',
  'bossbar-19',
  'bossbar-20',
  'bossbar-21',
  'bossbar-22',
  'bossbar-23',
  'bossbar-24',
  'bossbar-25',
];

export function createInitialLevel5MrHackerSpawnState(): Level5MrHackerSpawnState {
  return {
    hasSpawned: false,
  };
}

export function advanceLevel5MrHackerSpawnState(
  previousState: Level5MrHackerSpawnState,
  snapshot: Level5MrHackerSpawnSnapshot,
): Level5MrHackerSpawnResult {
  if (!snapshot.canSpawn || previousState.hasSpawned) {
    return {
      nextState: previousState,
      spawnedEnemies: [],
    };
  }

  const mrHacker: Level5MrHackerEnemySnapshot = {
    centerX: snapshot.canvasWidth * 0.7,
    centerY: snapshot.canvasHeight * 0.43,
    currentHealth: LEVEL5_MRHACKER_HEALTH,
    damage: LEVEL5_MRHACKER_DAMAGE,
    enemyId: 'level5-mrhacker-0',
    height: 0,
    scoreValue: LEVEL5_MRHACKER_SCORE_VALUE,
    velocityX: 0,
    velocityY: -(0.5 / 2),
    width: 0,
  };

  return {
    nextState: {
      hasSpawned: true,
    },
    spawnedEnemies: [mrHacker],
  };
}

export function resolveLevel5MrHackerHealthBarTextureKey(currentHealth: number): string {
  const clampedHealth: number = Math.max(
    0,
    Math.min(LEVEL5_MRHACKER_HEALTH, Math.floor(currentHealth)),
  );
  return LEVEL5_MRHACKER_HEALTH_BAR_TEXTURE_KEYS[clampedHealth];
}
