import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import matter from 'gray-matter'
import { describe, expect, it } from 'vitest'

import { DOCS_ROOT, getDocsNav } from './docs'

describe('documentation navigation labels', () => {
  it('uses the index metadata label without changing the page title or route', () => {
    expect(getDocsNav()[0]).toEqual({
      title: 'Introduction',
      href: '/docs',
    })
    const { data } = matter(
      readFileSync(join(DOCS_ROOT, 'content/index.mdx'), 'utf8'),
    )
    expect(data.title).toBe('react-fathom')
  })
})
