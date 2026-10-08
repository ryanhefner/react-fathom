import { readdirSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

import ts from 'typescript'
import { describe, expect, it } from 'vitest'

import {
  exampleSystem,
  exampleThemeConfig,
} from '../../examples/shared/src/theme'

const repoRoot = resolve('.') + '/'
// Deliberately exclude the dependency-free library debug UI, React Native,
// and the plain-HTML Next.js examples: they do not use Chakra.
const chakraSurfaces = [
  'docs/app',
  'docs/components',
  'examples/shared/src',
  'examples/react/src',
  'examples/tanstack-router/src',
  'examples/gatsby/src',
]

function sourceFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name)
    if (entry.isDirectory()) return sourceFiles(path)
    return /\.[jt]sx$/.test(entry.name) ? [path] : []
  })
}

describe('Chakra styling contract', () => {
  it('uses Chakra props and v3 APIs rather than DOM inline styles or legacy props', () => {
    const violations: string[] = []
    const legacyProps = new Set([
      'style',
      'colorScheme',
      'isDisabled',
      'isLoading',
      'isInvalid',
      'isRequired',
      'spacing',
    ])
    for (const surface of chakraSurfaces) {
      for (const path of sourceFiles(resolve(repoRoot, surface))) {
        const source = ts.createSourceFile(
          path,
          readFileSync(path, 'utf8'),
          ts.ScriptTarget.Latest,
          true,
          ts.ScriptKind.TSX,
        )
        const visit = (node: ts.Node) => {
          if (ts.isJsxAttribute(node)) {
            const name = node.name.getText(source)
            const value = node.initializer
            if (
              legacyProps.has(name) ||
              (value &&
                ts.isStringLiteral(value) &&
                value.text.startsWith('container.'))
            ) {
              const { line } = source.getLineAndCharacterOfPosition(
                node.getStart(source),
              )
              violations.push(
                `${path.slice(repoRoot.length)}:${line + 1}: ${name}`,
              )
            }
          }
          ts.forEachChild(node, visit)
        }
        visit(source)
      }
    }
    expect(violations).toEqual([])
  })

  it('keeps the documentation site free of separate CSS stylesheets', () => {
    function stylesheets(directory: string): string[] {
      return readdirSync(directory, { withFileTypes: true }).flatMap(
        (entry) => {
          const path = resolve(directory, entry.name)
          return entry.isDirectory()
            ? stylesheets(path)
            : /\.(css|scss|sass|less)$/.test(entry.name)
              ? [path]
              : []
        },
      )
    }
    expect(
      ['docs/app', 'docs/components'].flatMap((path) =>
        stylesheets(resolve(repoRoot, path)),
      ),
    ).toEqual([])
  })

  it('registers shared example layout and sizing tokens in the provider system', () => {
    expect(
      exampleThemeConfig.theme?.slotRecipes?.exampleLayout?.slots,
    ).toContain('footer')
    expect(exampleSystem.token('sizes.exampleContent')).toBe('40rem')
    expect(
      exampleSystem.css({ maxW: 'exampleIntro', zIndex: 'eventStreamPanel' }),
    ).toEqual({
      maxWidth: exampleSystem.token.var('sizes.exampleIntro'),
      zIndex: exampleSystem.token.var('zIndex.eventStreamPanel'),
    })
  })
})
