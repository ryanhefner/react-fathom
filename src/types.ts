import type { MutableRefObject, PropsWithChildren } from 'react'

import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

// Re-export fathom-client types for convenience
export type { EventOptions, LoadOptions, PageViewOptions }

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
}
