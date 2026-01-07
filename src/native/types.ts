import type { MutableRefObject } from 'react'
import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from '../types'
import type { WebViewFathomClient } from './createWebViewClient'

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
   * A ref that will be populated with the WebView-based Fathom client instance.
   * This allows the parent component that composes the provider to access
   * the client directly, since it cannot use useFathom() (context only flows
   * downward to children).
   *
   * The client is a WebViewFathomClient which extends FathomClient with
   * additional methods for queue management.
   *
   * @example
   * ```tsx
   * import { NativeFathomProvider, WebViewFathomClient } from 'react-fathom/native'
   *
   * function App() {
   *   const clientRef = useRef<WebViewFathomClient>(null);
   *
   *   const handleDeepLink = (url: string) => {
   *     clientRef.current?.trackEvent('deep_link', { _url: url });
   *   };
   *
   *   return (
   *     <NativeFathomProvider siteId="..." clientRef={clientRef}>
   *       <YourApp />
   *     </NativeFathomProvider>
   *   );
   * }
   * ```
   */
  clientRef?: MutableRefObject<WebViewFathomClient | null>

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
