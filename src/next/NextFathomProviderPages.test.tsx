import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import NextFathomProviderPages from './NextFathomProviderPages'
import { useFathom } from '../hooks/useFathom'

// Mock Next.js Pages Router hook
const mockRouter = {
  pathname: '/test-page',
  query: { foo: 'bar' },
  asPath: '/test-page?foo=bar',
  isReady: true,
  events: {
    on: vi.fn(),
    off: vi.fn(),
  },
}

vi.mock('next/router', () => ({
  useRouter: vi.fn(() => mockRouter),
}))

// Mock fathom-client
vi.mock('fathom-client', async () => {
  const mockFathomClient = {
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
    default: mockFathomClient,
  }
})

describe('NextFathomProviderPages', () => {
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

  beforeEach(() => {
    vi.clearAllMocks()
    mockRouter.isReady = true
    mockRouter.events.on = vi.fn()
    mockRouter.events.off = vi.fn()
    // Reset window.location
    Object.defineProperty(window, 'location', {
      value: {
        origin: 'https://example.com',
        href: 'https://example.com/test-page?foo=bar',
      },
      writable: true,
    })
  })

  it('should load Fathom on mount when siteId is provided', async () => {
    const loadSpy = vi.fn()
    const client = { ...mockClient, load: loadSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={client} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalledWith('TEST_SITE_ID', undefined)
    })
  })

  it('should load Fathom with clientOptions', async () => {
    const loadSpy = vi.fn()
    const clientOptions = { honorDNT: true }
    const client = { ...mockClient, load: loadSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages
        client={client}
        siteId="TEST_SITE_ID"
        clientOptions={clientOptions}
      >
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalledWith('TEST_SITE_ID', clientOptions)
    })
  })

  it('should track initial pageview when router is ready', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={client} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should not track initial pageview when router is not ready', async () => {
    mockRouter.isReady = false
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={client} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    // Wait a bit to ensure no tracking happens
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
  })

  it('should register route change listener', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={mockClient} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(mockRouter.events.on).toHaveBeenCalledWith(
        'routeChangeComplete',
        expect.any(Function),
      )
    })
  })

  it('should unregister route change listener on unmount', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={mockClient} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    const { unmount } = renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(mockRouter.events.on).toHaveBeenCalled()
    })

    unmount()

    expect(mockRouter.events.off).toHaveBeenCalledWith(
      'routeChangeComplete',
      expect.any(Function),
    )
  })

  it('should track pageview on route change', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={client} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(mockRouter.events.on).toHaveBeenCalled()
    })

    // Get the route change handler
    const routeChangeHandler = mockRouter.events.on.mock.calls[0][1]
    routeChangeHandler('/new-page')

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/new-page',
    })
  })

  it('should not track pageview when disableAutoTrack is true', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages
        client={client}
        siteId="TEST_SITE_ID"
        disableAutoTrack
      >
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    // Wait a bit to ensure no tracking happens
    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
    expect(mockRouter.events.on).not.toHaveBeenCalled()
  })

  it('should use provided client', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages client={mockClient} siteId="TEST_SITE_ID">
        {children}
      </NextFathomProviderPages>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBe(mockClient)
  })

  it('should merge defaultPageviewOptions', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages
        client={client}
        siteId="TEST_SITE_ID"
        defaultPageviewOptions={{ referrer: 'https://example.com' }}
      >
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      referrer: 'https://example.com',
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should support deprecated trackDefaultOptions', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages
        client={client}
        siteId="TEST_SITE_ID"
        trackDefaultOptions={{ referrer: 'https://example.com' }}
      >
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      referrer: 'https://example.com',
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should prioritize defaultPageviewOptions over trackDefaultOptions', async () => {
    const trackPageviewSpy = vi.fn()
    const client = { ...mockClient, trackPageview: trackPageviewSpy }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NextFathomProviderPages
        client={client}
        siteId="TEST_SITE_ID"
        trackDefaultOptions={{ referrer: 'old' }}
        defaultPageviewOptions={{ referrer: 'new' }}
      >
        {children}
      </NextFathomProviderPages>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      referrer: 'new',
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should have displayName', () => {
    expect(NextFathomProviderPages.displayName).toBe('NextFathomProviderPages')
  })
})
