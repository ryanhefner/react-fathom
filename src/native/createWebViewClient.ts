import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from '../types'
import type { FathomWebViewRef } from './FathomWebView'

export interface WebViewClientOptions {
  /**
   * Enable debug logging (default: false)
   */
  debug?: boolean

  /**
   * Enable offline event queuing (default: true)
   * When enabled, events are queued if the WebView isn't ready yet
   */
  enableQueue?: boolean

  /**
   * Maximum number of events to queue (default: 100)
   */
  maxQueueSize?: number
}

interface QueuedCommand {
  type: 'pageview' | 'event' | 'goal' | 'block' | 'enable'
  args: unknown[]
  timestamp: number
}

/**
 * Creates a Fathom client that communicates with a FathomWebView component.
 *
 * This client queues commands until the WebView is ready, then flushes them.
 * It implements the standard FathomClient interface for compatibility with
 * the FathomProvider component.
 *
 * @example
 * ```tsx
 * import { createWebViewClient, FathomWebView } from 'react-fathom/native'
 *
 * function App() {
 *   const webViewRef = useRef<FathomWebViewRef>(null)
 *   const client = useMemo(
 *     () => createWebViewClient(() => webViewRef.current, { debug: __DEV__ }),
 *     []
 *   )
 *
 *   return (
 *     <FathomProvider client={client} siteId="YOUR_SITE_ID">
 *       <FathomWebView ref={webViewRef} siteId="YOUR_SITE_ID" />
 *       <YourApp />
 *     </FathomProvider>
 *   )
 * }
 * ```
 */
export function createWebViewClient(
  getWebViewRef: () => FathomWebViewRef | null | undefined,
  options: WebViewClientOptions = {},
): FathomClient {
  const { debug = false, enableQueue = true, maxQueueSize = 100 } = options

  let isTrackingBlocked = false
  let currentSiteId: string | undefined
  let isLoaded = false

  // Queue for commands sent before WebView is ready
  const commandQueue: QueuedCommand[] = []

  const log = (...args: unknown[]) => {
    if (debug) {
      console.log('[react-fathom/webview-client]', ...args)
    }
  }

  const warn = (...args: unknown[]) => {
    if (debug) {
      console.warn('[react-fathom/webview-client]', ...args)
    }
  }

  /**
   * Queue a command for later execution
   */
  const queueCommand = (type: QueuedCommand['type'], args: unknown[]) => {
    if (!enableQueue) {
      warn('Queue disabled, dropping command:', type)
      return
    }

    if (commandQueue.length >= maxQueueSize) {
      commandQueue.shift()
      log('Queue full, removed oldest command')
    }

    commandQueue.push({
      type,
      args,
      timestamp: Date.now(),
    })

    log(`Command queued (${commandQueue.length}/${maxQueueSize}):`, type)
  }

  /**
   * Process all queued commands
   */
  const processQueue = () => {
    const ref = getWebViewRef()
    if (!ref?.isReady()) {
      return 0
    }

    log(`Processing ${commandQueue.length} queued commands`)
    let processed = 0

    while (commandQueue.length > 0) {
      const command = commandQueue.shift()!

      switch (command.type) {
        case 'pageview':
          ref.trackPageview(command.args[0] as PageViewOptions | undefined)
          break
        case 'event':
          ref.trackEvent(
            command.args[0] as string,
            command.args[1] as EventOptions | undefined,
          )
          break
        case 'goal':
          ref.trackGoal(command.args[0] as string, command.args[1] as number)
          break
        case 'block':
          ref.blockTrackingForMe()
          break
        case 'enable':
          ref.enableTrackingForMe()
          break
      }

      processed++
    }

    log(`Processed ${processed} queued commands`)
    return processed
  }

  /**
   * Execute a command immediately or queue it
   */
  const executeOrQueue = (
    type: QueuedCommand['type'],
    args: unknown[],
    executor: () => void,
  ) => {
    const ref = getWebViewRef()

    if (ref?.isReady()) {
      executor()
    } else {
      queueCommand(type, args)
    }
  }

  const client: FathomClient & {
    processQueue: () => number
    getQueueLength: () => number
    setWebViewReady: () => void
  } = {
    load: (siteId: string, opts?: LoadOptions) => {
      currentSiteId = siteId
      isLoaded = true
      log('Client loaded with site ID:', siteId)

      // Process any queued commands now that we're "loaded"
      // (actual WebView readiness is separate)
      processQueue()
    },

    trackPageview: (opts?: PageViewOptions) => {
      if (isTrackingBlocked) {
        log('Tracking blocked, skipping pageview')
        return
      }

      executeOrQueue('pageview', [opts], () => {
        const ref = getWebViewRef()
        ref?.trackPageview(opts)
        log('Tracked pageview:', opts)
      })
    },

    trackEvent: (eventName: string, opts?: EventOptions) => {
      if (isTrackingBlocked) {
        log('Tracking blocked, skipping event')
        return
      }

      executeOrQueue('event', [eventName, opts], () => {
        const ref = getWebViewRef()
        ref?.trackEvent(eventName, opts)
        log('Tracked event:', eventName, opts)
      })
    },

    trackGoal: (code: string, cents: number) => {
      if (isTrackingBlocked) {
        log('Tracking blocked, skipping goal')
        return
      }

      executeOrQueue('goal', [code, cents], () => {
        const ref = getWebViewRef()
        ref?.trackGoal(code, cents)
        log('Tracked goal:', code, cents)
      })
    },

    setSite: (id: string) => {
      currentSiteId = id
      log('Site ID changed to:', id)
      // Note: The WebView loads with a specific site ID, so changing it
      // at runtime would require reloading the WebView
      warn(
        'setSite() called but WebView was initialized with a different site ID. ' +
          'Consider re-mounting the FathomWebView component.',
      )
    },

    blockTrackingForMe: () => {
      isTrackingBlocked = true
      executeOrQueue('block', [], () => {
        const ref = getWebViewRef()
        ref?.blockTrackingForMe()
      })
      log('Tracking blocked')
    },

    enableTrackingForMe: () => {
      isTrackingBlocked = false
      executeOrQueue('enable', [], () => {
        const ref = getWebViewRef()
        ref?.enableTrackingForMe()
      })
      log('Tracking enabled')

      // Process queue when tracking is re-enabled
      processQueue()
    },

    isTrackingEnabled: () => {
      return !isTrackingBlocked
    },

    // Additional methods for React Native
    processQueue,

    getQueueLength: () => commandQueue.length,

    /**
     * Call this when the WebView signals it's ready.
     * This will flush any queued commands.
     */
    setWebViewReady: () => {
      log('WebView ready, processing queue')
      processQueue()
    },
  }

  return client
}

export type WebViewFathomClient = ReturnType<typeof createWebViewClient>
