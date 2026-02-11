export const LEVEL5_MRHACKER_DAMAGE = 20;
export const LEVEL5_MRHACKER_HEALTH = 25;
export const LEVEL5_MRHACKER_SCORE_VALUE = 100;
export const LEVEL5_MRHACKER_BULLET_DAMAGE = 5;
export const LEVEL5_MRHACKER_BULLET_SPEED_PER_MS = 1;
export const LEVEL5_MRHACKER_BULLET_COOLDOWN_MIN_MS = 100;
export const LEVEL5_MRHACKER_BULLET_COOLDOWN_RANGE_MS = 500;
export const LEVEL5_MRHACKER_INITIAL_BULLET_COOLDOWN_MIN_MS = 500;
export const LEVEL5_MRHACKER_INITIAL_BULLET_COOLDOWN_RANGE_MS = 500;
export const LEVEL5_MRHACKER_MINION_SPAWN_INTERVAL_MS = 3000;
const LEVEL5_MRHACKER_MINION_OFFSET_X = 100;
const LEVEL5_MRHACKER_MINION_FEMAIL_OFFSET_Y = 30;
const LEVEL5_MRHACKER_MINION_RVIRUS_OFFSET_Y = -30;
const LEVEL5_MRHACKER_MINION_WORM_OFFSET_Y = 30;
const LEVEL5_MINION_FEMAIL_DAMAGE = 5;
const LEVEL5_MINION_FEMAIL_SCORE_VALUE = 10;
const LEVEL5_MINION_FEMAIL_HEALTH = 1;
const LEVEL5_MINION_FEMAIL_HORIZONTAL_SPEED_PER_MS = 0.75 / 2;
const LEVEL5_MINION_FEMAIL_VERTICAL_SPEED_PER_MS = 0.25 / 2;
const LEVEL5_MINION_RVIRUS_DAMAGE = 5;
const LEVEL5_MINION_RVIRUS_SCORE_VALUE = 10;
const LEVEL5_MINION_RVIRUS_HEALTH = 5;
const LEVEL5_MINION_RVIRUS_HORIZONTAL_SPEED_PER_MS = 1 / 2;
const LEVEL5_MINION_RVIRUS_VERTICAL_SPEED_PER_MS = 0.3 / 2;
const LEVEL5_MINION_WORM_DAMAGE = 5;
const LEVEL5_MINION_WORM_SCORE_VALUE = 10;
const LEVEL5_MINION_WORM_HEALTH = 1;
export const LEVEL5_MRHACKER_TEXTURE_KEYS = [
    'mrhacker-0',
    'mrhacker-1',
    'mrhacker-2',
];
export const LEVEL5_MRHACKER_HEALTH_BAR_TEXTURE_KEYS = [
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
export function createInitialLevel5MrHackerSpawnState() {
    return {
        hasSpawned: false,
    };
}
export function createInitialLevel5MrHackerMinionSpawnState() {
    return {
        msUntilNextSpawn: LEVEL5_MRHACKER_MINION_SPAWN_INTERVAL_MS,
        nextFEmailNumericId: 0,
        nextRVirusNumericId: 0,
        nextWormNumericId: 0,
    };
}
export function createInitialLevel5MrHackerBulletState(random) {
    return {
        msUntilNextShot: LEVEL5_MRHACKER_INITIAL_BULLET_COOLDOWN_MIN_MS
            + (random() * LEVEL5_MRHACKER_INITIAL_BULLET_COOLDOWN_RANGE_MS),
        nextBulletNumericId: 0,
    };
}
export function advanceLevel5MrHackerSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn || previousState.hasSpawned) {
        return {
            nextState: previousState,
            spawnedEnemies: [],
        };
    }
    const mrHacker = {
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
export function advanceLevel5MrHackerMinionSpawnState(previousState, snapshot) {
    if (!snapshot.canSpawn) {
        return {
            nextState: previousState,
            spawnedFEmails: [],
            spawnedRViruses: [],
            spawnedWorms: [],
        };
    }
    const msUntilNextSpawn = previousState.msUntilNextSpawn - snapshot.elapsedMs;
    if (msUntilNextSpawn > 0) {
        return {
            nextState: {
                ...previousState,
                msUntilNextSpawn,
            },
            spawnedFEmails: [],
            spawnedRViruses: [],
            spawnedWorms: [],
        };
    }
    const rng = snapshot.random();
    if (rng < 0.33) {
        const spawnedFEmail = {
            centerX: snapshot.bossCenterX + LEVEL5_MRHACKER_MINION_OFFSET_X,
            centerY: snapshot.bossCenterY + LEVEL5_MRHACKER_MINION_FEMAIL_OFFSET_Y,
            currentHealth: LEVEL5_MINION_FEMAIL_HEALTH,
            damage: LEVEL5_MINION_FEMAIL_DAMAGE,
            enemyId: `level5-minion-femail-${previousState.nextFEmailNumericId}`,
            height: 0,
            scoreValue: LEVEL5_MINION_FEMAIL_SCORE_VALUE,
            velocityX: snapshot.random() > 0.5
                ? -LEVEL5_MINION_FEMAIL_HORIZONTAL_SPEED_PER_MS
                : LEVEL5_MINION_FEMAIL_HORIZONTAL_SPEED_PER_MS,
            velocityY: snapshot.random() > 0.5
                ? -LEVEL5_MINION_FEMAIL_VERTICAL_SPEED_PER_MS
                : LEVEL5_MINION_FEMAIL_VERTICAL_SPEED_PER_MS,
            width: 0,
        };
        return {
            nextState: {
                ...previousState,
                msUntilNextSpawn: LEVEL5_MRHACKER_MINION_SPAWN_INTERVAL_MS,
                nextFEmailNumericId: previousState.nextFEmailNumericId + 1,
            },
            spawnedFEmails: [spawnedFEmail],
            spawnedRViruses: [],
            spawnedWorms: [],
        };
    }
    if (rng < 0.66) {
        const spawnedRVirus = {
            centerX: snapshot.bossCenterX + LEVEL5_MRHACKER_MINION_OFFSET_X,
            centerY: snapshot.bossCenterY + LEVEL5_MRHACKER_MINION_RVIRUS_OFFSET_Y,
            currentHealth: LEVEL5_MINION_RVIRUS_HEALTH,
            damage: LEVEL5_MINION_RVIRUS_DAMAGE,
            enemyId: `level5-minion-rvirus-${previousState.nextRVirusNumericId}`,
            height: 0,
            scoreValue: LEVEL5_MINION_RVIRUS_SCORE_VALUE,
            velocityX: snapshot.random() > 0.5
                ? -LEVEL5_MINION_RVIRUS_HORIZONTAL_SPEED_PER_MS
                : LEVEL5_MINION_RVIRUS_HORIZONTAL_SPEED_PER_MS,
            velocityY: snapshot.random() > 0.5
                ? -LEVEL5_MINION_RVIRUS_VERTICAL_SPEED_PER_MS
                : LEVEL5_MINION_RVIRUS_VERTICAL_SPEED_PER_MS,
            width: 0,
        };
        return {
            nextState: {
                ...previousState,
                msUntilNextSpawn: LEVEL5_MRHACKER_MINION_SPAWN_INTERVAL_MS,
                nextRVirusNumericId: previousState.nextRVirusNumericId + 1,
            },
            spawnedFEmails: [],
            spawnedRViruses: [spawnedRVirus],
            spawnedWorms: [],
        };
    }
    const spawnedWorm = {
        centerX: snapshot.bossCenterX + LEVEL5_MRHACKER_MINION_OFFSET_X,
        centerY: snapshot.bossCenterY + LEVEL5_MRHACKER_MINION_WORM_OFFSET_Y,
        currentHealth: LEVEL5_MINION_WORM_HEALTH,
        damage: LEVEL5_MINION_WORM_DAMAGE,
        enemyId: `level5-minion-worm-${previousState.nextWormNumericId}`,
        height: 0,
        scoreValue: LEVEL5_MINION_WORM_SCORE_VALUE,
        velocityX: -(0.4 * snapshot.random()) - 0.3,
        velocityY: -(0.2 * snapshot.random()) - 0.3,
        width: 0,
    };
    return {
        nextState: {
            ...previousState,
            msUntilNextSpawn: LEVEL5_MRHACKER_MINION_SPAWN_INTERVAL_MS,
            nextWormNumericId: previousState.nextWormNumericId + 1,
        },
        spawnedFEmails: [],
        spawnedRViruses: [],
        spawnedWorms: [spawnedWorm],
    };
}
export function resolveLevel5MrHackerHealthBarTextureKey(currentHealth) {
    const clampedHealth = Math.max(0, Math.min(LEVEL5_MRHACKER_HEALTH, Math.floor(currentHealth)));
    return LEVEL5_MRHACKER_HEALTH_BAR_TEXTURE_KEYS[clampedHealth];
}
export function advanceLevel5MrHackerBulletState(previousState, snapshot) {
    if (!snapshot.canFire) {
        return {
            nextState: previousState,
            spawnedBullets: [],
        };
    }
    const msUntilNextShot = previousState.msUntilNextShot - snapshot.elapsedMs;
    if (msUntilNextShot > 0) {
        return {
            nextState: {
                msUntilNextShot,
                nextBulletNumericId: previousState.nextBulletNumericId,
            },
            spawnedBullets: [],
        };
    }
    const deltaX = snapshot.playerCenterX - snapshot.bossCenterX;
    const deltaY = snapshot.playerCenterY - snapshot.bossCenterY;
    const direction = Math.abs(deltaX) > Math.abs(deltaY)
        ? (deltaX > 0 ? 'E' : 'W')
        : (deltaY > 0 ? 'S' : 'N');
    const angle = 10 + (snapshot.random() * 45);
    const angleInRadians = (angle * Math.PI) / 180;
    const velocityX = Math.cos(angleInRadians) * LEVEL5_MRHACKER_BULLET_SPEED_PER_MS;
    const velocityY = Math.sin(angleInRadians) * LEVEL5_MRHACKER_BULLET_SPEED_PER_MS;
    const spawnedBullets = [];
    if (direction === 'N') {
        spawnedBullets.push(createBossBullet(previousState.nextBulletNumericId + 0, snapshot.bossCenterX, snapshot.bossCenterY, 0, -velocityY), createBossBullet(previousState.nextBulletNumericId + 1, snapshot.bossCenterX, snapshot.bossCenterY, velocityX, -velocityY), createBossBullet(previousState.nextBulletNumericId + 2, snapshot.bossCenterX, snapshot.bossCenterY, -velocityX, -velocityY));
    }
    else if (direction === 'S') {
        spawnedBullets.push(createBossBullet(previousState.nextBulletNumericId + 0, snapshot.bossCenterX, snapshot.bossCenterY, 0, velocityY), createBossBullet(previousState.nextBulletNumericId + 1, snapshot.bossCenterX, snapshot.bossCenterY, velocityX, velocityY), createBossBullet(previousState.nextBulletNumericId + 2, snapshot.bossCenterX, snapshot.bossCenterY, -velocityX, velocityY));
    }
    else if (direction === 'E') {
        spawnedBullets.push(createBossBullet(previousState.nextBulletNumericId + 0, snapshot.bossCenterX, snapshot.bossCenterY, velocityX, 0), createBossBullet(previousState.nextBulletNumericId + 1, snapshot.bossCenterX, snapshot.bossCenterY, velocityX, velocityY), createBossBullet(previousState.nextBulletNumericId + 2, snapshot.bossCenterX, snapshot.bossCenterY, velocityX, -velocityY));
    }
    else {
        spawnedBullets.push(createBossBullet(previousState.nextBulletNumericId + 0, snapshot.bossCenterX, snapshot.bossCenterY, -velocityX, 0), createBossBullet(previousState.nextBulletNumericId + 1, snapshot.bossCenterX, snapshot.bossCenterY, -velocityX, velocityY), createBossBullet(previousState.nextBulletNumericId + 2, snapshot.bossCenterX, snapshot.bossCenterY, -velocityX, -velocityY));
    }
    return {
        nextState: {
            msUntilNextShot: LEVEL5_MRHACKER_BULLET_COOLDOWN_MIN_MS
                + (snapshot.random() * LEVEL5_MRHACKER_BULLET_COOLDOWN_RANGE_MS),
            nextBulletNumericId: previousState.nextBulletNumericId + 3,
        },
        spawnedBullets,
    };
}
export function resolveLevel5EnemyBulletPlayerCollisions(snapshot) {
    const remainingBullets = [];
    const destroyedBulletIds = [];
    let playerDamageDelta = 0;
    for (const bullet of snapshot.bullets) {
        if (!isOverlap(snapshot.player, bullet)) {
            remainingBullets.push(bullet);
            continue;
        }
        destroyedBulletIds.push(bullet.bulletId);
        playerDamageDelta += bullet.damage;
    }
    return {
        destroyedBulletIds,
        playerDamageDelta,
        remainingBullets,
    };
}
function createBossBullet(bulletNumericId, startX, startY, velocityX, velocityY) {
    return {
        bulletId: `level5-mrhacker-bullet-${bulletNumericId}`,
        centerX: startX,
        centerY: startY,
        damage: LEVEL5_MRHACKER_BULLET_DAMAGE,
        height: 0,
        velocityX,
        velocityY,
        width: 0,
    };
}
function isOverlap(player, bullet) {
    const playerLeft = player.centerX - player.width / 2;
    const playerRight = player.centerX + player.width / 2;
    const playerTop = player.centerY - player.height / 2;
    const playerBottom = player.centerY + player.height / 2;
    const bulletLeft = bullet.centerX - bullet.width / 2;
    const bulletRight = bullet.centerX + bullet.width / 2;
    const bulletTop = bullet.centerY - bullet.height / 2;
    const bulletBottom = bullet.centerY + bullet.height / 2;
    return playerRight > bulletLeft
        && playerLeft < bulletRight
        && playerBottom > bulletTop
        && playerTop < bulletBottom;
}
//# sourceMappingURL=level5MrHackerCombat.js.map