'use client'

import { useMemo, type ReactNode } from 'react'

import { LuCheck, LuCopy } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import { NextFathomProviderApp } from '@/lib/fathom-next'
import {
  DocsPreferences,
  DocsProvider,
  type DocsAnalyticsCallbacks,
} from '@chakra-docs/chakra'
import { NextLink } from '@chakra-docs/next/link'
import { createChakraDocsShikiAdapter } from '@chakra-docs/shiki'
import { ChakraProvider } from '@chakra-ui/react'
import { PostkitProvider } from '@postkit/react'

import { ColorModeProvider } from './color-mode'
import { siteSystem } from './system'
import { EventStream } from '../components/docs/EventStream'

const codeBlockAdapter = createChakraDocsShikiAdapter({
  themes: { light: 'github-dark', dark: 'github-dark' },
})

const preferences = [
  {
    id: 'package-manager',
    label: 'Package manager',
    options: ['npm', 'yarn', 'pnpm', 'bun'],
    defaultValue: 'npm',
  },
]

function DocsIntegrationProvider({
  children,
  siteUrl,
}: {
  children: ReactNode
  siteUrl: string
}) {
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
      onPreferenceChange: ({ id, value, source }) => {
        if (source !== 'storage') trackEvent(`docs-${id}-select-${value}`)
      },
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
      codeBlock: {
        adapter: codeBlockAdapter,
        copyIcon: <LuCopy aria-hidden="true" />,
        copiedIcon: <LuCheck aria-hidden="true" />,
      },
      layout: {
        stickyTop: siteSystem.token.var('spacing.docsStickyTop'),
        scrollMarginTop: siteSystem.token.var('spacing.docsScrollMargin'),
      },
      linkComponent: NextLink,
      siteUrl,
      title: 'react-fathom',
    }),
    [analytics, siteUrl],
  )

  return (
    <DocsProvider config={config}>
      <DocsPreferences.Root definitions={preferences} storage="local">
        {children}
      </DocsPreferences.Root>
    </DocsProvider>
  )
}

export function Provider({
  children,
  siteUrl,
}: {
  children: React.ReactNode
  siteUrl: string
}) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <ChakraProvider value={siteSystem}>
      <ColorModeProvider>
        <NextFathomProviderApp
          siteId={siteId}
          debug={{ enabled: true, console: false }}
        >
          <PostkitProvider
            system={siteSystem}
            codeBlockAdapter={codeBlockAdapter}
          >
            <DocsIntegrationProvider siteUrl={siteUrl}>
              {children}
            </DocsIntegrationProvider>
            <EventStream forceShow />
          </PostkitProvider>
        </NextFathomProviderApp>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
