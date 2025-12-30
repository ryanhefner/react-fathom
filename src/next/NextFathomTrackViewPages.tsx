'use client'

import React, { useEffect, useRef } from 'react'

import { useRouter } from 'next/router.js'

import { useFathom } from '../hooks/useFathom'

export interface NextFathomTrackViewPagesProps {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
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

// Client-only wrapper to prevent SSR execution
const ClientOnlyWrapper: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  // Don't render during SSR - check window directly
  if (typeof window === 'undefined') {
    return null
  }

  return <>{children}</>
}

// Internal component that uses the router
// This component only renders client-side due to ClientOnlyWrapper
const NextFathomTrackViewPagesInternal: React.FC<
  NextFathomTrackViewPagesProps
> = ({ disableAutoTrack = false }) => {
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()

  // Always call useRouter unconditionally
  // This is safe because ClientOnlyWrapper prevents this component from rendering during SSR
  const router = useRouter()

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
      return
    }

    // Check if router is available and has events
    if (!router || typeof router.events === 'undefined' || !router.events) {
      // Silently return - this component should only be used in Pages Router
      return
    }

    const handleRouteChangeComplete = (url: string): void => {
      trackPageview({
        url: window.location.origin + url,
      })
    }

    // router.events is stable in Next.js, so we can use it without including router in dependencies
    router.events.on('routeChangeComplete', handleRouteChangeComplete)

    return () => {
      router?.events?.off('routeChangeComplete', handleRouteChangeComplete)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trackPageview, client, disableAutoTrack])

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
    trackPageview({
      url: window.location.href,
    })
  }, [trackPageview, client, disableAutoTrack, router])

  // This component doesn't render anything
  return null
}

// Export component wrapped in client-only wrapper to prevent SSR errors
export const NextFathomTrackViewPages: React.FC<
  NextFathomTrackViewPagesProps
> = (props) => {
  return (
    <ClientOnlyWrapper>
      <NextFathomTrackViewPagesInternal {...props} />
    </ClientOnlyWrapper>
  )
}

NextFathomTrackViewPages.displayName = 'NextFathomTrackViewPages'
