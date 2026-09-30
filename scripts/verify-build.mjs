import { readdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const packageJson = JSON.parse(
  await readFile(resolve(workspaceRoot, 'package.json'), 'utf8'),
)

const failures = []

for (const [subpath, conditions] of Object.entries(packageJson.exports)) {
  for (const condition of ['import', 'require']) {
    const target = conditions[condition]
    if (!target) {
      failures.push(`${subpath} has no ${condition} export`)
      continue
    }

    try {
      const contents = await readFile(resolve(workspaceRoot, target), 'utf8')
      if (!contents.startsWith("'use client';")) {
        failures.push(`${subpath} ${condition} export is missing 'use client'`)
      }
    } catch (error) {
      failures.push(
        `${subpath} ${condition} export is unreadable: ${error.message}`,
      )
    }
  }
}

for (const target of ['dist/es/native/index.js', 'dist/cjs/native/index.cjs']) {
  const contents = await readFile(resolve(workspaceRoot, target), 'utf8')
  if (!contents.includes('react-native-webview')) {
    failures.push(
      `${target} does not retain react-native-webview as an external`,
    )
  }
}

for (const target of ['dist/es/next/index.js', 'dist/cjs/next/index.cjs']) {
  const contents = await readFile(resolve(workspaceRoot, target), 'utf8')

  if (contents.includes('RouterContext') || contents.includes('next/dist/')) {
    failures.push(`${target} contains bundled Next.js router internals`)
  }

  for (const nextImport of ['next/compat/router', 'next/navigation']) {
    if (!contents.includes(nextImport)) {
      failures.push(`${target} does not retain ${nextImport} as an external`)
    }
  }
}

for (const [format, extension] of [
  ['es', '.js'],
  ['cjs', '.cjs'],
]) {
  const chunkDirectory = resolve(workspaceRoot, `dist/${format}/_chunks`)
  const chunkFiles = await readdir(chunkDirectory)
  const contextChunks = []

  for (const chunkFile of chunkFiles.filter((file) =>
    file.endsWith(extension),
  )) {
    const contents = await readFile(resolve(chunkDirectory, chunkFile), 'utf8')
    if (contents.includes('createContext(defaultContextValue)')) {
      contextChunks.push(chunkFile)
    }
  }

  if (contextChunks.length !== 1) {
    failures.push(
      `dist/${format} contains ${contextChunks.length} Fathom context runtimes instead of one`,
    )
    continue
  }

  const [contextChunk] = contextChunks
  for (const entrypoint of [
    `dist/${format}/index${extension}`,
    `dist/${format}/next/index${extension}`,
  ]) {
    const contents = await readFile(resolve(workspaceRoot, entrypoint), 'utf8')
    if (!contents.includes(contextChunk)) {
      failures.push(`${entrypoint} does not consume the shared context runtime`)
    }
  }
}

if (failures.length > 0) {
  throw new Error(`Build verification failed:\n- ${failures.join('\n- ')}`)
}

console.log(
  `Verified ${Object.keys(packageJson.exports).length} package entrypoints.`,
)
