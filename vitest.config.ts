import path from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['features/**/*.test.ts'],
  },
  resolve: {
    alias: {
      '@features': path.resolve(__dirname, 'features'),
      '@lib': path.resolve(__dirname, 'lib'),
      '@components': path.resolve(__dirname, 'components'),
      '@app': path.resolve(__dirname, 'app'),
      '@ui': path.resolve(__dirname, 'features/ui'),
    },
  },
})
