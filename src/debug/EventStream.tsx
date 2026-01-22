'use client'

import React, { useState, useEffect } from 'react'
import { useDebugSubscription } from '../hooks/useDebugSubscription'
import type { DebugEvent } from '../types'

const STORAGE_KEY = 'react-fathom-event-stream-visible'

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

interface EventCardProps {
  event: DebugEvent
}

function EventCard({ event }: EventCardProps) {
  const colors = {
    pageview: '#3b82f6',
    event: '#8b5cf6',
    goal: '#22c55e',
  }

  let title = ''
  let subtitle = ''

  switch (event.type) {
    case 'pageview':
      title = 'Pageview'
      subtitle = event.url || (typeof window !== 'undefined' ? window.location.pathname : '')
      break
    case 'event':
      title = 'Event'
      subtitle = event.eventName || ''
      break
    case 'goal':
      title = 'Goal'
      subtitle = `${event.goalCode} ($${((event.goalCents || 0) / 100).toFixed(2)})`
      break
  }

  return (
    <div
      style={{
        padding: '12px',
        borderRadius: '8px',
        borderLeft: `3px solid ${colors[event.type]}`,
        backgroundColor: 'var(--rf-event-bg, #f8fafc)',
        marginBottom: '8px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <strong style={{ fontSize: '14px' }}>{title}</strong>
        <span style={{ fontSize: '12px', color: '#6b7280' }}>{formatTime(event.timestamp)}</span>
      </div>
      <div style={{ fontSize: '12px', color: '#4b5563', wordBreak: 'break-all' }}>
        {subtitle}
      </div>
    </div>
  )
}

export interface EventStreamProps {
  /**
   * Maximum number of events to display
   * @default 20
   */
  maxEvents?: number
  /**
   * Position of the toggle button
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left'
  /**
   * Initial visibility state (overridden by localStorage if available)
   * @default false
   */
  defaultVisible?: boolean
}

/**
 * A debug panel component that displays tracked events in real-time.
 * Only renders when debug mode is enabled in the FathomProvider.
 *
 * @example
 * ```tsx
 * <FathomProvider siteId="..." debug={{ enabled: true }}>
 *   <App />
 *   <EventStream />
 * </FathomProvider>
 * ```
 */
export function EventStream({
  maxEvents = 20,
  position = 'bottom-right',
  defaultVisible = false,
}: EventStreamProps = {}) {
  const [isVisible, setIsVisible] = useState(defaultVisible)
  const [isHydrated, setIsHydrated] = useState(false)
  const { events, debugEnabled, clearEvents } = useDebugSubscription({ maxEvents })

  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        setIsVisible(stored === 'true')
      }
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        setIsVisible((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(isVisible))
    }
  }, [isVisible, isHydrated])

  if (!debugEnabled || !isHydrated) return null

  const isRight = position === 'bottom-right'

  return (
    <>
      <button
        onClick={() => setIsVisible(!isVisible)}
        aria-label={isVisible ? 'Hide event stream' : 'Show event stream'}
        style={{
          position: 'fixed',
          bottom: '16px',
          [isRight ? 'right' : 'left']: '16px',
          zIndex: 1000,
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: '#8b5cf6',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        }}
      >
        {isVisible ? '✕' : '📊'}
      </button>

      {isVisible && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            [isRight ? 'right' : 'left']: 0,
            bottom: 0,
            width: '320px',
            backgroundColor: 'var(--rf-panel-bg, white)',
            borderLeft: isRight ? '1px solid #e5e7eb' : undefined,
            borderRight: isRight ? undefined : '1px solid #e5e7eb',
            zIndex: 999,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: isRight ? '-4px 0 12px rgba(0,0,0,0.1)' : '4px 0 12px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              padding: '16px',
              borderBottom: '1px solid #e5e7eb',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: 'var(--rf-header-bg, #f9fafb)',
            }}
          >
            <strong>📊 Event Stream</strong>
            <button
              onClick={clearEvents}
              disabled={events.length === 0}
              style={{
                padding: '4px 8px',
                fontSize: '12px',
                backgroundColor: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: '4px',
                cursor: events.length === 0 ? 'not-allowed' : 'pointer',
                opacity: events.length === 0 ? 0.5 : 1,
              }}
            >
              Clear
            </button>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {events.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#6b7280', padding: '32px 16px' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
                <div style={{ fontSize: '14px' }}>
                  No events yet.<br />Navigate or interact to see tracking events.
                </div>
              </div>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>

          <div
            style={{
              padding: '12px',
              borderTop: '1px solid #e5e7eb',
              backgroundColor: 'var(--rf-footer-bg, #f9fafb)',
              fontSize: '12px',
              color: '#6b7280',
              textAlign: 'center',
            }}
          >
            {events.length} event{events.length !== 1 ? 's' : ''} •{' '}
            <code style={{ backgroundColor: '#e5e7eb', padding: '2px 4px', borderRadius: '4px' }}>⌘.</code> to toggle
          </div>
        </div>
      )}
    </>
  )
}
