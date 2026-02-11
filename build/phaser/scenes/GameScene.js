import * as Phaser from 'phaser';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS, advanceLevel0DialogueState, createInitialLevel0DialogueState, resolveLevel0DialoguePhase, } from './level0DialogueState.js';
import PlayerPrefab from '../entities/PlayerPrefab.js';
import { resolvePlayerMovementStep } from '../entities/playerMovementStep.js';
import { canMoveWithinLevel0Bounds, isLevel0ToLevel1TransitionTriggered, } from './level0TraversalRules.js';
import { LEVEL1_DIALOGUE_TEXTURE_KEYS, advanceLevel1DialogueState, createInitialLevel1DialogueState, resolveLevel1DialoguePhase, } from './level1DialogueState.js';
import { canMoveWithinLevel1Bounds, isLevel1ToLevel2TransitionTriggered, } from './level1TraversalRules.js';
import { LEVEL2_DIALOGUE_TEXTURE_KEYS, advanceLevel2DialogueState, createInitialLevel2DialogueState, resolveLevel2DialoguePhase, } from './level2DialogueState.js';
import { canMoveWithinLevel2Bounds, isLevel2ToLevel3TransitionTriggered, } from './level2TraversalRules.js';
import { LEVEL3_DIALOGUE_TEXTURE_KEYS, advanceLevel3DialogueState, createInitialLevel3DialogueState, resolveLevel3DialoguePhase, } from './level3DialogueState.js';
import { canMoveWithinLevel3Bounds, isLevel3ToLevel4TransitionTriggered, } from './level3TraversalRules.js';
import { LEVEL4_DIALOGUE_TEXTURE_KEYS, advanceLevel4DialogueState, createInitialLevel4DialogueState, resolveLevel4DialoguePhase, } from './level4DialogueState.js';
import { canMoveWithinLevel4Bounds, isLevel4ToLevel5TransitionTriggered, } from './level4TraversalRules.js';
import { LEVEL5_DIALOGUE_TEXTURE_KEYS, advanceLevel5DialogueState, createInitialLevel5DialogueState, resolveLevel5DialoguePhase, } from './level5DialogueState.js';
import { canMoveWithinLevel5Bounds, isLevel5VictoryTriggered, } from './level5TraversalRules.js';
import { canTriggerLevelTransition } from './transitionRuleEngine.js';
import { canAcceptShootInput } from './shootInputGate.js';
import ProjectilePrefab from '../entities/ProjectilePrefab.js';
import { resolveSingleShotProjectileConfigs } from './singleShotPattern.js';
import { resolveDualShotProjectileConfigs } from './dualShotPattern.js';
import { resolveTripleShotProjectileConfigs } from './tripleShotPattern.js';
import { resolveProjectileHitResolution, } from './projectileHitResolution.js';
import FEmailPrefab from '../entities/FEmailPrefab.js';
import { FEMAIL_DAMAGE, FEMAIL_HEALTH, FEMAIL_HORIZONTAL_SPEED_PER_MS, FEMAIL_SCORE_VALUE, FEMAIL_VERTICAL_SPEED_PER_MS, advanceLevel1FEmailMotion, advanceLevel1FEmailSpawnState, createInitialLevel1FEmailSpawnState, resolveLevel1PlayerEnemyCollisions, } from './level1FEmailCombat.js';
import RVirusPrefab from '../entities/RVirusPrefab.js';
import { LEVEL2_RVIRUS_DAMAGE, LEVEL2_RVIRUS_HEALTH, LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS, LEVEL2_RVIRUS_SCORE_VALUE, LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS, advanceLevel2RVirusMotion, advanceLevel2RVirusSpawnState, createInitialLevel2RVirusAttachmentState, createInitialLevel2RVirusSpawnState, resolveLevel2RVirusAttachment, } from './level2RVirusCombat.js';
import WormPrefab from '../entities/WormPrefab.js';
import { LEVEL3_WORM_DAMAGE, LEVEL3_WORM_HEALTH, LEVEL3_WORM_SCORE_VALUE, advanceLevel3WormDuplicationState, advanceLevel3WormMotion, advanceLevel3WormSpawnState, createInitialLevel3WormDuplicationState, createInitialLevel3WormSpawnState, resolveLevel3PlayerEnemyCollisions, } from './level3WormCombat.js';
import TrojanPrefab from '../entities/TrojanPrefab.js';
import { LEVEL4_TROJAN_DAMAGE, advanceLevel4TrojanMotion, advanceLevel4TrojanSpawnState, createInitialLevel4TrojanSpawnState, resolveLevel4TrojanBreaches, resolveLevel4TrojanPlayerCollisions, resolveLevel4TrojanProjectileHits, } from './level4TrojanCombat.js';
import MrHackerPrefab from '../entities/MrHackerPrefab.js';
import EnemyBulletPrefab from '../entities/EnemyBulletPrefab.js';
import { advanceLevel5MrHackerBulletState, advanceLevel5MrHackerMinionSpawnState, advanceLevel5MrHackerSpawnState, createInitialLevel5MrHackerBulletState, createInitialLevel5MrHackerMinionSpawnState, createInitialLevel5MrHackerSpawnState, resolveLevel5EnemyBulletPlayerCollisions, resolveLevel5MrHackerHealthBarTextureKey, } from './level5MrHackerCombat.js';
import { INITIAL_SCORE_MULTIPLIER, advanceScoreMultiplier, resolveLevel5CombatBackdropClass, resolveVictorySummaryText, shouldRestartFromVictory, } from './level5VictoryFlow.js';
export default class GameScene extends Phaser.Scene {
    static SCENE_KEY = 'GameScene';
    static LEVEL_TRANSITION_EVENT = 'level-transition';
    static SHOOT_INPUT_EVENT = 'shoot-input';
    dialogueState;
    dialogueImage;
    startPromptText;
    level0Phase;
    activeLevelId;
    level1DialogueState;
    level1Phase;
    level2DialogueState;
    level2Phase;
    level3DialogueState;
    level3Phase;
    level4DialogueState;
    level4Phase;
    level5DialogueState;
    level5Phase;
    player;
    spaceKey;
    moveUpKey;
    moveLeftKey;
    moveDownKey;
    moveRightKey;
    hasTriggeredLevel1Transition;
    hasTriggeredLevel2Transition;
    hasTriggeredLevel3Transition;
    hasTriggeredLevel4Transition;
    hasTriggeredLevel5Transition;
    hasTriggeredVictory;
    score;
    activeCombatItemCount;
    activeProjectiles;
    activeFEmails;
    level1FEmailSpawnState;
    activeRViruses;
    level2RVirusSpawnState;
    level2RVirusAttachmentState;
    activeWorms;
    level3WormSpawnState;
    level3WormDuplicationState;
    activeTrojans;
    activeMrHacker;
    activeEnemyBullets;
    level5MrHackerSpawnState;
    level5MrHackerBulletState;
    level5MrHackerMinionSpawnState;
    mrHackerHealthBar;
    level4TrojanSpawnState;
    level4SplitFEmailNextEnemyNumericId;
    level4SplitRVirusNextEnemyNumericId;
    level4SplitWormNextEnemyNumericId;
    playerHealth;
    scoreMultiplier;
    victoryScoreText;
    victoryMultiplierText;
    victoryFinalScoreText;
    victoryRestartPromptText;
    constructor() {
        super(GameScene.SCENE_KEY);
        this.dialogueState = createInitialLevel0DialogueState();
        this.dialogueImage = null;
        this.startPromptText = null;
        this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
        this.activeLevelId = 0;
        this.level1DialogueState = createInitialLevel1DialogueState();
        this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
        this.level2DialogueState = createInitialLevel2DialogueState();
        this.level2Phase = resolveLevel2DialoguePhase(this.level2DialogueState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length);
        this.level3DialogueState = createInitialLevel3DialogueState();
        this.level3Phase = resolveLevel3DialoguePhase(this.level3DialogueState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length);
        this.level4DialogueState = createInitialLevel4DialogueState();
        this.level4Phase = resolveLevel4DialoguePhase(this.level4DialogueState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length);
        this.level5DialogueState = createInitialLevel5DialogueState();
        this.level5Phase = resolveLevel5DialoguePhase(this.level5DialogueState, LEVEL5_DIALOGUE_TEXTURE_KEYS.length);
        this.player = null;
        this.spaceKey = null;
        this.moveUpKey = null;
        this.moveLeftKey = null;
        this.moveDownKey = null;
        this.moveRightKey = null;
        this.hasTriggeredLevel1Transition = false;
        this.hasTriggeredLevel2Transition = false;
        this.hasTriggeredLevel3Transition = false;
        this.hasTriggeredLevel4Transition = false;
        this.hasTriggeredLevel5Transition = false;
        this.hasTriggeredVictory = false;
        this.score = 0;
        this.activeCombatItemCount = 0;
        this.activeProjectiles = [];
        this.activeFEmails = [];
        this.level1FEmailSpawnState = createInitialLevel1FEmailSpawnState();
        this.activeRViruses = [];
        this.level2RVirusSpawnState = createInitialLevel2RVirusSpawnState();
        this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
        this.activeWorms = [];
        this.level3WormSpawnState = createInitialLevel3WormSpawnState();
        this.level3WormDuplicationState = createInitialLevel3WormDuplicationState();
        this.activeTrojans = [];
        this.activeMrHacker = null;
        this.activeEnemyBullets = [];
        this.level5MrHackerSpawnState = createInitialLevel5MrHackerSpawnState();
        this.level5MrHackerBulletState = createInitialLevel5MrHackerBulletState(() => Math.random());
        this.level5MrHackerMinionSpawnState = createInitialLevel5MrHackerMinionSpawnState();
        this.mrHackerHealthBar = null;
        this.level4TrojanSpawnState = createInitialLevel4TrojanSpawnState();
        this.level4SplitFEmailNextEnemyNumericId = 0;
        this.level4SplitRVirusNextEnemyNumericId = 0;
        this.level4SplitWormNextEnemyNumericId = 0;
        this.playerHealth = 100;
        this.scoreMultiplier = INITIAL_SCORE_MULTIPLIER;
        this.victoryScoreText = null;
        this.victoryMultiplierText = null;
        this.victoryFinalScoreText = null;
        this.victoryRestartPromptText = null;
    }
    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) ?? null;
        this.moveUpKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W) ?? null;
        this.moveLeftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A) ?? null;
        this.moveDownKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S) ?? null;
        this.moveRightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D) ?? null;
        this.startPromptText = this.add.text(centerX, centerY + 200, 'Press space to start the game', {
            color: '#ff0000',
            fontFamily: 'Copperplate',
            fontSize: '50px',
        });
        this.startPromptText.setOrigin(0.5, 0.5);
        this.victoryScoreText = this.add.text(centerX, centerY, '', {
            color: '#7fff00',
            fontFamily: 'Copperplate',
            fontSize: '50px',
        });
        this.victoryScoreText.setOrigin(0.5, 0.5);
        this.victoryScoreText.setVisible(false);
        this.victoryMultiplierText = this.add.text(centerX, centerY + 100, '', {
            color: '#7fff00',
            fontFamily: 'Copperplate',
            fontSize: '50px',
        });
        this.victoryMultiplierText.setOrigin(0.5, 0.5);
        this.victoryMultiplierText.setVisible(false);
        this.victoryFinalScoreText = this.add.text(centerX, centerY + 200, '', {
            color: '#7fff00',
            fontFamily: 'Copperplate',
            fontSize: '50px',
        });
        this.victoryFinalScoreText.setOrigin(0.5, 0.5);
        this.victoryFinalScoreText.setVisible(false);
        this.victoryRestartPromptText = this.add.text(centerX, centerY + 300, '', {
            color: '#7fff00',
            fontFamily: 'Copperplate',
            fontSize: '50px',
        });
        this.victoryRestartPromptText.setOrigin(0.5, 0.5);
        this.victoryRestartPromptText.setVisible(false);
        this.dialogueImage = this.add.image(centerX, centerY, LEVEL0_DIALOGUE_TEXTURE_KEYS[0]);
        this.dialogueImage.setVisible(false);
        this.player = new PlayerPrefab(this);
        this.add.existing(this.player);
        this.mrHackerHealthBar = this.add.image(centerX - 480, centerY - 968, resolveLevel5MrHackerHealthBarTextureKey(25));
        this.mrHackerHealthBar.setOrigin(0, 0);
        this.mrHackerHealthBar.setVisible(false);
        this.events.on(GameScene.SHOOT_INPUT_EVENT, this.handleShootInput, this);
        this.syncActiveLevelVisualState();
    }
    update(_time, delta) {
        this.updateProjectiles(delta);
        this.updateEnemyBullets(delta);
        this.scoreMultiplier = advanceScoreMultiplier(this.scoreMultiplier, this.hasTriggeredVictory);
        if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (shouldRestartFromVictory({
                hasTriggeredVictory: this.hasTriggeredVictory,
                isSpaceJustPressed: true,
            })) {
                window.location.reload();
                return;
            }
            if (this.activeLevelId === 0) {
                this.dialogueState = advanceLevel0DialogueState(this.dialogueState);
                this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 1 && this.level1Phase === 'dialogue') {
                this.level1DialogueState = advanceLevel1DialogueState(this.level1DialogueState);
                this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 2 && this.level2Phase === 'dialogue') {
                this.level2DialogueState = advanceLevel2DialogueState(this.level2DialogueState);
                this.level2Phase = resolveLevel2DialoguePhase(this.level2DialogueState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 3 && this.level3Phase === 'dialogue') {
                this.level3DialogueState = advanceLevel3DialogueState(this.level3DialogueState);
                this.level3Phase = resolveLevel3DialoguePhase(this.level3DialogueState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 4 && this.level4Phase === 'dialogue') {
                this.level4DialogueState = advanceLevel4DialogueState(this.level4DialogueState);
                this.level4Phase = resolveLevel4DialoguePhase(this.level4DialogueState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 5 && this.level5Phase === 'dialogue') {
                this.level5DialogueState = advanceLevel5DialogueState(this.level5DialogueState);
                this.level5Phase = resolveLevel5DialoguePhase(this.level5DialogueState, LEVEL5_DIALOGUE_TEXTURE_KEYS.length);
            }
            this.syncActiveLevelVisualState();
            if (canAcceptShootInput(this.activeLevelId) && this.isActiveLevelWalkablePhase()) {
                this.events.emit(GameScene.SHOOT_INPUT_EVENT, {
                    levelId: this.activeLevelId,
                });
            }
        }
        if (this.activeLevelId === 0 && this.level0Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel0TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 1 && this.level1Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel1Combat(delta);
            this.updateLevel1TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 2 && this.level2Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel2Combat(delta);
            this.updateLevel2TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 3 && this.level3Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel3Combat(delta);
            this.updateLevel3TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 4 && this.level4Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel4Combat(delta);
            this.updateLevel4TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 5 && this.level5Phase === 'walkable' && !this.hasTriggeredVictory) {
            this.updatePlayerMovement();
            this.updateLevel5Combat(delta);
            this.updateLevel5VictoryTrigger();
        }
    }
    updatePlayerMovement() {
        if (this.player === null) {
            return;
        }
        const movementStep = resolvePlayerMovementStep({
            down: this.moveDownKey?.isDown ?? false,
            left: this.moveLeftKey?.isDown ?? false,
            right: this.moveRightKey?.isDown ?? false,
            up: this.moveUpKey?.isDown ?? false,
        });
        if (!movementStep.isMoving || movementStep.facingDirection === null) {
            return;
        }
        const traversalSnapshot = {
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        };
        let canApplyMovement;
        if (this.activeLevelId === 0) {
            canApplyMovement = canMoveWithinLevel0Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        else if (this.activeLevelId === 1) {
            canApplyMovement = canMoveWithinLevel1Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        else if (this.activeLevelId === 2) {
            canApplyMovement = canMoveWithinLevel2Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        else if (this.activeLevelId === 3) {
            canApplyMovement = canMoveWithinLevel3Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        else if (this.activeLevelId === 4) {
            canApplyMovement = canMoveWithinLevel4Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        else {
            canApplyMovement = canMoveWithinLevel5Bounds(traversalSnapshot, movementStep.facingDirection);
        }
        if (!canApplyMovement) {
            return;
        }
        this.player.x += movementStep.deltaX;
        this.player.y += movementStep.deltaY;
        this.player.setFacingDirection(movementStep.facingDirection);
    }
    handleShootInput(payload) {
        if (this.player === null) {
            return;
        }
        const projectilePatternSnapshot = {
            facingDirection: this.player.getFacingDirection(),
            levelId: payload.levelId,
            playerCenterX: this.player.x + this.player.displayWidth / 2,
            playerCenterY: this.player.y + this.player.displayHeight / 2,
        };
        const projectileConfigs = [
            ...resolveSingleShotProjectileConfigs(projectilePatternSnapshot),
            ...resolveDualShotProjectileConfigs(projectilePatternSnapshot),
            ...resolveTripleShotProjectileConfigs(projectilePatternSnapshot),
        ];
        for (const projectileConfig of projectileConfigs) {
            const projectile = new ProjectilePrefab(this, projectileConfig);
            this.add.existing(projectile);
            this.activeProjectiles.push(projectile);
        }
    }
    updateProjectiles(elapsedMs) {
        if (this.activeProjectiles.length === 0) {
            return;
        }
        const nextActiveProjectiles = [];
        for (const projectile of this.activeProjectiles) {
            projectile.updateMotion(elapsedMs);
            if (projectile.isOutsideCombatWorldBounds(this.scale.width, this.scale.height)) {
                projectile.destroy();
            }
            else {
                nextActiveProjectiles.push(projectile);
            }
        }
        this.activeProjectiles = nextActiveProjectiles;
    }
    updateEnemyBullets(elapsedMs) {
        if (this.activeEnemyBullets.length === 0) {
            return;
        }
        const nextActiveEnemyBullets = [];
        for (const bullet of this.activeEnemyBullets) {
            bullet.updateMotion(elapsedMs);
            if (bullet.isOutsideCombatWorldBounds(this.scale.width, this.scale.height)) {
                bullet.destroy();
            }
            else {
                nextActiveEnemyBullets.push(bullet);
            }
        }
        this.activeEnemyBullets = nextActiveEnemyBullets;
    }
    updateLevel1Combat(elapsedMs) {
        const spawnResolution = advanceLevel1FEmailSpawnState(this.level1FEmailSpawnState, {
            canSpawn: this.activeLevelId === 1 && this.level1Phase === 'walkable',
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
            random: () => Math.random(),
            score: this.score,
        });
        this.level1FEmailSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedEnemies) {
            const fEmail = new FEmailPrefab(this, spawnedEnemy);
            this.add.existing(fEmail);
            this.activeFEmails.push(fEmail);
        }
        if (this.activeFEmails.length === 0) {
            this.activeCombatItemCount = 0;
            return;
        }
        const movedSnapshots = advanceLevel1FEmailMotion(this.activeFEmails.map((enemy) => enemy.toSnapshot()), {
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
        });
        this.applyFEmailSnapshotsById(movedSnapshots);
        this.resolveLevel1ProjectileHits();
        this.resolveLevel1PlayerEnemyCollisions();
        this.activeCombatItemCount = this.activeFEmails.length;
    }
    resolveLevel1ProjectileHits() {
        if (this.activeProjectiles.length === 0 || this.activeFEmails.length === 0) {
            return;
        }
        const projectileSnapshots = this.activeProjectiles.map((projectile) => ({
            centerX: projectile.x,
            centerY: projectile.y,
            damage: projectile.getDamage(),
            height: projectile.displayHeight,
            projectileId: projectile.name,
            width: projectile.displayWidth,
        }));
        for (let index = 0; index < projectileSnapshots.length; index += 1) {
            projectileSnapshots[index].projectileId = `projectile-${index}`;
        }
        const targetSnapshots = this.activeFEmails.map((enemy) => {
            const enemySnapshot = enemy.toSnapshot();
            return {
                centerX: enemySnapshot.centerX,
                centerY: enemySnapshot.centerY,
                currentHealth: enemySnapshot.currentHealth,
                height: enemySnapshot.height,
                scoreValue: enemySnapshot.scoreValue,
                targetId: enemySnapshot.enemyId,
                width: enemySnapshot.width,
            };
        });
        const resolution = resolveProjectileHitResolution({
            projectiles: projectileSnapshots,
            targets: targetSnapshots,
        });
        if (resolution.destroyedProjectileIds.length > 0) {
            this.activeProjectiles = this.activeProjectiles.filter((projectile, index) => {
                const projectileId = `projectile-${index}`;
                const isDestroyed = resolution.destroyedProjectileIds.includes(projectileId);
                if (isDestroyed) {
                    projectile.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.destroyedTargetIds.length > 0) {
            this.activeFEmails = this.activeFEmails.filter((enemy) => {
                const isDestroyed = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.remainingTargets.length > 0 && this.activeFEmails.length > 0) {
            this.applyFEmailSnapshotsById(resolution.remainingTargets.map((target) => ({
                centerX: target.centerX,
                centerY: target.centerY,
                currentHealth: target.currentHealth,
                damage: 5,
                enemyId: target.targetId,
                height: target.height,
                scoreValue: target.scoreValue,
                velocityX: this.resolveFEmailVelocityById(target.targetId).x,
                velocityY: this.resolveFEmailVelocityById(target.targetId).y,
                width: target.width,
            })));
        }
        this.score += resolution.scoreDelta;
    }
    resolveLevel1PlayerEnemyCollisions() {
        if (this.player === null || this.activeFEmails.length === 0) {
            return;
        }
        const result = resolveLevel1PlayerEnemyCollisions({
            enemies: this.activeFEmails.map((enemy) => enemy.toSnapshot()),
            player: {
                centerX: this.player.x + this.player.displayWidth / 2,
                centerY: this.player.y + this.player.displayHeight / 2,
                height: this.player.displayHeight,
                width: this.player.displayWidth,
            },
        });
        if (result.destroyedEnemyIds.length > 0) {
            this.activeFEmails = this.activeFEmails.filter((enemy) => {
                const isDestroyed = result.destroyedEnemyIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
    }
    applyFEmailSnapshotsById(snapshots) {
        const enemyById = new Map(this.activeFEmails.map((enemy) => [enemy.getEnemyId(), enemy]));
        for (const snapshot of snapshots) {
            const enemy = enemyById.get(snapshot.enemyId);
            if (enemy !== undefined) {
                enemy.applySnapshot(snapshot);
            }
        }
    }
    resolveFEmailVelocityById(enemyId) {
        const enemy = this.activeFEmails.find((item) => item.getEnemyId() === enemyId);
        if (enemy === undefined) {
            return { x: 0, y: 0 };
        }
        const snapshot = enemy.toSnapshot();
        return {
            x: snapshot.velocityX,
            y: snapshot.velocityY,
        };
    }
    updateLevel0TransitionTrigger() {
        if (this.player === null || this.hasTriggeredLevel1Transition) {
            return;
        }
        const hasReachedTransition = isLevel0ToLevel1TransitionTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedTransition || !canTriggerLevelTransition(0, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 0,
            toLevel: 1,
        });
        this.enterLevel1();
    }
    updateLevel1TransitionTrigger() {
        if (this.player === null || this.hasTriggeredLevel2Transition) {
            return;
        }
        const hasReachedTransition = isLevel1ToLevel2TransitionTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedTransition || !canTriggerLevelTransition(1, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.hasTriggeredLevel2Transition = true;
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 1,
            toLevel: 2,
        });
        this.enterLevel2();
    }
    updateLevel2Combat(elapsedMs) {
        const spawnResolution = advanceLevel2RVirusSpawnState(this.level2RVirusSpawnState, {
            canSpawn: this.activeLevelId === 2 && this.level2Phase === 'walkable',
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
            random: () => Math.random(),
            score: this.score,
        });
        this.level2RVirusSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedEnemies) {
            const rVirus = new RVirusPrefab(this, spawnedEnemy);
            this.add.existing(rVirus);
            this.activeRViruses.push(rVirus);
        }
        if (this.activeRViruses.length === 0) {
            this.activeCombatItemCount = 0;
            this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
            return;
        }
        const movedSnapshots = advanceLevel2RVirusMotion(this.activeRViruses.map((enemy) => enemy.toSnapshot()), {
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
            stuckEnemyId: this.level2RVirusAttachmentState.stuckEnemyId,
        });
        this.applyRVirusSnapshotsById(movedSnapshots);
        this.resolveLevel2ProjectileHits();
        this.resolveLevel2RVirusAttachment(elapsedMs);
        this.activeCombatItemCount = this.activeRViruses.length;
    }
    resolveLevel2ProjectileHits() {
        if (this.activeProjectiles.length === 0 || this.activeRViruses.length === 0) {
            return;
        }
        const projectileSnapshots = this.activeProjectiles.map((projectile) => ({
            centerX: projectile.x,
            centerY: projectile.y,
            damage: projectile.getDamage(),
            height: projectile.displayHeight,
            projectileId: projectile.name,
            width: projectile.displayWidth,
        }));
        for (let index = 0; index < projectileSnapshots.length; index += 1) {
            projectileSnapshots[index].projectileId = `projectile-${index}`;
        }
        const targetSnapshots = this.activeRViruses.map((enemy) => {
            const enemySnapshot = enemy.toSnapshot();
            return {
                centerX: enemySnapshot.centerX,
                centerY: enemySnapshot.centerY,
                currentHealth: enemySnapshot.currentHealth,
                height: enemySnapshot.height,
                scoreValue: enemySnapshot.scoreValue,
                targetId: enemySnapshot.enemyId,
                width: enemySnapshot.width,
            };
        });
        const resolution = resolveProjectileHitResolution({
            projectiles: projectileSnapshots,
            targets: targetSnapshots,
        });
        if (resolution.destroyedProjectileIds.length > 0) {
            this.activeProjectiles = this.activeProjectiles.filter((projectile, index) => {
                const projectileId = `projectile-${index}`;
                const isDestroyed = resolution.destroyedProjectileIds.includes(projectileId);
                if (isDestroyed) {
                    projectile.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.destroyedTargetIds.length > 0) {
            this.activeRViruses = this.activeRViruses.filter((enemy) => {
                const isDestroyed = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.remainingTargets.length > 0 && this.activeRViruses.length > 0) {
            this.applyRVirusSnapshotsById(resolution.remainingTargets.map((target) => ({
                centerX: target.centerX,
                centerY: target.centerY,
                currentHealth: target.currentHealth,
                damage: LEVEL2_RVIRUS_DAMAGE,
                enemyId: target.targetId,
                height: target.height,
                scoreValue: target.scoreValue,
                velocityX: this.resolveRVirusVelocityById(target.targetId).x,
                velocityY: this.resolveRVirusVelocityById(target.targetId).y,
                width: target.width,
            })));
        }
        this.score += resolution.scoreDelta;
    }
    resolveLevel2RVirusAttachment(elapsedMs) {
        if (this.player === null || this.activeRViruses.length === 0) {
            return;
        }
        const result = resolveLevel2RVirusAttachment(this.level2RVirusAttachmentState, {
            elapsedMs,
            enemies: this.activeRViruses.map((enemy) => enemy.toSnapshot()),
            player: {
                centerX: this.player.x + this.player.displayWidth / 2,
                centerY: this.player.y + this.player.displayHeight / 2,
                height: this.player.displayHeight,
                width: this.player.displayWidth,
            },
        });
        this.level2RVirusAttachmentState = result.nextState;
        this.applyRVirusSnapshotsById(result.nextEnemies);
        this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
    }
    applyRVirusSnapshotsById(snapshots) {
        const enemyById = new Map(this.activeRViruses.map((enemy) => [enemy.getEnemyId(), enemy]));
        for (const snapshot of snapshots) {
            const enemy = enemyById.get(snapshot.enemyId);
            if (enemy !== undefined) {
                enemy.applySnapshot(snapshot);
            }
        }
    }
    resolveRVirusVelocityById(enemyId) {
        const enemy = this.activeRViruses.find((item) => item.getEnemyId() === enemyId);
        if (enemy === undefined) {
            return { x: 0, y: 0 };
        }
        const snapshot = enemy.toSnapshot();
        return {
            x: snapshot.velocityX,
            y: snapshot.velocityY,
        };
    }
    updateLevel3Combat(elapsedMs) {
        const spawnResolution = advanceLevel3WormSpawnState(this.level3WormSpawnState, {
            canSpawn: this.activeLevelId === 3 && this.level3Phase === 'walkable',
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
            random: () => Math.random(),
            score: this.score,
        });
        this.level3WormSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedEnemies) {
            const worm = new WormPrefab(this, spawnedEnemy);
            this.add.existing(worm);
            this.activeWorms.push(worm);
        }
        const duplicationResolution = advanceLevel3WormDuplicationState(this.level3WormDuplicationState, {
            elapsedMs,
            enemies: this.activeWorms.map((enemy) => enemy.toSnapshot()),
            random: () => Math.random(),
            score: this.score,
        });
        this.level3WormDuplicationState = duplicationResolution.nextState;
        for (const duplicatedEnemy of duplicationResolution.duplicatedEnemies) {
            const worm = new WormPrefab(this, duplicatedEnemy);
            this.add.existing(worm);
            this.activeWorms.push(worm);
        }
        if (this.activeWorms.length === 0) {
            this.activeCombatItemCount = 0;
            return;
        }
        const movedSnapshots = advanceLevel3WormMotion(this.activeWorms.map((enemy) => enemy.toSnapshot()), {
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
        });
        this.applyWormSnapshotsById(movedSnapshots);
        this.resolveLevel3ProjectileHits();
        this.resolveLevel3PlayerEnemyCollisions();
        this.activeCombatItemCount = this.activeWorms.length;
    }
    resolveLevel3ProjectileHits() {
        if (this.activeProjectiles.length === 0 || this.activeWorms.length === 0) {
            return;
        }
        const projectileSnapshots = this.activeProjectiles.map((projectile) => ({
            centerX: projectile.x,
            centerY: projectile.y,
            damage: projectile.getDamage(),
            height: projectile.displayHeight,
            projectileId: projectile.name,
            width: projectile.displayWidth,
        }));
        for (let index = 0; index < projectileSnapshots.length; index += 1) {
            projectileSnapshots[index].projectileId = `projectile-${index}`;
        }
        const targetSnapshots = this.activeWorms.map((enemy) => {
            const enemySnapshot = enemy.toSnapshot();
            return {
                centerX: enemySnapshot.centerX,
                centerY: enemySnapshot.centerY,
                currentHealth: enemySnapshot.currentHealth,
                height: enemySnapshot.height,
                scoreValue: enemySnapshot.scoreValue,
                targetId: enemySnapshot.enemyId,
                width: enemySnapshot.width,
            };
        });
        const resolution = resolveProjectileHitResolution({
            projectiles: projectileSnapshots,
            targets: targetSnapshots,
        });
        if (resolution.destroyedProjectileIds.length > 0) {
            this.activeProjectiles = this.activeProjectiles.filter((projectile, index) => {
                const projectileId = `projectile-${index}`;
                const isDestroyed = resolution.destroyedProjectileIds.includes(projectileId);
                if (isDestroyed) {
                    projectile.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.destroyedTargetIds.length > 0) {
            this.activeWorms = this.activeWorms.filter((enemy) => {
                const isDestroyed = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.remainingTargets.length > 0 && this.activeWorms.length > 0) {
            this.applyWormSnapshotsById(resolution.remainingTargets.map((target) => ({
                centerX: target.centerX,
                centerY: target.centerY,
                currentHealth: target.currentHealth,
                damage: LEVEL3_WORM_DAMAGE,
                enemyId: target.targetId,
                height: target.height,
                scoreValue: target.scoreValue,
                velocityX: this.resolveWormVelocityById(target.targetId).x,
                velocityY: this.resolveWormVelocityById(target.targetId).y,
                width: target.width,
            })));
        }
        this.score += resolution.scoreDelta;
    }
    applyWormSnapshotsById(snapshots) {
        const enemyById = new Map(this.activeWorms.map((enemy) => [enemy.getEnemyId(), enemy]));
        for (const snapshot of snapshots) {
            const enemy = enemyById.get(snapshot.enemyId);
            if (enemy !== undefined) {
                enemy.applySnapshot(snapshot);
            }
        }
    }
    resolveLevel3PlayerEnemyCollisions() {
        if (this.player === null || this.activeWorms.length === 0) {
            return;
        }
        const result = resolveLevel3PlayerEnemyCollisions({
            enemies: this.activeWorms.map((enemy) => enemy.toSnapshot()),
            player: {
                centerX: this.player.x + this.player.displayWidth / 2,
                centerY: this.player.y + this.player.displayHeight / 2,
                height: this.player.displayHeight,
                width: this.player.displayWidth,
            },
        });
        if (result.destroyedEnemyIds.length > 0) {
            this.activeWorms = this.activeWorms.filter((enemy) => {
                const isDestroyed = result.destroyedEnemyIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
    }
    resolveWormVelocityById(enemyId) {
        const enemy = this.activeWorms.find((item) => item.getEnemyId() === enemyId);
        if (enemy === undefined) {
            return { x: 0, y: 0 };
        }
        const snapshot = enemy.toSnapshot();
        return {
            x: snapshot.velocityX,
            y: snapshot.velocityY,
        };
    }
    updateLevel4Combat(elapsedMs) {
        const spawnResolution = advanceLevel4TrojanSpawnState(this.level4TrojanSpawnState, {
            canSpawn: this.activeLevelId === 4 && this.level4Phase === 'walkable',
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            elapsedMs,
            random: () => Math.random(),
            score: this.score,
        });
        this.level4TrojanSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedEnemies) {
            const trojan = new TrojanPrefab(this, spawnedEnemy);
            this.add.existing(trojan);
            this.activeTrojans.push(trojan);
        }
        if (this.activeTrojans.length > 0) {
            const movedSnapshots = advanceLevel4TrojanMotion(this.activeTrojans.map((enemy) => enemy.toSnapshot()), { elapsedMs });
            this.applyTrojanSnapshotsById(movedSnapshots);
            this.resolveLevel4TrojanPlayerEnemyCollisions();
            this.resolveLevel4TrojanProjectileHits();
            this.resolveLevel4TrojanBreaches();
        }
        if (this.activeFEmails.length > 0) {
            this.updateLevel1Combat(elapsedMs);
        }
        if (this.activeRViruses.length > 0) {
            this.updateLevel2Combat(elapsedMs);
        }
        if (this.activeWorms.length > 0) {
            this.updateLevel3Combat(elapsedMs);
        }
        this.activeCombatItemCount = this.activeTrojans.length
            + this.activeFEmails.length
            + this.activeRViruses.length
            + this.activeWorms.length;
    }
    resolveLevel4TrojanProjectileHits() {
        if (this.activeProjectiles.length === 0 || this.activeTrojans.length === 0) {
            return;
        }
        const projectileSnapshots = this.activeProjectiles.map((projectile) => ({
            centerX: projectile.x,
            centerY: projectile.y,
            damage: projectile.getDamage(),
            height: projectile.displayHeight,
            projectileId: projectile.name,
            width: projectile.displayWidth,
        }));
        for (let index = 0; index < projectileSnapshots.length; index += 1) {
            projectileSnapshots[index].projectileId = `projectile-${index}`;
        }
        const trojanSnapshots = this.activeTrojans.map((enemy) => enemy.toSnapshot());
        const resolution = resolveLevel4TrojanProjectileHits({
            projectiles: projectileSnapshots,
            trojans: trojanSnapshots,
        });
        if (resolution.destroyedProjectileIds.length > 0) {
            this.activeProjectiles = this.activeProjectiles.filter((projectile, index) => {
                const projectileId = `projectile-${index}`;
                const isDestroyed = resolution.destroyedProjectileIds.includes(projectileId);
                if (isDestroyed) {
                    projectile.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.destroyedTrojanIds.length > 0) {
            this.activeTrojans = this.activeTrojans.filter((enemy) => {
                const isDestroyed = resolution.destroyedTrojanIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.remainingTrojans.length > 0 && this.activeTrojans.length > 0) {
            this.applyTrojanSnapshotsById(resolution.remainingTrojans.map((trojan) => ({
                centerX: trojan.centerX,
                centerY: trojan.centerY,
                currentHealth: trojan.currentHealth,
                damage: LEVEL4_TROJAN_DAMAGE,
                enemyId: trojan.enemyId,
                height: trojan.height,
                scoreValue: trojan.scoreValue,
                velocityX: this.resolveTrojanVelocityById(trojan.enemyId).x,
                velocityY: this.resolveTrojanVelocityById(trojan.enemyId).y,
                width: trojan.width,
            })));
        }
        this.score += resolution.scoreDelta;
        this.spawnLevel4SplitEnemies(resolution.splitSpawns);
    }
    resolveLevel4TrojanBreaches() {
        if (this.activeTrojans.length === 0) {
            return;
        }
        const breachResolution = resolveLevel4TrojanBreaches({
            enemies: this.activeTrojans.map((enemy) => enemy.toSnapshot()),
            minX: this.scale.width * 0.05,
        });
        if (breachResolution.breachedEnemyIds.length > 0) {
            this.activeTrojans = this.activeTrojans.filter((enemy) => {
                const isBreached = breachResolution.breachedEnemyIds.includes(enemy.getEnemyId());
                if (isBreached) {
                    enemy.destroy();
                }
                return !isBreached;
            });
        }
        this.playerHealth = Math.max(0, this.playerHealth - breachResolution.playerDamageDelta);
        this.spawnLevel4SplitEnemies(breachResolution.splitSpawns);
    }
    resolveLevel4TrojanPlayerEnemyCollisions() {
        if (this.player === null || this.activeTrojans.length === 0) {
            return;
        }
        const result = resolveLevel4TrojanPlayerCollisions({
            enemies: this.activeTrojans.map((enemy) => enemy.toSnapshot()),
            player: {
                centerX: this.player.x + this.player.displayWidth / 2,
                centerY: this.player.y + this.player.displayHeight / 2,
                height: this.player.displayHeight,
                width: this.player.displayWidth,
            },
        });
        if (result.destroyedEnemyIds.length > 0) {
            this.activeTrojans = this.activeTrojans.filter((enemy) => {
                const isDestroyed = result.destroyedEnemyIds.includes(enemy.getEnemyId());
                if (isDestroyed) {
                    enemy.destroy();
                }
                return !isDestroyed;
            });
        }
        this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
    }
    applyTrojanSnapshotsById(snapshots) {
        const enemyById = new Map(this.activeTrojans.map((enemy) => [enemy.getEnemyId(), enemy]));
        for (const snapshot of snapshots) {
            const enemy = enemyById.get(snapshot.enemyId);
            if (enemy !== undefined) {
                enemy.applySnapshot(snapshot);
            }
        }
    }
    resolveTrojanVelocityById(enemyId) {
        const enemy = this.activeTrojans.find((item) => item.getEnemyId() === enemyId);
        if (enemy === undefined) {
            return { x: 0, y: 0 };
        }
        const snapshot = enemy.toSnapshot();
        return {
            x: snapshot.velocityX,
            y: snapshot.velocityY,
        };
    }
    spawnLevel4SplitEnemies(splitSpawns) {
        for (const splitSpawn of splitSpawns) {
            const fEmailSnapshot = {
                centerX: splitSpawn.impactX + 100,
                centerY: splitSpawn.impactY + 30,
                currentHealth: FEMAIL_HEALTH,
                damage: FEMAIL_DAMAGE,
                enemyId: `level4-split-femail-${this.level4SplitFEmailNextEnemyNumericId}`,
                height: 0,
                scoreValue: FEMAIL_SCORE_VALUE,
                velocityX: Math.random() > 0.5 ? -FEMAIL_HORIZONTAL_SPEED_PER_MS : FEMAIL_HORIZONTAL_SPEED_PER_MS,
                velocityY: Math.random() > 0.5 ? -FEMAIL_VERTICAL_SPEED_PER_MS : FEMAIL_VERTICAL_SPEED_PER_MS,
                width: 0,
            };
            this.level4SplitFEmailNextEnemyNumericId += 1;
            const fEmail = new FEmailPrefab(this, fEmailSnapshot);
            this.add.existing(fEmail);
            this.activeFEmails.push(fEmail);
            const rVirusSnapshot = {
                centerX: splitSpawn.impactX + 100,
                centerY: splitSpawn.impactY - 30,
                currentHealth: LEVEL2_RVIRUS_HEALTH,
                damage: LEVEL2_RVIRUS_DAMAGE,
                enemyId: `level4-split-rvirus-${this.level4SplitRVirusNextEnemyNumericId}`,
                height: 0,
                scoreValue: LEVEL2_RVIRUS_SCORE_VALUE,
                velocityX: Math.random() > 0.5
                    ? -LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS
                    : LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS,
                velocityY: Math.random() > 0.5
                    ? -LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS
                    : LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS,
                width: 0,
            };
            this.level4SplitRVirusNextEnemyNumericId += 1;
            const rVirus = new RVirusPrefab(this, rVirusSnapshot);
            this.add.existing(rVirus);
            this.activeRViruses.push(rVirus);
            const wormSnapshot = {
                centerX: splitSpawn.impactX + 100,
                centerY: splitSpawn.impactY + 30,
                currentHealth: LEVEL3_WORM_HEALTH,
                damage: LEVEL3_WORM_DAMAGE,
                enemyId: `level4-split-worm-${this.level4SplitWormNextEnemyNumericId}`,
                height: 0,
                scoreValue: LEVEL3_WORM_SCORE_VALUE,
                velocityX: -0.4,
                velocityY: -0.3,
                width: 0,
            };
            this.level4SplitWormNextEnemyNumericId += 1;
            const worm = new WormPrefab(this, wormSnapshot);
            this.add.existing(worm);
            this.activeWorms.push(worm);
        }
    }
    updateLevel2TransitionTrigger() {
        if (this.player === null || this.hasTriggeredLevel3Transition) {
            return;
        }
        const hasReachedTransition = isLevel2ToLevel3TransitionTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedTransition || !canTriggerLevelTransition(2, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.hasTriggeredLevel3Transition = true;
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 2,
            toLevel: 3,
        });
        this.enterLevel3();
    }
    updateLevel3TransitionTrigger() {
        if (this.player === null || this.hasTriggeredLevel4Transition) {
            return;
        }
        const hasReachedTransition = isLevel3ToLevel4TransitionTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedTransition || !canTriggerLevelTransition(3, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.hasTriggeredLevel4Transition = true;
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 3,
            toLevel: 4,
        });
        this.enterLevel4();
    }
    updateLevel4TransitionTrigger() {
        if (this.player === null || this.hasTriggeredLevel5Transition) {
            return;
        }
        const hasReachedTransition = isLevel4ToLevel5TransitionTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedTransition || !canTriggerLevelTransition(4, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.hasTriggeredLevel5Transition = true;
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 4,
            toLevel: 5,
        });
        this.enterLevel5();
    }
    updateLevel5VictoryTrigger() {
        if (this.player === null || this.hasTriggeredVictory) {
            return;
        }
        const hasReachedVictory = isLevel5VictoryTriggered({
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
            playerHeight: this.player.displayHeight,
            playerWidth: this.player.displayWidth,
            playerX: this.player.x,
            playerY: this.player.y,
        });
        if (!hasReachedVictory || !canTriggerLevelTransition(5, this.score, this.activeCombatItemCount)) {
            return;
        }
        this.hasTriggeredVictory = true;
        this.syncVictorySummaryText();
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 5,
            toLevel: 'victory',
        });
        this.syncActiveLevelVisualState();
    }
    updateLevel5Combat(elapsedMs) {
        const spawnResolution = advanceLevel5MrHackerSpawnState(this.level5MrHackerSpawnState, {
            canSpawn: this.activeLevelId === 5 && this.level5Phase === 'walkable',
            canvasHeight: this.scale.height,
            canvasWidth: this.scale.width,
        });
        this.level5MrHackerSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedEnemies) {
            const mrHacker = new MrHackerPrefab(this, spawnedEnemy);
            this.add.existing(mrHacker);
            this.activeMrHacker = mrHacker;
        }
        if (this.activeMrHacker !== null) {
            this.resolveLevel5BossMinionSpawns(elapsedMs);
        }
        if (this.activeMrHacker === null) {
            this.resolveLevel5MinionCombat(elapsedMs);
            this.resolveLevel5EnemyBulletPlayerCollisions();
            this.activeCombatItemCount = this.activeFEmails.length
                + this.activeRViruses.length
                + this.activeWorms.length;
            this.syncLevel5BossHealthBar();
            return;
        }
        this.activeMrHacker.advanceAnimation(elapsedMs);
        this.resolveLevel5MrHackerBulletVolleys(elapsedMs);
        this.resolveLevel5EnemyBulletPlayerCollisions();
        this.resolveLevel5MrHackerProjectileHits();
        if (this.activeMrHacker !== null && this.activeMrHacker.getCurrentHealth() <= 0) {
            this.activeMrHacker.destroy();
            this.activeMrHacker = null;
            this.resolveLevel5MinionCombat(elapsedMs);
            this.activeCombatItemCount = this.activeFEmails.length
                + this.activeRViruses.length
                + this.activeWorms.length;
            this.syncLevel5BossHealthBar();
            return;
        }
        this.resolveLevel5MinionCombat(elapsedMs);
        this.activeCombatItemCount = 1
            + this.activeFEmails.length
            + this.activeRViruses.length
            + this.activeWorms.length;
        this.syncLevel5BossHealthBar();
    }
    resolveLevel5BossMinionSpawns(elapsedMs) {
        if (this.activeMrHacker === null) {
            return;
        }
        const bossSnapshot = this.activeMrHacker.toSnapshot();
        const spawnResolution = advanceLevel5MrHackerMinionSpawnState(this.level5MrHackerMinionSpawnState, {
            bossCenterX: bossSnapshot.centerX,
            bossCenterY: bossSnapshot.centerY,
            canSpawn: this.activeLevelId === 5 && this.level5Phase === 'walkable',
            elapsedMs,
            random: () => Math.random(),
        });
        this.level5MrHackerMinionSpawnState = spawnResolution.nextState;
        for (const spawnedEnemy of spawnResolution.spawnedFEmails) {
            const fEmail = new FEmailPrefab(this, spawnedEnemy);
            this.add.existing(fEmail);
            this.activeFEmails.push(fEmail);
        }
        for (const spawnedEnemy of spawnResolution.spawnedRViruses) {
            const rVirus = new RVirusPrefab(this, spawnedEnemy);
            this.add.existing(rVirus);
            this.activeRViruses.push(rVirus);
        }
        for (const spawnedEnemy of spawnResolution.spawnedWorms) {
            const worm = new WormPrefab(this, spawnedEnemy);
            this.add.existing(worm);
            this.activeWorms.push(worm);
        }
    }
    resolveLevel5MinionCombat(elapsedMs) {
        if (this.activeFEmails.length > 0) {
            this.updateLevel1Combat(elapsedMs);
        }
        if (this.activeRViruses.length > 0) {
            this.updateLevel2Combat(elapsedMs);
        }
        if (this.activeWorms.length > 0) {
            this.updateLevel3Combat(elapsedMs);
        }
    }
    resolveLevel5MrHackerProjectileHits() {
        if (this.activeProjectiles.length === 0 || this.activeMrHacker === null) {
            return;
        }
        const projectileSnapshots = this.activeProjectiles.map((projectile) => ({
            centerX: projectile.x,
            centerY: projectile.y,
            damage: projectile.getDamage(),
            height: projectile.displayHeight,
            projectileId: projectile.name,
            width: projectile.displayWidth,
        }));
        for (let index = 0; index < projectileSnapshots.length; index += 1) {
            projectileSnapshots[index].projectileId = `projectile-${index}`;
        }
        const mrHackerSnapshot = this.activeMrHacker.toSnapshot();
        const resolution = resolveProjectileHitResolution({
            projectiles: projectileSnapshots,
            targets: [{
                    centerX: mrHackerSnapshot.centerX,
                    centerY: mrHackerSnapshot.centerY,
                    currentHealth: mrHackerSnapshot.currentHealth,
                    height: mrHackerSnapshot.height,
                    scoreValue: mrHackerSnapshot.scoreValue,
                    targetId: mrHackerSnapshot.enemyId,
                    width: mrHackerSnapshot.width,
                }],
        });
        if (resolution.destroyedProjectileIds.length > 0) {
            this.activeProjectiles = this.activeProjectiles.filter((projectile, index) => {
                const projectileId = `projectile-${index}`;
                const isDestroyed = resolution.destroyedProjectileIds.includes(projectileId);
                if (isDestroyed) {
                    projectile.destroy();
                }
                return !isDestroyed;
            });
        }
        if (resolution.remainingTargets.length === 0) {
            this.activeMrHacker.applySnapshot({
                ...mrHackerSnapshot,
                currentHealth: 0,
            });
            return;
        }
        const remainingTarget = resolution.remainingTargets[0];
        this.activeMrHacker.applySnapshot({
            ...mrHackerSnapshot,
            centerX: remainingTarget.centerX,
            centerY: remainingTarget.centerY,
            currentHealth: remainingTarget.currentHealth,
            height: remainingTarget.height,
            width: remainingTarget.width,
        });
    }
    resolveLevel5MrHackerBulletVolleys(elapsedMs) {
        if (this.activeMrHacker === null || this.player === null) {
            return;
        }
        const mrHackerSnapshot = this.activeMrHacker.toSnapshot();
        const playerCenterX = this.player.x + this.player.displayWidth / 2;
        const playerCenterY = this.player.y + this.player.displayHeight / 2;
        const volleyResult = advanceLevel5MrHackerBulletState(this.level5MrHackerBulletState, {
            bossCenterX: mrHackerSnapshot.centerX,
            bossCenterY: mrHackerSnapshot.centerY,
            canFire: this.activeLevelId === 5 && this.level5Phase === 'walkable',
            elapsedMs,
            playerCenterX,
            playerCenterY,
            random: () => Math.random(),
        });
        this.level5MrHackerBulletState = volleyResult.nextState;
        for (const spawnedBullet of volleyResult.spawnedBullets) {
            const bullet = new EnemyBulletPrefab(this, spawnedBullet);
            this.add.existing(bullet);
            this.activeEnemyBullets.push(bullet);
        }
    }
    resolveLevel5EnemyBulletPlayerCollisions() {
        if (this.player === null || this.activeEnemyBullets.length === 0) {
            return;
        }
        const collisionResult = resolveLevel5EnemyBulletPlayerCollisions({
            bullets: this.activeEnemyBullets.map((bullet) => bullet.toSnapshot()),
            player: {
                centerX: this.player.x + this.player.displayWidth / 2,
                centerY: this.player.y + this.player.displayHeight / 2,
                height: this.player.displayHeight,
                width: this.player.displayWidth,
            },
        });
        if (collisionResult.destroyedBulletIds.length > 0) {
            this.activeEnemyBullets = this.activeEnemyBullets.filter((bullet) => {
                const isDestroyed = collisionResult.destroyedBulletIds.includes(bullet.getBulletId());
                if (isDestroyed) {
                    bullet.destroy();
                }
                return !isDestroyed;
            });
        }
        this.playerHealth = Math.max(0, this.playerHealth - collisionResult.playerDamageDelta);
    }
    enterLevel1() {
        this.activeLevelId = 1;
        this.destroyMrHacker();
        this.destroyAllEnemyBullets();
        this.hasTriggeredLevel1Transition = true;
        this.level1FEmailSpawnState = createInitialLevel1FEmailSpawnState();
        this.activeCombatItemCount = 0;
        this.level1DialogueState = createInitialLevel1DialogueState();
        this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel2() {
        this.activeLevelId = 2;
        this.destroyMrHacker();
        this.destroyAllEnemyBullets();
        this.destroyAllFEmails();
        this.destroyAllRViruses();
        this.activeCombatItemCount = 0;
        this.level2RVirusSpawnState = createInitialLevel2RVirusSpawnState();
        this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
        this.level2DialogueState = createInitialLevel2DialogueState();
        this.level2Phase = resolveLevel2DialoguePhase(this.level2DialogueState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel3() {
        this.activeLevelId = 3;
        this.destroyMrHacker();
        this.destroyAllEnemyBullets();
        this.destroyAllRViruses();
        this.destroyAllWorms();
        this.activeCombatItemCount = 0;
        this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
        this.level3WormSpawnState = createInitialLevel3WormSpawnState();
        this.level3WormDuplicationState = createInitialLevel3WormDuplicationState();
        this.level3DialogueState = createInitialLevel3DialogueState();
        this.level3Phase = resolveLevel3DialoguePhase(this.level3DialogueState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel4() {
        this.activeLevelId = 4;
        this.destroyMrHacker();
        this.destroyAllEnemyBullets();
        this.destroyAllFEmails();
        this.destroyAllRViruses();
        this.destroyAllWorms();
        this.destroyAllTrojans();
        this.activeCombatItemCount = 0;
        this.level4TrojanSpawnState = createInitialLevel4TrojanSpawnState();
        this.level4SplitFEmailNextEnemyNumericId = 0;
        this.level4SplitRVirusNextEnemyNumericId = 0;
        this.level4SplitWormNextEnemyNumericId = 0;
        this.level4DialogueState = createInitialLevel4DialogueState();
        this.level4Phase = resolveLevel4DialoguePhase(this.level4DialogueState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel5() {
        this.activeLevelId = 5;
        this.destroyMrHacker();
        this.destroyAllEnemyBullets();
        this.destroyAllFEmails();
        this.destroyAllRViruses();
        this.destroyAllWorms();
        this.destroyAllTrojans();
        this.activeCombatItemCount = 0;
        this.level5MrHackerSpawnState = createInitialLevel5MrHackerSpawnState();
        this.level5MrHackerBulletState = createInitialLevel5MrHackerBulletState(() => Math.random());
        this.level5MrHackerMinionSpawnState = createInitialLevel5MrHackerMinionSpawnState();
        this.level5DialogueState = createInitialLevel5DialogueState();
        this.level5Phase = resolveLevel5DialoguePhase(this.level5DialogueState, LEVEL5_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    syncActiveLevelVisualState() {
        if (this.activeLevelId === 0) {
            this.syncLevel0VisualState();
            return;
        }
        if (this.activeLevelId === 1) {
            this.syncLevel1VisualState();
            return;
        }
        if (this.activeLevelId === 2) {
            this.syncLevel2VisualState();
            return;
        }
        if (this.activeLevelId === 3) {
            this.syncLevel3VisualState();
            return;
        }
        if (this.activeLevelId === 4) {
            this.syncLevel4VisualState();
            return;
        }
        if (this.hasTriggeredVictory) {
            this.syncVictoryVisualState();
            return;
        }
        this.syncLevel5VisualState();
    }
    syncLevel0VisualState() {
        if (this.level0Phase === 'startScreen') {
            document.body.className = 'startScreen';
            this.setStartPromptVisible(true);
            this.setDialogueVisible(false);
            this.setPlayerVisible(false);
            this.setMrHackerHealthBarVisible(false);
            return;
        }
        document.body.className = 'level0';
        this.setStartPromptVisible(false);
        this.setMrHackerHealthBarVisible(false);
        if (this.level0Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL0_DIALOGUE_TEXTURE_KEYS[this.dialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.setMrHackerHealthBarVisible(false);
    }
    syncLevel1VisualState() {
        document.body.className = 'level1';
        this.setStartPromptVisible(false);
        this.setMrHackerHealthBarVisible(false);
        if (this.level1Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL1_DIALOGUE_TEXTURE_KEYS[this.level1DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.setMrHackerHealthBarVisible(false);
    }
    syncLevel2VisualState() {
        document.body.className = 'level2';
        this.setStartPromptVisible(false);
        this.setMrHackerHealthBarVisible(false);
        if (this.level2Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL2_DIALOGUE_TEXTURE_KEYS[this.level2DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.setMrHackerHealthBarVisible(false);
    }
    syncLevel3VisualState() {
        document.body.className = 'level3';
        this.setStartPromptVisible(false);
        this.setMrHackerHealthBarVisible(false);
        if (this.level3Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL3_DIALOGUE_TEXTURE_KEYS[this.level3DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.setMrHackerHealthBarVisible(false);
    }
    syncLevel4VisualState() {
        document.body.className = 'level4';
        this.setStartPromptVisible(false);
        this.setMrHackerHealthBarVisible(false);
        if (this.level4Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL4_DIALOGUE_TEXTURE_KEYS[this.level4DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.setMrHackerHealthBarVisible(false);
    }
    syncLevel5VisualState() {
        document.body.className = resolveLevel5CombatBackdropClass({
            activeCombatItemCount: this.activeCombatItemCount,
            score: this.score,
        });
        this.setStartPromptVisible(false);
        this.setVictorySummaryVisible(false);
        if (this.level5Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL5_DIALOGUE_TEXTURE_KEYS[this.level5DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
        this.syncLevel5BossHealthBar();
    }
    syncVictoryVisualState() {
        document.body.className = 'victory';
        this.setStartPromptVisible(false);
        this.setDialogueVisible(false);
        this.setPlayerVisible(false);
        this.setMrHackerHealthBarVisible(false);
        this.syncVictorySummaryText();
        this.setVictorySummaryVisible(true);
    }
    syncLevel5BossHealthBar() {
        if (this.mrHackerHealthBar === null) {
            return;
        }
        if (this.activeLevelId !== 5 || this.level5Phase !== 'walkable' || this.activeMrHacker === null) {
            this.mrHackerHealthBar.setVisible(false);
            return;
        }
        this.mrHackerHealthBar.setTexture(resolveLevel5MrHackerHealthBarTextureKey(this.activeMrHacker.getCurrentHealth()));
        this.mrHackerHealthBar.setPosition(this.scale.width / 2 - 480, this.scale.height / 2 - 968);
        this.mrHackerHealthBar.setVisible(true);
    }
    setDialogueVisible(shouldBeVisible) {
        if (this.dialogueImage !== null) {
            this.dialogueImage.setVisible(shouldBeVisible);
        }
    }
    setStartPromptVisible(shouldBeVisible) {
        if (this.startPromptText !== null) {
            this.startPromptText.setVisible(shouldBeVisible);
        }
    }
    syncVictorySummaryText() {
        const summary = resolveVictorySummaryText({
            multiplier: this.scoreMultiplier,
            score: this.score,
        });
        this.victoryScoreText?.setText(summary.scoreText);
        this.victoryMultiplierText?.setText(summary.multiplierText);
        this.victoryFinalScoreText?.setText(summary.finalScoreText);
        this.victoryRestartPromptText?.setText(summary.restartPromptText);
    }
    setVictorySummaryVisible(shouldBeVisible) {
        this.victoryScoreText?.setVisible(shouldBeVisible);
        this.victoryMultiplierText?.setVisible(shouldBeVisible);
        this.victoryFinalScoreText?.setVisible(shouldBeVisible);
        this.victoryRestartPromptText?.setVisible(shouldBeVisible);
    }
    setPlayerVisible(shouldBeVisible) {
        if (this.player !== null) {
            this.player.setVisible(shouldBeVisible);
        }
    }
    setMrHackerHealthBarVisible(shouldBeVisible) {
        if (this.mrHackerHealthBar !== null) {
            this.mrHackerHealthBar.setVisible(shouldBeVisible);
        }
    }
    destroyAllFEmails() {
        for (const enemy of this.activeFEmails) {
            enemy.destroy();
        }
        this.activeFEmails = [];
    }
    destroyAllRViruses() {
        for (const enemy of this.activeRViruses) {
            enemy.destroy();
        }
        this.activeRViruses = [];
    }
    destroyAllWorms() {
        for (const enemy of this.activeWorms) {
            enemy.destroy();
        }
        this.activeWorms = [];
    }
    destroyAllTrojans() {
        for (const enemy of this.activeTrojans) {
            enemy.destroy();
        }
        this.activeTrojans = [];
    }
    destroyAllEnemyBullets() {
        for (const bullet of this.activeEnemyBullets) {
            bullet.destroy();
        }
        this.activeEnemyBullets = [];
    }
    destroyMrHacker() {
        if (this.activeMrHacker !== null) {
            this.activeMrHacker.destroy();
            this.activeMrHacker = null;
        }
        this.setMrHackerHealthBarVisible(false);
    }
    isActiveLevelWalkablePhase() {
        if (this.activeLevelId === 0) {
            return this.level0Phase === 'walkable';
        }
        if (this.activeLevelId === 1) {
            return this.level1Phase === 'walkable';
        }
        if (this.activeLevelId === 2) {
            return this.level2Phase === 'walkable';
        }
        if (this.activeLevelId === 3) {
            return this.level3Phase === 'walkable';
        }
        if (this.activeLevelId === 4) {
            return this.level4Phase === 'walkable';
        }
        return this.level5Phase === 'walkable';
    }
}
//# sourceMappingURL=GameScene.js.map