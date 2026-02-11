import { describe, expect, it } from 'vitest';
import {
  LEVEL5_DIALOGUE_TEXTURE_KEYS,
  advanceLevel5DialogueState,
  createInitialLevel5DialogueState,
  resolveLevel5DialoguePhase,
} from './level5DialogueState.js';

describe('level5 dialogue state', () => {
  it('starts in dialogue phase at index 0', () => {
    const initialState = createInitialLevel5DialogueState();

    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel5DialoguePhase(initialState, LEVEL5_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('increments dialogue index on each space press while dialogue is active', () => {
    const nextState = advanceLevel5DialogueState(createInitialLevel5DialogueState());

    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel5DialoguePhase(nextState, LEVEL5_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after the last dialogue image', () => {
    let state = createInitialLevel5DialogueState();

    for (let index = 0; index < LEVEL5_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel5DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL5_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel5DialoguePhase(state, LEVEL5_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
