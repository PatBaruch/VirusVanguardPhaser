export type Level4DialoguePhase = 'dialogue' | 'walkable';

export interface Level4DialogueState {
  currentDialogue: number;
}

export const LEVEL4_DIALOGUE_TEXTURE_KEYS: readonly string[] = [
  'level4-dialogue-0',
  'level4-dialogue-1',
];

export function createInitialLevel4DialogueState(): Level4DialogueState {
  return {
    currentDialogue: 0,
  };
}

export function advanceLevel4DialogueState(previousState: Level4DialogueState): Level4DialogueState {
  return {
    currentDialogue: previousState.currentDialogue + 1,
  };
}

export function resolveLevel4DialoguePhase(
  state: Level4DialogueState,
  dialogueCount: number,
): Level4DialoguePhase {
  if (state.currentDialogue < dialogueCount) {
    return 'dialogue';
  }

  return 'walkable';
}
