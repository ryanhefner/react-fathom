import { useContext, useEffect, useState } from 'react'

import { FathomContext } from '../FathomContext'
import type { DebugEvent, DebugEventCallback } from '../types'

export interface UseDebugSubscriptionOptions {
  /**
   * Maximum number of events to keep in history.
   * @default 50
   */
  maxEvents?: number
  /**
   * Callback fired when a new event is received.
   */
  onEvent?: DebugEventCallback
}

export interface UseDebugSubscriptionResult {
  /**
   * Array of debug events, most recent first.
   */
  events: DebugEvent[]
  /**
   * Whether debug mode is enabled in the provider.
   */
  debugEnabled: boolean
  /**
   * Clear all events from history.
   */
  clearEvents: () => void
}

/**
 * Hook to subscribe to debug events from FathomProvider.
 * Returns an array of events that can be displayed in a UI.
 *
 * @example
 * ```tsx
 * function DebugPanel() {
 *   const { events, debugEnabled, clearEvents } = useDebugSubscription({
 *     maxEvents: 20,
 *     onEvent: (event) => console.log('New event:', event)
 *   })
 *
 *   if (!debugEnabled) return null
 *
 *   return (
 *     <div>
 *       <button onClick={clearEvents}>Clear</button>
 *       {events.map(event => (
 *         <div key={event.id}>{event.type}: {event.eventName || event.url}</div>
 *       ))}
 *     </div>
 *   )
 * }
 * ```
 */
export function useDebugSubscription(
  options: UseDebugSubscriptionOptions = {}
): UseDebugSubscriptionResult {
  const { maxEvents = 50, onEvent } = options
  const { subscribeToDebug, debugEnabled = false } = useContext(FathomContext)
  const [events, setEvents] = useState<DebugEvent[]>([])

  useEffect(() => {
    if (!subscribeToDebug) return

    const unsubscribe = subscribeToDebug((event) => {
      setEvents((prev) => {
        const updated = [event, ...prev]
        return updated.slice(0, maxEvents)
      })

      if (onEvent) {
        onEvent(event)
      }
    })

    return unsubscribe
  }, [subscribeToDebug, maxEvents, onEvent])

  const clearEvents = () => setEvents([])

  return {
    events,
    debugEnabled,
    clearEvents,
  }
}
