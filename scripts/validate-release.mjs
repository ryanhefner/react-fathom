import { readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const semverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/

export function validateRelease({
  version,
  channel,
  expectedVersion,
  releaseTag,
}) {
  const match = semverPattern.exec(version)

  if (!match) {
    throw new Error(`package.json version is not valid semver: ${version}`)
  }

  if (channel !== 'next' && channel !== 'latest') {
    throw new Error(`Unsupported npm dist-tag: ${channel}`)
  }

  const isPrerelease = Boolean(match[4])

  if (channel === 'next' && !isPrerelease) {
    throw new Error(
      `The next channel requires a prerelease version (for example, 0.3.0-next.0); received ${version}`,
    )
  }

  if (channel === 'latest' && isPrerelease) {
    throw new Error(
      `The latest channel requires a stable version; received ${version}`,
    )
  }

  if (expectedVersion && expectedVersion !== version) {
    throw new Error(
      `Requested version ${expectedVersion} does not match package.json version ${version}`,
    )
  }

  if (releaseTag && releaseTag !== `v${version}`) {
    throw new Error(
      `GitHub release tag ${releaseTag} does not match package.json version v${version}`,
    )
  }

  return { channel, isPrerelease, version }
}

async function run() {
  const [, , channel, expectedVersion = '', releaseTag = ''] = process.argv
  const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
  const manifest = JSON.parse(
    await readFile(resolve(workspaceRoot, 'package.json'), 'utf8'),
  )
  const result = validateRelease({
    version: manifest.version,
    channel,
    expectedVersion,
    releaseTag,
  })

  console.log(
    `Validated react-fathom@${result.version} for the npm ${result.channel} channel.`,
  )
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  await run()
}
