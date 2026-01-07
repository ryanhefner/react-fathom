import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from '../types'

/**
 * Configuration options for creating a React Native Fathom client
 */
export interface NativeClientOptions {
  /**
   * Your Fathom Analytics site ID
   */
  siteId: string

  /**
   * Custom API endpoint for sending events (defaults to Fathom's collect endpoint)
   */
  apiEndpoint?: string

  /**
   * Enable offline request queuing (default: true)
   * When enabled, failed requests are queued and retried when the app comes back online
   */
  enableOfflineQueue?: boolean

  /**
   * Maximum number of events to queue when offline (default: 100)
   */
  maxQueueSize?: number

  /**
   * Custom headers to include with each request
   */
  customHeaders?: Record<string, string>

  /**
   * Enable debug logging (default: false)
   */
  debug?: boolean

  /**
   * Custom user agent string (useful for identifying your app in analytics)
   */
  userAgent?: string

  /**
   * Request timeout in milliseconds (default: 10000)
   */
  timeout?: number
}

/**
 * Options for the NativeFathomProvider component
 */
export interface NativeFathomProviderProps {
  /**
   * Your Fathom Analytics site ID
   */
  siteId: string

  /**
   * Native client configuration options
   */
  clientOptions?: Omit<NativeClientOptions, 'siteId'>

  /**
   * Default options merged into all trackPageview calls
   */
  defaultPageviewOptions?: PageViewOptions

  /**
   * Default options merged into all trackEvent calls
   */
  defaultEventOptions?: EventOptions

  /**
   * Enable automatic app state tracking (foreground/background)
   * Tracks 'app-foreground' and 'app-background' events
   */
  trackAppState?: boolean

  /**
   * Children to render
   */
  children: React.ReactNode
}

/**
 * Options for the useNavigationTracking hook
 */
export interface UseNavigationTrackingOptions {
  /**
   * React Navigation navigation container ref
   */
  navigationRef: React.RefObject<any>

  /**
   * Transform the route name before tracking (e.g., add prefixes)
   */
  transformRouteName?: (routeName: string) => string

  /**
   * Filter which routes should be tracked (return false to skip)
   */
  shouldTrackRoute?: (routeName: string, params?: Record<string, any>) => boolean

  /**
   * Include route params in the tracked URL
   */
  includeParams?: boolean
}

/**
 * Options for the useAppStateTracking hook
 */
export interface UseAppStateTrackingOptions {
  /**
   * Event name for when the app comes to foreground (default: 'app-foreground')
   */
  foregroundEventName?: string

  /**
   * Event name for when the app goes to background (default: 'app-background')
   */
  backgroundEventName?: string

  /**
   * Additional event options to include with app state events
   */
  eventOptions?: EventOptions

  /**
   * Callback when app state changes
   */
  onStateChange?: (state: 'active' | 'background' | 'inactive') => void
}

// Re-export core types for convenience
export type { FathomClient, EventOptions, LoadOptions, PageViewOptions }
