import React from 'react'
import type { ComponentType } from 'react'

import NextFathomProviderPages from '../NextFathomProviderPages'
import type { NextFathomProviderProps } from '../types'

/**
 * Higher-order component that wraps your Next.js Pages Router app with FathomProvider
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
    return (
      <NextFathomProviderPages {...providerProps}>
        <Component {...props} />
      </NextFathomProviderPages>
    )
  }

  WithPagesRouter.displayName = `withPagesRouter(${Component.displayName || Component.name || 'Component'})`

  return WithPagesRouter
}

export { withPagesRouter }
