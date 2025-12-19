import { useCallback } from 'react'
import type { MouseEvent } from 'react'

import type { EventOptions } from 'fathom-client'

import { useFathom } from './useFathom'

export interface UseTrackOnClickOptions extends EventOptions {
  /**
   * Event name to track
   */
  eventName: string
  /**
   * Whether to prevent default behavior
   * @default false
   */
  preventDefault?: boolean
  /**
   * Optional callback function to run after tracking
   * Receives the click event as a parameter
   */
  callback?: (e?: MouseEvent) => void
}

/**
 * Hook that returns a click handler function that tracks an event
 *
 * @example
 * ```tsx
 * function Button() {
 *   const handleClick = useTrackOnClick({
 *     eventName: 'button-click',
 *     id: 'signup-button',
 *     callback: (e) => {
 *       console.log('Button clicked!')
 *       // Your custom logic here
 *     },
 *   })
 *
 *   return <button onClick={handleClick}>Sign Up</button>
 * }
 * ```
 */
export const useTrackOnClick = (
  options: UseTrackOnClickOptions,
): ((e?: MouseEvent) => void) => {
  const { trackEvent } = useFathom()
  const {
    eventName,
    preventDefault = false,
    callback,
    ...eventOptions
  } = options

  return useCallback(
    (e?: MouseEvent) => {
      if (preventDefault && e) {
        e.preventDefault()
      }
      trackEvent?.(eventName, eventOptions)
      callback?.(e)
    },
    [eventName, preventDefault, trackEvent, eventOptions, callback],
  )
}
