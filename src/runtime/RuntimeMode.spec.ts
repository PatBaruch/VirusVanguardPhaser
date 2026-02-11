import { describe, expect, it } from 'vitest';

import { getRuntimeMode } from './RuntimeMode.js';

function createWindowStub(search: string): Window {
  return {
    location: {
      search,
    },
  } as Window;
}

describe('getRuntimeMode', () => {
  it('defaults to phaser when runtime query parameter is absent', () => {
    const runtimeMode: 'legacy' | 'phaser' = getRuntimeMode(createWindowStub(''));

    expect(runtimeMode).toBe('phaser');
  });

  it('uses legacy runtime when runtime=legacy is provided as fallback', () => {
    const runtimeMode: 'legacy' | 'phaser' = getRuntimeMode(createWindowStub('?runtime=legacy'));

    expect(runtimeMode).toBe('legacy');
  });

  it('uses phaser runtime when runtime=phaser is explicitly provided', () => {
    const runtimeMode: 'legacy' | 'phaser' = getRuntimeMode(createWindowStub('?runtime=phaser'));

    expect(runtimeMode).toBe('phaser');
  });
});
