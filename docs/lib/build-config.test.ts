import { readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

describe('docs hydration configuration', () => {
  it('uses the Emotion-compatible bundler in development and production', () => {
    const manifest = JSON.parse(readFileSync('docs/package.json', 'utf8'))
    expect(manifest.scripts.dev).toBe('next dev --webpack')
    expect(manifest.scripts.build).toBe('next build --webpack')
  })
})
