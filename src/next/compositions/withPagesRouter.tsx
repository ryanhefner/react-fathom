'use client'

import React from 'react'
import type { ComponentType } from 'react'

import { FathomProvider } from '../../FathomProvider'
import type { FathomProviderProps } from '../../types'
import { NextFathomTrackViewPages } from '../NextFathomTrackViewPages'
import type { NextFathomProviderProps } from '../types'

/**
 * Higher-order component that wraps your Next.js Pages Router app with FathomProvider
 * and automatically tracks pageviews using NextFathomTrackViewPages.
 *
 * @example
 * ```tsx
 * // pages/_app.tsx
 * import { withPagesRouter } from 'react-fathom/next'
 *
 * function MyApp({ Component, pageProps }) {
 *   return <Component {...pageProps} />
 * }
 *
 * export default withPagesRouter(MyApp, {
 *   siteId: 'YOUR_SITE_ID',
 *   clientOptions: {
 *     spa: 'auto',
 *   },
 * })
 * ```
 */
const withPagesRouter = <P extends object>(
  Component: ComponentType<P>,
  providerProps?: NextFathomProviderProps,
): ComponentType<P> => {
  const WithPagesRouter: React.FC<P> = (props) => {
    // Extract disableAutoTrack for the tracking component
    const { disableAutoTrack, ...fathomProviderProps } = providerProps ?? {}

    return (
      <FathomProvider {...(fathomProviderProps as FathomProviderProps)}>
        <NextFathomTrackViewPages disableAutoTrack={disableAutoTrack} />
        <Component {...props} />
      </FathomProvider>
    )
  }

  WithPagesRouter.displayName = `withPagesRouter(${Component.displayName || Component.name || 'Component'})`

  return WithPagesRouter
}

export { withPagesRouter }
