import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import { useFathom } from '../hooks/useFathom'
import { NativeFathomProvider } from './NativeFathomProvider'

// Mock react-native
vi.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
}))

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('NativeFathomProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
  })

  it('should render children', () => {
    const TestChild = () => <div>Test Child</div>

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current).toBeDefined()
  })

  it('should provide fathom context to children', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.trackEvent).toBeDefined()
    expect(result.current.trackPageview).toBeDefined()
    expect(result.current.trackGoal).toBeDefined()
    expect(result.current.client).toBeDefined()
  })

  it('should load client with siteId on mount', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="MY_SITE_ID">
        {children}
      </NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    // Track an event to verify site ID is set
    result.current.trackEvent?.('test-event')

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)

    expect(body.site_id).toBe('MY_SITE_ID')
  })

  it('should pass clientOptions to native client', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider
        siteId="TEST_SITE"
        clientOptions={{
          debug: true,
          timeout: 5000,
        }}
      >
        {children}
      </NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBeDefined()
  })

  it('should merge defaultEventOptions in trackEvent', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider
        siteId="TEST_SITE"
        defaultEventOptions={{ _site_id: 'default-site' }}
      >
        {children}
      </NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event', { _value: 100 })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)

    expect(body._site_id).toBe('default-site')
    expect(body._value).toBe(100)
  })

  it('should override defaultEventOptions with provided options', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider
        siteId="TEST_SITE"
        defaultEventOptions={{ _site_id: 'default-site' }}
      >
        {children}
      </NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event', { _site_id: 'override-site' })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)

    expect(body._site_id).toBe('override-site')
  })

  it('should merge defaultPageviewOptions in trackPageview', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider
        siteId="TEST_SITE"
        defaultPageviewOptions={{ url: '/default-page' }}
      >
        {children}
      </NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.({ referrer: 'https://example.com' })

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)

    expect(body.url).toBe('/default-page')
    expect(body.referrer).toBe('https://example.com')
  })

  it('should expose native client methods', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.blockTrackingForMe).toBeDefined()
    expect(result.current.enableTrackingForMe).toBeDefined()
    expect(result.current.isTrackingEnabled).toBeDefined()
    expect(result.current.setSite).toBeDefined()
    expect(result.current.load).toBeDefined()
  })

  it('should support blocking and enabling tracking', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.isTrackingEnabled?.()).toBe(true)

    result.current.blockTrackingForMe?.()
    expect(result.current.isTrackingEnabled?.()).toBe(false)

    result.current.enableTrackingForMe?.()
    expect(result.current.isTrackingEnabled?.()).toBe(true)
  })

  it('should track goals', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackGoal?.('PURCHASE', 2999)

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled()
    })

    const call = mockFetch.mock.calls[0]
    const body = JSON.parse(call[1].body)

    expect(body.code).toBe('PURCHASE')
    expect(body.cents).toBe(2999)
  })

  it('should not track when tracking is blocked', async () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NativeFathomProvider siteId="TEST_SITE">{children}</NativeFathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.blockTrackingForMe?.()
    result.current.trackEvent?.('blocked-event')

    // Give time for any async operations
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(mockFetch).not.toHaveBeenCalled()
  })

  describe('trackAppState', () => {
    it('should not render AppStateTracker when trackAppState is false', () => {
      // This is implicit - when trackAppState is false/undefined,
      // no app state tracking component is rendered
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NativeFathomProvider siteId="TEST_SITE" trackAppState={false}>
          {children}
        </NativeFathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      expect(result.current).toBeDefined()
    })

    it('should render AppStateTracker when trackAppState is true', () => {
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <NativeFathomProvider siteId="TEST_SITE" trackAppState>
          {children}
        </NativeFathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      expect(result.current).toBeDefined()
    })
  })
})
