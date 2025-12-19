import React, { useCallback, useEffect, useRef, useMemo } from 'react'

import * as Fathom from 'fathom-client'
import type { PageViewOptions } from 'fathom-client'
import { useRouter } from 'next/router'

import { FathomProvider } from '../FathomProvider'
import type { NextFathomProviderProps } from './types'
import { useFathom } from '../hooks/useFathom'

const NextFathomProviderPages: React.FC<NextFathomProviderProps> = ({
  children,
  client: providedClient,
  clientOptions,
  disableAutoTrack = false,
  siteId,
  trackDefaultOptions,
  defaultPageviewOptions: providedDefaultPageviewOptions,
}) => {
  const router = useRouter()
  const hasTrackedInitialPageview = useRef(false)
  const parentContext = useFathom()

  // Use provided client or fall back to parent client or default Fathom
  const client = useMemo(
    () => providedClient ?? parentContext.client ?? Fathom,
    [providedClient, parentContext.client],
  )

  // Support both deprecated trackDefaultOptions and new defaultPageviewOptions
  // Priority: providedDefaultPageviewOptions > trackDefaultOptions > parent defaultPageviewOptions
  const defaultPageviewOptions = useMemo(
    () =>
      providedDefaultPageviewOptions ??
      trackDefaultOptions ??
      parentContext.defaultPageviewOptions,
    [
      providedDefaultPageviewOptions,
      trackDefaultOptions,
      parentContext.defaultPageviewOptions,
    ],
  )

  const trackPageview = useCallback(
    (options?: PageViewOptions) => {
      if (siteId !== undefined && client !== undefined) {
        client.trackPageview({
          ...defaultPageviewOptions,
          ...options,
        })
      }
    },
    [client, siteId, defaultPageviewOptions],
  )

  // Initialize Fathom on mount
  useEffect(() => {
    if (siteId !== undefined && client !== undefined) {
      client.load(siteId, clientOptions)
    }
  }, [client, clientOptions, siteId])

  // Track pageviews on route changes
  useEffect(() => {
    if (siteId === undefined || disableAutoTrack) {
      return
    }

    const handleRouteChangeComplete = (url: string): void => {
      trackPageview({
        url: window.location.origin + url,
      })
    }

    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [router.events, siteId, disableAutoTrack, trackPageview])

  // Track initial pageview (routeChangeComplete doesn't fire on initial load)
  useEffect(() => {
    if (
      siteId !== undefined &&
      !disableAutoTrack &&
      router.isReady &&
      !hasTrackedInitialPageview.current
    ) {
      hasTrackedInitialPageview.current = true
      trackPageview({
        url: window.location.href,
      })
    }
  }, [siteId, disableAutoTrack, router.isReady, trackPageview])

  return (
    <FathomProvider
      client={client}
      clientOptions={clientOptions}
      siteId={siteId}
      defaultPageviewOptions={defaultPageviewOptions}
    >
      {children}
    </FathomProvider>
  )
}

NextFathomProviderPages.displayName = 'NextFathomProviderPages'

export default NextFathomProviderPages
export { NextFathomProviderPages }
