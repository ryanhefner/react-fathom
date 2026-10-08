import type { DocsSearchRecord } from '@chakra-docs/core'

export type RecommendedSearchResult = Pick<
  DocsSearchRecord,
  'id' | 'collectionId' | 'route' | 'title' | 'description'
> & { kind: 'page' }

const recommendedRoutes = [
  '/docs/getting-started',
  '/docs/react',
  '/docs/nextjs/app-router',
  '/docs/react-native',
  '/docs/api/hooks',
  '/docs/troubleshooting',
] as const

/** Editorial opening results, independent of search ranking or popularity. */
export function getRecommendedSearchResults(
  records: readonly DocsSearchRecord[],
): RecommendedSearchResult[] {
  return recommendedRoutes.flatMap((route) => {
    const record = records.find(
      (item) => item.kind !== 'heading' && item.route === route,
    )
    if (!record) return []
    return [
      {
        id: record.id,
        kind: 'page' as const,
        collectionId: record.collectionId,
        route: record.route,
        title: record.title,
        description: record.description,
      },
    ]
  })
}
