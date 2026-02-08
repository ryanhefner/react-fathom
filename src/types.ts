import type { MutableRefObject, PropsWithChildren } from 'react'

import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

// Re-export fathom-client types for convenience
export type { EventOptions, LoadOptions, PageViewOptions }

/**
 * Represents a debug event emitted by FathomProvider when debug mode is enabled.
 */
export interface DebugEvent {
  /** Unique identifier for this event */
  id: string
  /** Timestamp when the event occurred */
  timestamp: number
  /** Type of tracking call */
  type: 'pageview' | 'event' | 'goal'
  /** Event name (for 'event' type) */
  eventName?: string
  /** Goal code (for 'goal' type) */
  goalCode?: string
  /** Goal value in cents (for 'goal' type) */
  goalCents?: number
  /** URL being tracked (for 'pageview' type) */
  url?: string
  /** Additional options passed to the tracking call */
  options?: PageViewOptions | EventOptions
}

/**
 * Callback function for debug events.
 */
export type DebugEventCallback = (event: DebugEvent) => void

/**
 * Options for debug mode in FathomProvider.
 */
export interface DebugOptions {
  /**
   * Enable debug mode.
   * @default false
   */
  enabled?: boolean
  /**
   * Log tracking calls to the console.
   * @default true when debug is enabled
   */
  console?: boolean
  /**
   * Callback fired when any tracking call is made.
   * Use this to integrate with custom UI (e.g., toast notifications).
   */
  onTrack?: DebugEventCallback
}

export interface FathomClient {
  blockTrackingForMe: () => void
  enableTrackingForMe: () => void
  trackPageview: (opts?: PageViewOptions) => void
  trackGoal: (code: string, cents: number) => void
  trackEvent: (eventName: string, opts?: EventOptions) => void
  setSite: (id: string) => void
  load: (siteId: string, options?: LoadOptions) => void
  isTrackingEnabled: () => boolean
}

export interface FathomContextInterface {
  blockTrackingForMe: () => void
  enableTrackingForMe: () => void
  isTrackingEnabled: () => boolean
  load: (siteId: string, options?: LoadOptions) => void
  setSite: (siteId: string) => void
  trackPageview: (options?: PageViewOptions) => void
  trackEvent: (eventName: string, options?: EventOptions) => void
  trackGoal: (code: string, cents: number) => void
  client?: FathomClient
  defaultPageviewOptions?: PageViewOptions
  defaultEventOptions?: EventOptions
  /**
   * Subscribe to debug events. Returns an unsubscribe function.
   * Only available when debug mode is enabled.
   */
  subscribeToDebug?: (callback: DebugEventCallback) => () => void
  /**
   * Whether debug mode is enabled.
   */
  debugEnabled?: boolean
}

export interface FathomProviderProps extends PropsWithChildren {
  client?: FathomClient
  /**
   * A ref that will be populated with the resolved Fathom client instance.
   * This allows the parent component that composes the provider to access
   * the client directly, since it cannot use useFathom() (context only flows
   * downward to children).
   *
   * @example
   * ```tsx
   * function App() {
   *   const clientRef = useRef<FathomClient>(null);
   *
   *   const handleDeepLink = (url: string) => {
   *     clientRef.current?.trackEvent('deep_link', { _url: url });
   *   };
   *
   *   return (
   *     <FathomProvider siteId="..." clientRef={clientRef}>
   *       <YourApp />
   *     </FathomProvider>
   *   );
   * }
   * ```
   */
  clientRef?: MutableRefObject<FathomClient | null>
  clientOptions?: LoadOptions
  siteId?: string
  defaultPageviewOptions?: PageViewOptions
  defaultEventOptions?: EventOptions
  /**
   * Enable debug mode to log and/or receive callbacks for all tracking calls.
   * Useful for development, demos, and debugging.
   * Does not block actual Fathom tracking.
   *
   * @example
   * ```tsx
   * // Simple console logging
   * <FathomProvider debug={{ enabled: true }} />
   *
   * // Custom callback for toast notifications
   * <FathomProvider
   *   debug={{
   *     enabled: true,
   *     console: false,
   *     onTrack: (event) => showToast(event)
   *   }}
   * />
   * ```
   */
  debug?: DebugOptions | boolean
  /**
   * Callback fired when a tracking call fails.
   * Useful for error monitoring and debugging.
   *
   * @example
   * ```tsx
   * <FathomProvider
   *   siteId="..."
   *   onError={(error, context) => {
   *     console.error(`Fathom ${context.method} failed:`, error)
   *   }}
   * />
   * ```
   */
  onError?: (error: unknown, context: { method: string; args?: unknown[] }) => void
}
