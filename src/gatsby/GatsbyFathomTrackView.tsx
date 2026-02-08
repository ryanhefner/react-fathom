import React, { useEffect, useRef } from 'react'

import { globalHistory } from '@reach/router'

import { useFathom } from '../hooks/useFathom'

export interface GatsbyFathomTrackViewProps {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean

  /**
   * Include search/query parameters in the tracked URL
   * @default true
   */
  includeSearchParams?: boolean

  /**
   * Include hash fragment in the tracked URL
   * @default false
   */
  includeHash?: boolean

  /**
   * Custom function to transform the URL before tracking.
   * Useful for removing sensitive data or normalizing URLs.
   * @param url The URL that would be tracked
   * @returns The transformed URL to track, or null/undefined to skip tracking
   */
  transformUrl?: (url: string) => string | null | undefined
}

/**
 * Component that tracks pageviews for Gatsby applications.
 * Uses @reach/router's globalHistory to listen for route changes.
 * Must be used within a FathomProvider.
 *
 * @example
 * ```tsx
 * // src/components/Layout.tsx
 * import { FathomProvider } from 'react-fathom'
 * import { GatsbyFathomTrackView } from 'react-fathom/gatsby'
 *
 * export default function Layout({ children }) {
 *   return (
 *     <FathomProvider siteId="YOUR_SITE_ID">
 *       <GatsbyFathomTrackView />
 *       {children}
 *     </FathomProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With URL transformation
 * <GatsbyFathomTrackView
 *   transformUrl={(url) => {
 *     // Strip query params for cleaner analytics
 *     return url.split('?')[0]
 *   }}
 * />
 * ```
 */
export const GatsbyFathomTrackView: React.FC<GatsbyFathomTrackViewProps> = ({
  disableAutoTrack = false,
  includeSearchParams = true,
  includeHash = false,
  transformUrl,
}) => {
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()

  // Build URL from location
  const buildUrl = (location: { pathname: string; search: string; hash: string }) => {
    if (typeof window === 'undefined') return null

    let url = window.location.origin + location.pathname

    if (includeSearchParams && location.search) {
      url += location.search
    }

    if (includeHash && location.hash) {
      url += location.hash
    }

    if (transformUrl) {
      const transformed = transformUrl(url)
      if (transformed === null || transformed === undefined) {
        return null
      }
      url = transformed
    }

    return url
  }

  // Track initial pageview
  useEffect(() => {
    if (
      !trackPageview ||
      !client ||
      disableAutoTrack ||
      hasTrackedInitialPageview.current ||
      typeof window === 'undefined'
    ) {
      return
    }

    hasTrackedInitialPageview.current = true
    const url = buildUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      hash: window.location.hash,
    })
    if (url) {
      trackPageview({ url })
    }
  }, [trackPageview, client, disableAutoTrack])

  // Listen to route changes via globalHistory
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
      return
    }

    const unsubscribe = globalHistory.listen(({ location, action }) => {
      // Only track on PUSH and POP actions (actual navigation)
      if (action === 'PUSH' || action === 'POP') {
        const url = buildUrl(location)
        if (url) {
          trackPageview({ url })
        }
      }
    })

    return () => {
      unsubscribe()
    }
  }, [trackPageview, client, disableAutoTrack, includeSearchParams, includeHash, transformUrl])

  return null
}

GatsbyFathomTrackView.displayName = 'GatsbyFathomTrackView'
