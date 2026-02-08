import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { act, render, waitFor } from '@testing-library/react'
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from '@tanstack/react-router'

import { FathomProvider } from '../FathomProvider'
import { TanStackRouterFathomTrackView } from './TanStackRouterFathomTrackView'

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

// Create a mock client factory
const createMockClient = () => ({
  trackEvent: vi.fn(),
  trackPageview: vi.fn(),
  trackGoal: vi.fn(),
  load: vi.fn(),
  setSite: vi.fn(),
  blockTrackingForMe: vi.fn(),
  enableTrackingForMe: vi.fn(),
  isTrackingEnabled: vi.fn(() => true),
})

// Create a test router setup helper that includes tracking in root component
function createTestRouter(
  initialPath: string = '/',
  client: ReturnType<typeof createMockClient>,
  trackViewProps: React.ComponentProps<typeof TanStackRouterFathomTrackView> = {},
) {
  const rootRoute = createRootRoute({
    component: () => (
      <FathomProvider client={client} siteId="TEST_SITE_ID">
        <TanStackRouterFathomTrackView {...trackViewProps} />
        <Outlet />
      </FathomProvider>
    ),
  })

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: () => <div>Home</div>,
  })

  const testRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/test-page',
    component: () => <div>Test Page</div>,
  })

  const newRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/new-page',
    component: () => <div>New Page</div>,
  })

  const routeTree = rootRoute.addChildren([indexRoute, testRoute, newRoute])

  const router = createRouter({
    routeTree,
    history: createMemoryHistory({
      initialEntries: [initialPath],
    }),
  })

  return router
}

describe('TanStackRouterFathomTrackView', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete (window as { location?: unknown }).location
    window.location = {
      href: 'https://example.com/test-page',
      origin: 'https://example.com',
    } as Location
  })

  it('should track initial pageview on mount', async () => {
    const client = createMockClient()
    const router = createTestRouter('/test-page', client)

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalled()
    })

    expect(client.trackPageview).toHaveBeenCalledWith({
      url: 'https://example.com/test-page',
    })
  })

  it('should track pageviews on route changes', async () => {
    const client = createMockClient()
    const router = createTestRouter('/', client)

    render(<RouterProvider router={router} />)

    // Wait for initial pageview
    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalledTimes(1)
    })

    // Navigate to new page using router
    await act(async () => {
      await router.navigate({ to: '/new-page' })
    })

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalledTimes(2)
    })

    expect(client.trackPageview).toHaveBeenLastCalledWith({
      url: 'https://example.com/new-page',
    })
  })

  it('should not track when disableAutoTrack is true', async () => {
    const client = createMockClient()
    const router = createTestRouter('/test-page', client, { disableAutoTrack: true })

    render(<RouterProvider router={router} />)

    // Give time for effects to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    expect(client.trackPageview).not.toHaveBeenCalled()
  })

  it('should include search params by default', async () => {
    const client = createMockClient()
    const router = createTestRouter('/test-page?foo=bar', client)

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalled()
    })

    expect(client.trackPageview).toHaveBeenCalledWith({
      url: 'https://example.com/test-page?foo=bar',
    })
  })

  it('should exclude search params when includeSearchParams is false', async () => {
    const client = createMockClient()
    const router = createTestRouter('/test-page?foo=bar', client, { includeSearchParams: false })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalled()
    })

    expect(client.trackPageview).toHaveBeenCalledWith({
      url: 'https://example.com/test-page',
    })
  })

  it('should include hash when includeHash is true', async () => {
    const client = createMockClient()
    const router = createTestRouter('/test-page#section', client, { includeHash: true })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalled()
    })

    expect(client.trackPageview).toHaveBeenCalledWith({
      url: 'https://example.com/test-page#section',
    })
  })

  it('should transform URL when transformUrl is provided', async () => {
    const client = createMockClient()
    const transformUrl = (url: string) => url.replace('/test-page', '/transformed')
    const router = createTestRouter('/test-page', client, { transformUrl })

    render(<RouterProvider router={router} />)

    await waitFor(() => {
      expect(client.trackPageview).toHaveBeenCalled()
    })

    expect(client.trackPageview).toHaveBeenCalledWith({
      url: 'https://example.com/transformed',
    })
  })

  it('should skip tracking when transformUrl returns null', async () => {
    const client = createMockClient()
    const transformUrl = () => null
    const router = createTestRouter('/test-page', client, { transformUrl })

    render(<RouterProvider router={router} />)

    // Give time for effects to run
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })

    expect(client.trackPageview).not.toHaveBeenCalled()
  })

  it('should have displayName', () => {
    expect(TanStackRouterFathomTrackView.displayName).toBe(
      'TanStackRouterFathomTrackView',
    )
  })
})
