import React, { createRef, act } from 'react'

import { describe, expect, it, vi, beforeEach } from 'vitest'
import { render } from '@testing-library/react'

import { FathomWebView, type FathomWebViewRef } from './FathomWebView'

// Store mock WebView instance for testing
let mockWebViewInstance: {
  injectJavaScript: ReturnType<typeof vi.fn>
  onMessage?: (event: any) => void
  onError?: (event: any) => void
  source?: { html: string }
  javaScriptEnabled?: boolean
} | null = null

// Mock react-native
vi.mock('react-native', () => ({
  StyleSheet: {
    create: vi.fn((styles) => styles),
  },
  View: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="rn-view">{children}</div>
  ),
}))

// Mock react-native-webview
vi.mock('react-native-webview', () => {
  const MockWebView = React.forwardRef((props: any, ref: any) => {
    const injectJavaScript = vi.fn()

    // Store for testing
    mockWebViewInstance = {
      injectJavaScript,
      onMessage: props.onMessage,
      onError: props.onError,
      source: props.source,
      javaScriptEnabled: props.javaScriptEnabled,
    }

    // Expose injectJavaScript via ref
    React.useImperativeHandle(ref, () => ({
      injectJavaScript,
    }))

    return (
      <div
        data-testid="webview"
        data-source={JSON.stringify(props.source)}
        data-javascript-enabled={props.javaScriptEnabled}
      />
    )
  })

  return { WebView: MockWebView }
})

describe('FathomWebView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockWebViewInstance = null
  })

  describe('rendering', () => {
    it('should render a WebView', () => {
      const { getByTestId } = render(<FathomWebView siteId="TEST_SITE" />)

      expect(getByTestId('webview')).toBeDefined()
    })

    it('should include siteId in the HTML source', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="MY_CUSTOM_SITE_ID" />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('data-site="MY_CUSTOM_SITE_ID"')
    })

    it('should use default scriptDomain', () => {
      const { getByTestId } = render(<FathomWebView siteId="TEST_SITE" />)

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('cdn.usefathom.com/script.js')
    })

    it('should use custom scriptDomain when provided', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="TEST_SITE" scriptDomain="custom.domain.com" />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('custom.domain.com/script.js')
    })

    it('should enable JavaScript', () => {
      const { getByTestId } = render(<FathomWebView siteId="TEST_SITE" />)

      const webview = getByTestId('webview')
      expect(webview.getAttribute('data-javascript-enabled')).toBe('true')
    })
  })

  describe('ref methods', () => {
    it('should expose trackPageview method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.trackPageview).toBeDefined()
      expect(typeof ref.current?.trackPageview).toBe('function')
    })

    it('should expose trackEvent method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.trackEvent).toBeDefined()
      expect(typeof ref.current?.trackEvent).toBe('function')
    })

    it('should expose trackGoal method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.trackGoal).toBeDefined()
      expect(typeof ref.current?.trackGoal).toBe('function')
    })

    it('should expose blockTrackingForMe method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.blockTrackingForMe).toBeDefined()
      expect(typeof ref.current?.blockTrackingForMe).toBe('function')
    })

    it('should expose enableTrackingForMe method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.enableTrackingForMe).toBeDefined()
      expect(typeof ref.current?.enableTrackingForMe).toBe('function')
    })

    it('should expose isReady method', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.isReady).toBeDefined()
      expect(typeof ref.current?.isReady).toBe('function')
    })

    it('should return false from isReady before ready message', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.isReady()).toBe(false)
    })
  })

  describe('JavaScript injection', () => {
    it('should inject trackPageview command', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      ref.current?.trackPageview({ url: '/test-page' })

      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('trackPageview'),
      )
      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('/test-page'),
      )
    })

    it('should inject trackEvent command', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      ref.current?.trackEvent('button-click', { _value: 100 })

      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('trackEvent'),
      )
      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('button-click'),
      )
    })

    it('should inject trackGoal command', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      ref.current?.trackGoal('PURCHASE', 2999)

      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('trackGoal'),
      )
      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('PURCHASE'),
      )
      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('2999'),
      )
    })

    it('should inject blockTrackingForMe command', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      ref.current?.blockTrackingForMe()

      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('blockTrackingForMe'),
      )
    })

    it('should inject enableTrackingForMe command', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      ref.current?.enableTrackingForMe()

      expect(mockWebViewInstance?.injectJavaScript).toHaveBeenCalledWith(
        expect.stringContaining('enableTrackingForMe'),
      )
    })
  })

  describe('message handling', () => {
    it('should call onReady when ready message is received', () => {
      const onReady = vi.fn()
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" onReady={onReady} />)

      // Simulate ready message from WebView (wrapped in act for state update)
      act(() => {
        mockWebViewInstance?.onMessage?.({
          nativeEvent: { data: JSON.stringify({ type: 'ready' }) },
        })
      })

      expect(onReady).toHaveBeenCalled()
    })

    it('should set isReady to true when ready message is received', () => {
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" />)

      expect(ref.current?.isReady()).toBe(false)

      // Simulate ready message from WebView (wrapped in act for state update)
      act(() => {
        mockWebViewInstance?.onMessage?.({
          nativeEvent: { data: JSON.stringify({ type: 'ready' }) },
        })
      })

      expect(ref.current?.isReady()).toBe(true)
    })

    it('should call onError when error message is received', () => {
      const onError = vi.fn()

      render(<FathomWebView siteId="TEST_SITE" onError={onError} />)

      // Simulate error message from WebView
      mockWebViewInstance?.onMessage?.({
        nativeEvent: {
          data: JSON.stringify({ type: 'error', message: 'Script failed to load' }),
        },
      })

      expect(onError).toHaveBeenCalledWith('Script failed to load')
    })

    it('should handle malformed messages gracefully', () => {
      const onError = vi.fn()

      render(<FathomWebView siteId="TEST_SITE" onError={onError} />)

      // Simulate malformed message
      expect(() => {
        mockWebViewInstance?.onMessage?.({
          nativeEvent: { data: 'not valid json' },
        })
      }).not.toThrow()
    })
  })

  describe('WebView error handling', () => {
    it('should call onError when WebView has an error', () => {
      const onError = vi.fn()

      render(<FathomWebView siteId="TEST_SITE" onError={onError} />)

      // Simulate WebView error
      mockWebViewInstance?.onError?.({
        nativeEvent: { description: 'Network error' },
      })

      expect(onError).toHaveBeenCalledWith('Network error')
    })

    it('should use default error message when description is missing', () => {
      const onError = vi.fn()

      render(<FathomWebView siteId="TEST_SITE" onError={onError} />)

      // Simulate WebView error without description
      mockWebViewInstance?.onError?.({
        nativeEvent: {},
      })

      expect(onError).toHaveBeenCalledWith('WebView error')
    })
  })

  describe('debug logging', () => {
    it('should log when debug is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" debug={true} />)

      ref.current?.trackPageview({ url: '/test' })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should not log when debug is disabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const ref = createRef<FathomWebViewRef>()

      render(<FathomWebView ref={ref} siteId="TEST_SITE" debug={false} />)

      ref.current?.trackPageview({ url: '/test' })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('loadOptions', () => {
    it('should include data-honor-dnt attribute when honorDNT is set', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="TEST_SITE" loadOptions={{ honorDNT: true }} />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('data-honor-dnt="true"')
    })

    it('should include data-auto attribute when auto is false', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="TEST_SITE" loadOptions={{ auto: false }} />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('data-auto="false"')
    })

    it('should include data-canonical attribute when canonical is false', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="TEST_SITE" loadOptions={{ canonical: false }} />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('data-canonical="false"')
    })

    it('should include data-spa attribute when spa mode is set', () => {
      const { getByTestId } = render(
        <FathomWebView siteId="TEST_SITE" loadOptions={{ spa: 'auto' }} />,
      )

      const webview = getByTestId('webview')
      const source = JSON.parse(webview.getAttribute('data-source') || '{}')

      expect(source.html).toContain('data-spa="auto"')
    })
  })
})
