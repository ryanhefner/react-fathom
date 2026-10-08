import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { it } from 'vitest'

const read = (file: string) => readFileSync(file, 'utf8')

it('the docs site uses pinned published Chakra Docs packages, not local links', () => {
  const manifest = JSON.parse(read('docs/package.json'))
  const dependencies = Object.entries(manifest.dependencies).filter(([name]) =>
    name.startsWith('@chakra-docs/'),
  )
  assert.ok(dependencies.length >= 4)
  for (const [name, version] of dependencies) {
    assert.equal(version, '0.3.0', name)
  }
  assert.doesNotMatch(read('pnpm-lock.yaml'), /file:.*\.yalc\/@chakra-docs\//)
})
