import React, { useMemo, useEffect } from 'react'

import { FathomProvider } from '../FathomProvider'
import { createNativeClient } from './createNativeClient'
import { useAppStateTracking } from './useAppStateTracking'
import type { NativeFathomProviderProps } from './types'

/**
 * Internal component that handles app state tracking
 */
const AppStateTracker: React.FC<{ enabled: boolean }> = ({ enabled }) => {
  useAppStateTracking({
    foregroundEventName: 'app-foreground',
    backgroundEventName: 'app-background',
  })

  return null
}

/**
 * A convenience provider for React Native apps that creates and manages
 * a native Fathom client automatically.
 *
 * @example
 * ```tsx
 * import { NativeFathomProvider } from 'react-fathom/native'
 *
 * function App() {
 *   return (
 *     <NativeFathomProvider
 *       siteId="YOUR_SITE_ID"
 *       clientOptions={{ debug: __DEV__ }}
 *       trackAppState
 *     >
 *       <YourApp />
 *     </NativeFathomProvider>
 *   )
 * }
 * ```
 */
export const NativeFathomProvider: React.FC<NativeFathomProviderProps> = ({
  siteId,
  clientOptions = {},
  defaultPageviewOptions,
  defaultEventOptions,
  trackAppState = false,
  children,
}) => {
  // Create the native client once
  const client = useMemo(
    () =>
      createNativeClient({
        siteId,
        ...clientOptions,
      }),
    [siteId], // Only recreate if siteId changes
  )

  // Load the client on mount
  useEffect(() => {
    client.load(siteId)
  }, [client, siteId])

  return (
    <FathomProvider
      client={client}
      siteId={siteId}
      defaultPageviewOptions={defaultPageviewOptions}
      defaultEventOptions={defaultEventOptions}
    >
      {trackAppState && <AppStateTracker enabled={trackAppState} />}
      {children}
    </FathomProvider>
  )
}
