import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'

import { describe, expect, it } from 'vitest'

import { getDocsNav, type NavItem } from './docs'
import { getDocsEditUrl } from './docs-links'

const contentDir = resolve('docs/content')
function files(directory: string, extensions: RegExp): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (['node_modules', '.yalc', '.next', 'out'].includes(entry.name))
      return []
    const path = join(directory, entry.name)
    return entry.isDirectory()
      ? files(path, extensions)
      : extensions.test(path)
        ? [path]
        : []
  })
}
const contentFiles = files(contentDir, /\.mdx?$/)
const routes = new Set([
  '/',
  '/withoss',
  ...contentFiles.map(
    (file) =>
      '/docs' +
      (
        '/' +
        relative(contentDir, file)
          .replace(/\.mdx?$/, '')
          .replace(/(^|\/)index$/, '')
      ).replace(/\/$/, ''),
  ),
])

describe('documentation links', () => {
  it('maps every edit action to an existing source, including directory indexes', () => {
    for (const file of contentFiles) {
      const source = relative(contentDir, file)
      const url = getDocsEditUrl({ path: source })!
      expect(url.endsWith('/' + source)).toBe(true)
      expect(
        existsSync(
          join(contentDir, decodeURIComponent(url.split('/docs/content/')[1])),
        ),
      ).toBe(true)
    }
    expect(getDocsEditUrl({ path: '../secret.mdx' })).toBeUndefined()
  })

  it('keeps README and site content links on existing routes', () => {
    const sources = [
      'README.md',
      ...contentFiles,
      ...files(resolve('docs/components'), /\.tsx$/),
      ...files(resolve('docs/app'), /\.tsx$/),
    ]
    for (const file of sources) {
      const source = readFileSync(file, 'utf8')
      let fence = ''
      const text = /\.mdx?$/.test(file)
        ? source
            .split('\n')
            .filter((line) => {
              const marker = line.trim().match(/^(`{3,}|~{3,})/)
              if (marker) {
                if (!fence) fence = marker[1]
                else if (
                  marker[1][0] === fence[0] &&
                  marker[1].length >= fence.length
                )
                  fence = ''
                return false
              }
              return !fence
            })
            .join('\n')
        : source
      const links = text.matchAll(
        /(?:https:\/\/react-fathom\.com(?=\/)|href[:=]\s*['"]|\]\()(\/[^\s'")\]}<>]+)/g,
      )
      for (const [, href] of links) {
        const route = href.split(/[?#]/)[0].replace(/\/$/, '') || '/'
        expect(routes.has(route), `${file}: ${href}`).toBe(true)
      }
    }
  })

  it('keeps every sidebar route reachable', () => {
    function check(items: NavItem[]) {
      for (const item of items) {
        if (item.href) expect(routes.has(item.href), item.href).toBe(true)
        if (item.children) check(item.children)
      }
    }
    check(getDocsNav())
  })
})
