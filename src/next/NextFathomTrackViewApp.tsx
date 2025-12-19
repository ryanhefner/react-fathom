import React, { useEffect, useRef } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import { useFathom } from '../hooks/useFathom'

export interface NextFathomTrackViewAppProps {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
}

/**
 * Component that tracks pageviews for Next.js App Router.
 * Must be used within a FathomProvider.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { FathomProvider } from 'react-fathom'
 * import { NextFathomTrackViewApp } from 'react-fathom/next'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <FathomProvider siteId="YOUR_SITE_ID">
 *           <NextFathomTrackViewApp />
 *           {children}
 *         </FathomProvider>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export const NextFathomTrackViewApp: React.FC<NextFathomTrackViewAppProps> = ({
  disableAutoTrack = false,
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const hasTrackedInitialPageview = useRef(false)
  const { trackPageview, client } = useFathom()

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack) {
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
  }, [pathname, searchParams, trackPageview, client, disableAutoTrack])

  // This component doesn't render anything
  return null
}

NextFathomTrackViewApp.displayName = 'NextFathomTrackViewApp'
