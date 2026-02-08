'use client'

import React, { useCallback, useContext, useEffect, useMemo, useRef } from 'react'

import * as Fathom from 'fathom-client'
import type { EventOptions, LoadOptions, PageViewOptions } from 'fathom-client'

import { FathomContext } from './FathomContext'
import type { DebugEvent, DebugEventCallback, DebugOptions, FathomProviderProps } from './types'

const FathomProvider: React.FC<FathomProviderProps> = ({
  children,
  client: providedClient,
  clientRef,
  clientOptions,
  siteId,
  defaultPageviewOptions: providedDefaultPageviewOptions,
  defaultEventOptions: providedDefaultEventOptions,
  debug: debugProp,
  onError,
}) => {
  // Instance-scoped counter for unique debug event IDs
  const debugEventCounterRef = useRef(0)
  const generateDebugEventId = useCallback(
    () => `debug-${Date.now()}-${++debugEventCounterRef.current}`,
    [],
  )

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

  // Log debug state when enabled
  useEffect(() => {
    if (debugEnabled) {
      console.log('[react-fathom] Debug mode: enabled')
    }
  }, [debugEnabled])

  // Warn if debug mode is enabled in production
  useEffect(() => {
    if (debugEnabled && process.env.NODE_ENV === 'production') {
      console.warn(
        '[react-fathom] Debug mode is enabled in production. ' +
          'This may expose tracking data via CustomEvent broadcasts and console logs. ' +
          'Consider disabling debug mode for production builds.'
      )
    }
  }, [debugEnabled])

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
      // Always emit global custom event when debug is enabled
      // This helps with linked packages where React context may not be shared
      if (debugEnabled && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('react-fathom:debug', { detail: event }))
      }

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

  // Helper to safely call client methods with error handling
  const safeClientCall = useCallback(
    <T,>(method: string, fn: () => T, args?: unknown[]): T | undefined => {
      try {
        return fn()
      } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
          console.error(`[react-fathom] ${method}() failed:`, error)
        }
        onError?.(error, { method, args })
        return undefined
      }
    },
    [onError],
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
      safeClientCall('load', () => client.load(siteId, clientOptions), [siteId, clientOptions])
    },
    [client, safeClientCall],
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
      safeClientCall('trackEvent', () => client.trackEvent(eventName, mergedOptions), [eventName, mergedOptions])
    },
    [client, defaultEventOptions, emitDebugEvent, generateDebugEventId, safeClientCall],
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
      safeClientCall('trackPageview', () => client.trackPageview(mergedOptions), [mergedOptions])
    },
    [client, defaultPageviewOptions, emitDebugEvent, generateDebugEventId, safeClientCall],
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
      safeClientCall('trackGoal', () => client.trackGoal(code, cents), [code, cents])
    },
    [client, emitDebugEvent, generateDebugEventId, safeClientCall],
  )

  useEffect(() => {
    if (siteId !== undefined && siteId !== '') {
      load(siteId, clientOptions)
    } else if (process.env.NODE_ENV !== 'production') {
      if (siteId === '') {
        console.warn(
          '[react-fathom] Empty siteId provided to FathomProvider. ' +
            'Please provide a valid Fathom site ID.'
        )
      } else {
        console.warn(
          '[react-fathom] No siteId provided to FathomProvider. ' +
            'Analytics tracking will not be sent to Fathom until a siteId is configured. ' +
            'Debug events will still be captured if debug mode is enabled.'
        )
      }
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
