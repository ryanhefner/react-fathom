import type { DocsPage } from '@chakra-docs/core'

export function getDocsEditUrl(
  page: Pick<DocsPage, 'path'>,
): string | undefined {
  // The manifest preserves the actual source file, including directory indexes.
  const segments = page.path.split('/')
  if (
    !/\.mdx?$/.test(page.path) ||
    segments.some(
      (segment) =>
        !segment ||
        segment === '.' ||
        segment === '..' ||
        segment.includes('\\'),
    )
  )
    return undefined
  return `https://github.com/ryanhefner/react-fathom/edit/main/docs/content/${segments.map(encodeURIComponent).join('/')}`
}
