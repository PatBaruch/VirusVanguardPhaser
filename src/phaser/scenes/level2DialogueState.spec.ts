import { describe, expect, it } from 'vitest';
import {
  LEVEL2_DIALOGUE_TEXTURE_KEYS,
  advanceLevel2DialogueState,
  createInitialLevel2DialogueState,
  resolveLevel2DialoguePhase,
} from './level2DialogueState.js';

describe('level2 dialogue state', () => {
  it('starts in dialogue phase at index 0 with no start screen', () => {
    const initialState = createInitialLevel2DialogueState();

    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel2DialoguePhase(initialState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('increments dialogue index on each space press while dialogue is active', () => {
    const nextState = advanceLevel2DialogueState(createInitialLevel2DialogueState());

    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel2DialoguePhase(nextState, LEVEL2_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after the last dialogue image', () => {
    let state = createInitialLevel2DialogueState();

    for (let index = 0; index < LEVEL2_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel2DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL2_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel2DialoguePhase(state, LEVEL2_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
