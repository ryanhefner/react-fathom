'use client'

import React, { useEffect, useRef } from 'react'

import { usePathname, useSearchParams } from 'next/navigation'

import { useFathom } from '../hooks/useFathom.js'
import type { FathomClient } from '../types.js'
import { buildTrackingUrl } from '../utils.js'

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
  transformUrl?: (url: string) => string | null | undefined
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
  const lastNavigation = useRef<{ key: string; client: FathomClient } | null>(
    null,
  )
  const { trackPageview, client } = useFathom()

  // Track pageviews on route changes
  useEffect(() => {
    if (!trackPageview || !client || disableAutoTrack || !pathname) {
      return
    }

    const searchString = searchParams?.toString()
    const key = JSON.stringify([pathname, searchString ?? ''])
    if (
      lastNavigation.current?.key === key &&
      lastNavigation.current.client === client
    )
      return
    // Remember the navigation, not every URL ever visited. Returning to an
    // earlier route counts again, but effect replay and callback changes do not.
    // Remember skipped URLs too so returning from a suppressed route counts.
    lastNavigation.current = { key, client }
    const url = buildTrackingUrl({
      pathname,
      search: searchString,
      transformUrl,
    })

    if (url) {
      trackPageview({ url })
    }
  }, [
    pathname,
    searchParams,
    trackPageview,
    client,
    disableAutoTrack,
    transformUrl,
  ])

  // This component doesn't render anything
  return null
}

NextFathomTrackViewApp.displayName = 'NextFathomTrackViewApp'
