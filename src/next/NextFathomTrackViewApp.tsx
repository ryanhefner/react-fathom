'use client'

import React, { useEffect, useRef } from 'react'

import { usePathname, useSearchParams } from 'next/navigation.js'

import { useFathom } from '../hooks/useFathom'
import { buildTrackingUrl } from './utils'

export interface NextFathomTrackViewAppProps {
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
   * <NextFathomTrackViewApp
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
  transformUrl,
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
    const path =
      pathname +
      (searchString !== undefined && searchString !== ''
        ? `?${searchString}`
        : '')

    const url = buildTrackingUrl(path, transformUrl)

    // Track initial pageview only once
    if (!hasTrackedInitialPageview.current) {
      hasTrackedInitialPageview.current = true
    }
    trackPageview({ url })
  }, [pathname, searchParams, trackPageview, client, disableAutoTrack, transformUrl])

  // This component doesn't render anything
  return null
}

NextFathomTrackViewApp.displayName = 'NextFathomTrackViewApp'
