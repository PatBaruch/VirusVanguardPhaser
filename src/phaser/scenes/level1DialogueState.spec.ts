import { describe, expect, it } from 'vitest';
import {
  LEVEL1_DIALOGUE_TEXTURE_KEYS,
  advanceLevel1DialogueState,
  createInitialLevel1DialogueState,
  resolveLevel1DialoguePhase,
} from './level1DialogueState.js';

describe('level1 dialogue state', () => {
  it('starts in dialogue phase at index 0 with no start screen', () => {
    const initialState = createInitialLevel1DialogueState();

    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel1DialoguePhase(initialState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('increments dialogue index on each space press while dialogue is active', () => {
    const nextState = advanceLevel1DialogueState(createInitialLevel1DialogueState());

    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel1DialoguePhase(nextState, LEVEL1_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after the last dialogue image', () => {
    let state = createInitialLevel1DialogueState();

    for (let index = 0; index < LEVEL1_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel1DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL1_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel1DialoguePhase(state, LEVEL1_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
