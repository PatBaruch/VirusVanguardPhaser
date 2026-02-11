import * as Phaser from 'phaser';
import { LEVEL0_DIALOGUE_TEXTURE_KEYS, advanceLevel0DialogueState, createInitialLevel0DialogueState, resolveLevel0DialoguePhase, } from './level0DialogueState.js';
import PlayerPrefab from '../entities/PlayerPrefab.js';
export default class GameScene extends Phaser.Scene {
    static SCENE_KEY = 'GameScene';
    dialogueState;
    dialogueImage;
    startPromptText;
    level0Phase;
    player;
    spaceKey;
    constructor() {
        super(GameScene.SCENE_KEY);
        this.dialogueState = createInitialLevel0DialogueState();
        this.dialogueImage = null;
        this.startPromptText = null;
        this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
        this.player = null;
        this.spaceKey = null;
    }
    create() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        this.spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE) ?? null;
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
        this.syncLevel0VisualState();
    }
    update() {
        if (this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.dialogueState = advanceLevel0DialogueState(this.dialogueState);
            this.level0Phase = resolveLevel0DialoguePhase(this.dialogueState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
            this.syncLevel0VisualState();
        }
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