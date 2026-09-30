'use client'

import { useRouter } from 'next/navigation'

import { DocsSearch } from '@chakra-docs/chakra'
import type { DocsSearchRecord } from '@chakra-docs/core'

interface DocsSiteSearchProps {
  records: readonly DocsSearchRecord[]
}

export function DocsSiteSearch({ records }: DocsSiteSearchProps) {
  const router = useRouter()

  return (
    <DocsSearch
      analyticsDebounceMs={300}
      onNavigate={(href) => router.push(href)}
      popularLimit={6}
      prefetch="intent"
      records={records}
    />
  )
}
