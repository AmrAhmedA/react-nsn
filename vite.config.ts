import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/nsn.ts'),
      name: 'react-nsn',
      fileName: 'react-nsn',
      formats: ['es', 'umd']
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-transition-group'],
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
