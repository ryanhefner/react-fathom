import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { GatsbyFathomTrackView } from './GatsbyFathomTrackView'

// Mock @reach/router's globalHistory
const mockListeners: Array<(args: { location: { pathname: string; search: string; hash: string }; action: string }) => void> = []

vi.mock('@reach/router', () => ({
  globalHistory: {
    listen: (callback: (args: { location: { pathname: string; search: string; hash: string }; action: string }) => void) => {
      mockListeners.push(callback)
      return () => {
        const index = mockListeners.indexOf(callback)
        if (index > -1) {
          mockListeners.splice(index, 1)
        }
      }
    },
  },
}))

// Mock fathom-client
vi.mock('fathom-client', () => {
  const mockFathomDefault = {
    trackEvent: vi.fn(),
    trackPageview: vi.fn(),
    trackGoal: vi.fn(),
    load: vi.fn(),
    setSite: vi.fn(),
    blockTrackingForMe: vi.fn(),
    enableTrackingForMe: vi.fn(),
    isTrackingEnabled: vi.fn(() => true),
  }

  return {
    default: mockFathomDefault,
  }
})

// Helper to simulate route changes
function simulateRouteChange(pathname: string, search = '', hash = '', action = 'PUSH') {
  mockListeners.forEach((listener) => {
    listener({
      location: { pathname, search, hash },
      action,
    })
  })
}

describe('GatsbyFathomTrackView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockListeners.length = 0
    delete (window as { location?: unknown }).location
    window.location = {
      href: 'https://example.com/test-page',
      origin: 'https://example.com',
      pathname: '/test-page',
      search: '',
      hash: '',
    } as Location
  })

  it('should track initial pageview on mount', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page',
    })
  })

  it('should track pageviews on route changes', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView />
      </FathomProvider>,
    )

    // Wait for initial pageview
    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(1)
    })

    // Simulate route change
    simulateRouteChange('/new-page')

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(2)
    })

    expect(trackPageviewSpy).toHaveBeenLastCalledWith({
      url: 'https://example.com/new-page',
    })
  })

  it('should track on POP action (back/forward navigation)', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(1)
    })

    // Simulate back navigation
    simulateRouteChange('/previous-page', '', '', 'POP')

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(2)
    })
  })

  it('should not track when disableAutoTrack is true', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView disableAutoTrack />
      </FathomProvider>,
    )

    // Give time for effects to run
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
  })

  it('should include search params by default', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    window.location = {
      ...window.location,
      search: '?foo=bar',
    } as Location

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should include hash when includeHash is true', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    window.location = {
      ...window.location,
      hash: '#section',
    } as Location

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView includeHash />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page#section',
    })
  })

  it('should transform URL when transformUrl is provided', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const transformUrl = (url: string) => url.replace('/test-page', '/transformed')

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView transformUrl={transformUrl} />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/transformed',
    })
  })

  it('should skip tracking when transformUrl returns null', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const transformUrl = () => null

    render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView transformUrl={transformUrl} />
      </FathomProvider>,
    )

    // Give time for effects to run
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
  })

  it('should have displayName', () => {
    expect(GatsbyFathomTrackView.displayName).toBe('GatsbyFathomTrackView')
  })

  it('should cleanup listener on unmount', async () => {
    const trackPageviewSpy = vi.fn()
    const client = {
      trackEvent: vi.fn(),
      trackPageview: trackPageviewSpy,
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const { unmount } = render(
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <GatsbyFathomTrackView />
      </FathomProvider>,
    )

    await waitFor(() => {
      expect(mockListeners.length).toBe(1)
    })

    unmount()

    expect(mockListeners.length).toBe(0)
  })
})
