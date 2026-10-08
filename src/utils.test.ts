import { describe, expect, it } from 'vitest'

import { buildTrackingUrl } from './utils'

describe('buildTrackingUrl', () => {
  it('builds an absolute URL from route parts', () => {
    expect(
      buildTrackingUrl({
        pathname: '/docs',
        search: 'page=2',
        hash: 'install',
        includeHash: true,
        origin: 'https://example.com/',
      }),
    ).toBe('https://example.com/docs?page=2#install')
  })

  it('does not duplicate search and hash prefixes', () => {
    expect(
      buildTrackingUrl({
        pathname: '/docs',
        search: '?page=2',
        hash: '#install',
        includeHash: true,
        origin: 'https://example.com',
      }),
    ).toBe('https://example.com/docs?page=2#install')
  })

  it('omits optional route parts when disabled', () => {
    expect(
      buildTrackingUrl({
        pathname: '/docs',
        search: '?page=2',
        hash: '#install',
        includeSearchParams: false,
        includeHash: false,
        origin: 'https://example.com',
      }),
    ).toBe('https://example.com/docs')
  })

  it('applies URL transformations', () => {
    expect(
      buildTrackingUrl({
        pathname: '/docs',
        search: '?token=secret&page=2',
        origin: 'https://example.com',
        transformUrl: (value) => {
          const url = new URL(value)
          url.searchParams.delete('token')
          return url.toString()
        },
      }),
    ).toBe('https://example.com/docs?page=2')
  })

  it('allows a transformation to skip tracking', () => {
    expect(
      buildTrackingUrl({
        pathname: '/private',
        origin: 'https://example.com',
        transformUrl: () => null,
      }),
    ).toBeNull()
  })

  it('returns null without a browser or explicit origin', () => {
    expect(
      buildTrackingUrl({
        pathname: '/docs',
        origin: '',
      }),
    ).toBeNull()
  })
})
