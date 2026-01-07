import type { FathomClient, EventOptions, LoadOptions, PageViewOptions } from '../types'
import type { NativeClientOptions } from './types'

// Fathom's collect endpoint
const FATHOM_COLLECT_ENDPOINT = 'https://cdn.usefathom.com/script.js'

interface QueuedEvent {
  type: 'pageview' | 'event' | 'goal'
  payload: Record<string, any>
  timestamp: number
}

/**
 * Creates a Fathom Analytics client for React Native applications.
 *
 * @example
 * ```tsx
 * import { createNativeClient } from 'react-fathom/native'
 *
 * const client = createNativeClient({
 *   siteId: 'YOUR_SITE_ID',
 *   debug: __DEV__,
 * })
 *
 * // Use with FathomProvider
 * <FathomProvider client={client}>
 *   <App />
 * </FathomProvider>
 * ```
 */
export function createNativeClient(options: NativeClientOptions): FathomClient {
  const {
    siteId: initialSiteId,
    apiEndpoint = FATHOM_COLLECT_ENDPOINT,
    enableOfflineQueue = true,
    maxQueueSize = 100,
    customHeaders = {},
    debug = false,
    userAgent,
    timeout = 10000,
  } = options

  let currentSiteId = initialSiteId
  let isTrackingBlocked = false
  let isLoaded = false
  let loadOptions: LoadOptions | undefined

  // Offline queue for failed requests
  const eventQueue: QueuedEvent[] = []

  const log = (...args: any[]) => {
    if (debug) {
      console.log('[react-fathom/native]', ...args)
    }
  }

  const warn = (...args: any[]) => {
    if (debug) {
      console.warn('[react-fathom/native]', ...args)
    }
  }

  /**
   * Send a tracking request to Fathom
   */
  const sendRequest = async (
    type: 'pageview' | 'event' | 'goal',
    payload: Record<string, any>,
  ): Promise<boolean> => {
    if (isTrackingBlocked) {
      log('Tracking is blocked, skipping request')
      return false
    }

    if (!currentSiteId) {
      warn('No site ID configured, skipping request')
      return false
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...customHeaders,
    }

    if (userAgent) {
      headers['User-Agent'] = userAgent
    }

    const body = {
      site_id: currentSiteId,
      ...payload,
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), timeout)

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      log(`${type} tracked successfully:`, payload)
      return true
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        warn(`Request timeout for ${type}:`, payload)
      } else {
        warn(`Failed to track ${type}:`, error)
      }

      // Queue the event for retry if offline queue is enabled
      if (enableOfflineQueue) {
        queueEvent(type, payload)
      }

      return false
    }
  }

  /**
   * Queue an event for later retry
   */
  const queueEvent = (type: 'pageview' | 'event' | 'goal', payload: Record<string, any>) => {
    if (eventQueue.length >= maxQueueSize) {
      // Remove oldest event to make room
      eventQueue.shift()
      log('Queue full, removed oldest event')
    }

    eventQueue.push({
      type,
      payload,
      timestamp: Date.now(),
    })

    log(`Event queued (${eventQueue.length}/${maxQueueSize}):`, { type, payload })
  }

  /**
   * Process queued events (call this when app comes online)
   */
  const processQueue = async (): Promise<number> => {
    if (eventQueue.length === 0) {
      return 0
    }

    log(`Processing ${eventQueue.length} queued events`)

    let processedCount = 0
    const eventsToProcess = [...eventQueue]
    eventQueue.length = 0 // Clear the queue

    for (const event of eventsToProcess) {
      const success = await sendRequest(event.type, event.payload)
      if (success) {
        processedCount++
      } else {
        // Re-queue failed events
        eventQueue.push(event)
      }
    }

    log(`Processed ${processedCount}/${eventsToProcess.length} queued events`)
    return processedCount
  }

  const client: FathomClient & { processQueue: () => Promise<number>; getQueueLength: () => number } = {
    load: (siteId: string, opts?: LoadOptions) => {
      currentSiteId = siteId
      loadOptions = opts
      isLoaded = true
      log('Client loaded with site ID:', siteId)

      // Honor tracking preferences from options
      if (opts?.honorDNT) {
        // Note: React Native doesn't have a standard DNT header,
        // but apps can implement their own tracking consent
        log('honorDNT option noted (implement app-specific consent)')
      }
    },

    trackPageview: (opts?: PageViewOptions) => {
      const payload: Record<string, any> = {}

      if (opts?.url) {
        payload.url = opts.url
      }

      if (opts?.referrer) {
        payload.referrer = opts.referrer
      }

      sendRequest('pageview', payload)
    },

    trackEvent: (eventName: string, opts?: EventOptions) => {
      const payload: Record<string, any> = {
        name: eventName,
      }

      // Include any additional event options
      if (opts) {
        Object.assign(payload, opts)
      }

      sendRequest('event', payload)
    },

    trackGoal: (code: string, cents: number) => {
      const payload = {
        code,
        cents,
      }

      sendRequest('goal', payload)
    },

    setSite: (id: string) => {
      currentSiteId = id
      log('Site ID changed to:', id)
    },

    blockTrackingForMe: () => {
      isTrackingBlocked = true
      log('Tracking blocked')
    },

    enableTrackingForMe: () => {
      isTrackingBlocked = false
      log('Tracking enabled')

      // Process any queued events when tracking is re-enabled
      if (enableOfflineQueue && eventQueue.length > 0) {
        processQueue()
      }
    },

    isTrackingEnabled: () => {
      return !isTrackingBlocked
    },

    // Additional methods for React Native
    processQueue,

    getQueueLength: () => eventQueue.length,
  }

  return client
}

export type NativeFathomClient = ReturnType<typeof createNativeClient>
