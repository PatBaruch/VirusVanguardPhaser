export type Level2DialoguePhase = 'dialogue' | 'walkable';

export interface Level2DialogueState {
  currentDialogue: number;
}

export const LEVEL2_DIALOGUE_TEXTURE_KEYS: readonly string[] = [
  'level2-dialogue-0',
  'level2-dialogue-1',
];

export function createInitialLevel2DialogueState(): Level2DialogueState {
  return {
    currentDialogue: 0,
  };
}

export function advanceLevel2DialogueState(previousState: Level2DialogueState): Level2DialogueState {
  return {
    currentDialogue: previousState.currentDialogue + 1,
  };
}

export function resolveLevel2DialoguePhase(
  state: Level2DialogueState,
  dialogueCount: number,
): Level2DialoguePhase {
  if (state.currentDialogue < dialogueCount) {
    return 'dialogue';
  }

  return 'walkable';
}
