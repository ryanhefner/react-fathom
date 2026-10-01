import { readFileSync } from 'node:fs'

import React from 'react'

import '@testing-library/jest-dom/vitest'

import { afterEach, describe, expect, it } from 'vitest'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { cleanup, render, screen } from '@testing-library/react'

import { SiteFooter } from '../components/docs/SiteFooter'

describe('shared site footer', () => {
  afterEach(cleanup)

  it('includes the copyright holders, credit links, and MIT license', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <SiteFooter year={2026} />
      </ChakraProvider>,
    )
    const footer = screen.getByRole('contentinfo', {
      name: 'Site credits and license',
    })
    expect(footer).toHaveTextContent(
      '© 2025–2026 Ryan Hefner, Commune Software.',
    )
    expect(screen.getByRole('link', { name: 'Ryan Hefner' })).toHaveAttribute(
      'href',
      'https://ryanhefner.com',
    )
    expect(
      screen.getByRole('link', { name: 'Commune Software' }),
    ).toHaveAttribute('href', 'https://www.commune.software')
    expect(screen.getByRole('link', { name: 'MIT license' })).toHaveAttribute(
      'href',
      'https://github.com/ryanhefner/react-fathom/blob/main/LICENSE',
    )
  })

  it('mounts once globally and removes the redundant article-level footer', () => {
    const layout = readFileSync('docs/app/layout.tsx', 'utf8')
    expect(layout.match(/<SiteFooter\b/g)).toHaveLength(1)
    expect(layout.indexOf('<SiteFooter')).toBeLessThan(
      layout.indexOf('<CommuneFooter'),
    )
    const article = readFileSync('docs/components/docs/DocsLayout.tsx', 'utf8')
    expect(article).not.toMatch(/as="footer"|© Ryan Hefner/)
  })
})
