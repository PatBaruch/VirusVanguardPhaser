import { describe, expect, it } from 'vitest';
import {
  LEVEL4_DIALOGUE_TEXTURE_KEYS,
  advanceLevel4DialogueState,
  createInitialLevel4DialogueState,
  resolveLevel4DialoguePhase,
} from './level4DialogueState.js';

describe('level4 dialogue state', () => {
  it('starts in dialogue phase at index 0 with no start screen', () => {
    const initialState = createInitialLevel4DialogueState();

    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel4DialoguePhase(initialState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('increments dialogue index on each space press while dialogue is active', () => {
    const nextState = advanceLevel4DialogueState(createInitialLevel4DialogueState());

    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel4DialoguePhase(nextState, LEVEL4_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after the last dialogue image', () => {
    let state = createInitialLevel4DialogueState();

    for (let index = 0; index < LEVEL4_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel4DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL4_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel4DialoguePhase(state, LEVEL4_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
