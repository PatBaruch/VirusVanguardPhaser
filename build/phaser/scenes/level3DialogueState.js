export const LEVEL3_DIALOGUE_TEXTURE_KEYS = [
    'level3-dialogue-0',
    'level3-dialogue-1',
];
export function createInitialLevel3DialogueState() {
    return {
        currentDialogue: 0,
    };
}
export function advanceLevel3DialogueState(previousState) {
    return {
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel3DialoguePhase(state, dialogueCount) {
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level3DialogueState.js.map