export const LEVEL1_DIALOGUE_TEXTURE_KEYS = [
    'level1-dialogue-0',
    'level1-dialogue-1',
];
export function createInitialLevel1DialogueState() {
    return {
        currentDialogue: 0,
    };
}
export function advanceLevel1DialogueState(previousState) {
    return {
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel1DialoguePhase(state, dialogueCount) {
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level1DialogueState.js.map