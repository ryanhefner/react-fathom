'use client'

import { useMemo, type ReactNode } from 'react'

import { useFathom } from '@/lib/fathom'
import { NextFathomProviderApp } from '@/lib/fathom-next'
import { DocsProvider, type DocsAnalyticsCallbacks } from '@chakra-docs/chakra'
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
  const analytics = useMemo<DocsAnalyticsCallbacks>(
    () => ({
      onCodeCopy: () => trackEvent('docs-code-copy'),
      onHeadingLinkCopy: () => trackEvent('docs-heading-link-copy'),
      onPackageCommandCopy: ({ manager }) =>
        trackEvent(`docs-package-command-copy-${manager}`),
      onPageAction: ({ action }) => trackEvent(`docs-page-action-${action}`),
      onPageCopy: ({ format }) => trackEvent(`docs-page-copy-${format}`),
      onPageFeedback: ({ value }) => trackEvent(`docs-page-feedback-${value}`),
      onSearch: (query) => {
        if (query) trackEvent('docs-search-query')
      },
      onSearchClose: ({ reason }) => trackEvent(`docs-search-close-${reason}`),
      onSearchError: () => trackEvent('docs-search-error'),
      onSearchOpen: () => trackEvent('docs-search-open'),
      onSearchResults: () => trackEvent('docs-search-results'),
      onSearchResultSelect: (_result, { interaction }) =>
        trackEvent(`docs-search-result-select-${interaction}`),
    }),
    [trackEvent],
  )
  const config = useMemo(
    () => ({
      analytics,
      layout: {
        stickyTop: '5rem',
        scrollMarginTop: '6rem',
      },
      linkComponent: NextLink,
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://react-fathom.com',
      title: 'react-fathom',
    }),
    [analytics],
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
