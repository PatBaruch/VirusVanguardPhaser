import { describe, expect, it } from 'vitest';
import {
  LEVEL3_DIALOGUE_TEXTURE_KEYS,
  advanceLevel3DialogueState,
  createInitialLevel3DialogueState,
  resolveLevel3DialoguePhase,
} from './level3DialogueState.js';

describe('level3 dialogue state', () => {
  it('starts in dialogue phase at index 0 with no start screen', () => {
    const initialState = createInitialLevel3DialogueState();

    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel3DialoguePhase(initialState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('increments dialogue index on each space press while dialogue is active', () => {
    const nextState = advanceLevel3DialogueState(createInitialLevel3DialogueState());

    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel3DialoguePhase(nextState, LEVEL3_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after the last dialogue image', () => {
    let state = createInitialLevel3DialogueState();

    for (let index = 0; index < LEVEL3_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel3DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL3_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel3DialoguePhase(state, LEVEL3_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
