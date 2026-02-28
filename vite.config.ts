/// <reference types="vitest" />
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { defineConfig, type PluginOption } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'
import packageJson from './package.json' with { type: 'json' }

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/__tests__/**', 'src/nsn.ts', 'src/icons.tsx'],
    },
  },

  plugins: [
    react(),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
    }),
    visualizer({
      template: 'treemap',
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'analyse.html',
    }) as PluginOption,
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/nsn.ts'),
      name: 'react-nsn',
      fileName: 'react-nsn',
      formats: ['cjs', 'es'],
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
})
