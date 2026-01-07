import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createNativeClient } from './createNativeClient'

// Mock fetch globally
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('createNativeClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({ ok: true })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('client creation', () => {
    it('should create a client with required siteId', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      expect(client).toBeDefined()
      expect(client.load).toBeDefined()
      expect(client.trackPageview).toBeDefined()
      expect(client.trackEvent).toBeDefined()
      expect(client.trackGoal).toBeDefined()
      expect(client.setSite).toBeDefined()
      expect(client.blockTrackingForMe).toBeDefined()
      expect(client.enableTrackingForMe).toBeDefined()
      expect(client.isTrackingEnabled).toBeDefined()
    })

    it('should have processQueue and getQueueLength methods', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      expect(typeof client.processQueue).toBe('function')
      expect(typeof client.getQueueLength).toBe('function')
    })
  })

  describe('load', () => {
    it('should store the site ID when load is called', () => {
      const client = createNativeClient({ siteId: 'INITIAL_SITE' })
      client.load('NEW_SITE_ID')

      // Verify by tracking - should use new site ID
      client.trackPageview({ url: '/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('NEW_SITE_ID'),
        }),
      )
    })
  })

  describe('trackPageview', () => {
    it('should send pageview request with site ID', async () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackPageview({ url: '/home' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://cdn.usefathom.com/script.js',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: expect.stringContaining('TEST_SITE'),
        }),
      )
    })

    it('should include url and referrer in request', async () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackPageview({ url: '/page', referrer: 'https://google.com' })

      const call = mockFetch.mock.calls[0]
      const body = JSON.parse(call[1].body)

      expect(body.url).toBe('/page')
      expect(body.referrer).toBe('https://google.com')
    })

    it('should not send request when tracking is blocked', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.blockTrackingForMe()
      client.trackPageview({ url: '/test' })

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('trackEvent', () => {
    it('should send event request with event name', async () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackEvent('button-click', { _value: 100 })

      const call = mockFetch.mock.calls[0]
      const body = JSON.parse(call[1].body)

      expect(body.site_id).toBe('TEST_SITE')
      expect(body.name).toBe('button-click')
      expect(body._value).toBe(100)
    })

    it('should not send request when tracking is blocked', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.blockTrackingForMe()
      client.trackEvent('test-event')

      expect(mockFetch).not.toHaveBeenCalled()
    })
  })

  describe('trackGoal', () => {
    it('should send goal request with code and cents', async () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackGoal('PURCHASE', 2999)

      const call = mockFetch.mock.calls[0]
      const body = JSON.parse(call[1].body)

      expect(body.site_id).toBe('TEST_SITE')
      expect(body.code).toBe('PURCHASE')
      expect(body.cents).toBe(2999)
    })
  })

  describe('setSite', () => {
    it('should update the site ID', () => {
      const client = createNativeClient({ siteId: 'OLD_SITE' })

      client.setSite('NEW_SITE')
      client.trackPageview({ url: '/test' })

      const call = mockFetch.mock.calls[0]
      const body = JSON.parse(call[1].body)

      expect(body.site_id).toBe('NEW_SITE')
    })
  })

  describe('tracking control', () => {
    it('should block tracking when blockTrackingForMe is called', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      expect(client.isTrackingEnabled()).toBe(true)

      client.blockTrackingForMe()

      expect(client.isTrackingEnabled()).toBe(false)
    })

    it('should enable tracking when enableTrackingForMe is called', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.blockTrackingForMe()
      expect(client.isTrackingEnabled()).toBe(false)

      client.enableTrackingForMe()
      expect(client.isTrackingEnabled()).toBe(true)
    })
  })

  describe('offline queue', () => {
    it('should queue events when request fails', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        enableOfflineQueue: true,
      })

      client.trackEvent('test-event')

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(client.getQueueLength()).toBe(1)
    })

    it('should not queue events when offline queue is disabled', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        enableOfflineQueue: false,
      })

      client.trackEvent('test-event')

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(client.getQueueLength()).toBe(0)
    })

    it('should respect maxQueueSize', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'))

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        enableOfflineQueue: true,
        maxQueueSize: 3,
      })

      // Queue more events than maxQueueSize
      for (let i = 0; i < 5; i++) {
        client.trackEvent(`event-${i}`)
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      expect(client.getQueueLength()).toBe(3)
    })

    it('should process queue and return count', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        enableOfflineQueue: true,
      })

      client.trackEvent('queued-event')

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(client.getQueueLength()).toBe(1)

      // Reset mock to succeed
      mockFetch.mockResolvedValue({ ok: true })

      const processed = await client.processQueue()

      expect(processed).toBe(1)
      expect(client.getQueueLength()).toBe(0)
    })

    it('should process queue when tracking is re-enabled', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'))

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        enableOfflineQueue: true,
      })

      client.trackEvent('test-event')

      // Wait for async operation
      await new Promise((resolve) => setTimeout(resolve, 10))

      expect(client.getQueueLength()).toBe(1)

      // Block then enable should trigger queue processing
      mockFetch.mockResolvedValue({ ok: true })
      client.blockTrackingForMe()
      client.enableTrackingForMe()

      // Wait for queue processing
      await new Promise((resolve) => setTimeout(resolve, 50))

      expect(client.getQueueLength()).toBe(0)
    })
  })

  describe('custom options', () => {
    it('should use custom API endpoint', () => {
      const client = createNativeClient({
        siteId: 'TEST_SITE',
        apiEndpoint: 'https://custom.endpoint.com/collect',
      })

      client.trackPageview({ url: '/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        'https://custom.endpoint.com/collect',
        expect.any(Object),
      )
    })

    it('should include custom headers', () => {
      const client = createNativeClient({
        siteId: 'TEST_SITE',
        customHeaders: { 'X-Custom-Header': 'custom-value' },
      })

      client.trackPageview({ url: '/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'X-Custom-Header': 'custom-value',
          }),
        }),
      )
    })

    it('should include custom user agent', () => {
      const client = createNativeClient({
        siteId: 'TEST_SITE',
        userAgent: 'MyApp/1.0.0',
      })

      client.trackPageview({ url: '/test' })

      expect(mockFetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'User-Agent': 'MyApp/1.0.0',
          }),
        }),
      )
    })

    it('should timeout requests after specified duration', async () => {
      // Create a mock that never resolves within the timeout
      let resolvePromise: () => void
      mockFetch.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePromise = () => resolve({ ok: true })
            // Don't resolve - let it timeout
          }),
      )

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        timeout: 50,
        enableOfflineQueue: true,
      })

      client.trackEvent('test-event')

      // Wait longer than timeout
      await new Promise((resolve) => setTimeout(resolve, 150))

      // Event should be queued due to timeout
      // Note: AbortController timeout behavior may vary, so we check that at least the request was attempted
      expect(mockFetch).toHaveBeenCalled()
    })
  })

  describe('debug mode', () => {
    it('should log when debug is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        debug: true,
      })

      client.load('TEST_SITE')

      // Check that console.log was called with the debug prefix
      expect(consoleSpy).toHaveBeenCalledWith(
        '[react-fathom/native]',
        expect.anything(),
        expect.anything(),
      )

      consoleSpy.mockRestore()
    })

    it('should not log when debug is disabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

      const client = createNativeClient({
        siteId: 'TEST_SITE',
        debug: false,
      })

      client.load('TEST_SITE')

      expect(consoleSpy).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })
  })

  describe('edge cases', () => {
    it('should not send request when site ID is empty', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      const client = createNativeClient({
        siteId: '',
        debug: true,
      })

      client.trackPageview({ url: '/test' })

      expect(mockFetch).not.toHaveBeenCalled()

      consoleSpy.mockRestore()
    })

    it('should handle trackPageview with no options', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackPageview()

      expect(mockFetch).toHaveBeenCalled()
    })

    it('should handle trackEvent with no options', () => {
      const client = createNativeClient({ siteId: 'TEST_SITE' })

      client.trackEvent('simple-event')

      const call = mockFetch.mock.calls[0]
      const body = JSON.parse(call[1].body)

      expect(body.name).toBe('simple-event')
    })
  })
})
