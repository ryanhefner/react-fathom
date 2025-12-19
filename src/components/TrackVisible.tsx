import React, { useEffect, useRef, forwardRef, useCallback } from 'react'
import type { ElementType, ReactNode } from 'react'

import type { EventOptions } from 'fathom-client'

import { useFathom } from '../hooks/useFathom'

export interface TrackVisibleProps extends EventOptions {
  /**
   * Event name to track
   */
  eventName: string
  /**
   * Child element(s) to render
   */
  children?: ReactNode
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
   * HTML element to render as wrapper
   * @default 'div'
   */
  as?: ElementType
}

/**
 * Component that tracks an event when it becomes visible in the viewport
 *
 * @example
 * ```tsx
 * <TrackVisible eventName="section-viewed" section="hero">
 *   <HeroSection />
 * </TrackVisible>
 * ```
 */
export const TrackVisible = forwardRef<HTMLDivElement, TrackVisibleProps>(
  function TrackVisible(
    {
      eventName,
      children,
      observerOptions,
      trackOnce = true,
      as: Component = 'div',
      ...eventOptions
    },
    forwardedRef,
  ) {
    const { trackEvent } = useFathom()
    const internalRef = useRef<HTMLDivElement | null>(null)
    const hasTracked = useRef(false)

    // Callback ref that handles both forwarded and internal refs
    const setRef = useCallback(
      (node: HTMLDivElement | null) => {
        internalRef.current = node

        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef !== null && forwardedRef !== undefined) {
          forwardedRef.current = node
        }
      },
      [forwardedRef],
    )

    useEffect(() => {
      const element = internalRef.current
      if (element === null) {
        return
      }

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              if (!trackOnce || !hasTracked.current) {
                trackEvent?.(eventName, eventOptions)
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
    }, [eventName, eventOptions, observerOptions, trackOnce, trackEvent])

    return <Component ref={setRef}>{children}</Component>
  },
)
