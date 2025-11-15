import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { componentTagger } from '@lirankor/vite-plugin-component-tagger'

export default defineConfig({
  plugins: [
    // Add component tagger BEFORE React plugin
    componentTagger({
      enabled: process.env.NODE_ENV === 'development'
    }),
    react(),
  ],
})