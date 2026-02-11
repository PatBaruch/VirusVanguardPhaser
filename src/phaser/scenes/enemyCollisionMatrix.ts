export type EnemyCollisionClass = 'femail' | 'rvirus' | 'worm' | 'trojan';

export interface PlayerCollisionMatrixSnapshot {
  centerX: number;
  centerY: number;
  width: number;
  height: number;
}

export interface EnemyCollisionMatrixSnapshot {
  enemyId: string;
  enemyClass: EnemyCollisionClass;
  centerX: number;
  centerY: number;
  width: number;
  height: number;
  damage: number;
}

export interface PlayerEnemyCollisionMatrixResult {
  remainingEnemies: EnemyCollisionMatrixSnapshot[];
  destroyedEnemyIds: string[];
  playerDamageDelta: number;
}

export function resolvePlayerEnemyCollisionMatrix(snapshot: {
  player: PlayerCollisionMatrixSnapshot;
  enemies: readonly EnemyCollisionMatrixSnapshot[];
}): PlayerEnemyCollisionMatrixResult {
  const remainingEnemies: EnemyCollisionMatrixSnapshot[] = [];
  const destroyedEnemyIds: string[] = [];
  let playerDamageDelta: number = 0;

  for (const enemy of snapshot.enemies) {
    if (!isOverlap(snapshot.player, enemy)) {
      remainingEnemies.push(enemy);
      continue;
    }

    if (enemy.enemyClass === 'rvirus') {
      remainingEnemies.push(enemy);
      continue;
    }

    destroyedEnemyIds.push(enemy.enemyId);
    playerDamageDelta += enemy.damage;
  }

  return {
    destroyedEnemyIds,
    playerDamageDelta,
    remainingEnemies,
  };
}

function isOverlap(
  player: PlayerCollisionMatrixSnapshot,
  enemy: EnemyCollisionMatrixSnapshot,
): boolean {
  const playerLeft: number = player.centerX - player.width / 2;
  const playerRight: number = player.centerX + player.width / 2;
  const playerTop: number = player.centerY - player.height / 2;
  const playerBottom: number = player.centerY + player.height / 2;

  const enemyLeft: number = enemy.centerX - enemy.width / 2;
  const enemyRight: number = enemy.centerX + enemy.width / 2;
  const enemyTop: number = enemy.centerY - enemy.height / 2;
  const enemyBottom: number = enemy.centerY + enemy.height / 2;

  return playerRight > enemyLeft
    && playerLeft < enemyRight
    && playerBottom > enemyTop
    && playerTop < enemyBottom;
}
