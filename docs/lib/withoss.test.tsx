import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'

import React from 'react'

import { afterEach, describe, expect, it } from 'vitest'

import { ChakraProvider } from '@chakra-ui/react'
import { cleanup, render, screen, within } from '@testing-library/react'

import { testSystem } from './chakra-test-system'
import { ossProjectGroups } from './oss-projects'
import { WITH_OSS_PAGE } from './site-metadata'
import { SiteFooter } from '../components/docs/SiteFooter'
import { WithOssPage } from '../components/docs/WithOssPage'

afterEach(cleanup)

describe('open-source credits', () => {
  it('separates library and site dependencies in accessible responsive rows', () => {
    render(
      <ChakraProvider value={testSystem}>
        <WithOssPage />
      </ChakraProvider>,
    )
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Made with open-source software',
      }),
    ).toBeInTheDocument()
    const projects = screen.getByRole('region', {
      name: ossProjectGroups[0].title,
    }).parentElement!
    expect(getComputedStyle(projects).display).toBe('flex')
    expect(getComputedStyle(projects).flexDirection).toBe('column')
    expect(getComputedStyle(projects).gap).toBe('var(--chakra-spacing-16)')
    for (const group of ossProjectGroups) {
      const section = screen.getByRole('region', { name: group.title })
      expect(
        within(section).getByRole('heading', { level: 2, name: group.title }),
      ).toBeInTheDocument()
      expect(within(section).getAllByRole('listitem')).toHaveLength(
        group.projects.length,
      )
      expect(getComputedStyle(within(section).getByRole('list')).gap).toBe(
        '0px',
      )
      for (const project of group.projects) {
        expect(within(section).getByText(project.name)).toBeInTheDocument()
        expect(
          within(section).getByRole('link', {
            name: project.href
              .replace(/^https:\/\/(?:www\.)?/, '')
              .replace(/\/$/, ''),
          }),
        ).toHaveAttribute('href', project.href)
      }
    }
  })

  it('uses the same OSS asset in the page and the internal footer link', () => {
    render(
      <ChakraProvider value={testSystem}>
        <WithOssPage />
        <SiteFooter year={2026} />
      </ChakraProvider>,
    )
    const main = screen.getByRole('main')
    const footer = screen.getByRole('contentinfo')
    const badgeLink = within(footer).getByRole('link', {
      name: 'Made with open-source software',
    })
    expect(badgeLink).toHaveAttribute('href', '/withoss')
    const pageMark = main.querySelector('img')!
    const footerMark = badgeLink.querySelector('img')!
    expect(pageMark).toHaveAttribute('src', '/assets/oss.svg')
    expect(footerMark).toHaveAttribute('src', pageMark.getAttribute('src'))
    expect(pageMark).toHaveAttribute('alt', '')
    expect(getComputedStyle(pageMark).filter).toBe('invert(1)')
    expect(getComputedStyle(footerMark).filter).toBe('invert(1)')
  })

  it('preserves the exact reference SVG without active or remote content', () => {
    const asset = readFileSync('docs/public/assets/oss.svg', 'utf8')
    expect(createHash('sha256').update(asset.trim()).digest('hex')).toBe(
      '50860e5039199dbd34ef7ab03ff9e1b17c28dc69c199b3d0c299ab8d17b2de31',
    )
    const svg = new DOMParser().parseFromString(asset, 'image/svg+xml')
    expect(
      svg.querySelector('parsererror, script, foreignObject, image, use'),
    ).toBeNull()
    expect(svg.querySelectorAll('path')).toHaveLength(2)
    expect(asset).not.toMatch(/\son\w+\s*=|(?:xlink:)?href\s*=/i)
  })

  it('exports page metadata and includes the route in the sitemap', () => {
    expect(readFileSync('docs/app/withoss/page.tsx', 'utf8')).toContain(
      'createPageMetadata(WITH_OSS_PAGE)',
    )
    expect(WITH_OSS_PAGE.route).toBe('/withoss')
    expect(readFileSync('docs/app/sitemap.ts', 'utf8')).toContain(
      "new URL('/withoss', SITE_URL)",
    )
  })
})
