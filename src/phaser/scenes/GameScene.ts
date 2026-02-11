import * as Phaser from 'phaser';
import {
  LEVEL0_DIALOGUE_TEXTURE_KEYS,
  Level0DialoguePhase,
  Level0DialogueState,
  advanceLevel0DialogueState,
  createInitialLevel0DialogueState,
  resolveLevel0DialoguePhase,
} from './level0DialogueState.js';
import PlayerPrefab from '../entities/PlayerPrefab.js';
import { resolvePlayerMovementStep } from '../entities/playerMovementStep.js';
import {
  canMoveWithinLevel0Bounds,
  isLevel0ToLevel1TransitionTriggered,
} from './level0TraversalRules.js';
import {
  LEVEL1_DIALOGUE_TEXTURE_KEYS,
  Level1DialoguePhase,
  Level1DialogueState,
  advanceLevel1DialogueState,
  createInitialLevel1DialogueState,
  resolveLevel1DialoguePhase,
} from './level1DialogueState.js';
import {
  canMoveWithinLevel1Bounds,
  isLevel1ToLevel2TransitionTriggered,
} from './level1TraversalRules.js';
import {
  LEVEL2_DIALOGUE_TEXTURE_KEYS,
  Level2DialoguePhase,
  Level2DialogueState,
  advanceLevel2DialogueState,
  createInitialLevel2DialogueState,
  resolveLevel2DialoguePhase,
} from './level2DialogueState.js';
import {
  canMoveWithinLevel2Bounds,
  isLevel2ToLevel3TransitionTriggered,
} from './level2TraversalRules.js';

/**
 * Minimal game scene shell for Phaser runtime lifecycle.
 */
export default class GameScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'GameScene';

  public static readonly LEVEL_TRANSITION_EVENT: string = 'level-transition';

  private dialogueState: Level0DialogueState;

  private dialogueImage: Phaser.GameObjects.Image | null;

  private startPromptText: Phaser.GameObjects.Text | null;

  private level0Phase: Level0DialoguePhase;

  private activeLevelId: 0 | 1 | 2;

  private level1DialogueState: Level1DialogueState;

  private level1Phase: Level1DialoguePhase;

  private level2DialogueState: Level2DialogueState;

  private level2Phase: Level2DialoguePhase;

  private player: PlayerPrefab | null;

  private spaceKey: Phaser.Input.Keyboard.Key | null;

  private moveUpKey: Phaser.Input.Keyboard.Key | null;

  private moveLeftKey: Phaser.Input.Keyboard.Key | null;

  private moveDownKey: Phaser.Input.Keyboard.Key | null;

  private moveRightKey: Phaser.Input.Keyboard.Key | null;

  private hasTriggeredLevel1Transition: boolean;

  private hasTriggeredLevel2Transition: boolean;

  private hasTriggeredLevel3Transition: boolean;

  public constructor() {
    super(GameScene.SCENE_KEY);
    this.dialogueState = createInitialLevel0DialogueState();
    this.dialogueImage = null;
    this.startPromptText = null;
    this.level0Phase = resolveLevel0DialoguePhase(
      this.dialogueState,
      LEVEL0_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.activeLevelId = 0;
    this.level1DialogueState = createInitialLevel1DialogueState();
    this.level1Phase = resolveLevel1DialoguePhase(
      this.level1DialogueState,
      LEVEL1_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.level2DialogueState = createInitialLevel2DialogueState();
    this.level2Phase = resolveLevel2DialoguePhase(
      this.level2DialogueState,
      LEVEL2_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.player = null;
    this.spaceKey = null;
    this.moveUpKey = null;
    this.moveLeftKey = null;
    this.moveDownKey = null;
    this.moveRightKey = null;
    this.hasTriggeredLevel1Transition = false;
    this.hasTriggeredLevel2Transition = false;
    this.hasTriggeredLevel3Transition = false;
  }

  public create(): void {
    const centerX: number = this.scale.width / 2;
    const centerY: number = this.scale.height / 2;

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) ?? null;
    this.moveUpKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.W) ?? null;
    this.moveLeftKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.A) ?? null;
    this.moveDownKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.S) ?? null;
    this.moveRightKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.D) ?? null;

    this.startPromptText = this.add.text(
      centerX,
      centerY + 200,
      'Press space to start the game',
      {
        color: '#ff0000',
        fontFamily: 'Copperplate',
        fontSize: '50px',
      },
    );
    this.startPromptText.setOrigin(0.5, 0.5);

    this.dialogueImage = this.add.image(centerX, centerY, LEVEL0_DIALOGUE_TEXTURE_KEYS[0]);
    this.dialogueImage.setVisible(false);

    this.player = new PlayerPrefab(this);
    this.add.existing(this.player);

    this.syncActiveLevelVisualState();
  }

  public override update(): void {
    if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      if (this.activeLevelId === 0) {
        this.dialogueState = advanceLevel0DialogueState(this.dialogueState);
        this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
      } else if (this.activeLevelId === 1 && this.level1Phase === 'dialogue') {
        this.level1DialogueState = advanceLevel1DialogueState(this.level1DialogueState);
        this.level1Phase = resolveLevel1DialoguePhase(
          this.level1DialogueState,
          LEVEL1_DIALOGUE_TEXTURE_KEYS.length,
        );
      } else if (this.activeLevelId === 2 && this.level2Phase === 'dialogue') {
        this.level2DialogueState = advanceLevel2DialogueState(this.level2DialogueState);
        this.level2Phase = resolveLevel2DialoguePhase(
          this.level2DialogueState,
          LEVEL2_DIALOGUE_TEXTURE_KEYS.length,
        );
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
      return;
    }

    if (this.activeLevelId === 2 && this.level2Phase === 'walkable') {
      this.updatePlayerMovement();
      this.updateLevel2TransitionTrigger();
    }
  }

  private updatePlayerMovement(): void {
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

    let canApplyMovement: boolean;
    if (this.activeLevelId === 0) {
      canApplyMovement = canMoveWithinLevel0Bounds(traversalSnapshot, movementStep.facingDirection);
    } else if (this.activeLevelId === 1) {
      canApplyMovement = canMoveWithinLevel1Bounds(traversalSnapshot, movementStep.facingDirection);
    } else {
      canApplyMovement = canMoveWithinLevel2Bounds(traversalSnapshot, movementStep.facingDirection);
    }

    if (!canApplyMovement) {
      return;
    }

    this.player.x += movementStep.deltaX;
    this.player.y += movementStep.deltaY;
    this.player.setFacingDirection(movementStep.facingDirection);
  }

  private updateLevel0TransitionTrigger(): void {
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

  private updateLevel1TransitionTrigger(): void {
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

    this.enterLevel2();
  }

  private updateLevel2TransitionTrigger(): void {
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

    if (!hasReachedTransition) {
      return;
    }

    this.hasTriggeredLevel3Transition = true;
    this.events.emit(GameScene.LEVEL_TRANSITION_EVENT, {
      fromLevel: 2,
      toLevel: 3,
    });
  }

  private enterLevel1(): void {
    this.activeLevelId = 1;
    this.hasTriggeredLevel1Transition = true;
    this.level1DialogueState = createInitialLevel1DialogueState();
    this.level1Phase = resolveLevel1DialoguePhase(
      this.level1DialogueState,
      LEVEL1_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.syncActiveLevelVisualState();
  }

  private enterLevel2(): void {
    this.activeLevelId = 2;
    this.level2DialogueState = createInitialLevel2DialogueState();
    this.level2Phase = resolveLevel2DialoguePhase(
      this.level2DialogueState,
      LEVEL2_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.syncActiveLevelVisualState();
  }

  private syncActiveLevelVisualState(): void {
    if (this.activeLevelId === 0) {
      this.syncLevel0VisualState();
      return;
    }

    if (this.activeLevelId === 1) {
      this.syncLevel1VisualState();
      return;
    }

    this.syncLevel2VisualState();
  }

  private syncLevel0VisualState(): void {
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

  private syncLevel1VisualState(): void {
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

  private syncLevel2VisualState(): void {
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

  private setDialogueVisible(shouldBeVisible: boolean): void {
    if (this.dialogueImage !== null) {
      this.dialogueImage.setVisible(shouldBeVisible);
    }
  }

  private setStartPromptVisible(shouldBeVisible: boolean): void {
    if (this.startPromptText !== null) {
      this.startPromptText.setVisible(shouldBeVisible);
    }
  }

  private setPlayerVisible(shouldBeVisible: boolean): void {
    if (this.player !== null) {
      this.player.setVisible(shouldBeVisible);
    }
  }
}
