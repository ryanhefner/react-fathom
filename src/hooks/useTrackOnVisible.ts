import { useEffect, useRef } from 'react'
import type { RefObject } from 'react'

import type { EventOptions } from 'fathom-client'

import { useFathom } from './useFathom'

export interface UseTrackOnVisibleOptions extends EventOptions {
  /**
   * Event name to track
   */
  eventName: string
  /**
   * Intersection observer options
   */
  observerOptions?: IntersectionObserverInit
  /**
   * Whether to track only once or every time it becomes visible
   * @default true
   */
  trackOnce?: boolean
  /**
   * Optional callback function to run after tracking
   * Receives the intersection observer entry as a parameter
   */
  callback?: (entry: IntersectionObserverEntry) => void
}

/**
 * Hook to track an event when an element becomes visible (using Intersection Observer)
 *
 * @example
 * ```tsx
 * function Section() {
 *   const ref = useTrackOnVisible({
 *     eventName: 'section-viewed',
 *     section: 'hero',
 *     callback: (entry) => {
 *       console.log('Section is visible!', entry.isIntersecting)
 *       // Your custom logic here
 *     },
 *   })
 *
 *   return <section ref={ref}>Content</section>
 * }
 * ```
 */
export const useTrackOnVisible = (
  options: UseTrackOnVisibleOptions,
): RefObject<HTMLElement | null> => {
  const { trackEvent } = useFathom()
  const {
    eventName,
    observerOptions,
    trackOnce = true,
    callback,
    ...eventOptions
  } = options
  const ref = useRef<HTMLElement | null>(null)
  const hasTracked = useRef(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!trackOnce || !hasTracked.current) {
              trackEvent?.(eventName, eventOptions)
              callback?.(entry)
              hasTracked.current = true
            }
          }
        })
      },
      {
        threshold: 0.1,
        ...observerOptions,
      },
    )

    observer.observe(element)

    return () => {
      observer.disconnect()
    }
  }, [
    eventName,
    eventOptions,
    observerOptions,
    trackOnce,
    trackEvent,
    callback,
  ])

  return ref
}
