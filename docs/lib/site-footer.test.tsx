import { readFileSync } from 'node:fs'

import React from 'react'

import '@testing-library/jest-dom/vitest'

import { afterEach, describe, expect, it } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { SiteFooter } from '../components/docs/SiteFooter'

describe('shared site footer', () => {
  afterEach(cleanup)

  it('includes Ryan’s credit and MIT license without repeating the Commune sub-footer', () => {
    render(
      <ChakraProvider value={testSystem}>
        <SiteFooter year={2026} />
      </ChakraProvider>,
    )
    const footer = screen.getByRole('contentinfo', {
      name: 'Site credits and license',
    })
    expect(footer).toHaveTextContent('© 2025–2026 Ryan Hefner.')
    expect(screen.getByRole('link', { name: 'Ryan Hefner' })).toHaveAttribute(
      'href',
      'https://www.ryanhefner.com',
    )
    expect(
      screen.queryByRole('link', { name: 'Commune Software' }),
    ).not.toBeInTheDocument()
    expect(footer).not.toHaveTextContent('Commune')
    expect(screen.getByRole('link', { name: 'MIT license' })).toHaveAttribute(
      'href',
      'https://github.com/ryanhefner/react-fathom/blob/main/LICENSE',
    )
  })

  it('mounts once globally and removes the redundant article-level footer', () => {
    const layout = readFileSync('docs/app/site-experience.tsx', 'utf8')
    expect(layout.match(/<SiteFooter\b/g)).toHaveLength(1)
    expect(layout.indexOf('<SiteFooter')).toBeLessThan(
      layout.indexOf('<CommuneFooter'),
    )
    const article = readFileSync('docs/components/docs/DocsLayout.tsx', 'utf8')
    expect(article).not.toMatch(/as="footer"|© Ryan Hefner/)
  })
})
