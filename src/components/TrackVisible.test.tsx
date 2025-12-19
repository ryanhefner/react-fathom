import React from 'react'

import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { TrackVisible } from './TrackVisible'

describe('TrackVisible', () => {
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

  it('should render children', () => {
    render(
      <TrackVisible eventName="test-event">
        <div>Visible content</div>
      </TrackVisible>,
      { wrapper },
    )

    expect(screen.getByText('Visible content')).toBeInTheDocument()
  })

  it('should create IntersectionObserver on mount', () => {
    render(
      <TrackVisible eventName="test-event">
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    expect(mockObserve).toHaveBeenCalled()
  })

  it('should track event when element becomes visible', async () => {
    render(
      <TrackVisible eventName="test-event">
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = screen.getByText('Content').parentElement
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
    render(
      <TrackVisible eventName="test-event" id="test-id" value={100}>
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = screen.getByText('Content').parentElement
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
    render(
      <TrackVisible eventName="test-event" trackOnce>
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = screen.getByText('Content').parentElement
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
    render(
      <TrackVisible eventName="test-event" trackOnce={false}>
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = screen.getByText('Content').parentElement
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

    render(
      <TrackVisible eventName="test-event" observerOptions={observerOptions}>
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    await waitFor(() => {
      expect(capturedOptions?.threshold).toBe(0.5)
    })

    global.IntersectionObserver = OriginalObserver
  })

  it('should render with custom element type', () => {
    render(
      <TrackVisible eventName="test-event" as="section">
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    const wrapperElement = screen.getByText('Content').parentElement
    expect(wrapperElement?.tagName).toBe('SECTION')
  })

  it('should render with default div wrapper', () => {
    render(
      <TrackVisible eventName="test-event">
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    const wrapperElement = screen.getByText('Content').parentElement
    expect(wrapperElement?.tagName).toBe('DIV')
  })

  it('should forward ref', () => {
    const ref = { current: null }

    render(
      <TrackVisible eventName="test-event" ref={ref}>
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    expect(ref.current).not.toBeNull()
    expect(ref.current).toBeInstanceOf(HTMLDivElement)
  })

  it('should disconnect observer on unmount', async () => {
    const { unmount } = render(
      <TrackVisible eventName="test-event">
        <div>Content</div>
      </TrackVisible>,
      { wrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    unmount()

    expect(mockDisconnect).toHaveBeenCalledTimes(1)
  })

  it('should merge defaultEventOptions from provider', async () => {
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ id: 'default-id' }}
      >
        {children}
      </FathomProvider>
    )

    render(
      <TrackVisible eventName="test-event" value={100}>
        <div>Content</div>
      </TrackVisible>,
      { wrapper: customWrapper },
    )

    // Wait for IntersectionObserver to be created
    await waitFor(() => {
      expect(mockObserve).toHaveBeenCalled()
    })

    const element = screen.getByText('Content').parentElement
    const mockEntry = {
      isIntersecting: true,
      target: element!,
    } as IntersectionObserverEntry

    observerCallback([mockEntry])

    await waitFor(() => {
      expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {
        id: 'default-id',
        value: 100,
      })
    })
  })
})
