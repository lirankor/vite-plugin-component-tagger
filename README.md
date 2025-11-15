# @lirankor/vite-plugin-component-tagger

A Vite plugin that adds data attributes to JSX elements for debugging and development purposes. This plugin helps developers identify which components and files generated specific DOM elements in the browser's developer tools.

## Features

- **Tags both HTML elements and React components** - Works with `<div>`, `<Button>`, `<Stack>`, etc.
- **Precise line number tracking** - Shows exact source line where element is defined
- **Self-closing tag support** - Handles `<Component />` syntax correctly  
- **TypeScript-aware** - Avoids breaking TypeScript generic syntax
- **Optimized performance** - Only runs during development when explicitly enabled
- **Clean console output** - Minimal, informative logging

## Installation

```bash
npm install @lirankor/vite-plugin-component-tagger --save-dev
```

## Usage

### Basic Setup

Add the plugin to your `vite.config.js` or `vite.config.ts`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { componentTagger } from '@lirankor/vite-plugin-component-tagger'

export default defineConfig({
  plugins: [
    componentTagger({
      enabled: process.env.NODE_ENV === 'development'
    }),
    react(),
  ],
})
```

### Conditional Usage (Recommended)

For maximum control, create a separate npm script:

**package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "dev:debug": "ENABLE_COMPONENT_TAGGER=true vite"
  }
}
```

**vite.config.js:**
```javascript
import { componentTagger } from '@lirankor/vite-plugin-component-tagger'

export default defineConfig({
  plugins: [
    componentTagger({
      enabled: process.env.ENABLE_COMPONENT_TAGGER === 'true'
    }),
    react(),
  ],
})
```

Then run with component tagging:
```bash
npm run dev:debug
```

## Generated Attributes

The plugin adds three data attributes to each JSX element:

- `data-dev-component`: The component file name (without extension)
- `data-dev-file`: Full file path with line number
- `data-dev-tag`: The HTML/React element tag name

### Example Output

**Source code (Button.jsx:15):**
```jsx
export function Button({ children }) {
  return <button className="btn">{children}</button>
}
```

**Generated HTML:**
```html
<button 
  class="btn" 
  data-dev-component="Button" 
  data-dev-file="/src/components/Button.jsx:15" 
  data-dev-tag="button"
>
  Click me
</button>
```

## Configuration

### Options

```typescript
interface ComponentTaggerOptions {
  enabled?: boolean; // Default: true
}
```

### Advanced Configuration

```javascript
componentTagger({
  enabled: process.env.NODE_ENV === 'development' && process.env.DEBUG_COMPONENTS === 'true'
})
```

## Use Cases

### 1. Component Debugging
Quickly identify which React component generated a specific DOM element:

```javascript
// In browser console
const element = document.querySelector('.some-class')
console.log(element.dataset.devComponent) // "UserProfile"
console.log(element.dataset.devFile)      // "/src/components/UserProfile.jsx:42"
```

### 2. Visual Testing
Perfect for visual regression testing and component identification in automated tests.

### 3. Code Reviews
Help reviewers understand the relationship between DOM structure and source code.

## Important Notes

- **Development only**: This plugin should only be enabled during development
- **Build size**: Has zero impact on production builds when disabled
- **Performance**: Minimal overhead - only processes JSX/TSX files
- **Syntax safety**: Carefully avoids breaking TypeScript generics and complex JSX

## Debugging

The plugin provides helpful console output:

```
Component Tagger: Tagged 156 elements across 23 files
```

## Requirements

- Vite 4.0.0 or higher
- TypeScript/JavaScript project with JSX/TSX files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Related

- [Vite Plugin Documentation](https://vitejs.dev/guide/api-plugin.html)
- [React Developer Tools](https://github.com/facebook/react/tree/main/packages/react-devtools)

---

Made for the React/Vite community