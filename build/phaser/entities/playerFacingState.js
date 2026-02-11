export const PLAYER_FACING_DIRECTIONS = [
    'E',
    'W',
    'N',
    'S',
    'NE',
    'SE',
    'NW',
    'SW',
];
export const PLAYER_FACING_TEXTURE_KEYS = {
    E: 'player-E',
    W: 'player-W',
    N: 'player-N',
    S: 'player-S',
    NE: 'player-NE',
    SE: 'player-SE',
    NW: 'player-NW',
    SW: 'player-SW',
};
export function createInitialPlayerFacingState() {
    return {
        direction: 'E',
        textureKey: PLAYER_FACING_TEXTURE_KEYS.E,
    };
}
export function setPlayerFacingDirection(currentState, direction) {
    if (currentState.direction === direction) {
        return currentState;
    }
    return {
        direction,
        textureKey: PLAYER_FACING_TEXTURE_KEYS[direction],
    };
}
//# sourceMappingURL=playerFacingState.js.map