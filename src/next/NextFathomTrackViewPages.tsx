import React, { useEffect, useRef } from 'react'

import { useRouter } from 'next/compat/router'

import { useFathom } from '../hooks/useFathom.js'
import { buildTrackingUrl } from '../utils.js'

export interface NextFathomTrackViewPagesProps {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
  /**
   * Transform the URL before tracking.
   * Useful for stripping sensitive parameters or normalizing URLs.
   *
   * @example
   * ```tsx
   * <NextFathomTrackViewPages
   *   transformUrl={(url) => {
   *     const u = new URL(url)
   *     u.searchParams.delete('token')
   *     return u.toString()
   *   }}
   * />
   * ```
   */
  transformUrl?: (url: string) => string | null | undefined
}

/**
 * Component that tracks pageviews for Next.js Pages Router.
 * Must be used within a FathomProvider.
 *
 * @example
 * ```tsx
 * // pages/_app.tsx
 * import { FathomProvider } from 'react-fathom'
 * import { NextFathomTrackViewPages } from 'react-fathom/next'
 *
 * function MyApp({ Component, pageProps }) {
 *   return (
 *     <FathomProvider siteId="YOUR_SITE_ID">
 *       <NextFathomTrackViewPages />
 *       <Component {...pageProps} />
 *     </FathomProvider>
 *   )
 * }
 * ```
 */
export const NextFathomTrackViewPages: React.FC<
  NextFathomTrackViewPagesProps
> = ({ disableAutoTrack = false, transformUrl }) => {
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()

  // Use next/compat/router which doesn't throw when router is not mounted
  // This allows the component to work in various contexts without errors
  const router = useRouter()
  const routerEvents = router?.events

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
      return
    }

    // Check if router is available and has events
    if (!routerEvents) {
      // Router not properly initialized - silently return
      return
    }

    const handleRouteChangeComplete = (path: string): void => {
      const url = buildTrackingUrl({ pathname: path, transformUrl })
      if (url) {
        trackPageview({ url })
      }
    }

    routerEvents.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      routerEvents.off('routeChangeComplete', handleRouteChangeComplete)
    }
  }, [trackPageview, client, disableAutoTrack, transformUrl, routerEvents])

  // Track initial pageview (routeChangeComplete doesn't fire on initial load)
  useEffect(() => {
    if (
      !trackPageview ||
      !client ||
      disableAutoTrack ||
      !router ||
      !router.isReady ||
      hasTrackedInitialPageview.current
    ) {
      return
    }

    hasTrackedInitialPageview.current = true
    const url = buildTrackingUrl({
      pathname: window.location.pathname,
      search: window.location.search,
      transformUrl,
    })
    if (url) {
      trackPageview({ url })
    }
  }, [trackPageview, client, disableAutoTrack, router, transformUrl])

  // This component doesn't render anything
  return null
}

NextFathomTrackViewPages.displayName = 'NextFathomTrackViewPages'
