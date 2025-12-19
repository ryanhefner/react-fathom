import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { renderHook } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useTrackOnMount } from './useTrackOnMount'

describe('useTrackOnMount', () => {
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

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <FathomProvider client={mockClient}>{children}</FathomProvider>
  )

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should track pageview on mount', () => {
    renderHook(() => useTrackOnMount(), { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    // The hook passes undefined, which becomes {} when merged
    expect(mockTrackPageview).toHaveBeenCalled()
  })

  it('should track pageview with options', () => {
    const options = { url: '/test-page' }
    renderHook(() => useTrackOnMount(options), { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    expect(mockTrackPageview).toHaveBeenCalledWith(options)
  })

  it('should only track once on mount', () => {
    const { rerender } = renderHook(() => useTrackOnMount(), { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)

    rerender()
    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
  })

  it('should not track when used outside FathomProvider', () => {
    renderHook(() => useTrackOnMount())

    expect(mockTrackPageview).not.toHaveBeenCalled()
  })

  it('should track with defaultPageviewOptions from provider', () => {
    const defaultOptions = { url: '/default' }
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={defaultOptions}
      >
        {children}
      </FathomProvider>
    )

    renderHook(() => useTrackOnMount(), { wrapper: customWrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    // The hook passes undefined, provider merges defaults internally
    expect(mockTrackPageview).toHaveBeenCalledWith({ url: '/default' })
  })
})
