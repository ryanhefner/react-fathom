import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, act } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useAppStateTracking } from './useAppStateTracking'

// Store the listener callback for testing
let appStateChangeCallback: ((state: string) => void) | null = null
const mockRemove = vi.fn()

// Mock react-native AppState
vi.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: vi.fn((event, callback) => {
      if (event === 'change') {
        appStateChangeCallback = callback
      }
      return { remove: mockRemove }
    }),
  },
}))

describe('useAppStateTracking', () => {
  const mockTrackEvent = vi.fn()
  const mockClient = {
    trackEvent: mockTrackEvent,
    trackPageview: vi.fn(),
    trackGoal: vi.fn(),
    load: vi.fn(),
    setSite: vi.fn(),
    blockTrackingForMe: vi.fn(),
    enableTrackingForMe: vi.fn(),
    isTrackingEnabled: vi.fn(() => true),
  }

  beforeEach(() => {
    vi.clearAllMocks()
    appStateChangeCallback = null
  })

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(FathomProvider, { client: mockClient }, children)
  }

  it('should set up AppState listener on mount', async () => {
    const reactNative = await import('react-native')

    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    expect(reactNative.AppState.addEventListener).toHaveBeenCalledWith(
      'change',
      expect.any(Function),
    )
  })

  it('should clean up listener on unmount', () => {
    const { unmount } = renderHook(() => useAppStateTracking(), {
      wrapper: createWrapper(),
    })

    unmount()

    expect(mockRemove).toHaveBeenCalled()
  })

  it('should track foreground event when app becomes active', () => {
    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    // Simulate app going to background then foreground
    act(() => {
      appStateChangeCallback?.('background')
    })

    act(() => {
      appStateChangeCallback?.('active')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-foreground', expect.anything())
  })

  it('should track background event when app goes to background', () => {
    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    // Simulate app going to background (from active state)
    act(() => {
      appStateChangeCallback?.('background')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-background', expect.anything())
  })

  it('should use custom foreground event name', () => {
    renderHook(
      () =>
        useAppStateTracking({
          foregroundEventName: 'app-resumed',
        }),
      { wrapper: createWrapper() },
    )

    // Simulate app going to background then foreground
    act(() => {
      appStateChangeCallback?.('background')
    })

    act(() => {
      appStateChangeCallback?.('active')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-resumed', expect.anything())
  })

  it('should use custom background event name', () => {
    renderHook(
      () =>
        useAppStateTracking({
          backgroundEventName: 'app-paused',
        }),
      { wrapper: createWrapper() },
    )

    act(() => {
      appStateChangeCallback?.('background')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-paused', expect.anything())
  })

  it('should include eventOptions in tracked events', () => {
    const eventOptions = { _site_id: 'app-state-tracking' }

    renderHook(
      () =>
        useAppStateTracking({
          eventOptions,
        }),
      { wrapper: createWrapper() },
    )

    act(() => {
      appStateChangeCallback?.('background')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-background', eventOptions)
  })

  it('should call onStateChange callback when state changes', () => {
    const onStateChange = vi.fn()

    renderHook(
      () =>
        useAppStateTracking({
          onStateChange,
        }),
      { wrapper: createWrapper() },
    )

    act(() => {
      appStateChangeCallback?.('background')
    })

    expect(onStateChange).toHaveBeenCalledWith('background')
  })

  it('should track inactive state as background', () => {
    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    act(() => {
      appStateChangeCallback?.('inactive')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-background', expect.anything())
  })

  it('should track foreground when transitioning from inactive to active', () => {
    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    // Go to inactive first
    act(() => {
      appStateChangeCallback?.('inactive')
    })

    mockTrackEvent.mockClear()

    // Then to active
    act(() => {
      appStateChangeCallback?.('active')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('app-foreground', expect.anything())
  })

  it('should not track when transitioning between inactive and background', () => {
    renderHook(() => useAppStateTracking(), { wrapper: createWrapper() })

    // Go to inactive first
    act(() => {
      appStateChangeCallback?.('inactive')
    })

    mockTrackEvent.mockClear()

    // Then to background (no foreground event should be tracked)
    act(() => {
      appStateChangeCallback?.('background')
    })

    // Should not track foreground event
    expect(mockTrackEvent).not.toHaveBeenCalledWith(
      'app-foreground',
      expect.anything(),
    )
  })

  it('should work with all options combined', () => {
    const onStateChange = vi.fn()
    const eventOptions = { _value: 1 }

    renderHook(
      () =>
        useAppStateTracking({
          foregroundEventName: 'resumed',
          backgroundEventName: 'paused',
          eventOptions,
          onStateChange,
        }),
      { wrapper: createWrapper() },
    )

    act(() => {
      appStateChangeCallback?.('background')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('paused', eventOptions)
    expect(onStateChange).toHaveBeenCalledWith('background')

    act(() => {
      appStateChangeCallback?.('active')
    })

    expect(mockTrackEvent).toHaveBeenCalledWith('resumed', eventOptions)
    expect(onStateChange).toHaveBeenCalledWith('active')
  })
})
