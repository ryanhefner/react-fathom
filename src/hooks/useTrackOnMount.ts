import { useEffect } from 'react'

import type { PageViewOptions } from 'fathom-client'

import { useFathom } from './useFathom'

/**
 * Hook to track a pageview when a component mounts
 *
 * @example
 * ```tsx
 * function MyComponent() {
 *   useTrackOnMount({ url: '/custom-page' })
 *   return <div>Content</div>
 * }
 * ```
 */
export const useTrackOnMount = (options?: PageViewOptions) => {
  const { trackPageview } = useFathom()

  useEffect(() => {
    trackPageview?.(options)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
