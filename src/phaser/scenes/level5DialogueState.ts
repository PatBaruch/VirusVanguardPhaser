export type Level5DialoguePhase = 'dialogue' | 'walkable';

export interface Level5DialogueState {
  currentDialogue: number;
}

export const LEVEL5_DIALOGUE_TEXTURE_KEYS: readonly string[] = [
  'level5-dialogue-0',
  'level5-dialogue-1',
  'level5-dialogue-2',
];

export function createInitialLevel5DialogueState(): Level5DialogueState {
  return {
    currentDialogue: 0,
  };
}

export function advanceLevel5DialogueState(previousState: Level5DialogueState): Level5DialogueState {
  return {
    currentDialogue: previousState.currentDialogue + 1,
  };
}

export function resolveLevel5DialoguePhase(
  state: Level5DialogueState,
  dialogueCount: number,
): Level5DialoguePhase {
  if (state.currentDialogue < dialogueCount) {
    return 'dialogue';
  }

  return 'walkable';
}
