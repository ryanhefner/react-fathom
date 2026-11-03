import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { extractReadmeExample } from './readme-examples.mjs'

const root = new URL('../', import.meta.url)
const readme = readFileSync(new URL('README.md', root), 'utf8')
const manifest = JSON.parse(readFileSync(new URL('package.json', root), 'utf8'))

test('release version matches the documentation header and changelog', () => {
  const header = readFileSync(
    new URL('docs/components/docs/Navbar.tsx', root),
    'utf8',
  )
  const changelog = readFileSync(
    new URL('docs/content/changelog.mdx', root),
    'utf8',
  )
  assert.ok(header.includes(`v${manifest.version}`))
  assert.ok(changelog.includes(`### ${manifest.version}\n`))
})

test('the packed consumer smoke uses the patched Next.js baseline', () => {
  const smoke = readFileSync(new URL('scripts/release-smoke.mjs', root), 'utf8')
  assert.ok(smoke.includes(`next: '${manifest.devDependencies.next}'`))
})

test('npm metadata retains discoverable package details and direct support links', () => {
  assert.equal(manifest.homepage, 'https://react-fathom.dev')
  assert.equal(
    manifest.bugs.url,
    'https://github.com/ryanhefner/react-fathom/issues',
  )
  assert.equal(
    manifest.repository.url,
    'git+https://github.com/ryanhefner/react-fathom.git',
  )
  assert.match(manifest.description, /Fathom Analytics.*React/)
  for (const keyword of ['fathom-analytics', 'react', 'nextjs', 'typescript']) {
    assert.ok(manifest.keywords.includes(keyword), keyword)
  }
  assert.equal(new Set(manifest.keywords).size, manifest.keywords.length)
  for (const file of ['README.md', 'LICENSE'])
    assert.ok(manifest.files.includes(file))
  assert.match(readme, /Ryan Hefner.*https:\/\/www\.ryanhefner\.com/)
  assert.match(readme, /Commune Software.*https:\/\/commune\.software/)
  assert.ok(
    manifest.contributors.some((person) =>
      person.includes('https://commune.software'),
    ),
  )
})

test('the README has standalone examples for React and both Next routers', () => {
  for (const name of ['react', 'next-app', 'next-pages']) {
    const source = extractReadmeExample(readme, name)
    assert.match(source, /export default function/)
    assert.doesNotMatch(source, /<YourApp\b|App\.tsx or layout\.tsx/)
  }
  assert.match(extractReadmeExample(readme, 'next-pages'), /auto: false/)
})

test('example extraction fails closed for missing, reordered, duplicated, or empty blocks', () => {
  const valid =
    '<!-- quickstart:react:start -->\n```tsx\nexport const x = 1\n```\n<!-- quickstart:react:end -->'
  assert.equal(extractReadmeExample(valid, 'react'), 'export const x = 1\n')
  assert.equal(
    extractReadmeExample(valid.replaceAll('\n', '\r\n'), 'react'),
    'export const x = 1\r\n',
  )
  for (const source of [
    '',
    valid + valid,
    '<!-- quickstart:react:end -->\n<!-- quickstart:react:start -->\n```tsx\nexport const x = 1\n```',
    valid.replace('```tsx', '```ts'),
    valid.replace('export const x = 1', ''),
    valid.replace('quickstart:react:start', 'missing'),
  ]) {
    assert.throws(() => extractReadmeExample(source, 'react'), /README react/)
  }
})
