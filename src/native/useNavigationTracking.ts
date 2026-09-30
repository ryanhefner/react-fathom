import { useCallback, useEffect, useRef } from 'react'

import type { UseNavigationTrackingOptions } from './types.js'
import { useFathom } from '../hooks/useFathom.js'

interface NavigationRouteSnapshot {
  name: string
  params?: Record<string, unknown>
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const getActiveRoute = (
  state: unknown,
): NavigationRouteSnapshot | undefined => {
  let currentState = state
  const visitedStates = new Set<object>()

  while (isRecord(currentState)) {
    if (visitedStates.has(currentState)) return undefined
    visitedStates.add(currentState)

    const routes = currentState.routes
    const index = currentState.index
    if (!Array.isArray(routes) || typeof index !== 'number') return undefined

    const route: unknown = routes[index]
    if (!isRecord(route) || typeof route.name !== 'string') return undefined

    if (route.state !== undefined) {
      currentState = route.state
      continue
    }

    return {
      name: route.name,
      params: isRecord(route.params) ? route.params : undefined,
    }
  }

  return undefined
}

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
  const trackedUrlRef = useRef<string | undefined>(undefined)

  /**
   * Get the active route from the navigation state
   */
  const getCurrentRoute = useCallback(():
    NavigationRouteSnapshot | undefined => {
    if (!navigationRef.current) {
      return undefined
    }

    return getActiveRoute(navigationRef.current.getRootState?.())
  }, [navigationRef])

  /**
   * Build the URL to track
   */
  const buildTrackingUrl = useCallback(
    (routeName: string, params?: Record<string, unknown>): string => {
      let url = transformRouteName
        ? transformRouteName(routeName)
        : `/${routeName}`

      if (includeParams && params && Object.keys(params).length > 0) {
        const queryString = Object.entries(params)
          .filter(([, value]) => value !== undefined && value !== null)
          .map(
            ([key, value]) =>
              `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
          )
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
    const currentRoute = getCurrentRoute()
    if (!currentRoute) return

    const params = includeParams ? currentRoute.params : undefined
    const url = buildTrackingUrl(currentRoute.name, params)

    if (url !== trackedUrlRef.current) {
      const previousUrl = trackedUrlRef.current

      // Check if this route should be tracked
      if (shouldTrackRoute && !shouldTrackRoute(currentRoute.name, params)) {
        return
      }

      trackPageview?.({
        url,
        referrer: previousUrl,
      })

      trackedUrlRef.current = url
    }
  }, [
    getCurrentRoute,
    shouldTrackRoute,
    buildTrackingUrl,
    trackPageview,
    includeParams,
  ])

  // Track initial route on mount
  useEffect(() => {
    // Small delay to ensure navigation is ready
    const timeout = setTimeout(() => {
      if (trackedUrlRef.current !== undefined) return

      const initialRoute = getCurrentRoute()
      if (initialRoute) {
        const params = includeParams ? initialRoute.params : undefined

        if (!shouldTrackRoute || shouldTrackRoute(initialRoute.name, params)) {
          const url = buildTrackingUrl(initialRoute.name, params)
          trackPageview?.({ url })
          trackedUrlRef.current = url
        }
      }
    }, 0)

    return () => clearTimeout(timeout)
  }, [
    buildTrackingUrl,
    getCurrentRoute,
    includeParams,
    shouldTrackRoute,
    trackPageview,
  ])

  // Set up navigation state change listener
  useEffect(() => {
    if (!navigationRef.current) {
      return
    }

    // Listen for navigation state changes
    const unsubscribe = navigationRef.current.addListener?.(
      'state',
      handleStateChange,
    )

    return () => {
      unsubscribe?.()
    }
  }, [navigationRef, handleStateChange])
}
