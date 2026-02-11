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
import { canAcceptShootInput } from './shootInputGate.js';
import ProjectilePrefab from '../entities/ProjectilePrefab.js';
import { resolveSingleShotProjectileConfigs } from './singleShotPattern.js';
import { resolveDualShotProjectileConfigs } from './dualShotPattern.js';
import { resolveTripleShotProjectileConfigs } from './tripleShotPattern.js';
import {
  CombatProjectileSnapshot,
  CombatTargetSnapshot,
  resolveProjectileHitResolution,
} from './projectileHitResolution.js';
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
import {
  Level5MrHackerSpawnState,
  advanceLevel5MrHackerSpawnState,
  createInitialLevel5MrHackerSpawnState,
  resolveLevel5MrHackerHealthBarTextureKey,
} from './level5MrHackerCombat.js';

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

  private level5MrHackerSpawnState: Level5MrHackerSpawnState;

  private mrHackerHealthBar: Phaser.GameObjects.Image | null;

  private level4TrojanSpawnState: Level4TrojanSpawnState;

  private level4SplitFEmailNextEnemyNumericId: number;

  private level4SplitRVirusNextEnemyNumericId: number;

  private level4SplitWormNextEnemyNumericId: number;

  private playerHealth: number;

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
    this.level5MrHackerSpawnState = createInitialLevel5MrHackerSpawnState();
    this.mrHackerHealthBar = null;
    this.level4TrojanSpawnState = createInitialLevel4TrojanSpawnState();
    this.level4SplitFEmailNextEnemyNumericId = 0;
    this.level4SplitRVirusNextEnemyNumericId = 0;
    this.level4SplitWormNextEnemyNumericId = 0;
    this.playerHealth = 100;
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
    this.updateProjectiles(delta);

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
      this.activeFEmails = this.activeFEmails.filter((enemy: FEmailPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
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
    this.applyRVirusSnapshotsById(result.nextEnemies);
    this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
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
      this.activeWorms = this.activeWorms.filter((enemy: WormPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
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
      this.activeTrojans = this.activeTrojans.filter((enemy: TrojanPrefab) => {
        const isBreached: boolean = breachResolution.breachedEnemyIds.includes(enemy.getEnemyId());
        if (isBreached) {
          enemy.destroy();
        }
        return !isBreached;
      });
    }

    this.playerHealth = Math.max(0, this.playerHealth - breachResolution.playerDamageDelta);
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
      this.activeTrojans = this.activeTrojans.filter((enemy: TrojanPrefab) => {
        const isDestroyed: boolean = result.destroyedEnemyIds.includes(enemy.getEnemyId());
        if (isDestroyed) {
          enemy.destroy();
        }
        return !isDestroyed;
      });
    }

    this.playerHealth = Math.max(0, this.playerHealth - result.playerDamageDelta);
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

    if (this.activeMrHacker === null) {
      this.activeCombatItemCount = 0;
      this.syncLevel5BossHealthBar();
      return;
    }

    this.activeMrHacker.advanceAnimation(elapsedMs);
    this.resolveLevel5MrHackerProjectileHits();

    if (this.activeMrHacker !== null && this.activeMrHacker.getCurrentHealth() <= 0) {
      this.activeMrHacker.destroy();
      this.activeMrHacker = null;
      this.activeCombatItemCount = 0;
      this.syncLevel5BossHealthBar();
      return;
    }

    this.activeCombatItemCount = 1;
    this.syncLevel5BossHealthBar();
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

  private enterLevel1(): void {
    this.activeLevelId = 1;
    this.destroyMrHacker();
    this.hasTriggeredLevel1Transition = true;
    this.level1FEmailSpawnState = createInitialLevel1FEmailSpawnState();
    this.activeCombatItemCount = 0;
    this.level1DialogueState = createInitialLevel1DialogueState();
    this.level1Phase = resolveLevel1DialoguePhase(
      this.level1DialogueState,
      LEVEL1_DIALOGUE_TEXTURE_KEYS.length,
    );
    this.syncActiveLevelVisualState();
  }

  private enterLevel2(): void {
    this.activeLevelId = 2;
    this.destroyMrHacker();
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
    this.syncActiveLevelVisualState();
  }

  private enterLevel3(): void {
    this.activeLevelId = 3;
    this.destroyMrHacker();
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
    this.syncActiveLevelVisualState();
  }

  private enterLevel4(): void {
    this.activeLevelId = 4;
    this.destroyMrHacker();
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
    this.syncActiveLevelVisualState();
  }

  private enterLevel5(): void {
    this.activeLevelId = 5;
    this.destroyMrHacker();
    this.destroyAllFEmails();
    this.destroyAllRViruses();
    this.destroyAllWorms();
    this.destroyAllTrojans();
    this.activeCombatItemCount = 0;
    this.level5MrHackerSpawnState = createInitialLevel5MrHackerSpawnState();
    this.level5DialogueState = createInitialLevel5DialogueState();
    this.level5Phase = resolveLevel5DialoguePhase(
      this.level5DialogueState,
      LEVEL5_DIALOGUE_TEXTURE_KEYS.length,
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

  private syncLevel0VisualState(): void {
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

  private syncLevel1VisualState(): void {
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

  private syncLevel2VisualState(): void {
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

  private syncLevel3VisualState(): void {
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

  private syncLevel4VisualState(): void {
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

  private syncLevel5VisualState(): void {
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
    this.syncLevel5BossHealthBar();
  }

  private syncVictoryVisualState(): void {
    document.body.className = 'victory';
    this.setStartPromptVisible(false);
    this.setDialogueVisible(false);
    this.setPlayerVisible(false);
    this.setMrHackerHealthBarVisible(false);
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
