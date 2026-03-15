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
import {
  LEVEL3_DIALOGUE_TEXTURE_KEYS,
  Level3DialoguePhase,
  Level3DialogueState,
  advanceLevel3DialogueState,
  createInitialLevel3DialogueState,
  resolveLevel3DialoguePhase,
} from './level3DialogueState.js';
import {
  canMoveWithinLevel3Bounds,
  isLevel3ToLevel4TransitionTriggered,
} from './level3TraversalRules.js';
import {
  LEVEL4_DIALOGUE_TEXTURE_KEYS,
  Level4DialoguePhase,
  Level4DialogueState,
  advanceLevel4DialogueState,
  createInitialLevel4DialogueState,
  resolveLevel4DialoguePhase,
} from './level4DialogueState.js';
import {
  canMoveWithinLevel4Bounds,
  isLevel4ToLevel5TransitionTriggered,
} from './level4TraversalRules.js';
import {
  LEVEL5_DIALOGUE_TEXTURE_KEYS,
  Level5DialoguePhase,
  Level5DialogueState,
  advanceLevel5DialogueState,
  createInitialLevel5DialogueState,
  resolveLevel5DialoguePhase,
} from './level5DialogueState.js';
import {
  canMoveWithinLevel5Bounds,
  isLevel5VictoryTriggered,
} from './level5TraversalRules.js';
import { canTriggerLevelTransition } from './transitionRuleEngine.js';
import {
  resolveNextShootCooldownMs,
  resolveShootCooldownDurationMs,
  shouldEmitShootInput,
} from './shootInputGate.js';
import ProjectilePrefab from '../entities/ProjectilePrefab.js';
import { resolveSingleShotProjectileConfigs } from './singleShotPattern.js';
import { resolveDualShotProjectileConfigs } from './dualShotPattern.js';
import { resolveTripleShotProjectileConfigs } from './tripleShotPattern.js';
import {
  CombatProjectileSnapshot,
  CombatTargetSnapshot,
  DeathEffectSpawnSnapshot,
  resolveProjectileHitResolution,
} from './projectileHitResolution.js';
import DeathEffectPrefab from '../entities/DeathEffectPrefab.js';
import FEmailPrefab from '../entities/FEmailPrefab.js';
import {
  FEMAIL_DAMAGE,
  FEMAIL_HEALTH,
  FEMAIL_HORIZONTAL_SPEED_PER_MS,
  FEMAIL_SCORE_VALUE,
  FEMAIL_VERTICAL_SPEED_PER_MS,
  Level1FEmailEnemySnapshot,
  Level1FEmailSpawnState,
  advanceLevel1FEmailMotion,
  advanceLevel1FEmailSpawnState,
  createInitialLevel1FEmailSpawnState,
  resolveLevel1PlayerEnemyCollisions,
} from './level1FEmailCombat.js';
import RVirusPrefab from '../entities/RVirusPrefab.js';
import {
  LEVEL2_RVIRUS_DAMAGE,
  LEVEL2_RVIRUS_HEALTH,
  LEVEL2_RVIRUS_HORIZONTAL_SPEED_PER_MS,
  LEVEL2_RVIRUS_SCORE_VALUE,
  LEVEL2_RVIRUS_VERTICAL_SPEED_PER_MS,
  Level2RVirusAttachmentState,
  Level2RVirusEnemySnapshot,
  Level2RVirusSpawnState,
  advanceLevel2RVirusMotion,
  advanceLevel2RVirusSpawnState,
  createInitialLevel2RVirusAttachmentState,
  createInitialLevel2RVirusSpawnState,
  resolveLevel2RVirusAttachment,
} from './level2RVirusCombat.js';
import WormPrefab from '../entities/WormPrefab.js';
import {
  LEVEL3_WORM_DAMAGE,
  LEVEL3_WORM_HEALTH,
  LEVEL3_WORM_SCORE_VALUE,
  Level3WormDuplicationState,
  Level3WormEnemySnapshot,
  Level3WormSpawnState,
  advanceLevel3WormDuplicationState,
  advanceLevel3WormMotion,
  advanceLevel3WormSpawnState,
  createInitialLevel3WormDuplicationState,
  createInitialLevel3WormSpawnState,
  resolveLevel3PlayerEnemyCollisions,
} from './level3WormCombat.js';
import TrojanPrefab from '../entities/TrojanPrefab.js';
import {
  LEVEL4_TROJAN_DAMAGE,
  Level4TrojanEnemySnapshot,
  Level4TrojanSpawnState,
  TrojanSplitSpawnSnapshot,
  advanceLevel4TrojanMotion,
  advanceLevel4TrojanSpawnState,
  createInitialLevel4TrojanSpawnState,
  resolveLevel4TrojanBreaches,
  resolveLevel4TrojanPlayerCollisions,
  resolveLevel4TrojanProjectileHits,
} from './level4TrojanCombat.js';
import MrHackerPrefab from '../entities/MrHackerPrefab.js';
import EnemyBulletPrefab from '../entities/EnemyBulletPrefab.js';
import {
  Level5MrHackerMinionSpawnState,
  Level5MrHackerBulletState,
  Level5MrHackerSpawnState,
  advanceLevel5MrHackerBulletState,
  advanceLevel5MrHackerMinionSpawnState,
  advanceLevel5MrHackerSpawnState,
  createInitialLevel5MrHackerBulletState,
  createInitialLevel5MrHackerMinionSpawnState,
  createInitialLevel5MrHackerSpawnState,
  resolveLevel5EnemyBulletPlayerCollisions,
  resolveLevel5MrHackerHealthBarTextureKey,
} from './level5MrHackerCombat.js';
import {
  INITIAL_SCORE_MULTIPLIER,
  advanceScoreMultiplier,
  resolveLevel5CombatBackdropClass,
  resolveVictorySummaryText,
  shouldRestartFromVictory,
} from './level5VictoryFlow.js';
import {
  resolveNextPlayerRecoveryMsRemaining,
  resolvePlayerDamageRecovery,
  resolveGameplayHudText,
  resolvePlayerStateClass,
  shouldTriggerGameOver,
} from './gameplayStatus.js';
import { resolveInitialPlayerHealthFromSearch } from './e2eRuntimeConfig.js';
import {
  LEVEL_BOUNDS_PARITY,
  LEVEL_TRANSITION_BOUNDS_PARITY,
  LevelId,
} from '../config/parityConstants.js';

const PLAYER_DAMAGE_FEEDBACK_DURATION_MS: number = 180;
const PLAYER_DAMAGE_RECOVERY_DURATION_MS: number = 450;
const PLAYER_DAMAGE_OVERLAY_ALPHA: number = 0.28;
const PLAYER_RECOVERY_OVERLAY_ALPHA: number = 0.1;
const PLAYER_DAMAGE_SHAKE_INTENSITY: number = 0.008;

/**
 * Minimal game scene shell for Phaser runtime lifecycle.
 */
export default class GameScene extends Phaser.Scene {
  public static readonly SCENE_KEY: string = 'GameScene';

  public static readonly LEVEL_TRANSITION_EVENT: string = 'level-transition';

  public static readonly SHOOT_INPUT_EVENT: string = 'shoot-input';

  private dialogueState: Level0DialogueState;

  private dialogueImage: Phaser.GameObjects.Image | null;

  private startPromptText: Phaser.GameObjects.Text | null;

  private level0Phase: Level0DialoguePhase;

  private activeLevelId: 0 | 1 | 2 | 3 | 4 | 5;

  private level1DialogueState: Level1DialogueState;

  private level1Phase: Level1DialoguePhase;

  private level2DialogueState: Level2DialogueState;

  private level2Phase: Level2DialoguePhase;

  private level3DialogueState: Level3DialogueState;

  private level3Phase: Level3DialoguePhase;

  private level4DialogueState: Level4DialogueState;

  private level4Phase: Level4DialoguePhase;

  private level5DialogueState: Level5DialogueState;

  private level5Phase: Level5DialoguePhase;

  private player: PlayerPrefab | null;

  private spaceKey: Phaser.Input.Keyboard.Key | null;

  private moveUpKey: Phaser.Input.Keyboard.Key | null;

  private moveLeftKey: Phaser.Input.Keyboard.Key | null;

  private moveDownKey: Phaser.Input.Keyboard.Key | null;

  private moveRightKey: Phaser.Input.Keyboard.Key | null;

  private hasTriggeredLevel1Transition: boolean;

  private hasTriggeredLevel2Transition: boolean;

  private hasTriggeredLevel3Transition: boolean;

  private hasTriggeredLevel4Transition: boolean;

  private hasTriggeredLevel5Transition: boolean;

  private hasTriggeredVictory: boolean;

  private score: number;

  private activeCombatItemCount: number;

  private activeProjectiles: ProjectilePrefab[];

  private activeFEmails: FEmailPrefab[];

  private level1FEmailSpawnState: Level1FEmailSpawnState;

  private activeRViruses: RVirusPrefab[];

  private level2RVirusSpawnState: Level2RVirusSpawnState;

  private level2RVirusAttachmentState: Level2RVirusAttachmentState;

  private activeWorms: WormPrefab[];

  private level3WormSpawnState: Level3WormSpawnState;

  private level3WormDuplicationState: Level3WormDuplicationState;

  private activeTrojans: TrojanPrefab[];

  private activeMrHacker: MrHackerPrefab | null;

  private activeEnemyBullets: EnemyBulletPrefab[];

  private activeDeathEffects: DeathEffectPrefab[];

  private level5MrHackerSpawnState: Level5MrHackerSpawnState;

  private level5MrHackerBulletState: Level5MrHackerBulletState;

  private level5MrHackerMinionSpawnState: Level5MrHackerMinionSpawnState;

  private mrHackerHealthBar: Phaser.GameObjects.Image | null;

  private level4TrojanSpawnState: Level4TrojanSpawnState;

  private level4SplitFEmailNextEnemyNumericId: number;

  private level4SplitRVirusNextEnemyNumericId: number;

  private level4SplitWormNextEnemyNumericId: number;

  private playerHealth: number;

  private scoreMultiplier: number;

  private levelHudText: Phaser.GameObjects.Text | null;

  private scoreHudText: Phaser.GameObjects.Text | null;

  private healthHudText: Phaser.GameObjects.Text | null;

  private multiplierHudText: Phaser.GameObjects.Text | null;

  private victoryScoreText: Phaser.GameObjects.Text | null;

  private victoryMultiplierText: Phaser.GameObjects.Text | null;

  private victoryFinalScoreText: Phaser.GameObjects.Text | null;

  private victoryRestartPromptText: Phaser.GameObjects.Text | null;

  private hasTriggeredGameOver: boolean;

  private gameOverTitleText: Phaser.GameObjects.Text | null;

  private gameOverRestartText: Phaser.GameObjects.Text | null;

  private playerDamageFlashMsRemaining: number;

  private playerRecoveryMsRemaining: number;

  private damageOverlay: Phaser.GameObjects.Rectangle | null;

  private shootCooldownMsRemaining: number;

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
    this.level3DialogueState = createInitialLevel3DialogueState();
    this.level3Phase = resolveLevel3DialoguePhase(
      this.level3DialogueState,
      LEVEL3_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.level4DialogueState = createInitialLevel4DialogueState();
    this.level4Phase = resolveLevel4DialoguePhase(
      this.level4DialogueState,
      LEVEL4_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.level5DialogueState = createInitialLevel5DialogueState();
    this.level5Phase = resolveLevel5DialoguePhase(
      this.level5DialogueState,
      LEVEL5_DIALOGUE_TEXTURE_KEYS.length,
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
    this.activeDeathEffects = [];
    this.level5MrHackerSpawnState = createInitialLevel5MrHackerSpawnState();
    this.level5MrHackerBulletState = createInitialLevel5MrHackerBulletState(() => Math.random());
    this.level5MrHackerMinionSpawnState = createInitialLevel5MrHackerMinionSpawnState();
    this.mrHackerHealthBar = null;
    this.level4TrojanSpawnState = createInitialLevel4TrojanSpawnState();
    this.level4SplitFEmailNextEnemyNumericId = 0;
    this.level4SplitRVirusNextEnemyNumericId = 0;
    this.level4SplitWormNextEnemyNumericId = 0;
    this.playerHealth = this.resolveInitialPlayerHealth();
    this.scoreMultiplier = INITIAL_SCORE_MULTIPLIER;
    this.levelHudText = null;
    this.scoreHudText = null;
    this.healthHudText = null;
    this.multiplierHudText = null;
    this.victoryScoreText = null;
    this.victoryMultiplierText = null;
    this.victoryFinalScoreText = null;
    this.victoryRestartPromptText = null;
    this.hasTriggeredGameOver = false;
    this.gameOverTitleText = null;
    this.gameOverRestartText = null;
    this.playerDamageFlashMsRemaining = 0;
    this.playerRecoveryMsRemaining = 0;
    this.damageOverlay = null;
    this.shootCooldownMsRemaining = 0;
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

    this.levelHudText = this.add.text(20, 20, '', {
      color: '#7fff00',
      fontFamily: 'Copperplate',
      fontSize: '32px',
    });
    this.levelHudText.setVisible(false);

    this.scoreHudText = this.add.text(20, 62, '', {
      color: '#7fff00',
      fontFamily: 'Copperplate',
      fontSize: '32px',
    });
    this.scoreHudText.setVisible(false);

    this.healthHudText = this.add.text(20, 104, '', {
      color: '#7fff00',
      fontFamily: 'Copperplate',
      fontSize: '32px',
    });
    this.healthHudText.setVisible(false);

    this.multiplierHudText = this.add.text(20, 146, '', {
      color: '#7fff00',
      fontFamily: 'Copperplate',
      fontSize: '32px',
    });
    this.multiplierHudText.setVisible(false);

    this.victoryScoreText = this.add.text(
      centerX,
      centerY,
      '',
      {
        color: '#7fff00',
        fontFamily: 'Copperplate',
        fontSize: '50px',
      },
    );
    this.victoryScoreText.setOrigin(0.5, 0.5);
    this.victoryScoreText.setVisible(false);

    this.victoryMultiplierText = this.add.text(
      centerX,
      centerY + 100,
      '',
      {
        color: '#7fff00',
        fontFamily: 'Copperplate',
        fontSize: '50px',
      },
    );
    this.victoryMultiplierText.setOrigin(0.5, 0.5);
    this.victoryMultiplierText.setVisible(false);

    this.victoryFinalScoreText = this.add.text(
      centerX,
      centerY + 200,
      '',
      {
        color: '#7fff00',
        fontFamily: 'Copperplate',
        fontSize: '50px',
      },
    );
    this.victoryFinalScoreText.setOrigin(0.5, 0.5);
    this.victoryFinalScoreText.setVisible(false);

    this.victoryRestartPromptText = this.add.text(
      centerX,
      centerY + 300,
      '',
      {
        color: '#7fff00',
        fontFamily: 'Copperplate',
        fontSize: '50px',
      },
    );
    this.victoryRestartPromptText.setOrigin(0.5, 0.5);
    this.victoryRestartPromptText.setVisible(false);

    this.gameOverTitleText = this.add.text(
      centerX,
      centerY,
      'GAME OVER',
      {
        color: '#ff0000',
        fontFamily: 'Copperplate',
        fontSize: '72px',
      },
    );
    this.gameOverTitleText.setOrigin(0.5, 0.5);
    this.gameOverTitleText.setVisible(false);

    this.gameOverRestartText = this.add.text(
      centerX,
      centerY + 120,
      'Press space to restart',
      {
        color: '#ff0000',
        fontFamily: 'Copperplate',
        fontSize: '44px',
      },
    );
    this.gameOverRestartText.setOrigin(0.5, 0.5);
    this.gameOverRestartText.setVisible(false);

    this.damageOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xff0000, 0);
    this.damageOverlay.setOrigin(0, 0);
    this.damageOverlay.setScrollFactor(0);
    this.damageOverlay.setDepth(1000);
    this.damageOverlay.setVisible(false);

    this.dialogueImage = this.add.image(centerX, centerY, LEVEL0_DIALOGUE_TEXTURE_KEYS[0]);
    this.dialogueImage.setVisible(false);

    this.player = new PlayerPrefab(this);
    this.add.existing(this.player);
    this.mrHackerHealthBar = this.add.image(
      centerX - 480,
      centerY - 968,
      resolveLevel5MrHackerHealthBarTextureKey(25),
    );
    this.mrHackerHealthBar.setOrigin(0, 0);
    this.mrHackerHealthBar.setVisible(false);
    this.events.on(GameScene.SHOOT_INPUT_EVENT, this.handleShootInput, this);

    this.syncActiveLevelVisualState();
  }

  public override update(_time: number, delta: number): void {
    this.shootCooldownMsRemaining = resolveNextShootCooldownMs(this.shootCooldownMsRemaining, delta);
    this.updateProjectiles(delta);
    this.updateEnemyBullets(delta);
    this.updateDeathEffects(delta);
    this.updatePlayerDamageFeedback(delta);

    this.scoreMultiplier = advanceScoreMultiplier(this.scoreMultiplier, this.hasTriggeredVictory);
    this.syncGameplayHud();
    this.maybeTriggerGameOver();

    const isSpaceJustPressed: boolean = this.spaceKey !== null && Phaser.Input.Keyboard.JustDown(this.spaceKey);
    const isSpacePressed: boolean = this.spaceKey?.isDown ?? false;

    if (isSpaceJustPressed) {
      if (shouldRestartFromVictory({
        hasTriggeredVictory: this.hasTriggeredVictory,
        isSpaceJustPressed: true,
      })) {
        window.location.reload();
        return;
      }

      if (this.hasTriggeredGameOver) {
        window.location.reload();
        return;
      }

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
      } else if (this.activeLevelId === 3 && this.level3Phase === 'dialogue') {
        this.level3DialogueState = advanceLevel3DialogueState(this.level3DialogueState);
        this.level3Phase = resolveLevel3DialoguePhase(
          this.level3DialogueState,
          LEVEL3_DIALOGUE_TEXTURE_KEYS.length,
        );
      } else if (this.activeLevelId === 4 && this.level4Phase === 'dialogue') {
        this.level4DialogueState = advanceLevel4DialogueState(this.level4DialogueState);
        this.level4Phase = resolveLevel4DialoguePhase(
          this.level4DialogueState,
          LEVEL4_DIALOGUE_TEXTURE_KEYS.length,
        );
      } else if (this.activeLevelId === 5 && this.level5Phase === 'dialogue') {
        this.level5DialogueState = advanceLevel5DialogueState(this.level5DialogueState);
        this.level5Phase = resolveLevel5DialoguePhase(
          this.level5DialogueState,
          LEVEL5_DIALOGUE_TEXTURE_KEYS.length,
        );
      }

      this.syncActiveLevelVisualState();
    }

    if (shouldEmitShootInput({
      hasTriggeredGameOver: this.hasTriggeredGameOver,
      hasTriggeredVictory: this.hasTriggeredVictory,
      isShootPressed: isSpacePressed,
      isWalkablePhase: this.isActiveLevelWalkablePhase(),
      levelId: this.activeLevelId,
      shootCooldownMsRemaining: this.shootCooldownMsRemaining,
    })) {
      this.events.emit(GameScene.SHOOT_INPUT_EVENT, {
        levelId: this.activeLevelId,
      });
      if (this.activeLevelId !== 0) {
        this.shootCooldownMsRemaining = resolveShootCooldownDurationMs(this.activeLevelId);
      }
    }

    if (this.hasTriggeredGameOver) {
      this.syncActiveLevelVisualState();
      return;
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
      this.syncActiveLevelVisualState();
      return;
    }

    if (this.activeLevelId === 2 && this.level2Phase === 'walkable') {
      this.updatePlayerMovement();
      this.updateLevel2Combat(delta);
      this.updateLevel2TransitionTrigger();
      this.syncActiveLevelVisualState();
      return;
    }

    if (this.activeLevelId === 3 && this.level3Phase === 'walkable') {
      this.updatePlayerMovement();
      this.updateLevel3Combat(delta);
      this.updateLevel3TransitionTrigger();
      this.syncActiveLevelVisualState();
      return;
    }

    if (this.activeLevelId === 4 && this.level4Phase === 'walkable') {
      this.updatePlayerMovement();
      this.updateLevel4Combat(delta);
      this.updateLevel4TransitionTrigger();
      this.syncActiveLevelVisualState();
      return;
    }

    if (this.activeLevelId === 5 && this.level5Phase === 'walkable' && !this.hasTriggeredVictory) {
      this.updatePlayerMovement();
      this.updateLevel5Combat(delta);
      this.updateLevel5VictoryTrigger();
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
    } else if (this.activeLevelId === 2) {
      canApplyMovement = canMoveWithinLevel2Bounds(traversalSnapshot, movementStep.facingDirection);
    } else if (this.activeLevelId === 3) {
      canApplyMovement = canMoveWithinLevel3Bounds(traversalSnapshot, movementStep.facingDirection);
    } else if (this.activeLevelId === 4) {
      canApplyMovement = canMoveWithinLevel4Bounds(traversalSnapshot, movementStep.facingDirection);
    } else {
      canApplyMovement = canMoveWithinLevel5Bounds(traversalSnapshot, movementStep.facingDirection);
    }

    if (!canApplyMovement) {
      return;
    }

    this.player.x += movementStep.deltaX;
    this.player.y += movementStep.deltaY;
    this.player.setFacingDirection(movementStep.facingDirection);
  }

  private handleShootInput(payload: { levelId: 0 | 1 | 2 | 3 | 4 | 5 }): void {
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

  private updateProjectiles(elapsedMs: number): void {
    if (this.activeProjectiles.length === 0) {
      return;
    }

    const nextActiveProjectiles: ProjectilePrefab[] = [];

    for (const projectile of this.activeProjectiles) {
      projectile.updateMotion(elapsedMs);

      if (projectile.isOutsideCombatWorldBounds(this.scale.width, this.scale.height)) {
        projectile.destroy();
      } else {
        nextActiveProjectiles.push(projectile);
      }
    }

    this.activeProjectiles = nextActiveProjectiles;
  }

  private updateEnemyBullets(elapsedMs: number): void {
    if (this.activeEnemyBullets.length === 0) {
      return;
    }

    const nextActiveEnemyBullets: EnemyBulletPrefab[] = [];

    for (const bullet of this.activeEnemyBullets) {
      bullet.updateMotion(elapsedMs);

      if (bullet.isOutsideCombatWorldBounds(this.scale.width, this.scale.height)) {
        bullet.destroy();
      } else {
        nextActiveEnemyBullets.push(bullet);
      }
    }

    this.activeEnemyBullets = nextActiveEnemyBullets;
  }

  private updateDeathEffects(elapsedMs: number): void {
    if (this.activeDeathEffects.length === 0) {
      return;
    }

    const nextActiveDeathEffects: DeathEffectPrefab[] = [];
    for (const effect of this.activeDeathEffects) {
      if (effect.advance(elapsedMs)) {
        nextActiveDeathEffects.push(effect);
        continue;
      }

      effect.destroy();
    }

    this.activeDeathEffects = nextActiveDeathEffects;
  }

  private updatePlayerDamageFeedback(elapsedMs: number): void {
    this.playerRecoveryMsRemaining = resolveNextPlayerRecoveryMsRemaining(this.playerRecoveryMsRemaining, elapsedMs);

    if (this.playerDamageFlashMsRemaining > 0) {
      this.playerDamageFlashMsRemaining = Math.max(0, this.playerDamageFlashMsRemaining - elapsedMs);
      const progressRatio: number = this.playerDamageFlashMsRemaining / PLAYER_DAMAGE_FEEDBACK_DURATION_MS;
      if (this.damageOverlay !== null) {
        this.damageOverlay.setVisible(true);
        this.damageOverlay.setAlpha(progressRatio * PLAYER_DAMAGE_OVERLAY_ALPHA);
      }
      return;
    }

    if (this.playerRecoveryMsRemaining > 0) {
      this.damageOverlay?.setVisible(true);
      this.damageOverlay?.setAlpha(PLAYER_RECOVERY_OVERLAY_ALPHA);
      return;
    }

    this.damageOverlay?.setVisible(false);
    this.damageOverlay?.setAlpha(0);
  }

  private applyPlayerDamage(damageDelta: number): void {
    const damageResolution = resolvePlayerDamageRecovery({
      damageDelta,
      playerRecoveryMsRemaining: this.playerRecoveryMsRemaining,
      recoveryDurationMs: PLAYER_DAMAGE_RECOVERY_DURATION_MS,
    });

    if (damageResolution.appliedDamage <= 0) {
      return;
    }

    this.playerHealth = Math.max(0, this.playerHealth - damageResolution.appliedDamage);
    this.playerRecoveryMsRemaining = damageResolution.nextPlayerRecoveryMsRemaining;
    this.playerDamageFlashMsRemaining = PLAYER_DAMAGE_FEEDBACK_DURATION_MS;
    if (this.damageOverlay !== null) {
      this.damageOverlay.setVisible(true);
      this.damageOverlay.setAlpha(PLAYER_DAMAGE_OVERLAY_ALPHA);
    }
    this.cameras.main.shake(PLAYER_DAMAGE_FEEDBACK_DURATION_MS, PLAYER_DAMAGE_SHAKE_INTENSITY);
  }

  private spawnDeathEffects(spawns: readonly DeathEffectSpawnSnapshot[]): void {
    for (const spawn of spawns) {
      const effect = new DeathEffectPrefab(this, spawn.centerX, spawn.centerY);
      this.add.existing(effect);
      this.activeDeathEffects.push(effect);
    }
  }

  private createDeathEffectSpawnsForDestroyedEnemies(
    destroyedEnemyIds: readonly string[],
    enemies: readonly { getEnemyId: () => string; x: number; y: number }[],
  ): DeathEffectSpawnSnapshot[] {
    const destroyedEnemyIdSet: Set<string> = new Set(destroyedEnemyIds);
    return enemies
      .filter((enemy) => destroyedEnemyIdSet.has(enemy.getEnemyId()))
      .map((enemy) => ({
        centerX: enemy.x,
        centerY: enemy.y,
      }));
  }

  private createDeathEffectSpawnsFromSplitSpawns(
    splitSpawns: readonly TrojanSplitSpawnSnapshot[],
  ): DeathEffectSpawnSnapshot[] {
    return splitSpawns.map((spawn: TrojanSplitSpawnSnapshot) => ({
      centerX: spawn.impactX,
      centerY: spawn.impactY,
    }));
  }

  private updateLevel1Combat(elapsedMs: number): void {
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

    const movedSnapshots = advanceLevel1FEmailMotion(
      this.activeFEmails.map((enemy: FEmailPrefab) => enemy.toSnapshot()),
      {
        canvasHeight: this.scale.height,
        canvasWidth: this.scale.width,
        elapsedMs,
      },
    );
    this.applyFEmailSnapshotsById(movedSnapshots);

    this.resolveLevel1ProjectileHits();
    this.resolveLevel1PlayerEnemyCollisions();

    this.activeCombatItemCount = this.activeFEmails.length;
  }

  private resolveLevel1ProjectileHits(): void {
    if (this.activeProjectiles.length === 0 || this.activeFEmails.length === 0) {
      return;
    }

    const projectileSnapshots: CombatProjectileSnapshot[] = this.activeProjectiles.map((projectile: ProjectilePrefab) => ({
      centerX: projectile.x,
      centerY: projectile.y,
      damage: projectile.getDamage(),
      height: projectile.displayHeight,
      projectileId: projectile.name,
      width: projectile.displayWidth,
    }));

    for (let index: number = 0; index < projectileSnapshots.length; index += 1) {
      projectileSnapshots[index].projectileId = `projectile-${index}`;
    }

    const targetSnapshots: CombatTargetSnapshot[] = this.activeFEmails.map((enemy: FEmailPrefab) => {
      const enemySnapshot: Level1FEmailEnemySnapshot = enemy.toSnapshot();
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
      this.activeProjectiles = this.activeProjectiles.filter((projectile: ProjectilePrefab, index: number) => {
        const projectileId: string = `projectile-${index}`;
        const isDestroyed: boolean = resolution.destroyedProjectileIds.includes(projectileId);
        if (isDestroyed) {
          projectile.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.destroyedTargetIds.length > 0) {
      this.spawnDeathEffects(resolution.deathEffectSpawns);
      this.activeFEmails = this.activeFEmails.filter((enemy: FEmailPrefab) => {
        const isDestroyed: boolean = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.remainingTargets.length > 0 && this.activeFEmails.length > 0) {
      this.applyFEmailSnapshotsById(
        resolution.remainingTargets.map((target: CombatTargetSnapshot) => ({
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
        })),
      );
    }

    this.score += resolution.scoreDelta;
  }

  private resolveLevel1PlayerEnemyCollisions(): void {
    if (this.player === null || this.activeFEmails.length === 0) {
      return;
    }

    const result = resolveLevel1PlayerEnemyCollisions({
      enemies: this.activeFEmails.map((enemy: FEmailPrefab) => enemy.toSnapshot()),
      player: {
        centerX: this.player.x + this.player.displayWidth / 2,
        centerY: this.player.y + this.player.displayHeight / 2,
        height: this.player.displayHeight,
        width: this.player.displayWidth,
      },
    });

    if (result.destroyedEnemyIds.length > 0) {
      this.spawnDeathEffects(
        this.createDeathEffectSpawnsForDestroyedEnemies(result.destroyedEnemyIds, this.activeFEmails),
      );
      this.activeFEmails = this.activeFEmails.filter((enemy: FEmailPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.applyPlayerDamage(result.playerDamageDelta);
  }

  private applyFEmailSnapshotsById(snapshots: readonly Level1FEmailEnemySnapshot[]): void {
    const enemyById: Map<string, FEmailPrefab> = new Map(
      this.activeFEmails.map((enemy: FEmailPrefab) => [enemy.getEnemyId(), enemy]),
    );

    for (const snapshot of snapshots) {
      const enemy = enemyById.get(snapshot.enemyId);
      if (enemy !== undefined) {
        enemy.applySnapshot(snapshot);
      }
    }
  }

  private resolveFEmailVelocityById(enemyId: string): { x: number; y: number } {
    const enemy = this.activeFEmails.find((item: FEmailPrefab) => item.getEnemyId() === enemyId);
    if (enemy === undefined) {
      return { x: 0, y: 0 };
    }

    const snapshot = enemy.toSnapshot();
    return {
      x: snapshot.velocityX,
      y: snapshot.velocityY,
    };
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

    if (!hasReachedTransition || !canTriggerLevelTransition(0, this.score, this.activeCombatItemCount)) {
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

  private updateLevel2Combat(elapsedMs: number): void {
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

    const movedSnapshots = advanceLevel2RVirusMotion(
      this.activeRViruses.map((enemy: RVirusPrefab) => enemy.toSnapshot()),
      {
        canvasHeight: this.scale.height,
        canvasWidth: this.scale.width,
        elapsedMs,
        stuckEnemyId: this.level2RVirusAttachmentState.stuckEnemyId,
      },
    );
    this.applyRVirusSnapshotsById(movedSnapshots);

    this.resolveLevel2ProjectileHits();
    this.resolveLevel2RVirusAttachment(elapsedMs);

    this.activeCombatItemCount = this.activeRViruses.length;
  }

  private resolveLevel2ProjectileHits(): void {
    if (this.activeProjectiles.length === 0 || this.activeRViruses.length === 0) {
      return;
    }

    const projectileSnapshots: CombatProjectileSnapshot[] = this.activeProjectiles.map((projectile: ProjectilePrefab) => ({
      centerX: projectile.x,
      centerY: projectile.y,
      damage: projectile.getDamage(),
      height: projectile.displayHeight,
      projectileId: projectile.name,
      width: projectile.displayWidth,
    }));

    for (let index: number = 0; index < projectileSnapshots.length; index += 1) {
      projectileSnapshots[index].projectileId = `projectile-${index}`;
    }

    const targetSnapshots: CombatTargetSnapshot[] = this.activeRViruses.map((enemy: RVirusPrefab) => {
      const enemySnapshot: Level2RVirusEnemySnapshot = enemy.toSnapshot();
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
      this.activeProjectiles = this.activeProjectiles.filter((projectile: ProjectilePrefab, index: number) => {
        const projectileId: string = `projectile-${index}`;
        const isDestroyed: boolean = resolution.destroyedProjectileIds.includes(projectileId);
        if (isDestroyed) {
          projectile.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.destroyedTargetIds.length > 0) {
      this.spawnDeathEffects(resolution.deathEffectSpawns);
      this.activeRViruses = this.activeRViruses.filter((enemy: RVirusPrefab) => {
        const isDestroyed: boolean = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.remainingTargets.length > 0 && this.activeRViruses.length > 0) {
      this.applyRVirusSnapshotsById(
        resolution.remainingTargets.map((target: CombatTargetSnapshot) => ({
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
        })),
      );
    }

    this.score += resolution.scoreDelta;
  }

  private resolveLevel2RVirusAttachment(elapsedMs: number): void {
    if (this.player === null || this.activeRViruses.length === 0) {
      return;
    }

    const result = resolveLevel2RVirusAttachment(this.level2RVirusAttachmentState, {
      elapsedMs,
      enemies: this.activeRViruses.map((enemy: RVirusPrefab) => enemy.toSnapshot()),
      player: {
        centerX: this.player.x + this.player.displayWidth / 2,
        centerY: this.player.y + this.player.displayHeight / 2,
        height: this.player.displayHeight,
        width: this.player.displayWidth,
      },
    });

    this.level2RVirusAttachmentState = result.nextState;
    const remainingEnemyIds: Set<string> = new Set(result.nextEnemies.map((enemy: Level2RVirusEnemySnapshot) => enemy.enemyId));
    this.spawnDeathEffects(
      this.activeRViruses
        .filter((enemy: RVirusPrefab) => !remainingEnemyIds.has(enemy.getEnemyId()))
        .map((enemy: RVirusPrefab) => ({
          centerX: enemy.x,
          centerY: enemy.y,
        })),
    );
    this.activeRViruses = this.activeRViruses.filter((enemy: RVirusPrefab) => {
      const shouldRemain: boolean = remainingEnemyIds.has(enemy.getEnemyId());
      if (!shouldRemain) {
        enemy.destroy();
      }

      return shouldRemain;
    });
    this.applyRVirusSnapshotsById(result.nextEnemies);
    this.applyPlayerDamage(result.playerDamageDelta);
  }

  private applyRVirusSnapshotsById(snapshots: readonly Level2RVirusEnemySnapshot[]): void {
    const enemyById: Map<string, RVirusPrefab> = new Map(
      this.activeRViruses.map((enemy: RVirusPrefab) => [enemy.getEnemyId(), enemy]),
    );

    for (const snapshot of snapshots) {
      const enemy = enemyById.get(snapshot.enemyId);
      if (enemy !== undefined) {
        enemy.applySnapshot(snapshot);
      }
    }
  }

  private resolveRVirusVelocityById(enemyId: string): { x: number; y: number } {
    const enemy = this.activeRViruses.find((item: RVirusPrefab) => item.getEnemyId() === enemyId);
    if (enemy === undefined) {
      return { x: 0, y: 0 };
    }

    const snapshot = enemy.toSnapshot();
    return {
      x: snapshot.velocityX,
      y: snapshot.velocityY,
    };
  }

  private updateLevel3Combat(elapsedMs: number): void {
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
      enemies: this.activeWorms.map((enemy: WormPrefab) => enemy.toSnapshot()),
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

    const movedSnapshots = advanceLevel3WormMotion(
      this.activeWorms.map((enemy: WormPrefab) => enemy.toSnapshot()),
      {
        canvasHeight: this.scale.height,
        canvasWidth: this.scale.width,
        elapsedMs,
      },
    );
    this.applyWormSnapshotsById(movedSnapshots);

    this.resolveLevel3ProjectileHits();
    this.resolveLevel3PlayerEnemyCollisions();
    this.activeCombatItemCount = this.activeWorms.length;
  }

  private resolveLevel3ProjectileHits(): void {
    if (this.activeProjectiles.length === 0 || this.activeWorms.length === 0) {
      return;
    }

    const projectileSnapshots: CombatProjectileSnapshot[] = this.activeProjectiles.map((projectile: ProjectilePrefab) => ({
      centerX: projectile.x,
      centerY: projectile.y,
      damage: projectile.getDamage(),
      height: projectile.displayHeight,
      projectileId: projectile.name,
      width: projectile.displayWidth,
    }));

    for (let index: number = 0; index < projectileSnapshots.length; index += 1) {
      projectileSnapshots[index].projectileId = `projectile-${index}`;
    }

    const targetSnapshots: CombatTargetSnapshot[] = this.activeWorms.map((enemy: WormPrefab) => {
      const enemySnapshot: Level3WormEnemySnapshot = enemy.toSnapshot();
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
      this.activeProjectiles = this.activeProjectiles.filter((projectile: ProjectilePrefab, index: number) => {
        const projectileId: string = `projectile-${index}`;
        const isDestroyed: boolean = resolution.destroyedProjectileIds.includes(projectileId);
        if (isDestroyed) {
          projectile.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.destroyedTargetIds.length > 0) {
      this.spawnDeathEffects(resolution.deathEffectSpawns);
      this.activeWorms = this.activeWorms.filter((enemy: WormPrefab) => {
        const isDestroyed: boolean = resolution.destroyedTargetIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.remainingTargets.length > 0 && this.activeWorms.length > 0) {
      this.applyWormSnapshotsById(
        resolution.remainingTargets.map((target: CombatTargetSnapshot) => ({
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
        })),
      );
    }

    this.score += resolution.scoreDelta;
  }

  private applyWormSnapshotsById(snapshots: readonly Level3WormEnemySnapshot[]): void {
    const enemyById: Map<string, WormPrefab> = new Map(
      this.activeWorms.map((enemy: WormPrefab) => [enemy.getEnemyId(), enemy]),
    );

    for (const snapshot of snapshots) {
      const enemy = enemyById.get(snapshot.enemyId);
      if (enemy !== undefined) {
        enemy.applySnapshot(snapshot);
      }
    }
  }

  private resolveLevel3PlayerEnemyCollisions(): void {
    if (this.player === null || this.activeWorms.length === 0) {
      return;
    }

    const result = resolveLevel3PlayerEnemyCollisions({
      enemies: this.activeWorms.map((enemy: WormPrefab) => enemy.toSnapshot()),
      player: {
        centerX: this.player.x + this.player.displayWidth / 2,
        centerY: this.player.y + this.player.displayHeight / 2,
        height: this.player.displayHeight,
        width: this.player.displayWidth,
      },
    });

    if (result.destroyedEnemyIds.length > 0) {
      this.spawnDeathEffects(
        this.createDeathEffectSpawnsForDestroyedEnemies(result.destroyedEnemyIds, this.activeWorms),
      );
      this.activeWorms = this.activeWorms.filter((enemy: WormPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.applyPlayerDamage(result.playerDamageDelta);
  }

  private resolveWormVelocityById(enemyId: string): { x: number; y: number } {
    const enemy = this.activeWorms.find((item: WormPrefab) => item.getEnemyId() === enemyId);
    if (enemy === undefined) {
      return { x: 0, y: 0 };
    }

    const snapshot = enemy.toSnapshot();
    return {
      x: snapshot.velocityX,
      y: snapshot.velocityY,
    };
  }

  private updateLevel4Combat(elapsedMs: number): void {
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
      const movedSnapshots = advanceLevel4TrojanMotion(
        this.activeTrojans.map((enemy: TrojanPrefab) => enemy.toSnapshot()),
        { elapsedMs },
      );
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

  private resolveLevel4TrojanProjectileHits(): void {
    if (this.activeProjectiles.length === 0 || this.activeTrojans.length === 0) {
      return;
    }

    const projectileSnapshots: CombatProjectileSnapshot[] = this.activeProjectiles.map((projectile: ProjectilePrefab) => ({
      centerX: projectile.x,
      centerY: projectile.y,
      damage: projectile.getDamage(),
      height: projectile.displayHeight,
      projectileId: projectile.name,
      width: projectile.displayWidth,
    }));

    for (let index: number = 0; index < projectileSnapshots.length; index += 1) {
      projectileSnapshots[index].projectileId = `projectile-${index}`;
    }

    const trojanSnapshots: Level4TrojanEnemySnapshot[] = this.activeTrojans.map(
      (enemy: TrojanPrefab) => enemy.toSnapshot(),
    );
    const resolution = resolveLevel4TrojanProjectileHits({
      projectiles: projectileSnapshots,
      trojans: trojanSnapshots,
    });

    if (resolution.destroyedProjectileIds.length > 0) {
      this.activeProjectiles = this.activeProjectiles.filter((projectile: ProjectilePrefab, index: number) => {
        const projectileId: string = `projectile-${index}`;
        const isDestroyed: boolean = resolution.destroyedProjectileIds.includes(projectileId);
        if (isDestroyed) {
          projectile.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.destroyedTrojanIds.length > 0) {
      this.spawnDeathEffects(this.createDeathEffectSpawnsFromSplitSpawns(resolution.splitSpawns));
      this.activeTrojans = this.activeTrojans.filter((enemy: TrojanPrefab) => {
        const isDestroyed: boolean = resolution.destroyedTrojanIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.remainingTrojans.length > 0 && this.activeTrojans.length > 0) {
      this.applyTrojanSnapshotsById(
        resolution.remainingTrojans.map((trojan: Level4TrojanEnemySnapshot) => ({
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
        })),
      );
    }

    this.score += resolution.scoreDelta;
    this.spawnLevel4SplitEnemies(resolution.splitSpawns);
  }

  private resolveLevel4TrojanBreaches(): void {
    if (this.activeTrojans.length === 0) {
      return;
    }

    const breachResolution = resolveLevel4TrojanBreaches({
      enemies: this.activeTrojans.map((enemy: TrojanPrefab) => enemy.toSnapshot()),
      minX: this.scale.width * 0.05,
    });

    if (breachResolution.breachedEnemyIds.length > 0) {
      this.spawnDeathEffects(this.createDeathEffectSpawnsFromSplitSpawns(breachResolution.splitSpawns));
      this.activeTrojans = this.activeTrojans.filter((enemy: TrojanPrefab) => {
        const isBreached: boolean = breachResolution.breachedEnemyIds.includes(enemy.getEnemyId());
        if (isBreached) {
          enemy.destroy();
        }
        return !isBreached;
      });
    }

    this.applyPlayerDamage(breachResolution.playerDamageDelta);
    this.spawnLevel4SplitEnemies(breachResolution.splitSpawns);
  }

  private resolveLevel4TrojanPlayerEnemyCollisions(): void {
    if (this.player === null || this.activeTrojans.length === 0) {
      return;
    }

    const result = resolveLevel4TrojanPlayerCollisions({
      enemies: this.activeTrojans.map((enemy: TrojanPrefab) => enemy.toSnapshot()),
      player: {
        centerX: this.player.x + this.player.displayWidth / 2,
        centerY: this.player.y + this.player.displayHeight / 2,
        height: this.player.displayHeight,
        width: this.player.displayWidth,
      },
    });

    if (result.destroyedEnemyIds.length > 0) {
      this.spawnDeathEffects(
        this.createDeathEffectSpawnsForDestroyedEnemies(result.destroyedEnemyIds, this.activeTrojans),
      );
      this.activeTrojans = this.activeTrojans.filter((enemy: TrojanPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.applyPlayerDamage(result.playerDamageDelta);
  }

  private applyTrojanSnapshotsById(snapshots: readonly Level4TrojanEnemySnapshot[]): void {
    const enemyById: Map<string, TrojanPrefab> = new Map(
      this.activeTrojans.map((enemy: TrojanPrefab) => [enemy.getEnemyId(), enemy]),
    );

    for (const snapshot of snapshots) {
      const enemy = enemyById.get(snapshot.enemyId);
      if (enemy !== undefined) {
        enemy.applySnapshot(snapshot);
      }
    }
  }

  private resolveTrojanVelocityById(enemyId: string): { x: number; y: number } {
    const enemy = this.activeTrojans.find((item: TrojanPrefab) => item.getEnemyId() === enemyId);
    if (enemy === undefined) {
      return { x: 0, y: 0 };
    }

    const snapshot = enemy.toSnapshot();
    return {
      x: snapshot.velocityX,
      y: snapshot.velocityY,
    };
  }

  private spawnLevel4SplitEnemies(splitSpawns: readonly TrojanSplitSpawnSnapshot[]): void {
    for (const splitSpawn of splitSpawns) {
      const fEmailSnapshot: Level1FEmailEnemySnapshot = {
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

      const rVirusSnapshot: Level2RVirusEnemySnapshot = {
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

      const wormSnapshot: Level3WormEnemySnapshot = {
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

  private updateLevel3TransitionTrigger(): void {
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

  private updateLevel4TransitionTrigger(): void {
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

  private updateLevel5VictoryTrigger(): void {
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

  private updateLevel5Combat(elapsedMs: number): void {
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
      this.syncActiveLevelVisualState();
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
      this.syncActiveLevelVisualState();
      this.syncLevel5BossHealthBar();
      return;
    }

    this.resolveLevel5MinionCombat(elapsedMs);

    this.activeCombatItemCount = 1
      + this.activeFEmails.length
      + this.activeRViruses.length
      + this.activeWorms.length;
    this.syncActiveLevelVisualState();
    this.syncLevel5BossHealthBar();
  }

  private resolveLevel5BossMinionSpawns(elapsedMs: number): void {
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

  private resolveLevel5MinionCombat(elapsedMs: number): void {
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

  private resolveLevel5MrHackerProjectileHits(): void {
    if (this.activeProjectiles.length === 0 || this.activeMrHacker === null) {
      return;
    }

    const projectileSnapshots: CombatProjectileSnapshot[] = this.activeProjectiles.map((projectile: ProjectilePrefab) => ({
      centerX: projectile.x,
      centerY: projectile.y,
      damage: projectile.getDamage(),
      height: projectile.displayHeight,
      projectileId: projectile.name,
      width: projectile.displayWidth,
    }));

    for (let index: number = 0; index < projectileSnapshots.length; index += 1) {
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
      this.activeProjectiles = this.activeProjectiles.filter((projectile: ProjectilePrefab, index: number) => {
        const projectileId: string = `projectile-${index}`;
        const isDestroyed: boolean = resolution.destroyedProjectileIds.includes(projectileId);
        if (isDestroyed) {
          projectile.destroy();
        }
        return !isDestroyed;
      });
    }

    if (resolution.remainingTargets.length === 0) {
      this.score += resolution.scoreDelta;
      this.spawnDeathEffects(resolution.deathEffectSpawns);
      this.activeMrHacker.applySnapshot({
        ...mrHackerSnapshot,
        currentHealth: 0,
      });
      return;
    }

    const remainingTarget = resolution.remainingTargets[0];
    this.score += resolution.scoreDelta;
    this.activeMrHacker.applySnapshot({
      ...mrHackerSnapshot,
      centerX: remainingTarget.centerX,
      centerY: remainingTarget.centerY,
      currentHealth: remainingTarget.currentHealth,
      height: remainingTarget.height,
      width: remainingTarget.width,
    });
  }

  private resolveLevel5MrHackerBulletVolleys(elapsedMs: number): void {
    if (this.activeMrHacker === null || this.player === null) {
      return;
    }

    const mrHackerSnapshot = this.activeMrHacker.toSnapshot();
    const playerCenterX: number = this.player.x + this.player.displayWidth / 2;
    const playerCenterY: number = this.player.y + this.player.displayHeight / 2;
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

  private resolveLevel5EnemyBulletPlayerCollisions(): void {
    if (this.player === null || this.activeEnemyBullets.length === 0) {
      return;
    }

    const collisionResult = resolveLevel5EnemyBulletPlayerCollisions({
      bullets: this.activeEnemyBullets.map((bullet: EnemyBulletPrefab) => bullet.toSnapshot()),
      player: {
        centerX: this.player.x + this.player.displayWidth / 2,
        centerY: this.player.y + this.player.displayHeight / 2,
        height: this.player.displayHeight,
        width: this.player.displayWidth,
      },
    });

    if (collisionResult.destroyedBulletIds.length > 0) {
      this.activeEnemyBullets = this.activeEnemyBullets.filter((bullet: EnemyBulletPrefab) => {
        const isDestroyed: boolean = collisionResult.destroyedBulletIds.includes(bullet.getBulletId());
        if (isDestroyed) {
          bullet.destroy();
        }
        return !isDestroyed;
      });
    }

    this.applyPlayerDamage(collisionResult.playerDamageDelta);
  }

  private enterLevel1(): void {
    this.activeLevelId = 1;
    this.destroyAllDeathEffects();
    this.destroyMrHacker();
    this.destroyAllEnemyBullets();
    this.hasTriggeredLevel1Transition = true;
    this.level1FEmailSpawnState = createInitialLevel1FEmailSpawnState();
    this.activeCombatItemCount = 0;
    this.level1DialogueState = createInitialLevel1DialogueState();
    this.level1Phase = resolveLevel1DialoguePhase(
      this.level1DialogueState,
      LEVEL1_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.positionPlayerAtLevelEntry(1);
    this.syncActiveLevelVisualState();
  }

  private enterLevel2(): void {
    this.activeLevelId = 2;
    this.destroyAllDeathEffects();
    this.destroyMrHacker();
    this.destroyAllEnemyBullets();
    this.destroyAllFEmails();
    this.destroyAllRViruses();
    this.activeCombatItemCount = 0;
    this.level2RVirusSpawnState = createInitialLevel2RVirusSpawnState();
    this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
    this.level2DialogueState = createInitialLevel2DialogueState();
    this.level2Phase = resolveLevel2DialoguePhase(
      this.level2DialogueState,
      LEVEL2_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.positionPlayerAtLevelEntry(2);
    this.syncActiveLevelVisualState();
  }

  private enterLevel3(): void {
    this.activeLevelId = 3;
    this.destroyAllDeathEffects();
    this.destroyMrHacker();
    this.destroyAllEnemyBullets();
    this.destroyAllRViruses();
    this.destroyAllWorms();
    this.activeCombatItemCount = 0;
    this.level2RVirusAttachmentState = createInitialLevel2RVirusAttachmentState();
    this.level3WormSpawnState = createInitialLevel3WormSpawnState();
    this.level3WormDuplicationState = createInitialLevel3WormDuplicationState();
    this.level3DialogueState = createInitialLevel3DialogueState();
    this.level3Phase = resolveLevel3DialoguePhase(
      this.level3DialogueState,
      LEVEL3_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.positionPlayerAtLevelEntry(3);
    this.syncActiveLevelVisualState();
  }

  private enterLevel4(): void {
    this.activeLevelId = 4;
    this.destroyAllDeathEffects();
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
    this.level4Phase = resolveLevel4DialoguePhase(
      this.level4DialogueState,
      LEVEL4_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.positionPlayerAtLevelEntry(4);
    this.syncActiveLevelVisualState();
  }

  private enterLevel5(): void {
    this.activeLevelId = 5;
    this.destroyAllDeathEffects();
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
    this.level5Phase = resolveLevel5DialoguePhase(
      this.level5DialogueState,
      LEVEL5_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.positionPlayerAtLevelEntry(5);
    this.syncActiveLevelVisualState();
  }

  private positionPlayerAtLevelEntry(levelId: Exclude<LevelId, 0>): void {
    if (this.player === null) {
      return;
    }

    const entryBounds = LEVEL_BOUNDS_PARITY[levelId];
    const transitionBounds = LEVEL_TRANSITION_BOUNDS_PARITY[levelId];
    const doorwayCenterYRatio: number = (transitionBounds.minYRatio + transitionBounds.maxYRatio) / 2;

    this.player.x = entryBounds.minXRatio * this.scale.width;
    this.player.y = (doorwayCenterYRatio * this.scale.height) - (this.player.displayHeight / 2);
    this.player.setFacingDirection('E');
  }

  private syncActiveLevelVisualState(): void {
    if (this.hasTriggeredGameOver) {
      this.syncGameOverVisualState();
      return;
    }

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

  private syncGameplayHud(): void {
    const hudText = resolveGameplayHudText({
      activeLevelId: this.activeLevelId,
      playerHealth: this.playerHealth,
      score: this.score,
      scoreMultiplier: this.scoreMultiplier,
    });

    this.levelHudText?.setText(hudText.level);
    this.scoreHudText?.setText(hudText.score);
    this.healthHudText?.setText(hudText.health);
    this.multiplierHudText?.setText(hudText.multiplier);

    document.body.dataset.vvLevel = `${this.activeLevelId}`;
    document.body.dataset.vvScore = `${this.score}`;
    document.body.dataset.vvHealth = `${Math.max(0, Math.floor(this.playerHealth))}`;
    document.body.dataset.vvMultiplier = `${this.scoreMultiplier.toFixed(2)}`;
    document.body.dataset.vvPlayerState = resolvePlayerStateClass({
      hasTriggeredGameOver: this.hasTriggeredGameOver,
      hasTriggeredVictory: this.hasTriggeredVictory,
      playerRecoveryMsRemaining: this.playerRecoveryMsRemaining,
    });
  }

  private maybeTriggerGameOver(): void {
    if (!shouldTriggerGameOver({
      hasTriggeredGameOver: this.hasTriggeredGameOver,
      hasTriggeredVictory: this.hasTriggeredVictory,
      playerHealth: this.playerHealth,
    })) {
      return;
    }

    this.hasTriggeredGameOver = true;
    this.syncGameplayHud();
    this.syncActiveLevelVisualState();
  }

  private syncGameOverVisualState(): void {
    this.destroyAllDeathEffects();
    this.damageOverlay?.setVisible(false);
    this.damageOverlay?.setAlpha(0);
    document.body.className = 'gameOver';
    this.setStartPromptVisible(false);
    this.setDialogueVisible(false);
    this.setPlayerVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setVictorySummaryVisible(false);
    this.setGameplayHudVisible(false);
    this.setGameOverVisible(true);
  }

  private syncLevel0VisualState(): void {
    this.setGameOverVisible(false);
    this.setVictorySummaryVisible(false);
    if (this.level0Phase === 'startScreen') {
      document.body.className = 'startScreen';
      this.setStartPromptVisible(true);
      this.setDialogueVisible(false);
      this.setPlayerVisible(false);
      this.setMrHackerHealthBarVisible(false);
      this.setGameplayHudVisible(false);
      return;
    }

    document.body.className = 'level0';
    this.setStartPromptVisible(false);
    this.setMrHackerHealthBarVisible(false);

    if (this.level0Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL0_DIALOGUE_TEXTURE_KEYS[this.dialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setMrHackerHealthBarVisible(false);
    this.setGameplayHudVisible(true);
  }

  private syncLevel1VisualState(): void {
    document.body.className = this.resolveCombatLevelBackdropClass(1, this.level1Phase);
    this.setStartPromptVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setGameOverVisible(false);
    this.setVictorySummaryVisible(false);

    if (this.level1Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL1_DIALOGUE_TEXTURE_KEYS[this.level1DialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setMrHackerHealthBarVisible(false);
    this.setGameplayHudVisible(true);
  }

  private syncLevel2VisualState(): void {
    document.body.className = this.resolveCombatLevelBackdropClass(2, this.level2Phase);
    this.setStartPromptVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setGameOverVisible(false);
    this.setVictorySummaryVisible(false);

    if (this.level2Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL2_DIALOGUE_TEXTURE_KEYS[this.level2DialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setMrHackerHealthBarVisible(false);
    this.setGameplayHudVisible(true);
  }

  private syncLevel3VisualState(): void {
    document.body.className = this.resolveCombatLevelBackdropClass(3, this.level3Phase);
    this.setStartPromptVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setGameOverVisible(false);
    this.setVictorySummaryVisible(false);

    if (this.level3Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL3_DIALOGUE_TEXTURE_KEYS[this.level3DialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setMrHackerHealthBarVisible(false);
    this.setGameplayHudVisible(true);
  }

  private syncLevel4VisualState(): void {
    document.body.className = this.resolveCombatLevelBackdropClass(4, this.level4Phase);
    this.setStartPromptVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setGameOverVisible(false);
    this.setVictorySummaryVisible(false);

    if (this.level4Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL4_DIALOGUE_TEXTURE_KEYS[this.level4DialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setMrHackerHealthBarVisible(false);
    this.setGameplayHudVisible(true);
  }

  private syncLevel5VisualState(): void {
    document.body.className = resolveLevel5CombatBackdropClass({
      activeCombatItemCount: this.activeCombatItemCount,
      score: this.score,
    });
    this.setStartPromptVisible(false);
    this.setVictorySummaryVisible(false);
    this.setGameOverVisible(false);

    if (this.level5Phase === 'dialogue') {
      this.setDialogueVisible(true);
      this.setPlayerVisible(false);
      this.setGameplayHudVisible(false);
      this.dialogueImage?.setTexture(LEVEL5_DIALOGUE_TEXTURE_KEYS[this.level5DialogueState.currentDialogue]);
      return;
    }

    this.setDialogueVisible(false);
    this.setPlayerVisible(true);
    this.setGameplayHudVisible(true);
    this.syncLevel5BossHealthBar();
  }

  private syncVictoryVisualState(): void {
    this.destroyAllDeathEffects();
    this.damageOverlay?.setVisible(false);
    this.damageOverlay?.setAlpha(0);
    document.body.className = 'victory';
    this.setStartPromptVisible(false);
    this.setDialogueVisible(false);
    this.setPlayerVisible(false);
    this.setMrHackerHealthBarVisible(false);
    this.setGameOverVisible(false);
    this.setGameplayHudVisible(false);
    this.syncVictorySummaryText();
    this.setVictorySummaryVisible(true);
  }

  private syncLevel5BossHealthBar(): void {
    if (this.mrHackerHealthBar === null) {
      return;
    }

    if (this.activeLevelId !== 5 || this.level5Phase !== 'walkable' || this.activeMrHacker === null) {
      this.mrHackerHealthBar.setVisible(false);
      return;
    }

    this.mrHackerHealthBar.setTexture(
      resolveLevel5MrHackerHealthBarTextureKey(this.activeMrHacker.getCurrentHealth()),
    );
    this.mrHackerHealthBar.setPosition(
      this.scale.width / 2 - 480,
      this.scale.height / 2 - 968,
    );
    this.mrHackerHealthBar.setVisible(true);
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

  private syncVictorySummaryText(): void {
    const summary = resolveVictorySummaryText({
      multiplier: this.scoreMultiplier,
      score: this.score,
    });

    this.victoryScoreText?.setText(summary.scoreText);
    this.victoryMultiplierText?.setText(summary.multiplierText);
    this.victoryFinalScoreText?.setText(summary.finalScoreText);
    this.victoryRestartPromptText?.setText(summary.restartPromptText);
  }

  private setVictorySummaryVisible(shouldBeVisible: boolean): void {
    this.victoryScoreText?.setVisible(shouldBeVisible);
    this.victoryMultiplierText?.setVisible(shouldBeVisible);
    this.victoryFinalScoreText?.setVisible(shouldBeVisible);
    this.victoryRestartPromptText?.setVisible(shouldBeVisible);
  }

  private setGameplayHudVisible(shouldBeVisible: boolean): void {
    this.levelHudText?.setVisible(shouldBeVisible);
    this.scoreHudText?.setVisible(shouldBeVisible);
    this.healthHudText?.setVisible(shouldBeVisible);
    this.multiplierHudText?.setVisible(shouldBeVisible);
  }

  private setGameOverVisible(shouldBeVisible: boolean): void {
    this.gameOverTitleText?.setVisible(shouldBeVisible);
    this.gameOverRestartText?.setVisible(shouldBeVisible);
  }

  private setPlayerVisible(shouldBeVisible: boolean): void {
    if (this.player !== null) {
      this.player.setVisible(shouldBeVisible);
    }
  }

  private setMrHackerHealthBarVisible(shouldBeVisible: boolean): void {
    if (this.mrHackerHealthBar !== null) {
      this.mrHackerHealthBar.setVisible(shouldBeVisible);
    }
  }

  private resolveInitialPlayerHealth(): number {
    return resolveInitialPlayerHealthFromSearch(window.location.search);
  }

  private resolveCombatLevelBackdropClass(
    levelId: 1 | 2 | 3 | 4,
    phase: 'dialogue' | 'walkable',
  ): 'level1' | 'level2' | 'level3' | 'level4' | 'goNextLevel' {
    if (phase === 'walkable' && canTriggerLevelTransition(levelId, this.score, this.activeCombatItemCount)) {
      return 'goNextLevel';
    }

    return `level${levelId}` as 'level1' | 'level2' | 'level3' | 'level4';
  }

  private destroyAllDeathEffects(): void {
    for (const effect of this.activeDeathEffects) {
      effect.destroy();
    }

    this.activeDeathEffects = [];
  }

  private destroyAllFEmails(): void {
    for (const enemy of this.activeFEmails) {
      enemy.destroy();
    }
    this.activeFEmails = [];
  }

  private destroyAllRViruses(): void {
    for (const enemy of this.activeRViruses) {
      enemy.destroy();
    }
    this.activeRViruses = [];
  }

  private destroyAllWorms(): void {
    for (const enemy of this.activeWorms) {
      enemy.destroy();
    }
    this.activeWorms = [];
  }

  private destroyAllTrojans(): void {
    for (const enemy of this.activeTrojans) {
      enemy.destroy();
    }
    this.activeTrojans = [];
  }

  private destroyAllEnemyBullets(): void {
    for (const bullet of this.activeEnemyBullets) {
      bullet.destroy();
    }
    this.activeEnemyBullets = [];
  }

  private destroyMrHacker(): void {
    if (this.activeMrHacker !== null) {
      this.activeMrHacker.destroy();
      this.activeMrHacker = null;
    }
    this.setMrHackerHealthBarVisible(false);
  }

  private isActiveLevelWalkablePhase(): boolean {
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
