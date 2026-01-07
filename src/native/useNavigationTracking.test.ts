import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook, act, waitFor } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useNavigationTracking } from './useNavigationTracking'

describe('useNavigationTracking', () => {
  const mockTrackPageview = vi.fn()
  const mockClient = {
    trackEvent: vi.fn(),
    trackPageview: mockTrackPageview,
    trackGoal: vi.fn(),
    load: vi.fn(),
    setSite: vi.fn(),
    blockTrackingForMe: vi.fn(),
    enableTrackingForMe: vi.fn(),
    isTrackingEnabled: vi.fn(() => true),
  }

  // Store listener callbacks for testing
  let stateChangeCallback: (() => void) | null = null

  const createMockNavigationRef = (initialRoute = 'Home', params?: object) => {
    let currentRoute = initialRoute
    let currentParams = params

    return {
      current: {
        getRootState: () => ({
          index: 0,
          routes: [{ name: currentRoute, params: currentParams }],
        }),
        addListener: vi.fn((event, callback) => {
          if (event === 'state') {
            stateChangeCallback = callback
          }
          return vi.fn() // Return unsubscribe function
        }),
        // Helper method for testing to change route
        __setRoute: (name: string, newParams?: object) => {
          currentRoute = name
          currentParams = newParams
        },
      },
    }
  }

  beforeEach(() => {
    vi.clearAllMocks()
    stateChangeCallback = null
  })

  const createWrapper = () => {
    return ({ children }: { children: React.ReactNode }) =>
      React.createElement(FathomProvider, { client: mockClient }, children)
  }

  it('should set up navigation listener on mount', async () => {
    const navigationRef = createMockNavigationRef()

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(navigationRef.current.addListener).toHaveBeenCalledWith(
        'state',
        expect.any(Function),
      )
    })
  })

  it('should track initial route on mount', async () => {
    const navigationRef = createMockNavigationRef('Home')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Home',
      })
    })
  })

  it('should track route changes', async () => {
    const navigationRef = createMockNavigationRef('Home')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    // Wait for initial tracking
    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalled()
    })

    mockTrackPageview.mockClear()

    // Simulate navigation to Settings
    navigationRef.current.__setRoute('Settings')

    act(() => {
      stateChangeCallback?.()
    })

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Settings',
        referrer: '/Home',
      })
    })
  })

  it('should not track same route twice', async () => {
    const navigationRef = createMockNavigationRef('Home')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    })

    // Trigger state change without route change
    act(() => {
      stateChangeCallback?.()
    })

    // Should still only have been called once
    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
  })

  it('should transform route names when transformRouteName is provided', async () => {
    const navigationRef = createMockNavigationRef('Home')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          transformRouteName: (name) => `/screens/${name.toLowerCase()}`,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/screens/home',
      })
    })
  })

  it('should filter routes when shouldTrackRoute returns false', async () => {
    const navigationRef = createMockNavigationRef('ModalScreen')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          shouldTrackRoute: (name) => !name.includes('Modal'),
        }),
      { wrapper: createWrapper() },
    )

    // Wait a bit to ensure tracking doesn't happen
    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(mockTrackPageview).not.toHaveBeenCalled()
  })

  it('should track route when shouldTrackRoute returns true', async () => {
    const navigationRef = createMockNavigationRef('Home')

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          shouldTrackRoute: (name) => !name.includes('Modal'),
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Home',
      })
    })
  })

  it('should include params when includeParams is true', async () => {
    const navigationRef = createMockNavigationRef('Profile', { userId: '123' })

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          includeParams: true,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Profile?userId=123',
      })
    })
  })

  it('should not include params when includeParams is false', async () => {
    const navigationRef = createMockNavigationRef('Profile', { userId: '123' })

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          includeParams: false,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Profile',
      })
    })
  })

  it('should handle multiple params', async () => {
    const navigationRef = createMockNavigationRef('Search', {
      query: 'test',
      page: 1,
    })

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          includeParams: true,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      const call = mockTrackPageview.mock.calls[0][0]
      expect(call.url).toContain('/Search?')
      expect(call.url).toContain('query=test')
      expect(call.url).toContain('page=1')
    })
  })

  it('should encode special characters in params', async () => {
    const navigationRef = createMockNavigationRef('Search', {
      query: 'hello world',
    })

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          includeParams: true,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Search?query=hello%20world',
      })
    })
  })

  it('should skip null and undefined params', async () => {
    const navigationRef = createMockNavigationRef('Profile', {
      userId: '123',
      extra: null,
      other: undefined,
    })

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          includeParams: true,
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(mockTrackPageview).toHaveBeenCalledWith({
        url: '/Profile?userId=123',
      })
    })
  })

  it('should pass params to shouldTrackRoute', async () => {
    const shouldTrackRoute = vi.fn(() => true)
    const params = { userId: '123' }
    const navigationRef = createMockNavigationRef('Profile', params)

    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
          shouldTrackRoute,
          includeParams: true, // Need this for params to be passed
        }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => {
      expect(shouldTrackRoute).toHaveBeenCalledWith('Profile', params)
    })
  })

  it('should handle navigation ref without getRootState', async () => {
    const navigationRef = {
      current: {
        getRootState: undefined,
        addListener: vi.fn(() => vi.fn()),
      },
    }

    // Should not throw
    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(mockTrackPageview).not.toHaveBeenCalled()
  })

  it('should handle null navigation ref current', async () => {
    const navigationRef = {
      current: null,
    }

    // Should not throw
    renderHook(
      () =>
        useNavigationTracking({
          navigationRef: navigationRef as any,
        }),
      { wrapper: createWrapper() },
    )

    await new Promise((resolve) => setTimeout(resolve, 50))

    expect(mockTrackPageview).not.toHaveBeenCalled()
  })

  describe('nested navigation', () => {
    it('should track deepest route in nested navigators', async () => {
      const navigationRef = {
        current: {
          getRootState: () => ({
            index: 0,
            routes: [
              {
                name: 'MainStack',
                state: {
                  index: 1,
                  routes: [
                    { name: 'Home' },
                    {
                      name: 'TabNavigator',
                      state: {
                        index: 0,
                        routes: [{ name: 'Feed' }],
                      },
                    },
                  ],
                },
              },
            ],
          }),
          addListener: vi.fn(() => vi.fn()),
        },
      }

      renderHook(
        () =>
          useNavigationTracking({
            navigationRef: navigationRef as any,
          }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => {
        expect(mockTrackPageview).toHaveBeenCalledWith({
          url: '/Feed',
        })
      })
    })
  })

  describe('combined options', () => {
    it('should work with all options combined', async () => {
      const navigationRef = createMockNavigationRef('UserProfile', {
        id: '456',
      })

      renderHook(
        () =>
          useNavigationTracking({
            navigationRef: navigationRef as any,
            transformRouteName: (name) => `/app/${name}`,
            shouldTrackRoute: () => true,
            includeParams: true,
          }),
        { wrapper: createWrapper() },
      )

      await waitFor(() => {
        expect(mockTrackPageview).toHaveBeenCalledWith({
          url: '/app/UserProfile?id=456',
        })
      })
    })
  })
})
