export const LEVEL4_DIALOGUE_TEXTURE_KEYS = [
    'level4-dialogue-0',
    'level4-dialogue-1',
];
export function createInitialLevel4DialogueState() {
    return {
        currentDialogue: 0,
    };
}
export function advanceLevel4DialogueState(previousState) {
    return {
        currentDialogue: previousState.currentDialogue + 1,
    };
}
export function resolveLevel4DialoguePhase(state, dialogueCount) {
    if (state.currentDialogue < dialogueCount) {
        return 'dialogue';
    }
    return 'walkable';
}
//# sourceMappingURL=level4DialogueState.js.map