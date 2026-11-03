import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('docs hydration configuration', () => {
  it('uses the Emotion-compatible bundler in development and production', () => {
    const manifest = JSON.parse(readFileSync('docs/package.json', 'utf8'))
    expect(manifest.scripts.dev).toBe('next dev --webpack')
    expect(manifest.scripts.build).toBe('next build --webpack')
  })

  it('keeps Vercel on Next.js with automatic build output discovery', () => {
    const config = JSON.parse(readFileSync('docs/vercel.json', 'utf8'))
    expect(config.framework).toBe('nextjs')
    expect(config.outputDirectory).toBeUndefined()
    expect(config.rewrites).toBeUndefined()
    expect(readFileSync('docs/next.config.mjs', 'utf8')).toContain(
      "output: 'export'",
    )
  })
})
