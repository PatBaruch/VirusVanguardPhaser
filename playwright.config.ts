import { defineConfig } from '@playwright/test';

const E2E_PORT: number = 4173;

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  retries: 0,
  use: {
    baseURL: `http://127.0.0.1:${E2E_PORT}`,
    headless: true,
  },
  webServer: {
    command: `node ./scripts/e2e/static-server.mjs ${E2E_PORT}`,
    port: E2E_PORT,
    reuseExistingServer: false,
  },
});
