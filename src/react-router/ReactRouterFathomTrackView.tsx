import React, { useCallback, useEffect, useRef } from 'react'

import { useLocation } from 'react-router-dom'

import { useFathom } from '../hooks/useFathom'
import { buildTrackingUrl } from '../utils'

export interface ReactRouterFathomTrackViewProps {
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
 * Component that tracks pageviews for React Router applications.
 * Compatible with React Router v6+ and Remix.
 * Must be used within a FathomProvider and a React Router context.
 *
 * @example
 * ```tsx
 * // App.tsx (React Router)
 * import { BrowserRouter } from 'react-router-dom'
 * import { FathomProvider } from 'react-fathom'
 * import { ReactRouterFathomTrackView } from 'react-fathom/react-router'
 *
 * function App() {
 *   return (
 *     <BrowserRouter>
 *       <FathomProvider siteId="YOUR_SITE_ID">
 *         <ReactRouterFathomTrackView />
 *         <Routes>...</Routes>
 *       </FathomProvider>
 *     </BrowserRouter>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // root.tsx (Remix)
 * import { FathomProvider } from 'react-fathom'
 * import { ReactRouterFathomTrackView } from 'react-fathom/react-router'
 *
 * export default function App() {
 *   return (
 *     <FathomProvider siteId="YOUR_SITE_ID">
 *       <ReactRouterFathomTrackView />
 *       <Outlet />
 *     </FathomProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With URL transformation (strip sensitive params)
 * <ReactRouterFathomTrackView
 *   transformUrl={(url) => {
 *     const urlObj = new URL(url)
 *     urlObj.searchParams.delete('token')
 *     return urlObj.toString()
 *   }}
 * />
 * ```
 */
export const ReactRouterFathomTrackView: React.FC<
  ReactRouterFathomTrackViewProps
> = ({
  disableAutoTrack = false,
  includeSearchParams = true,
  includeHash = false,
  transformUrl,
}) => {
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()
  const location = useLocation()

  // Build URL from location parts
  const buildUrl = useCallback(() => {
    return buildTrackingUrl({
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      includeSearchParams,
      includeHash,
      transformUrl,
    })
  }, [location.pathname, location.search, location.hash, includeSearchParams, includeHash, transformUrl])

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
      return
    }

    // Skip initial render - handled separately
    if (!hasTrackedInitialPageview.current) {
      return
    }

    const url = buildUrl()
    if (url) {
      trackPageview({ url })
    }
  }, [location.pathname, location.search, location.hash, trackPageview, client, disableAutoTrack, buildUrl])

  // Track initial pageview
  useEffect(() => {
    if (
      !trackPageview ||
      !client ||
      disableAutoTrack ||
      hasTrackedInitialPageview.current
    ) {
      return
    }

    hasTrackedInitialPageview.current = true
    const url = buildUrl()
    if (url) {
      trackPageview({ url })
    }
  }, [trackPageview, client, disableAutoTrack, buildUrl])

  // This component doesn't render anything
  return null
}

ReactRouterFathomTrackView.displayName = 'ReactRouterFathomTrackView'
