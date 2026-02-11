export const PLAYER_FACING_DIRECTIONS: readonly PlayerFacingDirection[] = [
  'E',
  'W',
  'N',
  'S',
  'NE',
  'SE',
  'NW',
  'SW',
];

export type PlayerFacingDirection =
  | 'E'
  | 'W'
  | 'N'
  | 'S'
  | 'NE'
  | 'SE'
  | 'NW'
  | 'SW';

export interface PlayerFacingState {
  direction: PlayerFacingDirection;
  textureKey: string;
}

export const PLAYER_FACING_TEXTURE_KEYS: Record<PlayerFacingDirection, string> = {
  E: 'player-E',
  W: 'player-W',
  N: 'player-N',
  S: 'player-S',
  NE: 'player-NE',
  SE: 'player-SE',
  NW: 'player-NW',
  SW: 'player-SW',
};

export function createInitialPlayerFacingState(): PlayerFacingState {
  return {
    direction: 'E',
    textureKey: PLAYER_FACING_TEXTURE_KEYS.E,
  };
}

export function setPlayerFacingDirection(
  currentState: PlayerFacingState,
  direction: PlayerFacingDirection,
): PlayerFacingState {
  if (currentState.direction === direction) {
    return currentState;
  }

  return {
    direction,
    textureKey: PLAYER_FACING_TEXTURE_KEYS[direction],
  };
}
