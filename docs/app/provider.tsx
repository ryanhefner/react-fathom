'use client'

import { useMemo, type ReactNode } from 'react'

import { useFathom } from '@/lib/fathom'
import { NextFathomProviderApp } from '@/lib/fathom-next'
import { DocsProvider } from '@chakra-docs/chakra'
import { chakraDocsThemeConfig } from '@chakra-docs/chakra/theme'
import { NextLink } from '@chakra-docs/next/link'
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react'

import { ColorModeProvider } from './color-mode'
import { siteThemeConfig } from './theme'
import { EventStream } from '../components/docs/EventStream'

const docsSystem = createSystem(
  defaultConfig,
  chakraDocsThemeConfig,
  siteThemeConfig,
)

function DocsIntegrationProvider({ children }: { children: ReactNode }) {
  const { trackEvent } = useFathom()
  const config = useMemo(
    () => ({
      analytics: {
        onSearchOpen: () => trackEvent('docs-search-open'),
        onSearchResultSelect: () => trackEvent('docs-search-result-select'),
        onPageCopy: ({ format }: { format: 'markdown' | 'link' }) =>
          trackEvent(`docs-page-copy-${format}`),
        onPageAction: ({ action }: { action: string }) =>
          trackEvent(`docs-page-action-${action}`),
      },
      layout: {
        stickyTop: '5rem',
        scrollMarginTop: '6rem',
      },
      linkComponent: NextLink,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://react-fathom.com',
      title: 'react-fathom',
    }),
    [trackEvent],
  )

  return <DocsProvider config={config}>{children}</DocsProvider>
}

export function Provider({ children }: { children: React.ReactNode }) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <ChakraProvider value={docsSystem}>
      <ColorModeProvider>
        <NextFathomProviderApp
          siteId={siteId}
          debug={{ enabled: true, console: false }}
        >
          <DocsIntegrationProvider>{children}</DocsIntegrationProvider>
          <EventStream forceShow />
        </NextFathomProviderApp>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
