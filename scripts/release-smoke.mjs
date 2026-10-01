import { execFile } from 'node:child_process'
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { promisify } from 'node:util'
import { fileURLToPath } from 'node:url'

const execFileAsync = promisify(execFile)
const npmCommand = process.platform === 'win32' ? 'npm.cmd' : 'npm'
const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const tempRoot = await mkdtemp(join(tmpdir(), 'react-fathom-consumer-'))
const tarballDirectory = join(tempRoot, 'tarballs')
const consumerDirectory = join(tempRoot, 'consumer')

const run = async (command, args, cwd = workspaceRoot) =>
  execFileAsync(command, args, {
    cwd,
    env: {
      ...process.env,
      npm_config_audit: 'false',
      npm_config_cache: join(tempRoot, 'npm-cache'),
      npm_config_fund: 'false',
      npm_config_provenance: 'false',
    },
    maxBuffer: 10 * 1024 * 1024,
  })

const parsePackOutput = (output) => {
  const lines = output.split(/\r?\n/)

  for (let index = 0; index < lines.length; index += 1) {
    if (!lines[index].trimStart().startsWith('[')) continue

    try {
      return JSON.parse(lines.slice(index).join('\n'))
    } catch {
      // npm can prepend lifecycle output before its JSON payload. Keep looking
      // in case an earlier log line also began with an opening bracket.
    }
  }

  throw new Error(`npm pack did not return valid JSON:\n${output}`)
}

try {
  await mkdir(tarballDirectory, { recursive: true })
  await mkdir(consumerDirectory, { recursive: true })

  const { stdout: packOutput } = await run(npmCommand, [
    'pack',
    '--json',
    '--ignore-scripts',
    '--pack-destination',
    tarballDirectory,
  ])
  const [packedPackage] = parsePackOutput(packOutput)

  if (!packedPackage?.filename) {
    throw new Error('npm pack did not produce a react-fathom tarball.')
  }

  const packedFiles = new Set(packedPackage.files.map(({ path }) => path))
  const requiredFiles = [
    'dist/es/index.js',
    'dist/cjs/index.cjs',
    'dist/es/debug/index.js',
    'dist/cjs/debug/index.cjs',
    'types/index.d.ts',
    'types/debug/index.d.ts',
    'types/next/index.d.ts',
    'types/native/index.d.ts',
    'types/react-router/index.d.ts',
    'types/gatsby/index.d.ts',
    'types/tanstack-router/index.d.ts',
  ]

  for (const requiredFile of requiredFiles) {
    if (!packedFiles.has(requiredFile)) {
      throw new Error(`Packed package is missing ${requiredFile}.`)
    }
  }

  const unpublishedFiles = [...packedFiles].filter(
    (path) => path.startsWith('src/') || path.endsWith('.test.tsx'),
  )
  if (unpublishedFiles.length > 0) {
    throw new Error(
      `Packed package contains unpublished source files: ${unpublishedFiles.join(', ')}`,
    )
  }

  const staleDeclarations = [
    'types/next/AppRouterProvider.d.ts',
    'types/next/utils.d.ts',
    'types/useFathom.d.ts',
  ]
  for (const staleDeclaration of staleDeclarations) {
    if (packedFiles.has(staleDeclaration)) {
      throw new Error(`Packed package contains stale ${staleDeclaration}.`)
    }
  }

  await writeFile(
    join(consumerDirectory, 'package.json'),
    `${JSON.stringify(
      {
        name: 'react-fathom-packed-consumer-smoke',
        private: true,
        type: 'module',
        dependencies: {
          'fathom-client': '3.7.2',
          react: '19.2.3',
          'react-dom': '19.2.3',
          'react-fathom': `file:${join(
            tarballDirectory,
            packedPackage.filename,
          )}`,
        },
        devDependencies: {
          '@types/react': '19.2.9',
          jsdom: '30.1.1',
          next: '16.3.7',
          typescript: '5.9.3',
        },
      },
      null,
      2,
    )}\n`,
  )

  await writeFile(
    join(consumerDirectory, 'smoke.mjs'),
    `import * as ReactFathom from 'react-fathom'
import * as ReactFathomDebug from 'react-fathom/debug'

if (
  typeof ReactFathom.FathomProvider !== 'function' ||
  typeof ReactFathom.useFathom !== 'function' ||
  typeof ReactFathomDebug.EventStream !== 'function'
) {
  throw new Error('Packed ESM exports are incomplete.')
}

const optionalSubpaths = [
  'react-fathom/next',
  'react-fathom/native',
  'react-fathom/react-router',
  'react-fathom/gatsby',
  'react-fathom/tanstack-router',
]

for (const subpath of optionalSubpaths) {
  import.meta.resolve(subpath)
}

console.log('ok packed ESM runtime and subpath resolution')
`,
  )

  await writeFile(
    join(consumerDirectory, 'smoke.cjs'),
    `const ReactFathom = require('react-fathom')
const ReactFathomDebug = require('react-fathom/debug')

if (
  typeof ReactFathom.FathomProvider !== 'function' ||
  typeof ReactFathom.useFathom !== 'function' ||
  typeof ReactFathomDebug.EventStream !== 'function'
) {
  throw new Error('Packed CommonJS exports are incomplete.')
}

for (const subpath of [
  'react-fathom/next',
  'react-fathom/native',
  'react-fathom/react-router',
  'react-fathom/gatsby',
  'react-fathom/tanstack-router',
]) {
  require.resolve(subpath)
}

console.log('ok packed CommonJS runtime and subpath resolution')
`,
  )

  await writeFile(
    join(consumerDirectory, 'smoke.tsx'),
    `import { FathomProvider, type FathomProviderProps } from 'react-fathom'
import { type EventStreamProps } from 'react-fathom/debug'
import { type GatsbyFathomOptions } from 'react-fathom/gatsby'
import { type NativeFathomProviderProps } from 'react-fathom/native'
import { type NextFathomTrackViewAppProps } from 'react-fathom/next'
import { type ReactRouterFathomTrackViewProps } from 'react-fathom/react-router'
import { type TanStackRouterFathomTrackViewProps } from 'react-fathom/tanstack-router'

const providerProps: FathomProviderProps = { debug: false }
const debugProps: EventStreamProps = { maxEvents: 10 }
const gatsbyOptions: GatsbyFathomOptions = { siteId: 'ABCDEFGH' }
const nativeProps = {} as NativeFathomProviderProps
const nextProps: NextFathomTrackViewAppProps = {}
const reactRouterProps: ReactRouterFathomTrackViewProps = {}
const tanStackProps: TanStackRouterFathomTrackViewProps = {}

export const smoke = (
  <FathomProvider {...providerProps}>
    {JSON.stringify({
      debugProps,
      gatsbyOptions,
      nativeProps,
      nextProps,
      reactRouterProps,
      tanStackProps,
    })}
  </FathomProvider>
)
`,
  )

  await writeFile(
    join(consumerDirectory, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          jsx: 'react-jsx',
          lib: ['ES2022', 'DOM'],
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          noEmit: true,
          skipLibCheck: false,
          strict: true,
          target: 'ES2022',
        },
        include: ['smoke.tsx'],
      },
      null,
      2,
    )}\n`,
  )

  await run(
    npmCommand,
    ['install', '--ignore-scripts', '--legacy-peer-deps', '--no-package-lock'],
    consumerDirectory,
  )
  await run(process.execPath, ['smoke.mjs'], consumerDirectory)
  await run(process.execPath, ['smoke.cjs'], consumerDirectory)
  await writeFile(
    join(consumerDirectory, 'packed-next.cjs'),
    await readFile(
      join(workspaceRoot, 'scripts/fixtures/packed-next.cjs'),
      'utf8',
    ),
  )
  await run(process.execPath, ['packed-next.cjs'], consumerDirectory)
  await run(
    join(consumerDirectory, 'node_modules', '.bin', 'tsc'),
    ['--noEmit', '-p', 'tsconfig.json'],
    consumerDirectory,
  )

  const installedManifest = JSON.parse(
    await readFile(
      join(consumerDirectory, 'node_modules', 'react-fathom', 'package.json'),
      'utf8',
    ),
  )
  // Confirm the shared runtime also connects on React 18, without requiring
  // optional framework peers for ordinary root-only consumers.
  await run(
    npmCommand,
    [
      'install',
      '--ignore-scripts',
      '--legacy-peer-deps',
      '--no-package-lock',
      'react@18.3.1',
      'react-dom@18.3.1',
    ],
    consumerDirectory,
  )
  await run(process.execPath, ['smoke.mjs'], consumerDirectory)
  await run(process.execPath, ['smoke.cjs'], consumerDirectory)
  await run(process.execPath, ['packed-next.cjs'], consumerDirectory)
  console.log(`Verified packed react-fathom@${installedManifest.version}.`)
} finally {
  await rm(tempRoot, { recursive: true, force: true })
}
