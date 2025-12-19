import React, { useEffect } from 'react'
import type { ReactNode } from 'react'

import type { PageViewOptions } from 'fathom-client'

import { useFathom } from '../hooks/useFathom'

export interface TrackPageviewProps extends PageViewOptions {
  /**
   * Child element(s) to render
   */
  children?: ReactNode
}

/**
 * Component that tracks a pageview when it mounts
 *
 * @example
 * ```tsx
 * <TrackPageview url="/custom-page">
 *   <div>Page content</div>
 * </TrackPageview>
 * ```
 */
export const TrackPageview: React.FC<TrackPageviewProps> = ({
  children,
  ...pageviewOptions
}) => {
  const { trackPageview } = useFathom()

  useEffect(() => {
    trackPageview?.(pageviewOptions)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{children}</>
}
