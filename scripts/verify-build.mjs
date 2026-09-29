import { readFile } from 'node:fs/promises'
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

if (failures.length > 0) {
  throw new Error(`Build verification failed:\n- ${failures.join('\n- ')}`)
}

console.log(
  `Verified ${Object.keys(packageJson.exports).length} package entrypoints.`,
)
