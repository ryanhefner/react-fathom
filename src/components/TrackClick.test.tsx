import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { fireEvent, render, screen } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { TrackClick } from './TrackClick'

describe('TrackClick', () => {
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

  it('should render children', () => {
    render(
      <TrackClick eventName="test-event">
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('should track event on click', () => {
    render(
      <TrackClick eventName="test-event">
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    fireEvent.click(screen.getByText('Click me'))

    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {})
  })

  it('should track event with options', () => {
    render(
      <TrackClick eventName="test-event" id="test-id" value={100}>
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    fireEvent.click(screen.getByText('Click me'))

    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {
      id: 'test-id',
      value: 100,
    })
  })

  it('should prevent default when preventDefault is true', () => {
    render(
      <TrackClick eventName="test-event" preventDefault>
        <a href="/test">Link</a>
      </TrackClick>,
      { wrapper },
    )

    const link = screen.getByText('Link')
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    fireEvent(link, clickEvent)

    expect(preventDefaultSpy).toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  })

  it('should not prevent default when preventDefault is false', () => {
    render(
      <TrackClick eventName="test-event" preventDefault={false}>
        <a href="/test">Link</a>
      </TrackClick>,
      { wrapper },
    )

    const link = screen.getByText('Link')
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault')

    fireEvent(link, clickEvent)

    expect(preventDefaultSpy).not.toHaveBeenCalled()
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  })

  it('should call custom onClick handler', () => {
    const onClick = vi.fn()

    render(
      <TrackClick eventName="test-event" onClick={onClick}>
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    fireEvent.click(screen.getByText('Click me'))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(mockTrackEvent).toHaveBeenCalledTimes(1)
  })

  it('should render with custom element type', () => {
    render(
      <TrackClick eventName="test-event" as="span">
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    const wrapperElement = screen.getByText('Click me').parentElement
    expect(wrapperElement?.tagName).toBe('SPAN')
  })

  it('should render with default div wrapper', () => {
    render(
      <TrackClick eventName="test-event">
        <button>Click me</button>
      </TrackClick>,
      { wrapper },
    )

    const wrapperElement = screen.getByText('Click me').parentElement
    expect(wrapperElement?.tagName).toBe('DIV')
  })

  it('should handle multiple children', () => {
    render(
      <TrackClick eventName="test-event">
        <button>Button 1</button>
        <button>Button 2</button>
      </TrackClick>,
      { wrapper },
    )

    expect(screen.getByText('Button 1')).toBeInTheDocument()
    expect(screen.getByText('Button 2')).toBeInTheDocument()
  })

  it('should merge defaultEventOptions from provider', () => {
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ id: 'default-id' }}
      >
        {children}
      </FathomProvider>
    )

    render(
      <TrackClick eventName="test-event" value={100}>
        <button>Click me</button>
      </TrackClick>,
      { wrapper: customWrapper },
    )

    fireEvent.click(screen.getByText('Click me'))

    expect(mockTrackEvent).toHaveBeenCalledWith('test-event', {
      id: 'default-id',
      value: 100,
    })
  })
})
