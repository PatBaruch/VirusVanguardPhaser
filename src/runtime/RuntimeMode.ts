export type RuntimeMode = 'legacy' | 'phaser';

const RUNTIME_QUERY_PARAMETER: string = 'runtime';
const LEGACY_RUNTIME_VALUE: string = 'legacy';
const PHASER_RUNTIME_VALUE: string = 'phaser';

/**
 * Resolve which runtime should boot from URL query params.
 * Defaults to Phaser while retaining a legacy fallback query flag.
 */
export function getRuntimeMode(windowObject: Window = window): RuntimeMode {
  const query: URLSearchParams = new URLSearchParams(windowObject.location.search);
  const runtimeValue: string | null = query.get(RUNTIME_QUERY_PARAMETER);
  if (runtimeValue === LEGACY_RUNTIME_VALUE) {
    return 'legacy';
  }

  if (runtimeValue === PHASER_RUNTIME_VALUE) {
    return 'phaser';
  }

  return 'phaser';
}
