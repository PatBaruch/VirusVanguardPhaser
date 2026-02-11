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

/**
 * Minimal game scene shell for Phaser runtime lifecycle.
 */
export default class GameScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'GameScene';

  private dialogueState: Level0DialogueState;

  private dialogueImage: Phaser.GameObjects.Image | null;

  private startPromptText: Phaser.GameObjects.Text | null;

  private level0Phase: Level0DialoguePhase;

  private player: PlayerPrefab | null;

  private spaceKey: Phaser.Input.Keyboard.Key | null;

  public constructor() {
    super(GameScene.SCENE_KEY);
    this.dialogueState = createInitialLevel0DialogueState();
    this.dialogueImage = null;
    this.startPromptText = null;
    this.level0Phase = resolveLevel0DialoguePhase(
      this.dialogueState,
      LEVEL0_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.player = null;
    this.spaceKey = null;
  }

  public create(): void {
    const centerX: number = this.scale.width / 2;
    const centerY: number = this.scale.height / 2;

    this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) ?? null;

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

    this.syncLevel0VisualState();
  }

  public override update(): void {
    if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.dialogueState = advanceLevel0DialogueState(this.dialogueState);
      this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
      this.syncLevel0VisualState();
    }
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
