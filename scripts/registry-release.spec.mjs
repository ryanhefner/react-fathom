import assert from 'node:assert/strict'
import test from 'node:test'
import {
  ensureUnpublished,
  readRegistry,
  verifyPublished,
} from './registry-release.mjs'

test('only an explicit npm E404 is treated as unpublished', async () => {
  const rejected = (stdout) => async () => {
    throw Object.assign(new Error('npm failed'), { stdout })
  }
  assert.equal(
    await readRegistry('react-fathom@0.3.0', {
      run: rejected('{"error":{"code":"E404"}}'),
    }),
    null,
  )
  for (const stdout of [
    '',
    '{"error":{"code":"E401"}}',
    '{"error":{"code":"E503"}}',
    'bad json',
  ]) {
    await assert.rejects(
      readRegistry('react-fathom@0.3.0', { run: rejected(stdout) }),
      /refusing to treat/,
    )
  }
  await assert.rejects(
    readRegistry('react-fathom@0.3.0', {
      run: async () => ({ stdout: 'not json' }),
    }),
    /refusing to treat/,
  )
})

test('published versions remain immutable', async () => {
  await ensureUnpublished('0.3.0', async () => null)
  await assert.rejects(
    ensureUnpublished('0.3.0', async () => ({ version: '0.3.0' })),
    /already published/,
  )
})

test('verification waits for both artifact propagation and the correct tag', async () => {
  let count = 0
  const waits = []
  await verifyPublished('0.3.0', 'latest', {
    read: async (_spec, options) => {
      if (options?.field === 'dist-tags')
        return { latest: count < 3 ? '0.2.0' : '0.3.0' }
      count++
      return count === 1
        ? null
        : {
            version: '0.3.0',
            dist: {
              integrity: 'sha512-test',
              tarball: 'https://registry.npmjs.org/file.tgz',
            },
          }
    },
    wait: async (delay) => {
      waits.push(delay)
    },
  })
  assert.equal(count, 3)
  assert.deepEqual(waits, [10_000, 10_000])
})

test('verification fails if the artifact or tag never becomes complete', async () => {
  for (const manifest of [
    null,
    { version: '0.3.0' },
    { version: '0.3.0', dist: { integrity: 'x', tarball: 'x' } },
  ]) {
    await assert.rejects(
      verifyPublished('0.3.0', 'next', {
        read: async (_spec, options) =>
          options?.field === 'dist-tags' ? { next: '0.3.0-next.0' } : manifest,
        wait: async () => {},
        attempts: 2,
      }),
      /Registry verification failed/,
    )
  }
})
