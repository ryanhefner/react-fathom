'use client'

import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import * as Fathom from 'fathom-client'
import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

import { FathomContext } from './FathomContext'
import type { DebugEvent, DebugEventCallback, DebugOptions, FathomProviderProps } from './types'

// Generate unique IDs for debug events
let debugEventCounter = 0
const generateDebugEventId = () => `debug-${Date.now()}-${++debugEventCounter}`

const FathomProvider: React.FC<FathomProviderProps> = ({
  children,
  client: providedClient,
  clientRef,
  clientOptions,
  siteId,
  defaultPageviewOptions: providedDefaultPageviewOptions,
  defaultEventOptions: providedDefaultEventOptions,
  debug: debugProp,
}) => {
  // Read parent context if it exists
  const parentContext = useContext(FathomContext)

  // Parse debug options
  const debugOptions: DebugOptions = useMemo(() => {
    if (debugProp === true) {
      return { enabled: true, console: true }
    }
    if (debugProp && typeof debugProp === 'object') {
      return {
        enabled: debugProp.enabled ?? false,
        console: debugProp.console ?? debugProp.enabled ?? false,
        onTrack: debugProp.onTrack,
      }
    }
    // Inherit from parent if not specified
    return {
      enabled: parentContext.debugEnabled ?? false,
      console: false,
    }
  }, [debugProp, parentContext.debugEnabled])

  const debugEnabled = debugOptions.enabled

  // Store debug subscribers
  const debugSubscribersRef = useRef<Set<DebugEventCallback>>(new Set())

  // Inherit parent's subscribers if we're a nested provider without our own debug config
  useEffect(() => {
    if (!debugProp && parentContext.subscribeToDebug) {
      // We don't have our own debug config, so we don't need our own subscribers
      // Events will flow through parent
    }
  }, [debugProp, parentContext.subscribeToDebug])

  // Subscribe to debug events
  const subscribeToDebug = useCallback((callback: DebugEventCallback) => {
    debugSubscribersRef.current.add(callback)
    return () => {
      debugSubscribersRef.current.delete(callback)
    }
  }, [])

  // Emit debug event to all subscribers and optionally log to console
  const emitDebugEvent = useCallback(
    (event: DebugEvent) => {
      if (!debugEnabled) return

      // Log to console if enabled
      if (debugOptions.console) {
        const emoji = event.type === 'pageview' ? '📄' : event.type === 'event' ? '🎯' : '🏆'
        const label = event.type === 'pageview'
          ? `Pageview: ${event.url || '(current page)'}`
          : event.type === 'event'
            ? `Event: ${event.eventName}`
            : `Goal: ${event.goalCode} ($${((event.goalCents || 0) / 100).toFixed(2)})`

        console.log(
          `%c[react-fathom] ${emoji} ${label}`,
          'color: #8b5cf6; font-weight: bold;',
          event.options || ''
        )
      }

      // Call the onTrack callback if provided
      if (debugOptions.onTrack) {
        debugOptions.onTrack(event)
      }

      // Notify all subscribers
      debugSubscribersRef.current.forEach((callback) => {
        try {
          callback(event)
        } catch (err) {
          console.error('[react-fathom] Debug subscriber error:', err)
        }
      })
    },
    [debugEnabled, debugOptions]
  )

  // Use provided client or fall back to parent client or default Fathom
  const client = useMemo(
    () => providedClient ?? parentContext.client ?? Fathom,
    [providedClient, parentContext.client],
  )

  // Merge defaultPageviewOptions: parent + provided (provided overrides parent)
  const defaultPageviewOptions = useMemo(
    () => ({
      ...parentContext.defaultPageviewOptions,
      ...providedDefaultPageviewOptions,
    }),
    [providedDefaultPageviewOptions, parentContext.defaultPageviewOptions],
  )

  // Merge defaultEventOptions: parent + provided (provided overrides parent)
  const defaultEventOptions = useMemo(
    () => ({
      ...parentContext.defaultEventOptions,
      ...providedDefaultEventOptions,
    }),
    [providedDefaultEventOptions, parentContext.defaultEventOptions],
  )

  const blockTrackingForMe = useCallback(() => {
    client.blockTrackingForMe()
  }, [client])

  const enableTrackingForMe = useCallback(() => {
    client.enableTrackingForMe()
  }, [client])

  const isTrackingEnabled = useCallback(() => {
    return client.isTrackingEnabled() ?? false
  }, [client])

  const load = useCallback(
    (siteId: string, clientOptions?: LoadOptions) => {
      client.load(siteId, clientOptions)
    },
    [client],
  )

  const setSite = useCallback(
    (siteId: string) => {
      client.setSite(siteId)
    },
    [client],
  )

  const trackEvent = useCallback(
    (eventName: string, options?: EventOptions) => {
      const mergedOptions = {
        ...defaultEventOptions,
        ...options,
      }

      // Emit debug event
      emitDebugEvent({
        id: generateDebugEventId(),
        timestamp: Date.now(),
        type: 'event',
        eventName,
        options: mergedOptions,
      })

      // Track to Fathom
      client.trackEvent(eventName, mergedOptions)
    },
    [client, defaultEventOptions, emitDebugEvent],
  )

  const trackPageview = useCallback(
    (options?: PageViewOptions) => {
      const mergedOptions = {
        ...defaultPageviewOptions,
        ...options,
      }

      // Emit debug event
      emitDebugEvent({
        id: generateDebugEventId(),
        timestamp: Date.now(),
        type: 'pageview',
        url: mergedOptions.url,
        options: mergedOptions,
      })

      // Track to Fathom
      client.trackPageview(mergedOptions)
    },
    [client, defaultPageviewOptions, emitDebugEvent],
  )

  const trackGoal = useCallback(
    (code: string, cents: number) => {
      // Emit debug event
      emitDebugEvent({
        id: generateDebugEventId(),
        timestamp: Date.now(),
        type: 'goal',
        goalCode: code,
        goalCents: cents,
      })

      // Track to Fathom
      client.trackGoal(code, cents)
    },
    [client, emitDebugEvent],
  )

  useEffect(() => {
    if (siteId !== undefined) {
      load(siteId, clientOptions)
    }
  }, [clientOptions, load, siteId])

  // Populate the clientRef so the parent component can access the client
  useEffect(() => {
    if (clientRef) {
      clientRef.current = client
    }
  }, [client, clientRef])

  return (
    <FathomContext.Provider
      value={{
        blockTrackingForMe,
        enableTrackingForMe,
        isTrackingEnabled,
        load,
        setSite,
        trackEvent,
        trackGoal,
        trackPageview,
        client,
        defaultPageviewOptions,
        defaultEventOptions,
        subscribeToDebug: debugEnabled ? subscribeToDebug : undefined,
        debugEnabled,
      }}
    >
      {children}
    </FathomContext.Provider>
  )
}

FathomProvider.displayName = 'FathomProvider'

export { FathomProvider }
