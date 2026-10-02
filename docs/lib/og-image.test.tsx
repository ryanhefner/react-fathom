import { readFileSync } from 'node:fs'

import React, { type ReactNode } from 'react'

import { afterEach, describe, expect, it, vi } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen, waitFor } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import {
  getOgImageContent,
  OG_IMAGE_DEFAULTS,
  OG_IMAGE_HEIGHT,
  OG_IMAGE_WIDTH,
} from './og-image'
import { SiteExperience } from '../app/site-experience'
import { OgImageCard, OgImagePage } from '../components/docs/OgImagePage'

const navigation = vi.hoisted(() => ({
  pathname: '/og-image',
  params: new URLSearchParams(),
}))
vi.mock('next/navigation', () => ({
  usePathname: () => navigation.pathname,
  useSearchParams: () => navigation.params,
}))
vi.mock('../app/provider', () => ({
  Provider: ({ children }: { children: ReactNode }) => (
    <ChakraProvider value={testSystem}>
      <div data-testid="site-provider">{children}</div>
    </ChakraProvider>
  ),
}))

afterEach(() => {
  cleanup()
  navigation.pathname = '/og-image'
  navigation.params = new URLSearchParams()
})

describe('Open Graph capture page', () => {
  it('normalizes and bounds plain-text overrides without splitting Unicode', () => {
    expect(getOgImageContent(new URLSearchParams())).toEqual(OG_IMAGE_DEFAULTS)
    expect(
      getOgImageContent(
        new URLSearchParams({ title: '  React\n Native  ', description: '  ' }),
      ),
    ).toEqual({
      title: 'React Native',
      description: OG_IMAGE_DEFAULTS.description,
    })
    const long = getOgImageContent(
      new URLSearchParams({
        title: '😀'.repeat(101),
        description: 'x'.repeat(201),
      }),
    )
    expect(Array.from(long.title)).toHaveLength(100)
    expect(long.description).toHaveLength(200)
  })

  it('renders an exact 1200 × 630 default card without site controls', async () => {
    render(
      <ChakraProvider value={testSystem}>
        <OgImageCard />
      </ChakraProvider>,
    )
    const main = screen.getByRole('main', { name: 'Open Graph image' })
    expect(getComputedStyle(main).width).toBe(`${OG_IMAGE_WIDTH}px`)
    expect(getComputedStyle(main).height).toBe(`${OG_IMAGE_HEIGHT}px`)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      OG_IMAGE_DEFAULTS.title,
    )
    expect(screen.getByText(OG_IMAGE_DEFAULTS.description)).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Commune Software' }),
    ).toHaveAttribute('src', '/assets/commune-software-wordmark.svg')
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
    await waitFor(() => expect(main).toHaveAttribute('data-og-ready', 'true'))
  })

  it('renders query overrides as inert text', () => {
    navigation.params = new URLSearchParams({
      title: '<script>alert(1)</script>',
      description: 'Custom guide description',
    })
    render(
      <ChakraProvider value={testSystem}>
        <OgImagePage />
      </ChakraProvider>,
    )
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      '<script>alert(1)</script>',
    )
    expect(screen.getByText('Custom guide description')).toBeInTheDocument()
    expect(document.querySelector('script')).toBeNull()
  })

  it('omits the normal provider and footers on capture routes, including trailing slash', () => {
    for (const pathname of ['/og-image', '/og-image/']) {
      navigation.pathname = pathname
      render(
        <SiteExperience siteUrl="https://react-fathom.com" year={2026}>
          <OgImageCard />
        </SiteExperience>,
      )
      expect(screen.queryByTestId('site-provider')).not.toBeInTheDocument()
      expect(screen.queryByRole('contentinfo')).not.toBeInTheDocument()
      expect(
        screen.queryByRole('region', { name: 'By Commune Software' }),
      ).not.toBeInTheDocument()
      cleanup()
    }
  })

  it('preserves the regular provider and shared footers on ordinary routes', () => {
    navigation.pathname = '/withoss'
    render(
      <SiteExperience siteUrl="https://react-fathom.com" year={2026}>
        <p>Ordinary page</p>
      </SiteExperience>,
    )
    expect(screen.getByTestId('site-provider')).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(
      screen.getByRole('region', { name: 'By Commune Software' }),
    ).toBeInTheDocument()
  })

  it('marks the capture route noindex without replacing existing image metadata', () => {
    expect(readFileSync('docs/app/og-image/page.tsx', 'utf8')).toContain(
      'index: false',
    )
    expect(readFileSync('docs/app/sitemap.ts', 'utf8')).not.toContain(
      "'/og-image'",
    )
    expect(readFileSync('docs/lib/site-metadata.ts', 'utf8')).toContain(
      "url: '/og-image.svg'",
    )
  })
})
