export type RuntimeMode = 'phaser';

const RUNTIME_QUERY_PARAMETER: string = 'runtime';
const PHASER_RUNTIME_VALUE: string = 'phaser';

/**
 * Resolve which runtime should boot from URL query params.
 * Legacy runtime has been decommissioned; Phaser is always selected.
 */
export function getRuntimeMode(windowObject: Window = window): RuntimeMode {
  const query: URLSearchParams = new URLSearchParams(windowObject.location.search);
  const runtimeValue: string | null = query.get(RUNTIME_QUERY_PARAMETER);
  if (runtimeValue === PHASER_RUNTIME_VALUE) {
    return 'phaser';
  }

  return 'phaser';
}
