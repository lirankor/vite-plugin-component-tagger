import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'VitePluginComponentTagger',
      fileName: 'index',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external: ['vite'],
      output: {
        exports: 'named',
        globals: {
          vite: 'Vite'
        }
      }
    }
  }
})