import * as packageJson from './package.json'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { visualizer } from 'rollup-plugin-visualizer'
import { PluginOption, defineConfig } from 'vite'
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    react({ jsxRuntime: 'classic' }),
    cssInjectedByJsPlugin(),
    dts({
      insertTypesEntry: true
    }),
    visualizer({
      template: 'treemap', // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: 'analyse.html' // will be saved in project's root
    }) as PluginOption
  ],

  build: {
    lib: {
      entry: resolve(__dirname, 'src/nsn.ts'),
      name: 'react-nsn',
      fileName: 'react-nsn',
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      external: [...Object.keys(packageJson.peerDependencies)],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-transition-group': 'ReactTransitionGroup'
        }
      }
    }
  }
})
