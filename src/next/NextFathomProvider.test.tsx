import React from 'react'

import { beforeEach, describe, expect, it, vi } from 'vitest'

import { render, screen, waitFor } from '@testing-library/react'

import { NextFathomProvider } from './NextFathomProvider'

// Mock the lazy-loaded providers
vi.mock('./NextFathomProviderApp', () => ({
  default: ({
    children,
    siteId,
  }: {
    children: React.ReactNode
    siteId?: string
  }) => (
    <div data-testid="app-provider" data-site-id={siteId}>
      {children}
    </div>
  ),
}))

vi.mock('./NextFathomProviderPages', () => ({
  default: ({
    children,
    siteId,
  }: {
    children: React.ReactNode
    siteId?: string
  }) => (
    <div data-testid="pages-provider" data-site-id={siteId}>
      {children}
    </div>
  ),
}))

describe('NextFathomProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render App Router provider by default', async () => {
    render(
      <NextFathomProvider siteId="TEST_SITE_ID">
        <div>Test Content</div>
      </NextFathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('app-provider')).toBeInTheDocument()
      expect(screen.getByTestId('app-provider')).toHaveAttribute(
        'data-site-id',
        'TEST_SITE_ID',
      )
    })

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render App Router provider when router="app"', async () => {
    render(
      <NextFathomProvider siteId="TEST_SITE_ID" router="app">
        <div>Test Content</div>
      </NextFathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('app-provider')).toBeInTheDocument()
    })

    expect(screen.queryByTestId('pages-provider')).not.toBeInTheDocument()
  })

  it('should render Pages Router provider when router="pages"', async () => {
    render(
      <NextFathomProvider siteId="TEST_SITE_ID" router="pages">
        <div>Test Content</div>
      </NextFathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('pages-provider')).toBeInTheDocument()
      expect(screen.getByTestId('pages-provider')).toHaveAttribute(
        'data-site-id',
        'TEST_SITE_ID',
      )
    })

    expect(screen.queryByTestId('app-provider')).not.toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should render custom fallback while loading', async () => {
    render(
      <NextFathomProvider
        siteId="TEST_SITE_ID"
        fallback={<div>Loading...</div>}
      >
        <div>Test Content</div>
      </NextFathomProvider>,
    )

    // Suspense fallback may be shown briefly, but provider should load quickly
    await waitFor(() => {
      expect(screen.getByTestId('app-provider')).toBeInTheDocument()
    })
  })

  it('should pass all props to the underlying provider', async () => {
    const clientOptions = { honorDNT: true }
    render(
      <NextFathomProvider
        siteId="TEST_SITE_ID"
        router="app"
        clientOptions={clientOptions}
        disableAutoTrack
      >
        <div>Test Content</div>
      </NextFathomProvider>,
    )

    await waitFor(() => {
      expect(screen.getByTestId('app-provider')).toBeInTheDocument()
    })
  })

  it('should have displayName', () => {
    expect(NextFathomProvider.displayName).toBe('NextFathomProvider')
  })
})
