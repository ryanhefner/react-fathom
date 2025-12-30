'use client'

import React from 'react'

import { FathomProvider } from '../FathomProvider'
import type { FathomProviderProps } from '../types'
import { NextFathomTrackViewApp } from './NextFathomTrackViewApp'

export interface NextFathomProviderAppProps extends Omit<
  FathomProviderProps,
  'children'
> {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
  /**
   * Child components to render
   */
  children: React.ReactNode
}

/**
 * Client component wrapper that combines FathomProvider and NextFathomTrackViewApp
 * for easy integration in Next.js App Router layouts.
 *
 * This component is marked with 'use client' and can be used directly in Server Components
 * like the root layout.tsx file.
 *
 * @example
 * ```tsx
 * // app/layout.tsx
 * import { NextFathomProviderApp } from 'react-fathom/next'
 *
 * export default function RootLayout({ children }) {
 *   return (
 *     <html>
 *       <body>
 *         <NextFathomProviderApp siteId="YOUR_SITE_ID">
 *           {children}
 *         </NextFathomProviderApp>
 *       </body>
 *     </html>
 *   )
 * }
 * ```
 */
export const NextFathomProviderApp: React.FC<NextFathomProviderAppProps> = ({
  children,
  disableAutoTrack = false,
  ...fathomProviderProps
}) => {
  return (
    <FathomProvider {...fathomProviderProps}>
      <NextFathomTrackViewApp disableAutoTrack={disableAutoTrack} />
      {children}
    </FathomProvider>
  )
}

NextFathomProviderApp.displayName = 'NextFathomProviderApp'
