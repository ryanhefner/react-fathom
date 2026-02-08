import React, { useCallback, useEffect, useRef } from 'react'

import { useRouterState } from '@tanstack/react-router'

import { useFathom } from '../hooks/useFathom'

export interface TanStackRouterFathomTrackViewProps {
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
 * Component that tracks pageviews for TanStack Router applications.
 * Must be used within a FathomProvider and a TanStack Router context.
 *
 * @example
 * ```tsx
 * import { RouterProvider, createRouter } from '@tanstack/react-router'
 * import { FathomProvider } from 'react-fathom'
 * import { TanStackRouterFathomTrackView } from 'react-fathom/tanstack-router'
 *
 * // In your root route component
 * function RootComponent() {
 *   return (
 *     <FathomProvider siteId="YOUR_SITE_ID">
 *       <TanStackRouterFathomTrackView />
 *       <Outlet />
 *     </FathomProvider>
 *   )
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With URL transformation (strip sensitive params)
 * <TanStackRouterFathomTrackView
 *   transformUrl={(url) => {
 *     const urlObj = new URL(url)
 *     urlObj.searchParams.delete('token')
 *     return urlObj.toString()
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Normalize dynamic route segments
 * <TanStackRouterFathomTrackView
 *   transformUrl={(url) => {
 *     // /users/123 → /users/[id]
 *     return url.replace(/\/users\/\d+/, '/users/[id]')
 *   }}
 * />
 * ```
 */
export const TanStackRouterFathomTrackView: React.FC<
  TanStackRouterFathomTrackViewProps
> = ({
  disableAutoTrack = false,
  includeSearchParams = true,
  includeHash = false,
  transformUrl,
}) => {
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()

  // Get location from TanStack Router state
  const location = useRouterState({ select: (s) => s.location })

  // Build URL from location parts
  const buildUrl = useCallback(() => {
    if (typeof window === 'undefined') return null

    let url = window.location.origin + location.pathname

    // TanStack Router provides search as an object, use the serialized searchStr
    if (includeSearchParams && location.searchStr) {
      url += location.searchStr
    }

    if (includeHash && location.hash) {
      // TanStack Router's hash doesn't include the # prefix
      url += location.hash.startsWith('#') ? location.hash : `#${location.hash}`
    }

    if (transformUrl) {
      const transformed = transformUrl(url)
      if (transformed === null || transformed === undefined) {
        return null
      }
      url = transformed
    }

    return url
  }, [location.pathname, location.searchStr, location.hash, includeSearchParams, includeHash, transformUrl])

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
  }, [location.pathname, location.searchStr, location.hash, trackPageview, client, disableAutoTrack, buildUrl])

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

TanStackRouterFathomTrackView.displayName = 'TanStackRouterFathomTrackView'
