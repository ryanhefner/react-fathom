import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const filePath = join(__dirname, '..', 'dist', 'es', 'next', 'index.js')
try {
  let content = readFileSync(filePath, 'utf8')

  // Check if NextFathomProviderApp is exported
  if (content.includes('NextFathomProviderApp')) {
    // Remove existing 'use client' if present (might be in wrong position)
    content = content.replace(/^'use client'\s*\n\s*\n?/gm, '')

    // 'use client' must be the very first line, before any comments or code
    const newContent = "'use client'\n" + content
    writeFileSync(filePath, newContent, 'utf8')
    console.log("Added 'use client' directive to dist/es/next/index.js")
  } else {
    console.log("NextFathomProviderApp not found, skipping 'use client' directive")
  }
} catch (error) {
  // File doesn't exist yet, that's okay
  console.log('Skipping add-use-client:', error.message)
}
