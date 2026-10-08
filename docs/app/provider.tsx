'use client'

import { Suspense, useEffect, useMemo, type ReactNode } from 'react'

import { LuCheck, LuCopy } from 'react-icons/lu'

import {
  createDocsAnalytics,
  getAnalyticsUrl,
  getFathomConfig,
} from '@/lib/analytics'
import { FathomProvider, useFathom, type FathomClient } from '@/lib/fathom'
import { NextFathomTrackViewApp } from '@/lib/fathom-next'
import { DocsPreferences, DocsProvider } from '@chakra-docs/chakra'
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

// The interactive event stream still works without sending demo traffic.
const previewClient: FathomClient = {
  blockTrackingForMe: () => {},
  enableTrackingForMe: () => {},
  isTrackingEnabled: () => false,
  load: () => {},
  setSite: () => {},
  trackPageview: () => {},
  trackEvent: () => {},
  trackGoal: () => {},
}

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
  const analytics = useMemo(() => createDocsAnalytics(trackEvent), [trackEvent])
  useEffect(() => analytics.cancelPendingSearchTracking, [analytics])
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
  const config = useMemo(
    () =>
      getFathomConfig(
        process.env.NEXT_PUBLIC_FATHOM_SITE_ID,
        process.env.NEXT_PUBLIC_FATHOM_CUSTOM_DOMAIN,
      ),
    [],
  )

  return (
    <ChakraProvider value={siteSystem}>
      <ColorModeProvider>
        <FathomProvider
          {...config}
          client={config ? undefined : previewClient}
          debug={{ enabled: true, console: false }}
        >
          <Suspense fallback={null}>
            <NextFathomTrackViewApp transformUrl={getAnalyticsUrl} />
          </Suspense>
          <PostkitProvider
            system={siteSystem}
            codeBlockAdapter={codeBlockAdapter}
          >
            <DocsIntegrationProvider siteUrl={siteUrl}>
              {children}
            </DocsIntegrationProvider>
            <EventStream forceShow />
          </PostkitProvider>
        </FathomProvider>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
