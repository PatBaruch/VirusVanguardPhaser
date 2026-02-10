import { describe, expect, it } from 'vitest';
import {
  LEVEL0_DIALOGUE_TEXTURE_KEYS,
  advanceLevel0DialogueState,
  createInitialLevel0DialogueState,
  resolveLevel0DialoguePhase,
} from './level0DialogueState.js';

describe('level0 dialogue state', () => {
  it('starts on start screen before first space press', () => {
    const initialState = createInitialLevel0DialogueState();

    expect(initialState.startScreenSkipped).toBe(false);
    expect(initialState.currentDialogue).toBe(0);
    expect(resolveLevel0DialoguePhase(initialState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length)).toBe('startScreen');
  });

  it('matches legacy behavior by skipping directly to dialogue index 1 on first space press', () => {
    const nextState = advanceLevel0DialogueState(createInitialLevel0DialogueState());

    expect(nextState.startScreenSkipped).toBe(true);
    expect(nextState.currentDialogue).toBe(1);
    expect(resolveLevel0DialoguePhase(nextState, LEVEL0_DIALOGUE_TEXTURE_KEYS.length)).toBe('dialogue');
  });

  it('switches to walkable phase after last dialogue image', () => {
    let state = createInitialLevel0DialogueState();

    for (let index = 0; index < LEVEL0_DIALOGUE_TEXTURE_KEYS.length; index += 1) {
      state = advanceLevel0DialogueState(state);
    }

    expect(state.currentDialogue).toBe(LEVEL0_DIALOGUE_TEXTURE_KEYS.length);
    expect(resolveLevel0DialoguePhase(state, LEVEL0_DIALOGUE_TEXTURE_KEYS.length)).toBe('walkable');
  });
});
