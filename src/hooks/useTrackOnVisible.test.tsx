import React from 'react'

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { render, renderHook, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useTrackOnVisible } from './useTrackOnVisible'

describe('useTrackOnVisible', () => {
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FathomProvider client={mockClient}>{children}</FathomProvider>
  )

  let mockObserve: ReturnType<typeof vi.fn>
  let mockDisconnect: ReturnType<typeof vi.fn>
  let observerCallback: (entries: IntersectionObserverEntry[]) => void

  beforeEach(() => {
    vi.clearAllMocks()
    mockObserve = vi.fn()
    mockDisconnect = vi.fn()

    global.IntersectionObserver = class MockIntersectionObserver {
      observe = mockObserve
      disconnect = mockDisconnect
      unobserve = vi.fn()

      constructor(callback: (entries: IntersectionObserverEntry[]) => void) {
        observerCallback = callback
      }
    } as any
  })

  afterEach(() => {
    delete (global as any).IntersectionObserver
  })

  it('should return a ref object', () => {
    const { result } = renderHook(
      () => useTrackOnVisible({ eventName: 'test-event' }),
      { wrapper },
    )

    expect(result.current).toHaveProperty('current')
  })

  it('should create IntersectionObserver when ref is attached', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({ eventName: 'test-event' })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })
  })

  it('should track event when element becomes visible', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({ eventName: 'test-event' })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    // Simulate intersection
    const element = document.querySelector('div')
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
      expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {})
    })
  })

  it('should track event with options', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({
        eventName: 'test-event',
        id: 'test-id',
        value: 100,
      })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = document.querySelector('div')
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {
        id: 'test-id',
        value: 100,
      })
    })
  })

  it('should track only once when trackOnce is true', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({
        eventName: 'test-event',
        trackOnce: true,
      })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = document.querySelector('div')
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])
    observerCallback([mockEntry])
    observerCallback([mockEntry])

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    })
  })

  it('should track multiple times when trackOnce is false', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({
        eventName: 'test-event',
        trackOnce: false,
      })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = document.querySelector('div')
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])
    observerCallback([mockEntry])
    observerCallback([mockEntry])

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledTimes(3)
    })
  })

  it('should call callback when element becomes visible', async () => {
    const callback = vi.fn()

    const TestComponent = () => {
      const ref = useTrackOnVisible({
        eventName: 'test-event',
        callback,
      })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = document.querySelector('div')
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])

    await waitFor(() => {
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenCalledWith(mockEntry)
    })
  })

  it('should use custom observer options', async () => {
    const observerOptions = { threshold: 0.5 }
    let capturedOptions: IntersectionObserverInit | undefined

    const OriginalObserver = global.IntersectionObserver
    global.IntersectionObserver = class MockIntersectionObserver {
      observe = mockObserve
      disconnect = mockDisconnect
      unobserve = vi.fn()

      constructor(
        callback: (entries: IntersectionObserverEntry[]) => void,
        options?: IntersectionObserverInit,
      ) {
        capturedOptions = options
        observerCallback = callback
      }
    } as any

    const TestComponent = () => {
      const ref = useTrackOnVisible({
        eventName: 'test-event',
        observerOptions,
      })
      return <div ref={ref}>Test</div>
    }

    render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(capturedOptions?.threshold).toBe(0.5)
    })

    global.IntersectionObserver = OriginalObserver
  })

  it('should disconnect observer on unmount', async () => {
    const TestComponent = () => {
      const ref = useTrackOnVisible({ eventName: 'test-event' })
      return <div ref={ref}>Test</div>
    }

    const { unmount } = render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    // Wait for observer to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    unmount()

    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })
})
