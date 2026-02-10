export const LEVEL0_DIALOGUE_TEXTURE_KEYS = [
    'level0-dialogue-0',
    'level0-dialogue-1',
    'level0-dialogue-2',
    'level0-dialogue-3',
    'level0-dialogue-4',
    'level0-dialogue-5',
    'level0-dialogue-6',
];
export function createInitialLevel0DialogueState() {
    return {
        startScreenSkipped: false,
        currentDialogue: 0,
    };
}
export function advanceLevel0DialogueState(previousState) {
    return {
        startScreenSkipped: true,
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel0DialoguePhase(state, dialogueCount) {
    if (!state.startScreenSkipped) {
        return 'startScreen';
    }
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level0DialogueState.js.map