import React, { useMemo } from 'react'
import type { ComponentType } from 'react'

import { FathomProvider } from '../../FathomProvider.js'
import type { FathomProviderProps } from '../../types.js'
import { NextFathomTrackViewApp } from '../NextFathomTrackViewApp.js'
import { routerClientOptions } from '../router-options.js'
import type { NextFathomProviderProps } from '../types.js'

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
 *     honorDNT: true,
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
    const {
      disableAutoTrack = false,
      clientOptions,
      ...fathomProviderProps
    } = providerProps ?? {}
    const resolvedOptions = useMemo(
      () => routerClientOptions(clientOptions, disableAutoTrack),
      [clientOptions, disableAutoTrack],
    )

    return (
      <FathomProvider
        {...(fathomProviderProps as FathomProviderProps)}
        clientOptions={resolvedOptions}
      >
        <NextFathomTrackViewApp disableAutoTrack={disableAutoTrack} />
        <Component {...props} />
      </FathomProvider>
    )
  }

  WithAppRouter.displayName = `withAppRouter(${Component.displayName || Component.name || 'Component'})`

  return WithAppRouter
}

export { withAppRouter }
