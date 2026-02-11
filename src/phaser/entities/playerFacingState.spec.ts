import { describe, expect, it } from 'vitest';
import {
  PLAYER_FACING_TEXTURE_KEYS,
  PLAYER_FACING_DIRECTIONS,
  PlayerFacingDirection,
  PlayerFacingState,
  createInitialPlayerFacingState,
  setPlayerFacingDirection,
} from './playerFacingState.js';

describe('player facing state parity', () => {
  it('starts facing east with the east texture key', () => {
    const state: PlayerFacingState = createInitialPlayerFacingState();

    expect(state.direction).toBe('E');
    expect(state.textureKey).toBe('player-E');
  });

  it('maps every legacy-facing direction to its expected texture key', () => {
    const expectedTextureByDirection: Record<PlayerFacingDirection, string> = {
      E: 'player-E',
      N: 'player-N',
      NE: 'player-NE',
      NW: 'player-NW',
      S: 'player-S',
      SE: 'player-SE',
      SW: 'player-SW',
      W: 'player-W',
    };

    expect(PLAYER_FACING_DIRECTIONS).toEqual(['E', 'W', 'N', 'S', 'NE', 'SE', 'NW', 'SW']);
    expect(PLAYER_FACING_TEXTURE_KEYS).toEqual(expectedTextureByDirection);
  });

  it('updates both direction and texture key when facing changes', () => {
    const initialState: PlayerFacingState = createInitialPlayerFacingState();
    const updatedState: PlayerFacingState = setPlayerFacingDirection(initialState, 'NW');

    expect(updatedState.direction).toBe('NW');
    expect(updatedState.textureKey).toBe('player-NW');
  });
});
