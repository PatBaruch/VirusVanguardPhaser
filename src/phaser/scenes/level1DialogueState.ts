export type Level1DialoguePhase = 'dialogue' | 'walkable';

export interface Level1DialogueState {
  currentDialogue: number;
}

export const LEVEL1_DIALOGUE_TEXTURE_KEYS: readonly string[] = [
  'level1-dialogue-0',
  'level1-dialogue-1',
];

export function createInitialLevel1DialogueState(): Level1DialogueState {
  return {
    currentDialogue: 0,
  };
}

export function advanceLevel1DialogueState(previousState: Level1DialogueState): Level1DialogueState {
  return {
    currentDialogue: previousState.currentDialogue + 1,
  };
}

export function resolveLevel1DialoguePhase(
  state: Level1DialogueState,
  dialogueCount: number,
): Level1DialoguePhase {
  if (state.currentDialogue < dialogueCount) {
    return 'dialogue';
  }

  return 'walkable';
}
