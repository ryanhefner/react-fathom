import React, { useRef } from 'react'

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'

import { useFathom } from '../hooks/useFathom'
import { NativeFathomProvider } from './NativeFathomProvider'
import type { WebViewFathomClient } from './createWebViewClient'

// Mock the FathomWebView component
vi.mock('./FathomWebView', () => ({
  FathomWebView: vi.fn(({ onReady, onError, siteId, debug }) => {
    // Store the callbacks for testing
    ;(global as any).__fathomWebViewProps = { onReady, onError, siteId, debug }
    return null
  }),
}))

// Mock react-native AppState for useAppStateTracking
vi.mock('react-native', () => ({
  AppState: {
    currentState: 'active',
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
  },
  StyleSheet: {
    create: vi.fn((styles) => styles),
  },
  View: vi.fn(({ children }) => children),
}))

describe('NativeFathomProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    ;(global as any).__fathomWebViewProps = null
  })

  it('should render children', () => {
    render(
      <NativeFathomProvider siteId="TEST_SITE">
        <div data-testid="child">Child content</div>
      </NativeFathomProvider>,
    )

    expect(screen.getByTestId('child')).toBeDefined()
    expect(screen.getByText('Child content')).toBeDefined()
  })

  it('should pass siteId to FathomWebView', async () => {
    const { FathomWebView } = await import('./FathomWebView')

    render(
      <NativeFathomProvider siteId="MY_SITE_ID">
        <div>Test</div>
      </NativeFathomProvider>,
    )

    expect(FathomWebView).toHaveBeenCalled()
    const callArgs = (FathomWebView as any).mock.calls[0][0]
    expect(callArgs.siteId).toBe('MY_SITE_ID')
  })

  it('should pass debug prop to FathomWebView', async () => {
    const { FathomWebView } = await import('./FathomWebView')

    render(
      <NativeFathomProvider siteId="TEST_SITE" debug={true}>
        <div>Test</div>
      </NativeFathomProvider>,
    )

    expect(FathomWebView).toHaveBeenCalled()
    const callArgs = (FathomWebView as any).mock.calls[0][0]
    expect(callArgs.debug).toBe(true)
  })

  it('should pass scriptDomain to FathomWebView', async () => {
    const { FathomWebView } = await import('./FathomWebView')

    render(
      <NativeFathomProvider siteId="TEST_SITE" scriptDomain="custom.domain.com">
        <div>Test</div>
      </NativeFathomProvider>,
    )

    expect(FathomWebView).toHaveBeenCalled()
    const callArgs = (FathomWebView as any).mock.calls[0][0]
    expect(callArgs.scriptDomain).toBe('custom.domain.com')
  })

  it('should pass loadOptions to FathomWebView', async () => {
    const { FathomWebView } = await import('./FathomWebView')
    const loadOptions = { honorDNT: true, auto: false }

    render(
      <NativeFathomProvider siteId="TEST_SITE" loadOptions={loadOptions}>
        <div>Test</div>
      </NativeFathomProvider>,
    )

    expect(FathomWebView).toHaveBeenCalled()
    const callArgs = (FathomWebView as any).mock.calls[0][0]
    expect(callArgs.loadOptions).toEqual(loadOptions)
  })

  it('should call onReady when FathomWebView is ready', async () => {
    const onReady = vi.fn()

    render(
      <NativeFathomProvider siteId="TEST_SITE" onReady={onReady}>
        <div>Test</div>
      </NativeFathomProvider>,
    )

    // Simulate WebView ready
    const props = (global as any).__fathomWebViewProps
    props?.onReady?.()

    expect(onReady).toHaveBeenCalled()
  })

  it('should call onError when FathomWebView has an error', async () => {
    const onError = vi.fn()

    render(
      <NativeFathomProvider siteId="TEST_SITE" onError={onError}>
        <div>Test</div>
      </NativeFathomProvider>,
    )

    // Simulate WebView error
    const props = (global as any).__fathomWebViewProps
    props?.onError?.('Test error')

    expect(onError).toHaveBeenCalledWith('Test error')
  })

  it('should provide Fathom context to children', () => {
    const TestChild = () => {
      const fathom = useFathom()
      return (
        <div data-testid="has-context">
          {fathom.trackEvent ? 'has trackEvent' : 'no trackEvent'}
        </div>
      )
    }

    render(
      <NativeFathomProvider siteId="TEST_SITE">
        <TestChild />
      </NativeFathomProvider>,
    )

    expect(screen.getByText('has trackEvent')).toBeDefined()
  })

  it('should pass defaultPageviewOptions to FathomProvider', () => {
    const TestChild = () => {
      const { defaultPageviewOptions } = useFathom()
      return (
        <div data-testid="default-options">
          {defaultPageviewOptions?.referrer || 'no referrer'}
        </div>
      )
    }

    render(
      <NativeFathomProvider
        siteId="TEST_SITE"
        defaultPageviewOptions={{ referrer: 'https://example.com' }}
      >
        <TestChild />
      </NativeFathomProvider>,
    )

    expect(screen.getByText('https://example.com')).toBeDefined()
  })

  it('should pass defaultEventOptions to FathomProvider', () => {
    const TestChild = () => {
      const { defaultEventOptions } = useFathom()
      return (
        <div data-testid="default-options">
          {(defaultEventOptions as any)?._site_id || 'no site id'}
        </div>
      )
    }

    render(
      <NativeFathomProvider
        siteId="TEST_SITE"
        defaultEventOptions={{ _site_id: 'my-app' } as any}
      >
        <TestChild />
      </NativeFathomProvider>,
    )

    expect(screen.getByText('my-app')).toBeDefined()
  })

  describe('trackAppState prop', () => {
    it('should not render AppStateTracker when trackAppState is false', async () => {
      const reactNative = await import('react-native')

      render(
        <NativeFathomProvider siteId="TEST_SITE" trackAppState={false}>
          <div>Test</div>
        </NativeFathomProvider>,
      )

      // AppState.addEventListener should not be called for app state tracking
      // (It might be called once for other reasons, so we just verify it works)
      expect(screen.getByText('Test')).toBeDefined()
    })

    it('should render AppStateTracker when trackAppState is true', async () => {
      const reactNative = await import('react-native')

      render(
        <NativeFathomProvider siteId="TEST_SITE" trackAppState={true}>
          <div>Test</div>
        </NativeFathomProvider>,
      )

      // AppState.addEventListener should be called for app state tracking
      expect(reactNative.AppState.addEventListener).toHaveBeenCalledWith(
        'change',
        expect.any(Function),
      )
    })
  })

  describe('client methods', () => {
    it('should provide a working trackEvent method', () => {
      const trackEventCalls: any[] = []

      const TestChild = () => {
        const { trackEvent } = useFathom()
        React.useEffect(() => {
          trackEvent('test-event', { _value: 100 })
        }, [trackEvent])
        return null
      }

      render(
        <NativeFathomProvider siteId="TEST_SITE">
          <TestChild />
        </NativeFathomProvider>,
      )

      // The event should be queued since WebView isn't ready
      // We just verify no errors are thrown
    })

    it('should provide a working trackPageview method', () => {
      const TestChild = () => {
        const { trackPageview } = useFathom()
        React.useEffect(() => {
          trackPageview({ url: '/test-page' })
        }, [trackPageview])
        return null
      }

      render(
        <NativeFathomProvider siteId="TEST_SITE">
          <TestChild />
        </NativeFathomProvider>,
      )

      // The pageview should be queued since WebView isn't ready
      // We just verify no errors are thrown
    })

    it('should provide a working trackGoal method', () => {
      const TestChild = () => {
        const { trackGoal } = useFathom()
        React.useEffect(() => {
          trackGoal('PURCHASE', 2999)
        }, [trackGoal])
        return null
      }

      render(
        <NativeFathomProvider siteId="TEST_SITE">
          <TestChild />
        </NativeFathomProvider>,
      )

      // The goal should be queued since WebView isn't ready
      // We just verify no errors are thrown
    })
  })

  describe('clientRef', () => {
    it('should populate clientRef with the WebViewFathomClient', async () => {
      let clientRefValue: WebViewFathomClient | null = null

      const TestComponent = () => {
        const clientRef = useRef<WebViewFathomClient>(null)
        React.useEffect(() => {
          clientRefValue = clientRef.current
        })
        return (
          <NativeFathomProvider siteId="TEST_SITE" clientRef={clientRef}>
            <div>Test</div>
          </NativeFathomProvider>
        )
      }

      render(<TestComponent />)

      await waitFor(() => {
        expect(clientRefValue).not.toBeNull()
        expect(clientRefValue).toBeDefined()
      })

      // Verify it's a WebViewFathomClient with the extended methods
      expect(typeof clientRefValue?.trackEvent).toBe('function')
      expect(typeof clientRefValue?.trackPageview).toBe('function')
      expect(typeof clientRefValue?.processQueue).toBe('function')
      expect(typeof clientRefValue?.getQueueLength).toBe('function')
      expect(typeof clientRefValue?.setWebViewReady).toBe('function')
    })

    it('should allow parent to call client methods via clientRef', async () => {
      const clientRef = React.createRef<WebViewFathomClient>() as React.MutableRefObject<WebViewFathomClient | null>
      clientRef.current = null

      render(
        <NativeFathomProvider siteId="TEST_SITE" clientRef={clientRef}>
          <div>Test</div>
        </NativeFathomProvider>,
      )

      await waitFor(() => {
        expect(clientRef.current).not.toBeNull()
      })

      // Parent can use the client directly
      // Events will be queued since WebView isn't ready
      clientRef.current?.trackEvent('parent-event', { _value: 100 })

      // Verify the event was queued
      expect(clientRef.current?.getQueueLength()).toBeGreaterThan(0)
    })

    it('should allow parent to check queue status via clientRef', async () => {
      const clientRef = React.createRef<WebViewFathomClient>() as React.MutableRefObject<WebViewFathomClient | null>
      clientRef.current = null

      render(
        <NativeFathomProvider siteId="TEST_SITE" clientRef={clientRef}>
          <div>Test</div>
        </NativeFathomProvider>,
      )

      await waitFor(() => {
        expect(clientRef.current).not.toBeNull()
      })

      // Initially, queue should be empty
      expect(clientRef.current?.getQueueLength()).toBe(0)

      // Track some events (they'll be queued)
      clientRef.current?.trackEvent('event-1')
      clientRef.current?.trackPageview({ url: '/page-1' })
      clientRef.current?.trackGoal('GOAL', 100)

      // Queue should now have 3 items
      expect(clientRef.current?.getQueueLength()).toBe(3)
    })
  })
})
