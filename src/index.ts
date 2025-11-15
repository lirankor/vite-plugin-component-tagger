import type { Plugin } from 'vite';

export interface ComponentTaggerOptions {
  enabled?: boolean;
}

/**
 * JSX-aware component tagger that's more careful about syntax
 */
export function componentTagger(options: ComponentTaggerOptions = {}): Plugin {
  const { enabled = true } = options;
  
  if (!enabled) {
    return {
      name: 'jsx-component-tagger-disabled',
    };
  }

  let totalTaggedElements = 0;
  let totalFilesProcessed = 0;

  return {
    name: 'jsx-component-tagger',
    enforce: 'pre', // Run before esbuild and other core plugins
    
    buildStart() {
      totalTaggedElements = 0;
      totalFilesProcessed = 0;
    },
    
    buildEnd() {
      if (totalFilesProcessed > 0) {
        console.log(`🏷️ Component Tagger: Tagged ${totalTaggedElements} elements across ${totalFilesProcessed} files`);
      }
    },
    
    transform(code: string, id: string) {
      if (!enabled || (!id.includes('.tsx') && !id.includes('.jsx'))) {
        return null;
      }

      if (id.includes('node_modules')) {
        return null;
      }

      try {
        const fileName = id.split('/').pop()?.replace(/\.(tsx|jsx)$/, '') || 'unknown';
        const filePath = id.replace(process.cwd(), '');
        
        let transformedCode = code;
        let hasChanges = false;
        let transformCount = 0;

              // Pattern to match JSX elements only (not TypeScript generics)
      // HTML elements: <div>, <span>, <button>, etc.
      // React components: <Button>, <Stack>, <TextField>, etc.
      // Includes both opening tags and self-closing tags
      // Excludes TypeScript generics by avoiding matches after : or < characters
      const elementPattern = /(?<![:\w])\s*(<(div|span|p|h[1-6]|button|form|section|main|article|header|footer|nav|aside|[A-Z][a-zA-Z0-9]*(?:[A-Z][a-zA-Z0-9]*)?)(\s[^>]*?)?(\/?)>)/g;

        [elementPattern].forEach(pattern => {
          transformedCode = transformedCode.replace(pattern, (match, fullTag, tagName, _attributes, _selfClosing, offset) => {
            // Calculate line number by counting newlines before the match
            const beforeMatch = transformedCode.substring(0, offset);
            const lineNumber = (beforeMatch.match(/\n/g) || []).length + 1;
            
            // Skip if already has our attributes
            if (fullTag.includes('data-dev-component')) {
              return match;
            }
            
            // Skip if it contains arrow functions or complex JSX expressions that could break
            if (fullTag.includes('=>') || fullTag.includes('() =>')) {
              return match;
            }

            // Skip if it spans multiple lines (contains newlines)
            if (fullTag.includes('\n')) {
              return match;
            }

            // Handle both regular tags and self-closing tags
            const devAttrs = ` data-dev-component="${fileName}" data-dev-file="${filePath}:${lineNumber}" data-dev-tag="${tagName}"`;
            let transformedTag;
            
            // Check if it's a self-closing tag (ends with />)
            if (fullTag.endsWith('/>')) {
              // Insert attributes before the />
              transformedTag = fullTag.slice(0, -2) + devAttrs + ' />';
            } else {
              // Regular opening tag - insert attributes before the >
              transformedTag = fullTag.slice(0, -1) + devAttrs + '>';
            }
            
            // Return the full match with the transformed tag
            const result = match.replace(fullTag, transformedTag);
            hasChanges = true;
            transformCount++;
            
            return result;
          });
        });

        if (hasChanges) {
          totalTaggedElements += transformCount;
          totalFilesProcessed++;
          return {
            code: transformedCode,
            map: null,
          };
        }

        return null;
      } catch (error) {
        console.warn(`JSX tagger failed for ${id}:`, error);
        return null;
      }
    },
  };
}