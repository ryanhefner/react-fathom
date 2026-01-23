import React, { useRef } from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, waitFor } from '@testing-library/react'

import { FathomProvider } from './FathomProvider'
import { useFathom } from './hooks/useFathom'
import type { FathomClient } from './types'

// Mock fathom-client
vi.mock('fathom-client', () => {
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
    load: mockFathomClient.load,
  }
})

describe('FathomProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should provide default Fathom client when no client is provided', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBeDefined()
    expect(result.current.trackEvent).toBeDefined()
    expect(result.current.trackPageview).toBeDefined()
  })

  it('should use provided client', () => {
    const customClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={customClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBe(customClient)
  })

  it('should load Fathom when siteId is provided', async () => {
    const loadSpy = vi.fn()
    const mockClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: loadSpy,
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={mockClient} siteId="TEST_SITE_ID">
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalledWith('TEST_SITE_ID', undefined)
    })
  })

  it('should load Fathom with clientOptions when provided', async () => {
    const loadSpy = vi.fn()
    const clientOptions = { honorDNT: true }
    const mockClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: loadSpy,
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        siteId="TEST_SITE_ID"
        clientOptions={clientOptions}
      >
        {children}
      </FathomProvider>
    )

    renderHook(() => useFathom(), { wrapper })

    await waitFor(() => {
      expect(loadSpy).toHaveBeenCalledWith('TEST_SITE_ID', clientOptions)
    })
  })

  it('should provide trackEvent function', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={mockClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event', { _site_id: 'test-id' })

    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'test-id',
    })
  })

  it('should merge defaultEventOptions in trackEvent', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'default-id' }}
      >
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event', { _value: 100 })

    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'default-id',
      _value: 100,
    })
  })

  it('should override defaultEventOptions with provided options', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'default-id' }}
      >
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event', { _site_id: 'override-id' })

    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'override-id',
    })
  })

  it('should provide trackPageview function', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={mockClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.({ url: '/test-page' })

    expect(mockClient.trackPageview).toHaveBeenCalledWith({ url: '/test-page' })
  })

  it('should merge defaultPageviewOptions in trackPageview', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/default' }}
      >
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.({ referrer: 'https://example.com' })

    expect(mockClient.trackPageview).toHaveBeenCalledWith({
      url: '/default',
      referrer: 'https://example.com',
    })
  })

  it('should override defaultPageviewOptions with provided options', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/default' }}
      >
        {children}
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.({ url: '/override' })

    expect(mockClient.trackPageview).toHaveBeenCalledWith({ url: '/override' })
  })

  it('should provide trackGoal function', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={mockClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackGoal?.('GOAL_CODE', 1000)

    expect(mockClient.trackGoal).toHaveBeenCalledWith('GOAL_CODE', 1000)
  })

  it('should provide other Fathom methods', () => {
    const loadSpy = vi.fn()
    const setSiteSpy = vi.fn()
    const blockTrackingSpy = vi.fn()
    const enableTrackingSpy = vi.fn()
    const isTrackingEnabledSpy = vi.fn(() => true)

    const mockClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: loadSpy,
      setSite: setSiteSpy,
      blockTrackingForMe: blockTrackingSpy,
      enableTrackingForMe: enableTrackingSpy,
      isTrackingEnabled: isTrackingEnabledSpy,
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={mockClient}>{children}</FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.load?.('SITE_ID')
    result.current.setSite?.('SITE_ID')
    result.current.blockTrackingForMe?.()
    result.current.enableTrackingForMe?.()
    result.current.isTrackingEnabled?.()

    expect(loadSpy).toHaveBeenCalledWith('SITE_ID', undefined)
    expect(setSiteSpy).toHaveBeenCalledWith('SITE_ID')
    expect(blockTrackingSpy).toHaveBeenCalled()
    expect(enableTrackingSpy).toHaveBeenCalled()
    expect(isTrackingEnabledSpy).toHaveBeenCalled()
  })

  it('should compose nested providers - child uses parent client', () => {
    const parentClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={parentClient}>
        <FathomProvider>{children}</FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBe(parentClient)
  })

  it('should compose nested providers - child overrides parent client', () => {
    const parentClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const childClient = {
      trackEvent: vi.fn(),
      trackPageview: vi.fn(),
      trackGoal: vi.fn(),
      load: vi.fn(),
      setSite: vi.fn(),
      blockTrackingForMe: vi.fn(),
      enableTrackingForMe: vi.fn(),
      isTrackingEnabled: vi.fn(() => true),
    }

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider client={parentClient}>
        <FathomProvider client={childClient}>{children}</FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    expect(result.current.client).toBe(childClient)
  })

  it('should compose nested providers - child inherits parent defaultPageviewOptions', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/parent' }}
      >
        <FathomProvider>{children}</FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.()

    expect(mockClient.trackPageview).toHaveBeenCalledWith({ url: '/parent' })
  })

  it('should compose nested providers - child overrides parent defaultPageviewOptions', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/parent' }}
      >
        <FathomProvider defaultPageviewOptions={{ url: '/child' }}>
          {children}
        </FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.()

    expect(mockClient.trackPageview).toHaveBeenCalledWith({ url: '/child' })
  })

  it('should compose nested providers - child inherits parent defaultEventOptions', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'parent-id' }}
      >
        <FathomProvider>{children}</FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event')

    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'parent-id',
    })
  })

  it('should compose nested providers - child overrides parent defaultEventOptions', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'parent-id' }}
      >
        <FathomProvider defaultEventOptions={{ _site_id: 'child-id' }}>
          {children}
        </FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event')

    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'child-id',
    })
  })

  it('should deep merge nested providers - child overrides specific defaultEventOptions while inheriting others', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'parent-id', _value: 100 }}
      >
        <FathomProvider defaultEventOptions={{ _value: 200 }}>
          {children}
        </FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event')

    // Child overrides _value but inherits _site_id from parent
    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'parent-id',
      _value: 200,
    })
  })

  it('should deep merge nested providers - child overrides specific defaultPageviewOptions while inheriting others', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/parent', referrer: 'https://parent.com' }}
      >
        <FathomProvider defaultPageviewOptions={{ url: '/child' }}>
          {children}
        </FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackPageview?.()

    // Child overrides url but inherits referrer from parent
    expect(mockClient.trackPageview).toHaveBeenCalledWith({
      url: '/child',
      referrer: 'https://parent.com',
    })
  })

  it('should deep merge three levels of nested providers', () => {
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

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultEventOptions={{ _site_id: 'root-id' }}
      >
        <FathomProvider defaultEventOptions={{ _value: 100 }}>
          <FathomProvider defaultEventOptions={{ _value: 200 }}>
            {children}
          </FathomProvider>
        </FathomProvider>
      </FathomProvider>
    )

    const { result } = renderHook(() => useFathom(), { wrapper })

    result.current.trackEvent?.('test-event')

    // Deepest child overrides _value, inherits _site_id from root
    expect(mockClient.trackEvent).toHaveBeenCalledWith('test-event', {
      _site_id: 'root-id',
      _value: 200,
    })
  })

  it('should have displayName', () => {
    expect(FathomProvider.displayName).toBe('FathomProvider')
  })

  describe('clientRef', () => {
    it('should populate clientRef with the resolved client', () => {
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

      let clientRefValue: FathomClient | null = null

      const TestWrapper = ({ children }: { children: React.ReactNode }) => {
        const clientRef = useRef<FathomClient>(null)
        // Capture the ref value after render
        React.useEffect(() => {
          clientRefValue = clientRef.current
        })
        return (
          <FathomProvider client={mockClient} clientRef={clientRef}>
            {children}
          </FathomProvider>
        )
      }

      renderHook(() => useFathom(), { wrapper: TestWrapper })

      expect(clientRefValue).toBe(mockClient)
    })

    it('should allow parent to call client methods via clientRef', () => {
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

      const clientRef = React.createRef<FathomClient>() as React.MutableRefObject<FathomClient | null>
      clientRef.current = null

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient} clientRef={clientRef}>
          {children}
        </FathomProvider>
      )

      renderHook(() => useFathom(), { wrapper })

      // Parent can now use the client directly
      clientRef.current?.trackEvent('parent-event', { _value: 50 })

      expect(mockClient.trackEvent).toHaveBeenCalledWith('parent-event', {
        _value: 50,
      })
    })

    it('should populate clientRef with inherited parent client', () => {
      const parentClient = {
        trackEvent: vi.fn(),
        trackPageview: vi.fn(),
        trackGoal: vi.fn(),
        load: vi.fn(),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      let clientRefValue: FathomClient | null = null

      const TestWrapper = ({ children }: { children: React.ReactNode }) => {
        const clientRef = useRef<FathomClient>(null)
        React.useEffect(() => {
          clientRefValue = clientRef.current
        })
        return (
          <FathomProvider client={parentClient}>
            <FathomProvider clientRef={clientRef}>
              {children}
            </FathomProvider>
          </FathomProvider>
        )
      }

      renderHook(() => useFathom(), { wrapper: TestWrapper })

      // Should inherit the parent client
      expect(clientRefValue).toBe(parentClient)
    })
  })

  describe('onError callback', () => {
    it('should call onError when trackEvent throws', () => {
      const error = new Error('trackEvent failed')
      const onError = vi.fn()
      const mockClient = {
        trackEvent: vi.fn().mockImplementation(() => {
          throw error
        }),
        trackPageview: vi.fn(),
        trackGoal: vi.fn(),
        load: vi.fn(),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient} onError={onError}>
          {children}
        </FathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      result.current.trackEvent?.('test-event')

      expect(onError).toHaveBeenCalledWith(error, {
        method: 'trackEvent',
        args: ['test-event', {}],
      })
    })

    it('should call onError when trackPageview throws', () => {
      const error = new Error('trackPageview failed')
      const onError = vi.fn()
      const mockClient = {
        trackEvent: vi.fn(),
        trackPageview: vi.fn().mockImplementation(() => {
          throw error
        }),
        trackGoal: vi.fn(),
        load: vi.fn(),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient} onError={onError}>
          {children}
        </FathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      result.current.trackPageview?.({ url: '/test' })

      expect(onError).toHaveBeenCalledWith(error, {
        method: 'trackPageview',
        args: [{ url: '/test' }],
      })
    })

    it('should call onError when trackGoal throws', () => {
      const error = new Error('trackGoal failed')
      const onError = vi.fn()
      const mockClient = {
        trackEvent: vi.fn(),
        trackPageview: vi.fn(),
        trackGoal: vi.fn().mockImplementation(() => {
          throw error
        }),
        load: vi.fn(),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient} onError={onError}>
          {children}
        </FathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      result.current.trackGoal?.('GOAL_CODE', 1000)

      expect(onError).toHaveBeenCalledWith(error, {
        method: 'trackGoal',
        args: ['GOAL_CODE', 1000],
      })
    })

    it('should call onError when load throws', () => {
      const error = new Error('load failed')
      const onError = vi.fn()
      const mockClient = {
        trackEvent: vi.fn(),
        trackPageview: vi.fn(),
        trackGoal: vi.fn(),
        load: vi.fn().mockImplementation(() => {
          throw error
        }),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient} onError={onError}>
          {children}
        </FathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      result.current.load?.('SITE_ID')

      expect(onError).toHaveBeenCalledWith(error, {
        method: 'load',
        args: ['SITE_ID', undefined],
      })
    })

    it('should not throw when onError is not provided', () => {
      const mockClient = {
        trackEvent: vi.fn().mockImplementation(() => {
          throw new Error('trackEvent failed')
        }),
        trackPageview: vi.fn(),
        trackGoal: vi.fn(),
        load: vi.fn(),
        setSite: vi.fn(),
        blockTrackingForMe: vi.fn(),
        enableTrackingForMe: vi.fn(),
        isTrackingEnabled: vi.fn(() => true),
      }

      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <FathomProvider client={mockClient}>{children}</FathomProvider>
      )

      const { result } = renderHook(() => useFathom(), { wrapper })

      // Should not throw
      expect(() => result.current.trackEvent?.('test-event')).not.toThrow()
    })
  })
})
