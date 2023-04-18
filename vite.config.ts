import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    assetsDir: '.',
    rollupOptions: {
      input: '/src',
      output: {
        dir: 'dist',
        entryFileNames: 'bundle.js'
      }
    }
  }
})
