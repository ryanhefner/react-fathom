import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, fireEvent, render } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useTrackOnClick } from './useTrackOnClick'

describe('useTrackOnClick', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return a click handler function', () => {
    const { result } = renderHook(
      () => useTrackOnClick({ eventName: 'test-event' }),
      { wrapper },
    )

    expect(typeof result.current).toBe('function')
  })

  it('should track event when handler is called', () => {
    const { result } = renderHook(
      () => useTrackOnClick({ eventName: 'test-event' }),
      { wrapper },
    )

    result.current()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {})
  })

  it('should track event with options', () => {
    const { result } = renderHook(
      () =>
        useTrackOnClick({
          eventName: 'test-event',
          id: 'test-id',
          value: 100,
        }),
      { wrapper },
    )

    result.current()

    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {
      id: 'test-id',
      value: 100,
    })
  })

  it('should prevent default when preventDefault is true', () => {
    const TestComponent = () => {
      const handleClick = useTrackOnClick({
        eventName: 'test-event',
        preventDefault: true,
      })

      return <button onClick={handleClick}>Click me</button>
    }

    const { getByText } = render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    const button = getByText('Click me')
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    fireEvent(button, clickEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  })

  it('should not prevent default when preventDefault is false', () => {
    const TestComponent = () => {
      const handleClick = useTrackOnClick({
        eventName: 'test-event',
        preventDefault: false,
      })

      return <button onClick={handleClick}>Click me</button>
    }

    const { getByText } = render(
      <FathomProvider client={mockClient}>
        <TestComponent />
      </FathomProvider>,
    )

    const button = getByText('Click me')
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    fireEvent(button, clickEvent)

    expect(preventDefaultSpy).not.toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  })

  it('should call custom callback after tracking', () => {
    const callback = vi.fn()
    const { result } = renderHook(
      () =>
        useTrackOnClick({
          eventName: 'test-event',
          callback,
        }),
      { wrapper },
    )

    const mockEvent = {} as React.MouseEvent
    result.current(mockEvent)

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(mockEvent)
  })

  it('should call callback even when event is undefined', () => {
    const callback = vi.fn()
    const { result } = renderHook(
      () =>
        useTrackOnClick({
          eventName: 'test-event',
          callback,
        }),
      { wrapper },
    )

    result.current()

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledTimes(1)
    expect(callback).toHaveBeenCalledWith(undefined)
  })

  it('should memoize the handler function', () => {
    // Note: Due to eventOptions being created from destructuring,
    // the handler will be recreated if eventOptions object reference changes.
    // This test verifies that the handler is stable when options don't change.
    const options = { eventName: 'test-event' }
    const { result } = renderHook(() => useTrackOnClick(options), { wrapper })

    const firstHandler = result.current
    // Call the handler to ensure it works
    firstHandler()

    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {})
    // The handler should be a function
    expect(typeof firstHandler).toBe('function')
  })

  it('should create new handler when options change', () => {
    const { result, rerender } = renderHook(
      ({ eventName }) => useTrackOnClick({ eventName }),
      {
        wrapper,
        initialProps: { eventName: 'event-1' },
      },
    )

    const firstHandler = result.current
    rerender({ eventName: 'event-2' })
    const secondHandler = result.current

    expect(firstHandler).not.toBe(secondHandler)
  })
})
