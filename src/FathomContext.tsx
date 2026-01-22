import { createContext } from 'react'

import type { FathomContextInterface } from './types'

const warnMissingProvider = (methodName: string) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `[react-fathom] ${methodName}() called without a FathomProvider. ` +
        'Wrap your app with <FathomProvider> to enable analytics tracking.',
    )
  }
}

/**
 * Default context value with stub methods that warn in development.
 * These allow useFathom() to be called without optional chaining,
 * while still informing developers when the provider is missing.
 */
const defaultContextValue: FathomContextInterface = {
  blockTrackingForMe: () => warnMissingProvider('blockTrackingForMe'),
  enableTrackingForMe: () => warnMissingProvider('enableTrackingForMe'),
  isTrackingEnabled: () => {
    warnMissingProvider('isTrackingEnabled')
    return false
  },
  load: () => warnMissingProvider('load'),
  setSite: () => warnMissingProvider('setSite'),
  trackPageview: () => warnMissingProvider('trackPageview'),
  trackEvent: () => warnMissingProvider('trackEvent'),
  trackGoal: () => warnMissingProvider('trackGoal'),
  subscribeToDebug: undefined,
  debugEnabled: false,
}

export const FathomContext =
  createContext<FathomContextInterface>(defaultContextValue)
