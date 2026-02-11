export const LEVEL5_DIALOGUE_TEXTURE_KEYS = [
    'level5-dialogue-0',
    'level5-dialogue-1',
    'level5-dialogue-2',
];
export function createInitialLevel5DialogueState() {
    return {
        currentDialogue: 0,
    };
}
export function advanceLevel5DialogueState(previousState) {
    return {
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel5DialoguePhase(state, dialogueCount) {
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level5DialogueState.js.map