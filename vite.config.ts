import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environmentMatchGlobs: [
      ['tests/repositories/prisma/**', 'prisma'],
      ['tests/http/controllers/**', 'prisma'],
    ],
  },
})
