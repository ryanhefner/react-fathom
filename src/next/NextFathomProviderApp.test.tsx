import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen } from '@testing-library/react'

import { NextFathomProviderApp } from './NextFathomProviderApp'

// Mock FathomProvider and NextFathomTrackViewApp
vi.mock('../FathomProvider', () => ({
  FathomProvider: ({
    children,
    siteId,
    clientOptions,
  }: {
    children: React.ReactNode
    siteId?: string
    clientOptions?: unknown
  }) => (
    <div
      data-testid="fathom-provider"
      data-site-id={siteId}
      data-client-options={JSON.stringify(clientOptions)}
    >
      {children}
    </div>
  ),
}))

vi.mock('./NextFathomTrackViewApp', () => ({
  NextFathomTrackViewApp: ({
    disableAutoTrack,
  }: {
    disableAutoTrack?: boolean
  }) => (
    <div
      data-testid="track-view-app"
      data-disable-auto-track={disableAutoTrack}
    >
      TrackViewApp
    </div>
  ),
}))

describe('NextFathomProviderApp', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render FathomProvider and NextFathomTrackViewApp with children', () => {
    render(
      <NextFathomProviderApp siteId="TEST_SITE_ID">
        <div>Test Content</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByTestId('fathom-provider')).toBeInTheDocument()
    expect(screen.getByTestId('fathom-provider')).toHaveAttribute(
      'data-site-id',
      'TEST_SITE_ID',
    )
    expect(screen.getByTestId('track-view-app')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should pass siteId to FathomProvider', () => {
    render(
      <NextFathomProviderApp siteId="MY_SITE_ID">
        <div>Content</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByTestId('fathom-provider')).toHaveAttribute(
      'data-site-id',
      'MY_SITE_ID',
    )
  })

  it('should pass disableAutoTrack to NextFathomTrackViewApp', () => {
    render(
      <NextFathomProviderApp siteId="TEST_SITE_ID" disableAutoTrack>
        <div>Content</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByTestId('track-view-app')).toHaveAttribute(
      'data-disable-auto-track',
      'true',
    )
  })

  it('should default disableAutoTrack to false', () => {
    render(
      <NextFathomProviderApp siteId="TEST_SITE_ID">
        <div>Content</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByTestId('track-view-app')).toHaveAttribute(
      'data-disable-auto-track',
      'false',
    )
  })

  it('should pass clientOptions to FathomProvider', () => {
    const clientOptions = { honorDNT: true, spa: 'auto' }

    render(
      <NextFathomProviderApp
        siteId="TEST_SITE_ID"
        clientOptions={clientOptions}
      >
        <div>Content</div>
      </NextFathomProviderApp>,
    )

    const provider = screen.getByTestId('fathom-provider')
    const options = JSON.parse(
      provider.getAttribute('data-client-options') || '{}',
    )
    expect(options).toEqual(clientOptions)
  })

  it('should pass all FathomProvider props except children and disableAutoTrack', () => {
    render(
      <NextFathomProviderApp
        siteId="TEST_SITE_ID"
        defaultPageviewOptions={{ referrer: 'https://example.com' }}
        defaultEventOptions={{ id: 'test' }}
      >
        <div>Content</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByTestId('fathom-provider')).toBeInTheDocument()
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('should have displayName', () => {
    expect(NextFathomProviderApp.displayName).toBe('NextFathomProviderApp')
  })

  it('should render multiple children correctly', () => {
    render(
      <NextFathomProviderApp siteId="TEST_SITE_ID">
        <div>Child 1</div>
        <div>Child 2</div>
      </NextFathomProviderApp>,
    )

    expect(screen.getByText('Child 1')).toBeInTheDocument()
    expect(screen.getByText('Child 2')).toBeInTheDocument()
  })
})
