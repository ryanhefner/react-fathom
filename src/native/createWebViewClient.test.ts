import { describe, expect, it, vi, beforeEach } from 'vitest'

import { createWebViewClient } from './createWebViewClient'
import type { FathomWebViewRef } from './FathomWebView'

describe('createWebViewClient', () => {
  const createMockWebViewRef = (isReady = true): FathomWebViewRef => ({
    trackPageview: vi.fn(),
    trackEvent: vi.fn(),
    trackGoal: vi.fn(),
    blockTrackingForMe: vi.fn(),
    enableTrackingForMe: vi.fn(),
    isReady: vi.fn(() => isReady),
  })

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('basic client creation', () => {
    it('should create a client with all required methods', () => {
      const client = createWebViewClient(() => null)

      expect(client.load).toBeDefined()
      expect(client.trackPageview).toBeDefined()
      expect(client.trackEvent).toBeDefined()
      expect(client.trackGoal).toBeDefined()
      expect(client.setSite).toBeDefined()
      expect(client.blockTrackingForMe).toBeDefined()
      expect(client.enableTrackingForMe).toBeDefined()
      expect(client.isTrackingEnabled).toBeDefined()
      expect(client.processQueue).toBeDefined()
      expect(client.getQueueLength).toBeDefined()
      expect(client.setWebViewReady).toBeDefined()
    })

    it('should start with tracking enabled', () => {
      const client = createWebViewClient(() => null)
      expect(client.isTrackingEnabled()).toBe(true)
    })

    it('should start with empty queue', () => {
      const client = createWebViewClient(() => null)
      expect(client.getQueueLength()).toBe(0)
    })
  })

  describe('when WebView is ready', () => {
    it('should call trackPageview on WebView immediately', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.trackPageview({ url: '/test' })

      expect(mockRef.trackPageview).toHaveBeenCalledWith({ url: '/test' })
    })

    it('should call trackEvent on WebView immediately', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.trackEvent('button-click', { _value: 100 })

      expect(mockRef.trackEvent).toHaveBeenCalledWith('button-click', { _value: 100 })
    })

    it('should call trackGoal on WebView immediately', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.trackGoal('PURCHASE', 2999)

      expect(mockRef.trackGoal).toHaveBeenCalledWith('PURCHASE', 2999)
    })

    it('should call blockTrackingForMe on WebView immediately', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.blockTrackingForMe()

      expect(mockRef.blockTrackingForMe).toHaveBeenCalled()
    })

    it('should call enableTrackingForMe on WebView immediately', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.enableTrackingForMe()

      expect(mockRef.enableTrackingForMe).toHaveBeenCalled()
    })
  })

  describe('when WebView is not ready (queuing)', () => {
    it('should queue trackPageview when WebView is not ready', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackPageview({ url: '/test' })

      expect(mockRef.trackPageview).not.toHaveBeenCalled()
      expect(client.getQueueLength()).toBe(1)
    })

    it('should queue trackEvent when WebView is not ready', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackEvent('button-click')

      expect(mockRef.trackEvent).not.toHaveBeenCalled()
      expect(client.getQueueLength()).toBe(1)
    })

    it('should queue trackGoal when WebView is not ready', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackGoal('PURCHASE', 2999)

      expect(mockRef.trackGoal).not.toHaveBeenCalled()
      expect(client.getQueueLength()).toBe(1)
    })

    it('should queue multiple commands', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackPageview({ url: '/page1' })
      client.trackEvent('event1')
      client.trackGoal('GOAL1', 100)

      expect(client.getQueueLength()).toBe(3)
    })

    it('should process queue when setWebViewReady is called', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackPageview({ url: '/test' })
      client.trackEvent('button-click', { _value: 100 })

      expect(client.getQueueLength()).toBe(2)

      // Now make WebView ready
      mockRef.isReady = vi.fn(() => true)
      client.setWebViewReady()

      expect(mockRef.trackPageview).toHaveBeenCalledWith({ url: '/test' })
      expect(mockRef.trackEvent).toHaveBeenCalledWith('button-click', { _value: 100 })
      expect(client.getQueueLength()).toBe(0)
    })

    it('should process queue in order', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)
      const callOrder: string[] = []

      mockRef.trackPageview = vi.fn(() => callOrder.push('pageview'))
      mockRef.trackEvent = vi.fn(() => callOrder.push('event'))
      mockRef.trackGoal = vi.fn(() => callOrder.push('goal'))

      client.trackPageview({ url: '/first' })
      client.trackEvent('second')
      client.trackGoal('third', 100)

      mockRef.isReady = vi.fn(() => true)
      client.setWebViewReady()

      expect(callOrder).toEqual(['pageview', 'event', 'goal'])
    })
  })

  describe('queue size limits', () => {
    it('should respect maxQueueSize option', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef, { maxQueueSize: 3 })

      client.trackEvent('event1')
      client.trackEvent('event2')
      client.trackEvent('event3')
      client.trackEvent('event4') // Should remove event1

      expect(client.getQueueLength()).toBe(3)
    })

    it('should remove oldest command when queue is full', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef, { maxQueueSize: 2 })

      client.trackEvent('event1')
      client.trackEvent('event2')
      client.trackEvent('event3') // Should remove event1

      mockRef.isReady = vi.fn(() => true)
      client.setWebViewReady()

      // event1 should not have been called, only event2 and event3
      expect(mockRef.trackEvent).toHaveBeenCalledTimes(2)
      expect(mockRef.trackEvent).toHaveBeenCalledWith('event2', undefined)
      expect(mockRef.trackEvent).toHaveBeenCalledWith('event3', undefined)
    })
  })

  describe('queue disabled', () => {
    it('should not queue commands when enableQueue is false', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef, { enableQueue: false })

      client.trackPageview({ url: '/test' })
      client.trackEvent('event1')

      expect(client.getQueueLength()).toBe(0)
      expect(mockRef.trackPageview).not.toHaveBeenCalled()
    })
  })

  describe('tracking blocked', () => {
    it('should not track pageview when blocked', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.blockTrackingForMe()
      client.trackPageview({ url: '/test' })

      // blockTrackingForMe itself is called, but not trackPageview after
      expect(mockRef.trackPageview).not.toHaveBeenCalled()
    })

    it('should not track events when blocked', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.blockTrackingForMe()
      client.trackEvent('button-click')

      expect(mockRef.trackEvent).not.toHaveBeenCalled()
    })

    it('should not track goals when blocked', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.blockTrackingForMe()
      client.trackGoal('PURCHASE', 2999)

      expect(mockRef.trackGoal).not.toHaveBeenCalled()
    })

    it('should resume tracking after enableTrackingForMe', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      client.blockTrackingForMe()
      expect(client.isTrackingEnabled()).toBe(false)

      client.enableTrackingForMe()
      expect(client.isTrackingEnabled()).toBe(true)

      client.trackEvent('button-click')
      expect(mockRef.trackEvent).toHaveBeenCalledWith('button-click', undefined)
    })
  })

  describe('load method', () => {
    it('should process queue when load is called', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackEvent('event1')

      // Queue should not be empty
      expect(client.getQueueLength()).toBe(1)

      // Make WebView ready and call load
      mockRef.isReady = vi.fn(() => true)
      client.load('SITE_ID')

      // Queue should be processed
      expect(mockRef.trackEvent).toHaveBeenCalledWith('event1', undefined)
      expect(client.getQueueLength()).toBe(0)
    })
  })

  describe('setSite method', () => {
    it('should update site ID', () => {
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef, { debug: true })

      client.setSite('NEW_SITE_ID')

      // Should log a warning about changing site ID
      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('null WebView ref', () => {
    it('should queue commands when ref is null', () => {
      const client = createWebViewClient(() => null)

      client.trackPageview({ url: '/test' })

      expect(client.getQueueLength()).toBe(1)
    })

    it('should not throw when ref is null', () => {
      const client = createWebViewClient(() => null)

      expect(() => client.trackPageview()).not.toThrow()
      expect(() => client.trackEvent('test')).not.toThrow()
      expect(() => client.trackGoal('TEST', 100)).not.toThrow()
      expect(() => client.blockTrackingForMe()).not.toThrow()
      expect(() => client.enableTrackingForMe()).not.toThrow()
    })
  })

  describe('processQueue method', () => {
    it('should return number of processed commands', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackEvent('event1')
      client.trackEvent('event2')
      client.trackEvent('event3')

      mockRef.isReady = vi.fn(() => true)
      const processed = client.processQueue()

      expect(processed).toBe(3)
    })

    it('should return 0 when WebView is not ready', () => {
      const mockRef = createMockWebViewRef(false)
      const client = createWebViewClient(() => mockRef)

      client.trackEvent('event1')

      const processed = client.processQueue()

      expect(processed).toBe(0)
      expect(client.getQueueLength()).toBe(1) // Still in queue
    })

    it('should return 0 when queue is empty', () => {
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef)

      const processed = client.processQueue()

      expect(processed).toBe(0)
    })
  })

  describe('debug logging', () => {
    it('should log when debug is enabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef, { debug: true })

      client.trackPageview({ url: '/test' })

      expect(consoleSpy).toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('should not log when debug is disabled', () => {
      const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const mockRef = createMockWebViewRef(true)
      const client = createWebViewClient(() => mockRef, { debug: false })

      client.trackPageview({ url: '/test' })

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })
})
