const RUNTIME_QUERY_PARAMETER = 'runtime';
const PHASER_RUNTIME_VALUE = 'phaser';
export function getRuntimeMode(windowObject = window) {
    const query = new URLSearchParams(windowObject.location.search);
    const runtimeValue = query.get(RUNTIME_QUERY_PARAMETER);
    if (runtimeValue === PHASER_RUNTIME_VALUE) {
        return 'phaser';
    }
    return 'phaser';
}
//# sourceMappingURL=RuntimeMode.js.map