'use client'

import React from 'react'
import type { ComponentType } from 'react'

import { FathomProvider } from '../../FathomProvider'
import type { FathomProviderProps } from '../../types'
import { NextFathomTrackViewApp } from '../NextFathomTrackViewApp'
import type { NextFathomProviderProps } from '../types'

/**
 * Higher-order component that wraps your Next.js App Router app with FathomProvider
 * and automatically tracks pageviews using NextFathomTrackViewApp.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { withAppRouter } from 'react-fathom/next'
 *
 * function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>{children}</body>
 *     </html>
 *   )
 * }
 *
 * export default withAppRouter(RootLayout, {
 *   siteId: 'YOUR_SITE_ID',
 *   clientOptions: {
 *     spa: 'auto',
 *   },
 * })
 * ```
 */
const withAppRouter = <P extends object>(
  Component: ComponentType<P>,
  providerProps?: NextFathomProviderProps,
): ComponentType<P> => {
  const WithAppRouter: React.FC<P> = (props) => {
    // Extract disableAutoTrack for the tracking component
    const { disableAutoTrack, ...fathomProviderProps } = providerProps ?? {}

    return (
      <FathomProvider {...(fathomProviderProps as FathomProviderProps)}>
        <NextFathomTrackViewApp disableAutoTrack={disableAutoTrack} />
        <Component {...props} />
      </FathomProvider>
    )
  }

  WithAppRouter.displayName = `withAppRouter(${Component.displayName || Component.name || 'Component'})`

  return WithAppRouter
}

export { withAppRouter }
