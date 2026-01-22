'use client'

import { useFathom } from 'react-fathom'
import { useState } from 'react'

type TrackedEvent = {
  id: number
  type: string
  name: string
  value?: number
  timestamp: Date
}

export default function Events() {
  const { trackEvent, trackGoal } = useFathom()
  const [events, setEvents] = useState<TrackedEvent[]>([])
  const [eventId, setEventId] = useState(0)

  const addEvent = (type: string, name: string, value?: number) => {
    setEvents((prev) => [
      {
        id: eventId,
        type,
        name,
        value,
        timestamp: new Date(),
      },
      ...prev,
    ])
    setEventId((prev) => prev + 1)
  }

  const handleTrackEvent = (name: string) => {
    trackEvent(name)
    addEvent('Event', name)
  }

  const handleTrackGoal = (name: string, value: number) => {
    trackGoal(name, value)
    addEvent('Goal', name, value)
  }

  return (
    <div>
      <div className="page-header">
        <h1>Event Tracking Demo</h1>
        <p>Test different event tracking methods</p>
      </div>
      <div className="content">
        <p>
          Click the buttons below to track different types of events. Events will be
          logged below and sent to your Fathom Analytics dashboard.
        </p>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Custom Events</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Track user interactions with custom event names
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleTrackEvent('button-click')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Button Click
            </button>
            <button
              onClick={() => handleTrackEvent('signup-started')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Signup Started
            </button>
            <button
              onClick={() => handleTrackEvent('feature-used')}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#0070f3',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Feature Used
            </button>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Goal Tracking</h2>
          <p style={{ marginBottom: '1rem', color: '#666' }}>
            Track conversions with optional monetary values (in cents)
          </p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => handleTrackGoal('signup-complete', 0)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Signup Complete
            </button>
            <button
              onClick={() => handleTrackGoal('purchase', 2999)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Purchase ($29.99)
            </button>
            <button
              onClick={() => handleTrackGoal('premium-upgrade', 9900)}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: '#fff',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              Premium ($99.00)
            </button>
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Event Log</h2>
          <div
            style={{
              background: '#f5f5f5',
              border: '1px solid #e5e5e5',
              borderRadius: '0.5rem',
              padding: '1rem',
              maxHeight: '300px',
              overflow: 'auto',
            }}
          >
            {events.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center', margin: 0 }}>
                No events tracked yet. Click a button above to get started.
              </p>
            ) : (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {events.map((event) => (
                  <li
                    key={event.id}
                    style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #e5e5e5',
                      fontFamily: 'monospace',
                      fontSize: '0.875rem',
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-block',
                        width: '60px',
                        padding: '0.125rem 0.5rem',
                        background: event.type === 'Event' ? '#dbeafe' : '#d1fae5',
                        color: event.type === 'Event' ? '#1d4ed8' : '#047857',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem',
                        textAlign: 'center',
                        marginRight: '0.75rem',
                      }}
                    >
                      {event.type}
                    </span>
                    <span style={{ fontWeight: 500 }}>{event.name}</span>
                    {event.value !== undefined && event.value > 0 && (
                      <span style={{ color: '#666', marginLeft: '0.5rem' }}>
                        ${(event.value / 100).toFixed(2)}
                      </span>
                    )}
                    <span style={{ color: '#999', marginLeft: '0.5rem' }}>
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        <section style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem' }}>Code Example</h2>
          <pre
            style={{
              background: '#1a1a1a',
              color: '#e5e5e5',
              padding: '1rem',
              borderRadius: '0.5rem',
              overflow: 'auto',
            }}
          >
            <code>{`'use client'

import { useFathom } from 'react-fathom'

export default function MyComponent() {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <>
      {/* Track a custom event */}
      <button onClick={() => trackEvent('button-click')}>
        Click Me
      </button>

      {/* Track a goal with monetary value (in cents) */}
      <button onClick={() => trackGoal('purchase', 2999)}>
        Buy Now - $29.99
      </button>
    </>
  )
}`}</code>
          </pre>
        </section>
      </div>
    </div>
  )
}
