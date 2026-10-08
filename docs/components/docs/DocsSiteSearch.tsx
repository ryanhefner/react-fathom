'use client'

import { useMemo } from 'react'

import { useRouter } from 'next/navigation'

import { DocsSearch } from '@chakra-docs/chakra'
import type { DocsSearchRecord } from '@chakra-docs/core'

import { getRecommendedSearchResults } from '../../lib/search-recommendations'

interface DocsSiteSearchProps {
  records: readonly DocsSearchRecord[]
}

export function DocsSiteSearch({ records }: DocsSiteSearchProps) {
  const router = useRouter()
  const recommendedSearchResults = useMemo(
    () => getRecommendedSearchResults(records),
    [records],
  )

  return (
    <DocsSearch
      analyticsDebounceMs={300}
      defaultResults={recommendedSearchResults}
      defaultResultsLabel="Recommended"
      onNavigate={(href) => router.push(href)}
      popularLimit={6}
      records={records}
    />
  )
}
