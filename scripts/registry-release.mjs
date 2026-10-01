import { execFile } from 'node:child_process'
import { resolve } from 'node:path'
import { setTimeout } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm'

export async function readRegistry(spec, { field, run = execFileAsync } = {}) {
  try {
    const { stdout } = await run(
      npm,
      [
        'view',
        spec,
        ...(field ? [field] : []),
        '--json',
        '--registry=https://registry.npmjs.org',
      ],
      {
        timeout: 30_000,
        maxBuffer: 2 * 1024 * 1024,
      },
    )
    const value = JSON.parse(stdout)
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw new Error('npm returned an invalid registry object')
    }
    return value
  } catch (error) {
    let response
    try {
      response = JSON.parse(error.stdout)
    } catch {
      /* Not an npm JSON response. */
    }
    if (response?.error?.code === 'E404') return null
    throw new Error(
      'npm registry lookup failed; refusing to treat an auth, network, or malformed response as an unpublished version.',
      { cause: error },
    )
  }
}

export async function ensureUnpublished(version, read = readRegistry) {
  if (await read(`react-fathom@${version}`)) {
    throw new Error(
      `react-fathom@${version} is already published. Bump the version before publishing another immutable release.`,
    )
  }
}

export async function verifyPublished(
  version,
  channel,
  { read = readRegistry, wait = setTimeout, attempts = 6, delay = 10_000 } = {},
) {
  let reason = 'version not visible'
  for (let attempt = 1; attempt <= attempts; attempt++) {
    const manifest = await read(`react-fathom@${version}`)
    const tags = await read('react-fathom', { field: 'dist-tags' })
    if (
      manifest?.version === version &&
      manifest.dist?.integrity &&
      manifest.dist?.tarball &&
      tags?.[channel] === version
    )
      return
    reason = !manifest
      ? 'version not visible'
      : manifest.version !== version
        ? 'registry returned a different version'
        : !manifest.dist?.integrity || !manifest.dist?.tarball
          ? 'missing tarball or integrity'
          : `${channel} points to ${tags?.[channel] ?? 'nothing'}`
    if (attempt < attempts) await wait(delay)
  }
  throw new Error(
    `Registry verification failed for react-fathom@${version}: ${reason}`,
  )
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const [command, version, channel] = process.argv.slice(2)
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(version ?? ''))
    throw new Error('A release version is required')
  if (command === 'ensure-unpublished') await ensureUnpublished(version)
  else if (command === 'verify' && ['latest', 'next'].includes(channel))
    await verifyPublished(version, channel)
  else
    throw new Error(
      'Usage: registry-release.mjs ensure-unpublished <version> | verify <version> <latest|next>',
    )
}
