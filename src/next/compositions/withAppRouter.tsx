import React from 'react'
import type { ComponentType } from 'react'

import NextFathomProviderApp from '../NextFathomProviderApp'
import type { NextFathomProviderProps } from '../types'

/**
 * Higher-order component that wraps your Next.js App Router app with FathomProvider
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
    return (
      <NextFathomProviderApp {...providerProps}>
        <Component {...props} />
      </NextFathomProviderApp>
    )
  }

  WithAppRouter.displayName = `withAppRouter(${Component.displayName || Component.name || 'Component'})`

  return WithAppRouter
}

export { withAppRouter }
