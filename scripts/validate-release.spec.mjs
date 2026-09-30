import assert from 'node:assert/strict'
import test from 'node:test'

import { validateRelease } from './validate-release.mjs'

test('accepts a stable release on latest', () => {
  assert.deepEqual(
    validateRelease({
      version: '0.3.0',
      channel: 'latest',
      expectedVersion: '0.3.0',
      releaseTag: 'v0.3.0',
    }),
    { version: '0.3.0', channel: 'latest', isPrerelease: false },
  )
})

test('accepts a prerelease on next', () => {
  assert.deepEqual(
    validateRelease({
      version: '0.3.0-next.0',
      channel: 'next',
      expectedVersion: '0.3.0-next.0',
      releaseTag: 'v0.3.0-next.0',
    }),
    { version: '0.3.0-next.0', channel: 'next', isPrerelease: true },
  )
})

test('rejects stable versions on next', () => {
  assert.throws(
    () => validateRelease({ version: '0.3.0', channel: 'next' }),
    /next channel requires a prerelease version/,
  )
})

test('rejects prerelease versions on latest', () => {
  assert.throws(
    () => validateRelease({ version: '0.3.0-rc.1', channel: 'latest' }),
    /latest channel requires a stable version/,
  )
})

test('rejects mismatched requested versions and release tags', () => {
  assert.throws(
    () =>
      validateRelease({
        version: '0.3.0',
        channel: 'latest',
        expectedVersion: '0.3.1',
      }),
    /does not match package.json version/,
  )
  assert.throws(
    () =>
      validateRelease({
        version: '0.3.0',
        channel: 'latest',
        releaseTag: 'v0.3.1',
      }),
    /does not match package.json version/,
  )
})
