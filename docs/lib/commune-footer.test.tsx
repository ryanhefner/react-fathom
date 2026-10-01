import { readFileSync } from 'node:fs'

import React from 'react'

import '@testing-library/jest-dom/vitest'

import { afterEach, describe, expect, it } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { CommuneFooter } from '../components/docs/CommuneFooter'

describe('COMMUNE sub-footer', () => {
  afterEach(() => {
    cleanup()
    document.documentElement.classList.remove('dark')
  })

  it('provides a full-width, accessible link using the local Playstack SVG', () => {
    render(
      <ChakraProvider value={testSystem}>
        <CommuneFooter />
      </ChakraProvider>,
    )
    const footer = screen.getByRole('region', {
      name: 'By Commune Software',
    })
    expect(footer).toHaveTextContent('By')
    expect(
      screen.getByRole('link', { name: 'Commune Software' }),
    ).toHaveAttribute('href', 'https://commune.software')
    const wordmark = screen.getByRole('img', { name: 'Commune Software' })
    expect(wordmark).toHaveAttribute(
      'src',
      '/assets/commune-software-wordmark.svg',
    )
    expect(wordmark).toHaveAttribute('loading', 'lazy')
    expect(getComputedStyle(wordmark).height).toBe('auto')
    expect(getComputedStyle(wordmark).filter).not.toBe('invert(1)')
    // jsdom does not resolve CSS custom properties, so check Chakra's emitted
    // token declarations rather than its incomplete computed color values.
    const footerClass = [...footer.classList].find((name) =>
      name.startsWith('css-'),
    )
    const footerRule = Array.from(document.styleSheets)
      .flatMap((sheet) => Array.from(sheet.cssRules))
      .find(
        (rule) =>
          'selectorText' in rule && rule.selectorText === `.${footerClass}`,
      )
    expect(footerRule?.cssText).toMatch(
      /background(?:-color)?: var\(--chakra-colors-black\)/,
    )
    expect(footerRule?.cssText).toContain('color: var(--chakra-colors-white)')
    document.documentElement.classList.add('dark')
    expect(getComputedStyle(wordmark).filter).not.toBe('invert(1)')
  })

  it('is mounted once in the shared layout, after the page content', () => {
    const layout = readFileSync('docs/app/layout.tsx', 'utf8')
    expect(layout.match(/<CommuneFooter\s*\/>/g)).toHaveLength(1)
    expect(layout).toMatch(
      /<Provider[^>]*>\s*\{children\}\s*<SiteFooter[^>]+\/>\s*<CommuneFooter\s*\/>/,
    )
  })

  it('ships the self-contained SVG wordmark without executable or remote content', () => {
    const asset = readFileSync(
      'docs/public/assets/commune-software-wordmark.svg',
      'utf8',
    )
    const svg = new DOMParser().parseFromString(asset, 'image/svg+xml')
    expect(svg.querySelector('parsererror')).toBeNull()
    expect(svg.documentElement.getAttribute('width')).toBe('832')
    expect(svg.documentElement.getAttribute('height')).toBe('160')
    expect(svg.querySelector('g')?.getAttribute('fill')).toBe('#fff')
    expect(svg.querySelectorAll('g path')).toHaveLength(2)
    expect(svg.querySelector('script, foreignObject, image, use')).toBeNull()
    expect(asset).not.toMatch(/\son\w+\s*=|(?:xlink:)?href\s*=/i)
  })
})
