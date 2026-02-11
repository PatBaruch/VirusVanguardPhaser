import * as Phaser from 'phaser';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS, advanceLevel0DialogueState, createInitialLevel0DialogueState, resolveLevel0DialoguePhase, } from './level0DialogueState.js';
import PlayerPrefab from '../entities/PlayerPrefab.js';
import { resolvePlayerMovementStep } from '../entities/playerMovementStep.js';
import { canMoveWithinLevel0Bounds, isLevel0ToLevel1TransitionTriggered, } from './level0TraversalRules.js';
import { LEVEL1_DIALOGUE_TEXTURE_KEYS, advanceLevel1DialogueState, createInitialLevel1DialogueState, resolveLevel1DialoguePhase, } from './level1DialogueState.js';
import { canMoveWithinLevel1Bounds, isLevel1ToLevel2TransitionTriggered, } from './level1TraversalRules.js';
export default class GameScene extends Phaser.Scene {
    static SCENE_KEY = 'GameScene';
    static LEVEL_TRANSITION_EVENT = 'level-transition';
    dialogueState;
    dialogueImage;
    startPromptText;
    level0Phase;
    activeLevelId;
    level1DialogueState;
    level1Phase;
    player;
    spaceKey;
    moveUpKey;
    moveLeftKey;
    moveDownKey;
    moveRightKey;
    hasTriggeredLevel1Transition;
    hasTriggeredLevel2Transition;
    constructor() {
        super(GameScene.SCENE_KEY);
        this.dialogueState = createInitialLevel0DialogueState();
        this.dialogueImage = null;
        this.startPromptText = null;
        this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
        this.activeLevelId = 0;
        this.level1DialogueState = createInitialLevel1DialogueState();
        this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
        this.player = null;
        this.spaceKey = null;
        this.moveUpKey = null;
        this.moveLeftKey = null;
        this.moveDownKey = null;
        this.moveRightKey = null;
        this.hasTriggeredLevel1Transition = false;
        this.hasTriggeredLevel2Transition = false;
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
        this.syncActiveLevelVisualState();
    }
    update() {
        if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            if (this.activeLevelId === 0) {
                this.dialogueState = advanceLevel0DialogueState(this.dialogueState);
                this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
            }
            else if (this.activeLevelId === 1 && this.level1Phase === 'dialogue') {
                this.level1DialogueState = advanceLevel1DialogueState(this.level1DialogueState);
                this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
            }
            this.syncActiveLevelVisualState();
        }
        if (this.activeLevelId === 0 && this.level0Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel0TransitionTrigger();
            return;
        }
        if (this.activeLevelId === 1 && this.level1Phase === 'walkable') {
            this.updatePlayerMovement();
            this.updateLevel1TransitionTrigger();
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
        const canApplyMovement = this.activeLevelId === 0
            ? canMoveWithinLevel0Bounds(traversalSnapshot, movementStep.facingDirection)
            : canMoveWithinLevel1Bounds(traversalSnapshot, movementStep.facingDirection);
        if (!canApplyMovement) {
            return;
        }
        this.player.x += movementStep.deltaX;
        this.player.y += movementStep.deltaY;
        this.player.setFacingDirection(movementStep.facingDirection);
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
        if (!hasReachedTransition) {
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
        if (!hasReachedTransition) {
            return;
        }
        this.hasTriggeredLevel2Transition = true;
        this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
            fromLevel: 1,
            toLevel: 2,
        });
    }
    enterLevel1() {
        this.activeLevelId = 1;
        this.hasTriggeredLevel1Transition = true;
        this.level1DialogueState = createInitialLevel1DialogueState();
        this.level1Phase = resolveLevel1DialoguePhase(this.level1DialogueState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
        this.syncActiveLevelVisualState();
    }
    syncActiveLevelVisualState() {
        if (this.activeLevelId === 0) {
            this.syncLevel0VisualState();
            return;
        }
        this.syncLevel1VisualState();
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
}
//# sourceMappingURL=GameScene.js.map