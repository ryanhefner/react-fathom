import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { act, renderHook, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useFathom } from './useFathom'
import { useDebugSubscription } from './useDebugSubscription'

// Mock fathom-client
vi.mock('fathom-client', () => ({
  trackEvent: vi.fn(),
  trackPageview: vi.fn(),
  trackGoal: vi.fn(),
  load: vi.fn(),
  setSite: vi.fn(),
  blockTrackingForMe: vi.fn(),
  enableTrackingForMe: vi.fn(),
  isTrackingEnabled: vi.fn(() => true),
}))

describe('useDebugSubscription', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return debugEnabled as false when debug is not enabled', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useDebugSubscription(), { wrapper })

    expect(result.current.debugEnabled).toBe(false)
    expect(result.current.events).toEqual([])
  })

  it('should return debugEnabled as true when debug is enabled', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true }}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useDebugSubscription(), { wrapper })

    expect(result.current.debugEnabled).toBe(true)
  })

  it('should receive events when trackEvent is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription()
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackEvent?.('test-event', { _value: 100 })
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(1)
    })

    expect(result.current.debug.events[0].type).toBe('event')
    expect(result.current.debug.events[0].eventName).toBe('test-event')
  })

  it('should receive events when trackPageview is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription()
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackPageview?.({ url: '/test-page' })
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(1)
    })

    expect(result.current.debug.events[0].type).toBe('pageview')
    expect(result.current.debug.events[0].url).toBe('/test-page')
  })

  it('should receive events when trackGoal is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription()
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackGoal?.('GOAL123', 2999)
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(1)
    })

    expect(result.current.debug.events[0].type).toBe('goal')
    expect(result.current.debug.events[0].goalCode).toBe('GOAL123')
    expect(result.current.debug.events[0].goalCents).toBe(2999)
  })

  it('should limit events to maxEvents', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription({ maxEvents: 3 })
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackEvent?.('event-1')
      result.current.fathom.trackEvent?.('event-2')
      result.current.fathom.trackEvent?.('event-3')
      result.current.fathom.trackEvent?.('event-4')
      result.current.fathom.trackEvent?.('event-5')
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(3)
    })

    // Most recent events should be first
    expect(result.current.debug.events[0].eventName).toBe('event-5')
    expect(result.current.debug.events[1].eventName).toBe('event-4')
    expect(result.current.debug.events[2].eventName).toBe('event-3')
  })

  it('should call onEvent callback when events are received', async () => {
    const onEventSpy = vi.fn()
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription({ onEvent: onEventSpy })
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackEvent?.('test-event')
    })

    await waitFor(() => {
      expect(onEventSpy).toHaveBeenCalled()
    })

    expect(onEventSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'event',
        eventName: 'test-event',
      })
    )
  })

  it('should clear events when clearEvents is called', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug={{ enabled: true, console: false }}>
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription()
        return { fathom, debug }
      },
      { wrapper }
    )

    act(() => {
      result.current.fathom.trackEvent?.('event-1')
      result.current.fathom.trackEvent?.('event-2')
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(2)
    })

    act(() => {
      result.current.debug.clearEvents()
    })

    expect(result.current.debug.events.length).toBe(0)
  })

  it('should work with debug={true} shorthand', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider debug>{children}</FathomProvider>
    )

    const { result } = renderHook(
      () => {
        const fathom = useFathom()
        const debug = useDebugSubscription()
        return { fathom, debug }
      },
      { wrapper }
    )

    expect(result.current.debug.debugEnabled).toBe(true)

    act(() => {
      result.current.fathom.trackEvent?.('test-event')
    })

    await waitFor(() => {
      expect(result.current.debug.events.length).toBe(1)
    })
  })
})
