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
        this.dialogueImage = this.add.image(centerX, centerY, LEVEL0_DIALOGUE_TEXTURE_KEYS[0]);
        this.dialogueImage.setVisible(false);
        this.player = new PlayerPrefab(this);
        this.add.existing(this.player);
        this.events.on(GameScene.SHOOT_INPUT_EVENT, this.handleShootInput, this);
        this.syncActiveLevelVisualState();
    }
    update(_time, delta) {
        this.updateProjectiles(delta);
        if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
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
            this.updateLevel1TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 2 && this.level2Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel2TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 3 && this.level3Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel3TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 4 && this.level4Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel4TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 5 && this.level5Phase === 'walkable' && !this.hasTriggeredVictory) {
            this.updatePlayerMovement();
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
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 5,
            toLevel: 'victory',
        });
        this.syncActiveLevelVisualState();
    }
    enterLevel1() {
        this.activeLevelId = 1;
        this.hasTriggeredLevel1Transition = true;
        this.level1DialogueState = createInitialLevel1DialogueState();
        this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel2() {
        this.activeLevelId = 2;
        this.level2DialogueState = createInitialLevel2DialogueState();
        this.level2Phase = resolveLevel2DialoguePhase(this.level2DialogueState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel3() {
        this.activeLevelId = 3;
        this.level3DialogueState = createInitialLevel3DialogueState();
        this.level3Phase = resolveLevel3DialoguePhase(this.level3DialogueState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel4() {
        this.activeLevelId = 4;
        this.level4DialogueState = createInitialLevel4DialogueState();
        this.level4Phase = resolveLevel4DialoguePhase(this.level4DialogueState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    enterLevel5() {
        this.activeLevelId = 5;
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
            return;
        }
        document.body.className = 'level0';
        this.setStartPromptVisible(false);
        if (this.level0Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL0_DIALOGUE_TEXTURE_KEYS[this.dialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncLevel1VisualState() {
        document.body.className = 'level1';
        this.setStartPromptVisible(false);
        if (this.level1Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL1_DIALOGUE_TEXTURE_KEYS[this.level1DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncLevel2VisualState() {
        document.body.className = 'level2';
        this.setStartPromptVisible(false);
        if (this.level2Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL2_DIALOGUE_TEXTURE_KEYS[this.level2DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncLevel3VisualState() {
        document.body.className = 'level3';
        this.setStartPromptVisible(false);
        if (this.level3Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL3_DIALOGUE_TEXTURE_KEYS[this.level3DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncLevel4VisualState() {
        document.body.className = 'level4';
        this.setStartPromptVisible(false);
        if (this.level4Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL4_DIALOGUE_TEXTURE_KEYS[this.level4DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncLevel5VisualState() {
        document.body.className = 'level5';
        this.setStartPromptVisible(false);
        if (this.level5Phase === 'dialogue') {
            this.setDialogueVisible(true);
            this.setPlayerVisible(false);
            this.dialogueImage?.setTexture(LEVEL5_DIALOGUE_TEXTURE_KEYS[this.level5DialogueState.currentDialogue]);
            return;
        }
        this.setDialogueVisible(false);
        this.setPlayerVisible(true);
    }
    syncVictoryVisualState() {
        document.body.className = 'victory';
        this.setStartPromptVisible(false);
        this.setDialogueVisible(false);
        this.setPlayerVisible(false);
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
    setPlayerVisible(shouldBeVisible) {
        if (this.player !== null) {
            this.player.setVisible(shouldBeVisible);
        }
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