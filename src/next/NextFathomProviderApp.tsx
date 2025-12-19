import React, { useCallback, useEffect, useRef, useMemo } from 'react'

import * as Fathom from 'fathom-client'
import type { PageViewOptions } from 'fathom-client'
import { usePathname, useSearchParams } from 'next/navigation'

import { FathomProvider } from '../FathomProvider'
import type { NextFathomProviderProps } from './types'
import { useFathom } from '../hooks/useFathom'

const NextFathomProviderApp: React.FC<NextFathomProviderProps> = ({
  children,
  client: providedClient,
  clientOptions,
  disableAutoTrack = false,
  siteId,
  trackDefaultOptions,
  defaultPageviewOptions: providedDefaultPageviewOptions,
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
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

    const searchString = searchParams?.toString()
    const url =
      pathname +
      (searchString !== undefined && searchString !== ''
        ? `?${searchString}`
        : '')

    // Track initial pageview only once
    if (!hasTrackedInitialPageview.current) {
      hasTrackedInitialPageview.current = true
      trackPageview({
        url: window.location.origin + url,
      })
    } else {
      // Track subsequent route changes
      trackPageview({
        url: window.location.origin + url,
      })
    }
  }, [pathname, searchParams, siteId, disableAutoTrack, trackPageview])

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

NextFathomProviderApp.displayName = 'NextFathomProviderApp'

export default NextFathomProviderApp
export { NextFathomProviderApp }
