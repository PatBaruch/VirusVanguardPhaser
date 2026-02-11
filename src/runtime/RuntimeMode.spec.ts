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
    const runtimeMode: 'phaser' = getRuntimeMode(createWindowStub(''));

    expect(runtimeMode).toBe('phaser');
  });

  it('ignores runtime=legacy fallback and keeps Phaser runtime active', () => {
    const runtimeMode: 'phaser' = getRuntimeMode(createWindowStub('?runtime=legacy'));

    expect(runtimeMode).toBe('phaser');
  });

  it('uses phaser runtime when runtime=phaser is explicitly provided', () => {
    const runtimeMode: 'phaser' = getRuntimeMode(createWindowStub('?runtime=phaser'));

    expect(runtimeMode).toBe('phaser');
  });
});
