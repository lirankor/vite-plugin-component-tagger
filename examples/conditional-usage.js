import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { componentTagger } from '@lirankor/vite-plugin-component-tagger'

export default defineConfig({
  plugins: [
    // Only enable when ENABLE_COMPONENT_TAGGER=true
    componentTagger({
      enabled: process.env.ENABLE_COMPONENT_TAGGER === 'true'
    }),
    react(),
  ],
})

// Usage:
// npm run dev                    # No component tagging
// ENABLE_COMPONENT_TAGGER=true npm run dev  # With component tagging

// Or add to package.json:
// {
//   "scripts": {
//     "dev": "vite",
//     "dev:debug": "ENABLE_COMPONENT_TAGGER=true vite"
//   }
// }