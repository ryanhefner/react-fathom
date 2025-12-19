import type { PropsWithChildren } from 'react'

import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

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
  blockTrackingForMe?: () => void
  enableTrackingForMe?: () => void
  isTrackingEnabled?: () => boolean
  load?: (siteId: string, options?: LoadOptions) => void
  setSite?: (siteId: string) => void
  trackPageview?: (options?: PageViewOptions) => void
  trackEvent?: (eventName: string, options?: EventOptions) => void
  trackGoal?: (code: string, cents: number) => void
  client?: FathomClient
  defaultPageviewOptions?: PageViewOptions
  defaultEventOptions?: EventOptions
}

export interface FathomProviderProps extends PropsWithChildren {
  client?: FathomClient
  clientOptions?: LoadOptions
  siteId?: string
  disableDefaultTrack?: boolean
  defaultPageviewOptions?: PageViewOptions
  defaultEventOptions?: EventOptions
}
