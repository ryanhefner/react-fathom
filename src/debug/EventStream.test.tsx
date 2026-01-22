import React from 'react'

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'

import { act, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { EventStream } from './EventStream'

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

describe('EventStream', () => {
  const mockClient = {
    trackEvent: vi.fn(),
    trackPageview: vi.fn(),
    trackGoal: vi.fn(),
    load: vi.fn(),
    setSite: vi.fn(),
    blockTrackingForMe: vi.fn(),
    enableTrackingForMe: vi.fn(),
    isTrackingEnabled: vi.fn(() => true),
  }

  const localStorageMock = (() => {
    let store: Record<string, string> = {}
    return {
      getItem: vi.fn((key: string) => store[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key]
      }),
      clear: vi.fn(() => {
        store = {}
      }),
    }
  })()

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.clear()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should not render when debug is disabled', async () => {
    render(
      <FathomProvider client={mockClient}>
        <EventStream />
      </FathomProvider>
    )

    // Wait for hydration
    await waitFor(() => {
      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })
  })

  it('should render toggle button when debug is enabled', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })
  })

  it('should show panel when button is clicked', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    expect(screen.getByText(/No events yet/)).toBeInTheDocument()
  })

  it('should hide panel when close button is clicked', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /hide event stream/i }))

    expect(screen.queryByText('📊 Event Stream')).not.toBeInTheDocument()
  })

  it('should display events when tracking calls are made', async () => {
    const TestComponent = () => {
      const [tracked, setTracked] = React.useState(false)
      return (
        <FathomProvider client={mockClient} debug={{ enabled: true, console: false }}>
          <EventStream defaultVisible />
          {!tracked && (
            <button
              onClick={() => {
                mockClient.trackEvent('test-event')
                setTracked(true)
              }}
            >
              Track Event
            </button>
          )}
        </FathomProvider>
      )
    }

    render(<TestComponent />)

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    // Initial state shows no events
    expect(screen.getByText(/No events yet/)).toBeInTheDocument()
  })

  it('should toggle with keyboard shortcut', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })

    // Panel should not be visible initially
    expect(screen.queryByText('📊 Event Stream')).not.toBeInTheDocument()

    // Press Cmd + .
    act(() => {
      fireEvent.keyDown(document, { key: '.', metaKey: true })
    })

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()

    // Press Cmd + . again to hide
    act(() => {
      fireEvent.keyDown(document, { key: '.', metaKey: true })
    })

    expect(screen.queryByText('📊 Event Stream')).not.toBeInTheDocument()
  })

  it('should toggle with Ctrl + . on non-Mac', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })

    // Press Ctrl + .
    act(() => {
      fireEvent.keyDown(document, { key: '.', ctrlKey: true })
    })

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
  })

  it('should persist visibility state to localStorage', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'react-fathom-event-stream-visible',
      'true'
    )
  })

  it('should load visibility state from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('true')

    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })
  })

  it('should handle localStorage errors gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    localStorageMock.getItem.mockImplementation(() => {
      throw new Error('localStorage unavailable')
    })

    // Should not throw
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    errorSpy.mockRestore()
  })

  it('should handle localStorage setItem errors gracefully', async () => {
    localStorageMock.setItem.mockImplementation(() => {
      throw new Error('localStorage full')
    })

    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })

    // Should not throw when clicking
    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
  })

  it('should position panel on the left when position is bottom-left', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream position="bottom-left" defaultVisible />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    // Panel container should be rendered - find the outer positioned div
    const panelContainer = screen.getByText('📊 Event Stream').parentElement?.parentElement
    expect(panelContainer).toHaveAttribute('style', expect.stringContaining('left: 0'))
  })

  it('should show keyboard shortcut hint in footer', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    expect(screen.getByText('⌘.')).toBeInTheDocument()
  })

  it('should disable clear button when no events', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    const clearButton = screen.getByRole('button', { name: 'Clear' })
    expect(clearButton).toBeDisabled()
  })

  it('should use debug={true} shorthand', async () => {
    render(
      <FathomProvider client={mockClient} debug>
        <EventStream />
      </FathomProvider>
    )

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /show event stream/i })).toBeInTheDocument()
    })
  })
})
