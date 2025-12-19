import React from 'react'

import { describe, expect, it, vi } from 'vitest'

import { renderHook } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { useFathom } from './useFathom'

describe('useFathom', () => {
  it('should return context values when used within FathomProvider', () => {
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

    expect(result.current.client).toBe(mockClient)
    expect(result.current.trackEvent).toBeDefined()
    expect(result.current.trackPageview).toBeDefined()
    expect(result.current.trackGoal).toBeDefined()
    expect(result.current.load).toBeDefined()
    expect(result.current.setSite).toBeDefined()
    expect(result.current.blockTrackingForMe).toBeDefined()
    expect(result.current.enableTrackingForMe).toBeDefined()
    expect(result.current.isTrackingEnabled).toBeDefined()
  })

  it('should return empty context when used outside FathomProvider', () => {
    const { result } = renderHook(() => useFathom())

    expect(result.current.client).toBeUndefined()
    expect(result.current.trackEvent).toBeUndefined()
    expect(result.current.trackPageview).toBeUndefined()
  })

  it('should have displayName', () => {
    expect(useFathom.displayName).toBe('useFathom')
  })
})
