import { useEffect, useRef, useCallback } from 'react'

import { useFathom } from '../hooks/useFathom'
import type { UseNavigationTrackingOptions } from './types'

/**
 * Hook that tracks screen navigation as pageviews using React Navigation.
 *
 * This integrates with React Navigation's navigation container to automatically
 * track screen changes as Fathom pageviews.
 *
 * @example
 * ```tsx
 * import { NavigationContainer } from '@react-navigation/native'
 * import { useNavigationTracking } from 'react-fathom/native'
 *
 * function App() {
 *   const navigationRef = useNavigationContainerRef()
 *
 *   useNavigationTracking({
 *     navigationRef,
 *     transformRouteName: (name) => `/screens/${name}`,
 *   })
 *
 *   return (
 *     <NavigationContainer ref={navigationRef}>
 *       <Navigator />
 *     </NavigationContainer>
 *   )
 * }
 * ```
 */
export function useNavigationTracking(options: UseNavigationTrackingOptions) {
  const {
    navigationRef,
    transformRouteName,
    shouldTrackRoute,
    includeParams = false,
  } = options

  const { trackPageview } = useFathom()
  const routeNameRef = useRef<string | undefined>()

  /**
   * Get the current route name from the navigation state
   */
  const getCurrentRouteName = useCallback((): string | undefined => {
    if (!navigationRef.current) {
      return undefined
    }

    const state = navigationRef.current.getRootState?.()
    if (!state) {
      return undefined
    }

    // Navigate through nested navigators to get the deepest route
    let currentState = state
    while (currentState.routes[currentState.index]?.state) {
      currentState = currentState.routes[currentState.index].state as any
    }

    return currentState.routes[currentState.index]?.name
  }, [navigationRef])

  /**
   * Get the current route params from the navigation state
   */
  const getCurrentRouteParams = useCallback((): Record<string, any> | undefined => {
    if (!navigationRef.current) {
      return undefined
    }

    const state = navigationRef.current.getRootState?.()
    if (!state) {
      return undefined
    }

    // Navigate through nested navigators to get the deepest route
    let currentState = state
    while (currentState.routes[currentState.index]?.state) {
      currentState = currentState.routes[currentState.index].state as any
    }

    return currentState.routes[currentState.index]?.params as Record<string, any> | undefined
  }, [navigationRef])

  /**
   * Build the URL to track
   */
  const buildTrackingUrl = useCallback(
    (routeName: string, params?: Record<string, any>): string => {
      let url = transformRouteName ? transformRouteName(routeName) : `/${routeName}`

      if (includeParams && params && Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
          .filter(([_, value]) => value !== undefined && value !== null)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&')

        if (queryString) {
          url += `?${queryString}`
        }
      }

      return url
    },
    [transformRouteName, includeParams],
  )

  /**
   * Handle navigation state change
   */
  const handleStateChange = useCallback(() => {
    const currentRouteName = getCurrentRouteName()
    const previousRouteName = routeNameRef.current

    if (currentRouteName && currentRouteName !== previousRouteName) {
      const params = includeParams ? getCurrentRouteParams() : undefined

      // Check if this route should be tracked
      if (shouldTrackRoute && !shouldTrackRoute(currentRouteName, params)) {
        routeNameRef.current = currentRouteName
        return
      }

      const url = buildTrackingUrl(currentRouteName, params)

      trackPageview?.({
        url,
        referrer: previousRouteName ? buildTrackingUrl(previousRouteName) : undefined,
      })

      routeNameRef.current = currentRouteName
    }
  }, [
    getCurrentRouteName,
    getCurrentRouteParams,
    shouldTrackRoute,
    buildTrackingUrl,
    trackPageview,
    includeParams,
  ])

  // Track initial route on mount
  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timeout = setTimeout(() => {
      const initialRoute = getCurrentRouteName()
      if (initialRoute) {
        const params = includeParams ? getCurrentRouteParams() : undefined

        if (!shouldTrackRoute || shouldTrackRoute(initialRoute, params)) {
          const url = buildTrackingUrl(initialRoute, params)
          trackPageview?.({ url })
          routeNameRef.current = initialRoute
        }
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, []) // Only on mount

  // Set up navigation state change listener
  useEffect(() => {
    if (!navigationRef.current) {
      return
    }

    // Listen for navigation state changes
    const unsubscribe = navigationRef.current.addListener?.('state', handleStateChange)

    return () => {
      unsubscribe?.()
    }
  }, [navigationRef, handleStateChange])
}
