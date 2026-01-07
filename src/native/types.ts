import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from '../types'

/**
 * Options for the NativeFathomProvider component
 */
export interface NativeFathomProviderProps {
  /**
   * Your Fathom Analytics site ID
   */
  siteId: string

  /**
   * Options passed to fathom.load() in the WebView
   */
  loadOptions?: LoadOptions

  /**
   * Custom domain for Fathom script (if using Fathom's custom domains feature)
   * @default 'cdn.usefathom.com'
   */
  scriptDomain?: string

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
   * @default false
   */
  trackAppState?: boolean

  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean

  /**
   * Called when the Fathom script has loaded and is ready
   */
  onReady?: () => void

  /**
   * Called when an error occurs loading the script
   */
  onError?: (error: string) => void

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
