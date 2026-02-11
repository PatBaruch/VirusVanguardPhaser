export const LEVEL2_DIALOGUE_TEXTURE_KEYS = [
    'level2-dialogue-0',
    'level2-dialogue-1',
];
export function createInitialLevel2DialogueState() {
    return {
        currentDialogue: 0,
    };
}
export function advanceLevel2DialogueState(previousState) {
    return {
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel2DialoguePhase(state, dialogueCount) {
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level2DialogueState.js.map