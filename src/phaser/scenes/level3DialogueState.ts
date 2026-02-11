export type Level3DialoguePhase = 'dialogue' | 'walkable';

export interface Level3DialogueState {
  currentDialogue: number;
}

export const LEVEL3_DIALOGUE_TEXTURE_KEYS: readonly string[] = [
  'level3-dialogue-0',
  'level3-dialogue-1',
];

export function createInitialLevel3DialogueState(): Level3DialogueState {
  return {
    currentDialogue: 0,
  };
}

export function advanceLevel3DialogueState(previousState: Level3DialogueState): Level3DialogueState {
  return {
    currentDialogue: previousState.currentDialogue + 1,
  };
}

export function resolveLevel3DialoguePhase(
  state: Level3DialogueState,
  dialogueCount: number,
): Level3DialoguePhase {
  if (state.currentDialogue < dialogueCount) {
    return 'dialogue';
  }

  return 'walkable';
}
