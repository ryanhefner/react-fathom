import type { PropsWithChildren } from 'react'

import type { PageViewOptions } from 'fathom-client'

import type { FathomProviderProps } from '../types'

export interface NextFathomProviderProps
  extends PropsWithChildren, Omit<FathomProviderProps, 'disableDefaultTrack'> {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
  /**
   * Default options to pass to trackPageview on route changes
   * @deprecated Use `defaultPageviewOptions` instead
   */
  trackDefaultOptions?: PageViewOptions
}
