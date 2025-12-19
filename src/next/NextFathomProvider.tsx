import React, { Suspense, lazy, useMemo } from 'react'

import type { NextFathomProviderProps } from './types'

export interface NextFathomProviderComponentProps extends NextFathomProviderProps {
  /**
   * Router type to use
   * @default 'app'
   */
  router?: 'pages' | 'app'
  /**
   * Fallback component to show while loading the router provider
   * @default null
   */
  fallback?: React.ReactNode
}

// Dynamically import providers to enable code-splitting
const NextFathomProviderAppLazy = lazy(
  async () => await import('./NextFathomProviderApp'),
)
const NextFathomProviderPagesLazy = lazy(
  async () => await import('./NextFathomProviderPages'),
)

/**
 * Unified provider component that conditionally renders the appropriate
 * Next.js router provider based on the `router` prop.
 * Providers are dynamically loaded to avoid bundling both router types.
 *
 * @example
 * ```tsx
 * // App Router (default)
 * <NextFathomProvider siteId="YOUR_SITE_ID" router="app">
 *   <App>{children}</App>
 * </NextFathomProvider>
 *
 * // Pages Router
 * <NextFathomProvider siteId="YOUR_SITE_ID" router="pages">
 *   <App>{children}</App>
 * </NextFathomProvider>
 * ```
 */
export const NextFathomProvider: React.FC<NextFathomProviderComponentProps> = ({
  router = 'app',
  fallback = null,
  ...props
}) => {
  const Provider = useMemo(() => {
    return router === 'pages'
      ? NextFathomProviderPagesLazy
      : NextFathomProviderAppLazy
  }, [router])

  return (
    <Suspense fallback={fallback}>
      <Provider {...props} />
    </Suspense>
  )
}

NextFathomProvider.displayName = 'NextFathomProvider'
