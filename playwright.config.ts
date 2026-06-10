import { defineConfig, devices } from '@playwright/test'

/**
 * E2E + perf-budget suite. Runs against the PRODUCTION build (perf
 * numbers from dev mode are meaningless), so `pnpm build` must run
 * first — the webServer command boots the built Nitro server.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  // one worker: tests share the GPU and the Playroom network
  workers: 1,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'retain-on-failure',
    launchOptions: {
      // software WebGL in headless CI runners
      args: ['--enable-unsafe-swiftshader'],
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node .output/server/index.mjs',
    port: 4173,
    env: { PORT: '4173' },
    reuseExistingServer: !process.env.CI,
    timeout: 30_000,
  },
})
