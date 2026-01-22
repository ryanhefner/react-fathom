import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, waitFor } from '@testing-library/react'
import { MemoryRouter, useNavigate } from 'react-router-dom'

import { FathomProvider } from '../FathomProvider'
import { ReactRouterFathomTrackView } from './ReactRouterFathomTrackView'

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

// Helper component to trigger navigation
function NavigateButton({ to }: { to: string }) {
  const navigate = useNavigate()
  return <button onClick={() => navigate(to)}>Navigate</button>
}

describe('ReactRouterFathomTrackView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as { location?: unknown }).location
    window.location = {
      href: 'https://example.com/test-page',
      origin: 'https://example.com',
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
      <MemoryRouter initialEntries={['/test-page']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView />
        </FathomProvider>
      </MemoryRouter>,
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

    const { getByText } = render(
      <MemoryRouter initialEntries={['/']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView />
          <NavigateButton to="/new-page" />
        </FathomProvider>
      </MemoryRouter>,
    )

    // Wait for initial pageview
    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(1)
    })

    // Navigate to new page
    getByText('Navigate').click()

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(2)
    })

    expect(trackPageviewSpy).toHaveBeenLastCalledWith({
      url: 'https://example.com/new-page',
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
      <MemoryRouter initialEntries={['/test-page']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView disableAutoTrack />
        </FathomProvider>
      </MemoryRouter>,
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

    render(
      <MemoryRouter initialEntries={['/test-page?foo=bar']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView />
        </FathomProvider>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should exclude search params when includeSearchParams is false', async () => {
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
      <MemoryRouter initialEntries={['/test-page?foo=bar']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView includeSearchParams={false} />
        </FathomProvider>
      </MemoryRouter>,
    )

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page',
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

    render(
      <MemoryRouter initialEntries={['/test-page#section']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView includeHash />
        </FathomProvider>
      </MemoryRouter>,
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
      <MemoryRouter initialEntries={['/test-page']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView transformUrl={transformUrl} />
        </FathomProvider>
      </MemoryRouter>,
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
      <MemoryRouter initialEntries={['/test-page']}>
        <FathomProvider client={client} siteId="TEST_SITE_ID">
          <ReactRouterFathomTrackView transformUrl={transformUrl} />
        </FathomProvider>
      </MemoryRouter>,
    )

    // Give time for effects to run
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
  })

  it('should have displayName', () => {
    expect(ReactRouterFathomTrackView.displayName).toBe(
      'ReactRouterFathomTrackView',
    )
  })
})
