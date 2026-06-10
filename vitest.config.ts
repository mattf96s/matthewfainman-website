import { defineConfig } from 'vitest/config'

/**
 * Standalone vitest config: unit tests cover pure logic only, so they
 * skip the app's full Vite plugin stack (nitro, TanStack Start, React
 * compiler). Playwright owns everything under e2e/.
 */
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
  },
})
