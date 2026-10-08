import React from 'react'

import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest'

import {
  act,
  fireEvent,
  render,
  renderHook,
  screen,
  waitFor,
  within,
} from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { EventStream, type EventStreamProps } from './EventStream'
import { useFathom } from '../hooks/useFathom'

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

  const createLocalStorageMock = () => {
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
  }
  let localStorageMock: ReturnType<typeof createLocalStorageMock>

  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock = createLocalStorageMock()
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.useRealTimers()
  })

  function renderTrackedStream(props: EventStreamProps = {}) {
    return renderHook(() => useFathom(), {
      wrapper: ({ children }) => (
        <FathomProvider
          client={mockClient}
          debug={{ enabled: true, console: false }}
        >
          <EventStream defaultVisible {...props} />
          {children}
        </FathomProvider>
      ),
    })
  }

  it('should not render when debug is disabled', async () => {
    render(
      <FathomProvider client={mockClient}>
        <EventStream />
      </FathomProvider>,
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
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })
  })

  it('should show panel when button is clicked', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    expect(screen.getByText(/No events yet/)).toBeInTheDocument()
  })

  it('should hide panel when close button is clicked', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /hide event stream/i }))

    expect(screen.queryByText('📊 Event Stream')).not.toBeInTheDocument()
  })

  it('should display events when tracking calls are made', async () => {
    const timestamp = new Date(2026, 0, 1, 13, 2, 3).getTime()
    vi.spyOn(Date, 'now').mockReturnValue(timestamp)
    const { result } = renderTrackedStream()
    const panel = await screen.findByRole('region', {
      name: 'Fathom event stream',
    })
    expect(screen.getByText(/No events yet/)).toBeInTheDocument()

    act(() => {
      result.current.trackPageview({ url: '/docs/getting-started' })
      result.current.trackEvent('signup-click', { _value: 50 })
      result.current.trackGoal('purchase', 2999)
    })

    const titles = within(panel).getAllByText(/^(Pageview|Event|Goal)$/)
    expect(titles.map((title) => title.textContent)).toEqual([
      'Goal',
      'Event',
      'Pageview',
    ])
    for (const [title, subtitle] of [
      ['Pageview', '/docs/getting-started'],
      ['Event', 'signup-click'],
      ['Goal', 'purchase ($29.99)'],
    ]) {
      const card = within(panel).getByText(title).parentElement?.parentElement
      if (!card) throw new Error(`Missing ${title} card`)
      expect(within(card).getByText(subtitle)).toBeInTheDocument()
      expect(within(card).getByText('01:02:03 PM')).toBeInTheDocument()
    }
    expect(screen.queryByText(/No events yet/)).not.toBeInTheDocument()
    expect(within(panel).getByText(/3 events/)).toBeInTheDocument()
    expect(mockClient.trackPageview).toHaveBeenCalledWith({
      url: '/docs/getting-started',
    })
    expect(mockClient.trackEvent).toHaveBeenCalledWith('signup-click', {
      _value: 50,
    })
    expect(mockClient.trackGoal).toHaveBeenCalledWith('purchase', 2999)
  })

  it('should show the current path and a zero-valued goal when values are omitted', async () => {
    const { result } = renderTrackedStream()
    await screen.findByRole('region', { name: 'Fathom event stream' })

    act(() => {
      result.current.trackPageview()
      result.current.trackGoal('free-signup', 0)
    })

    expect(screen.getByText(window.location.pathname)).toBeInTheDocument()
    expect(screen.getByText('free-signup ($0.00)')).toBeInTheDocument()
  })

  it('should clear events and keep receiving new events afterwards', async () => {
    const { result } = renderTrackedStream()
    await screen.findByRole('region', { name: 'Fathom event stream' })
    const clear = screen.getByRole('button', { name: 'Clear' })
    expect(clear).toBeDisabled()

    act(() => result.current.trackEvent('before-clear'))
    expect(screen.getByText(/1 event •/)).toBeInTheDocument()
    expect(clear).toBeEnabled()
    fireEvent.click(clear)

    expect(screen.queryByText('before-clear')).not.toBeInTheDocument()
    expect(screen.getByText(/No events yet/)).toBeInTheDocument()
    expect(clear).toBeDisabled()
    act(() => result.current.trackEvent('after-clear'))
    expect(screen.getByText('after-clear')).toBeInTheDocument()
    expect(screen.getByText(/1 event •/)).toBeInTheDocument()
  })

  it('should limit history to the newest maxEvents entries', async () => {
    const { result } = renderTrackedStream({ maxEvents: 2 })
    await screen.findByRole('region', { name: 'Fathom event stream' })

    act(() => {
      result.current.trackEvent('oldest')
      result.current.trackEvent('middle')
      result.current.trackEvent('newest')
    })

    expect(screen.queryByText('oldest')).not.toBeInTheDocument()
    expect(
      screen.getAllByText(/^(middle|newest)$/).map((el) => el.textContent),
    ).toEqual(['newest', 'middle'])
    expect(screen.getByText(/2 events/)).toBeInTheDocument()
  })

  it('should cancel deferred hydration and remove the keyboard handler on unmount', () => {
    vi.useFakeTimers()
    const clearTimeout = vi.spyOn(window, 'clearTimeout')
    const removeListener = vi.spyOn(document, 'removeEventListener')
    const { unmount } = renderTrackedStream()
    expect(screen.queryByRole('region')).not.toBeInTheDocument()

    unmount()
    act(() => vi.runAllTimers())
    expect(clearTimeout).toHaveBeenCalled()
    expect(removeListener).toHaveBeenCalledWith('keydown', expect.any(Function))
    expect(localStorageMock.getItem).not.toHaveBeenCalled()
    expect(localStorageMock.setItem).not.toHaveBeenCalled()
  })

  it('should let a stored false value override default visibility', async () => {
    localStorageMock.getItem.mockReturnValue('false')
    renderTrackedStream()

    await screen.findByRole('button', { name: /show event stream/i })
    expect(screen.queryByRole('region')).not.toBeInTheDocument()
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'react-fathom-event-stream-visible',
      'false',
    )
  })

  it('should toggle with keyboard shortcut', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
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
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })

    // Press Ctrl + .
    act(() => {
      fireEvent.keyDown(document, { key: '.', ctrlKey: true })
    })

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
  })

  it('should not intercept the keyboard shortcut while typing', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <input aria-label="Example input" />
        <EventStream />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })

    fireEvent.keyDown(screen.getByRole('textbox', { name: 'Example input' }), {
      key: '.',
      metaKey: true,
    })

    expect(screen.queryByText('📊 Event Stream')).not.toBeInTheDocument()
  })

  it('should persist visibility state to localStorage', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })

    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'react-fathom-event-stream-visible',
      'true',
    )
  })

  it('should load visibility state from localStorage', async () => {
    localStorageMock.getItem.mockReturnValue('true')

    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    expect(
      screen.getByRole('region', { name: 'Fathom event stream' }),
    ).toBeInTheDocument()
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
      </FathomProvider>,
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
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })

    // Should not throw when clicking
    fireEvent.click(screen.getByRole('button', { name: /show event stream/i }))

    expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
  })

  it('should position panel on the left when position is bottom-left', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream position="bottom-left" defaultVisible />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByText('📊 Event Stream')).toBeInTheDocument()
    })

    // Panel container should be rendered - find the outer positioned div
    const panelContainer =
      screen.getByText('📊 Event Stream').parentElement?.parentElement
    expect(panelContainer).toHaveAttribute(
      'style',
      expect.stringContaining('left: 0'),
    )
  })

  it('should show keyboard shortcut hint in footer', async () => {
    render(
      <FathomProvider client={mockClient} debug={{ enabled: true }}>
        <EventStream defaultVisible />
      </FathomProvider>,
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
      </FathomProvider>,
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
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /show event stream/i }),
      ).toBeInTheDocument()
    })
  })
})
