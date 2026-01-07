import { useEffect, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'

import { useFathom } from '../hooks/useFathom'
import type { UseAppStateTrackingOptions } from './types'

/**
 * Hook that tracks app state changes (foreground/background) as Fathom events.
 *
 * This is useful for understanding user engagement patterns and session behavior.
 *
 * @example
 * ```tsx
 * import { useAppStateTracking } from 'react-fathom/native'
 *
 * function App() {
 *   useAppStateTracking({
 *     foregroundEventName: 'app-resumed',
 *     backgroundEventName: 'app-paused',
 *     onStateChange: (state) => {
 *       console.log('App state:', state)
 *     },
 *   })
 *
 *   return <YourApp />
 * }
 * ```
 */
export function useAppStateTracking(options: UseAppStateTrackingOptions = {}) {
  const {
    foregroundEventName = 'app-foreground',
    backgroundEventName = 'app-background',
    eventOptions,
    onStateChange,
  } = options

  const { trackEvent } = useFathom()
  const appStateRef = useRef<AppStateStatus>(AppState.currentState)

  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousState = appStateRef.current

      // Track when app comes to foreground
      if (previousState.match(/inactive|background/) && nextAppState === 'active') {
        trackEvent?.(foregroundEventName, eventOptions)
      }

      // Track when app goes to background
      if (previousState === 'active' && nextAppState.match(/inactive|background/)) {
        trackEvent?.(backgroundEventName, eventOptions)
      }

      // Call the optional state change callback
      onStateChange?.(nextAppState as 'active' | 'background' | 'inactive')

      appStateRef.current = nextAppState
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange)

    return () => {
      subscription.remove()
    }
  }, [trackEvent, foregroundEventName, backgroundEventName, eventOptions, onStateChange])
}
