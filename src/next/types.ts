import type { PropsWithChildren } from 'react'

import type { FathomProviderProps } from '../types'

export interface NextFathomProviderProps
  extends PropsWithChildren, Omit<FathomProviderProps, 'disableDefaultTrack'> {
  /**
   * Disable automatic pageview tracking on route changes
   * @default false
   */
  disableAutoTrack?: boolean
}
