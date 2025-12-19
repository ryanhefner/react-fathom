import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { FathomProvider } from '../FathomProvider'
import { TrackPageview } from './TrackPageview'

describe('TrackPageview', () => {
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
    render(<TrackPageview />, { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    expect(mockTrackPageview).toHaveBeenCalledWith({})
  })

  it('should track pageview with options', () => {
    render(<TrackPageview url="/test-page" />, { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    expect(mockTrackPageview).toHaveBeenCalledWith({ url: '/test-page' })
  })

  it('should render children', () => {
    render(
      <TrackPageview>
        <div>Page content</div>
      </TrackPageview>,
      { wrapper },
    )

    expect(screen.getByText('Page content')).toBeInTheDocument()
    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
  })

  it('should render without children', () => {
    const { container } = render(<TrackPageview />, { wrapper })

    expect(container.firstChild).toBeNull()
    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
  })

  it('should only track once on mount', () => {
    const { rerender } = render(<TrackPageview />, { wrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)

    rerender(<TrackPageview />)
    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
  })

  it('should merge defaultPageviewOptions from provider', () => {
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/default' }}
      >
        {children}
      </FathomProvider>
    )

    render(<TrackPageview />, { wrapper: customWrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    // The component passes empty object, provider merges defaults internally
    expect(mockTrackPageview).toHaveBeenCalledWith({ url: '/default' })
  })

  it('should override defaultPageviewOptions with props', () => {
    const customWrapper = ({ children }: { children: React.ReactNode }) => (
      <FathomProvider
        client={mockClient}
        defaultPageviewOptions={{ url: '/default' }}
      >
        {children}
      </FathomProvider>
    )

    render(<TrackPageview url="/custom" />, { wrapper: customWrapper })

    expect(mockTrackPageview).toHaveBeenCalledTimes(1)
    expect(mockTrackPageview).toHaveBeenCalledWith({ url: '/custom' })
  })

  it('should not track when used outside FathomProvider', () => {
    render(<TrackPageview />)

    expect(mockTrackPageview).not.toHaveBeenCalled()
  })
})
