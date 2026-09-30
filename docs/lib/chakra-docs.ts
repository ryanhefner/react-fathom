import type { DocsManifest, DocsNavItem } from '@chakra-docs/core'
import {
  buildFilesystemManifest,
  defineDocsDiscoveryConfig,
} from '@chakra-docs/source-filesystem'

import { DOCS_ROOT, getDocsNav, type NavItem } from './docs'

const COLLECTION_ID = 'docs'

const discoveryConfig = defineDocsDiscoveryConfig({
  rootDir: DOCS_ROOT,
  collections: [
    {
      id: COLLECTION_ID,
      name: 'Documentation',
      contentPath: 'content',
      basePath: '/docs',
      include: ['**/*.md', '**/*.mdx'],
      exclude: ['**/_*.md', '**/_*.mdx'],
    },
  ],
})

let manifestPromise: Promise<DocsManifest> | undefined

function toDocsNav(items: NavItem[], parentId = 'docs'): DocsNavItem[] {
  return items.map((item, index) => {
    const id = item.href ?? `${parentId}:${index}`

    return {
      id,
      title: item.title,
      href: item.href,
      slug: item.href
        ? item.href
            .replace(/^\/docs\/?/, '')
            .split('/')
            .filter(Boolean)
        : undefined,
      children: item.children ? toDocsNav(item.children, id) : undefined,
    }
  })
}

async function buildManifest(): Promise<DocsManifest> {
  const manifest = await buildFilesystemManifest({ config: discoveryConfig })
  const nav = toDocsNav(getDocsNav())
  const collection = manifest.byCollection[COLLECTION_ID]

  if (collection) {
    collection.nav = nav
  }

  manifest.nav = nav
  return manifest
}

export function getDocsManifest(): Promise<DocsManifest> {
  manifestPromise ??= buildManifest()
  return manifestPromise
}
