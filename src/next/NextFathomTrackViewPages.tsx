import React, { useEffect, useRef } from 'react'

import { useRouter } from 'next/compat/router.js'

import { useFathom } from '../hooks/useFathom'
import { buildTrackingUrl } from './utils'

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
  transformUrl?: (url: string) => string
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

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
      return
    }

    // Check if router is available and has events
    if (!router || typeof router.events === 'undefined' || !router.events) {
      // Router not properly initialized - silently return
      return
    }

    const handleRouteChangeComplete = (path: string): void => {
      const url = buildTrackingUrl(path, transformUrl)
      trackPageview({ url })
    }

    // router.events is stable in Next.js, so we can use it without including router in dependencies
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router?.events?.off('routeChangeComplete', handleRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackPageview, client, disableAutoTrack, transformUrl])

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
    const url = buildTrackingUrl(
      window.location.pathname + window.location.search,
      transformUrl,
    )
    trackPageview({ url })
  }, [trackPageview, client, disableAutoTrack, router, transformUrl])

  // This component doesn't render anything
  return null
}

NextFathomTrackViewPages.displayName = 'NextFathomTrackViewPages'
