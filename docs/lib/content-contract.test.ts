import { readdirSync, readFileSync } from 'node:fs'
import { join, resolve } from 'node:path'

import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'

import { getDocsMarkdownHeadings } from '@chakra-docs/core'

const contentDir = resolve('docs/content')

function contentFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const path = join(directory, entry.name)
      if (entry.isDirectory()) return contentFiles(path)
      return /\.mdx?$/.test(entry.name) ? [path] : []
    })
    .sort()
}

function normalize(text: string): string {
  return text
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, ' ')
    .trim()
}

describe('documentation article content contract', () => {
  for (const path of contentFiles(contentDir)) {
    it(`${path.slice(contentDir.length)} keeps the title and summary in the page header`, () => {
      const { data, content } = matter(readFileSync(path, 'utf8'))
      expect(typeof data.title).toBe('string')
      expect(data.title.trim()).not.toBe('')
      expect(typeof data.description).toBe('string')

      const headings = getDocsMarkdownHeadings(content)
      // The scanner ignores heading-like text inside fenced code samples.
      expect(headings.some((heading) => heading.level === 1)).toBe(false)
      for (const heading of headings.slice(0, 2)) {
        expect([
          normalize(data.title),
          normalize(`${data.title} Integration`),
        ]).not.toContain(normalize(heading.title))
      }

      const opening = content.trim().split(/\n\s*\n/)[0]
      expect(normalize(opening)).not.toBe(normalize(data.description))
    })
  }
})
