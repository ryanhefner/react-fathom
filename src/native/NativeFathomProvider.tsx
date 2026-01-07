import React, { useMemo, useRef, useCallback } from 'react'

import { FathomProvider } from '../FathomProvider'
import { FathomWebView, type FathomWebViewRef } from './FathomWebView'
import { createWebViewClient, type WebViewFathomClient } from './createWebViewClient'
import { useAppStateTracking } from './useAppStateTracking'
import type { NativeFathomProviderProps } from './types'

/**
 * Internal component that handles app state tracking
 */
const AppStateTracker: React.FC = () => {
  useAppStateTracking({
    foregroundEventName: 'app-foreground',
    backgroundEventName: 'app-background',
  })

  return null
}

/**
 * A convenience provider for React Native apps that uses a hidden WebView
 * to load the official Fathom Analytics script.
 *
 * This approach ensures full compatibility with Fathom's tracking by using
 * their official JavaScript client, while providing a native React API.
 *
 * @example
 * ```tsx
 * import { NativeFathomProvider } from 'react-fathom/native'
 *
 * function App() {
 *   return (
 *     <NativeFathomProvider
 *       siteId="YOUR_SITE_ID"
 *       debug={__DEV__}
 *       trackAppState
 *     >
 *       <YourApp />
 *     </NativeFathomProvider>
 *   )
 * }
 * ```
 *
 * @remarks
 * This component renders a hidden WebView that loads Fathom's tracking script.
 * Events are queued until the WebView is ready, then automatically flushed.
 *
 * The WebView approach is used because Fathom Analytics does not currently
 * provide a public API for server-side or mobile event tracking. This ensures
 * your analytics are recorded correctly using Fathom's official client.
 */
export const NativeFathomProvider: React.FC<NativeFathomProviderProps> = ({
  siteId,
  loadOptions,
  scriptDomain,
  defaultPageviewOptions,
  defaultEventOptions,
  trackAppState = false,
  debug = false,
  onReady,
  onError,
  children,
}) => {
  const webViewRef = useRef<FathomWebViewRef>(null)

  // Create the WebView-based client
  const client = useMemo(
    () =>
      createWebViewClient(() => webViewRef.current, {
        debug,
        enableQueue: true,
        maxQueueSize: 100,
      }) as WebViewFathomClient,
    [debug],
  )

  // Handle WebView ready event
  const handleReady = useCallback(() => {
    // Flush any queued commands
    client.setWebViewReady()
    onReady?.()
  }, [client, onReady])

  return (
    <FathomProvider
      client={client}
      siteId={siteId}
      defaultPageviewOptions={defaultPageviewOptions}
      defaultEventOptions={defaultEventOptions}
    >
      <FathomWebView
        ref={webViewRef}
        siteId={siteId}
        loadOptions={loadOptions}
        scriptDomain={scriptDomain}
        debug={debug}
        onReady={handleReady}
        onError={onError}
      />
      {trackAppState && <AppStateTracker />}
      {children}
    </FathomProvider>
  )
}
