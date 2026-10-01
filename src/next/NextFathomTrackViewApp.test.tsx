import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, renderHook, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { NextFathomTrackViewApp } from './NextFathomTrackViewApp'
import { useFathom } from '../hooks/useFathom'

// Mock Next.js App Router hooks
const mockPathname = '/test-page'
const mockSearchParams = new URLSearchParams('?foo=bar')

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(() => mockPathname),
  useSearchParams: vi.fn(() => mockSearchParams),
}))

const mockFathomClient = vi.hoisted(() => ({
  trackEvent: vi.fn(),
  trackPageview: vi.fn(),
  trackGoal: vi.fn(),
  load: vi.fn(),
  setSite: vi.fn(),
  blockTrackingForMe: vi.fn(),
  enableTrackingForMe: vi.fn(),
  isTrackingEnabled: vi.fn(() => true),
}))

vi.mock('fathom-client', () => ({
  ...mockFathomClient,
  default: mockFathomClient,
}))

describe('NextFathomTrackViewApp', () => {
  it('tracks once under Strict Mode and ignores same-route provider rerenders', async () => {
    const view = () => (
      <React.StrictMode>
        <FathomProvider client={mockFathomClient} debug={{ enabled: false }}>
          <NextFathomTrackViewApp transformUrl={(url) => url} />
        </FathomProvider>
      </React.StrictMode>
    )
    const { rerender } = render(view())
    expect(mockFathomClient.trackPageview).toHaveBeenCalledTimes(1)
    rerender(view())
    expect(mockFathomClient.trackPageview).toHaveBeenCalledTimes(1)
    const navigation = await import('next/navigation')
    vi.mocked(navigation.usePathname).mockReturnValue('/second')
    rerender(view())
    vi.mocked(navigation.usePathname).mockReturnValue(mockPathname)
    rerender(view())
    expect(mockFathomClient.trackPageview).toHaveBeenCalledTimes(3)
  })
  it('counts returning from a URL suppressed by transformUrl', async () => {
    const view = () => (
      <FathomProvider client={mockFathomClient}>
        <NextFathomTrackViewApp
          transformUrl={(url) => (url.includes('/private') ? null : url)}
        />
      </FathomProvider>
    )
    const { rerender } = render(view())
    const navigation = await import('next/navigation')
    vi.mocked(navigation.usePathname).mockReturnValue('/private')
    rerender(view())
    expect(mockFathomClient.trackPageview).toHaveBeenCalledTimes(1)
    vi.mocked(navigation.usePathname).mockReturnValue(mockPathname)
    rerender(view())
    expect(mockFathomClient.trackPageview).toHaveBeenCalledTimes(2)
  })
  beforeEach(async () => {
    vi.clearAllMocks()
    const nextNavigation = await import('next/navigation')
    vi.mocked(nextNavigation.usePathname).mockReturnValue(mockPathname)
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(mockSearchParams)
    delete (window as { location?: unknown }).location
    window.location = {
      href: 'https://example.com/test-page?foo=bar',
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?foo=bar',
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

    // Reset mocks to initial state
    const nextNavigation = await import('next/navigation')
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/test-page')
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      new URLSearchParams('?foo=bar'),
    )

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp />
        {children}
      </FathomProvider>
    )

    const { rerender } = renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(1)
    })

    // Simulate route change by updating pathname
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/new-page')

    rerender()

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalledTimes(2)
    })

    expect(trackPageviewSpy).toHaveBeenLastCalledWith({
      url: 'https://example.com/new-page?foo=bar',
    })
  })

  it('should handle pathname without search params', async () => {
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

    // Reset mocks to initial state with empty search params
    const nextNavigation = await import('next/navigation')
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/test-page')
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      new URLSearchParams(),
    )

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page',
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp disableAutoTrack />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await new Promise((resolve) => setTimeout(resolve, 100))

    expect(trackPageviewSpy).not.toHaveBeenCalled()
  })

  it('should use the default Fathom client when no client is provided', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(mockFathomClient.load).toHaveBeenCalledWith(
        'TEST_SITE_ID',
        undefined,
      )
      expect(mockFathomClient.trackPageview).toHaveBeenCalledWith({
        url: 'https://example.com/test-page?foo=bar',
      })
    })
  })

  it('should use trackPageview from context which merges defaultPageviewOptions', async () => {
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

    // Reset mocks to initial state
    const nextNavigation = await import('next/navigation')
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/test-page')
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      new URLSearchParams('?foo=bar'),
    )

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={client}
        siteId="TEST_SITE_ID"
        defaultPageviewOptions={{ referrer: 'https://example.com' }}
      >
        <NextFathomTrackViewApp />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    // The trackPageview from context already merges defaultPageviewOptions
    // So when NextFathomTrackViewApp calls trackPageview, it will include the defaults
    expect(trackPageviewSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        referrer: 'https://example.com',
        url: expect.stringContaining('/test-page'),
      }),
    )
  })

  it('should apply transformUrl to tracked URL', async () => {
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

    const nextNavigation = await import('next/navigation')
    vi.mocked(nextNavigation.usePathname).mockReturnValue('/test-page')
    vi.mocked(nextNavigation.useSearchParams).mockReturnValue(
      new URLSearchParams('?token=secret&page=1'),
    )

    const transformUrl = (url: string) => {
      const u = new URL(url)
      u.searchParams.delete('token')
      return u.toString()
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <NextFathomTrackViewApp transformUrl={transformUrl} />
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(trackPageviewSpy).toHaveBeenCalled()
    })

    // URL should have token param stripped
    expect(trackPageviewSpy).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?page=1',
    })
  })

  it('should have displayName', () => {
    expect(NextFathomTrackViewApp.displayName).toBe('NextFathomTrackViewApp')
  })
})
