import { beforeEach, describe, expect, it } from 'vitest'

import { buildTrackingUrl } from './utils'

describe('buildTrackingUrl', () => {
  beforeEach(() => {
    delete (window as { location?: unknown }).location
    window.location = {
      origin: 'https://example.com',
    } as Location
  })

  it('should build a URL from pathname only', () => {
    const url = buildTrackingUrl({ pathname: '/test-page' })
    expect(url).toBe('https://example.com/test-page')
  })

  it('should include search params by default', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      search: '?foo=bar',
    })
    expect(url).toBe('https://example.com/test-page?foo=bar')
  })

  it('should exclude search params when includeSearchParams is false', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      search: '?foo=bar',
      includeSearchParams: false,
    })
    expect(url).toBe('https://example.com/test-page')
  })

  it('should exclude hash by default', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      hash: '#section',
    })
    expect(url).toBe('https://example.com/test-page')
  })

  it('should include hash when includeHash is true', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      hash: '#section',
      includeHash: true,
    })
    expect(url).toBe('https://example.com/test-page#section')
  })

  it('should normalize hash without # prefix', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      hash: 'section',
      includeHash: true,
    })
    expect(url).toBe('https://example.com/test-page#section')
  })

  it('should not double # prefix on hash', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      hash: '#section',
      includeHash: true,
    })
    expect(url).toBe('https://example.com/test-page#section')
  })

  it('should include both search and hash', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      search: '?q=test',
      hash: '#results',
      includeSearchParams: true,
      includeHash: true,
    })
    expect(url).toBe('https://example.com/test-page?q=test#results')
  })

  it('should apply transformUrl', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      transformUrl: (u) => u.replace('/test-page', '/transformed'),
    })
    expect(url).toBe('https://example.com/transformed')
  })

  it('should return null when transformUrl returns null', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      transformUrl: () => null,
    })
    expect(url).toBeNull()
  })

  it('should return null when transformUrl returns undefined', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      transformUrl: () => undefined,
    })
    expect(url).toBeNull()
  })

  it('should handle empty search string', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      search: '',
    })
    expect(url).toBe('https://example.com/test-page')
  })

  it('should handle empty hash string', () => {
    const url = buildTrackingUrl({
      pathname: '/test-page',
      hash: '',
      includeHash: true,
    })
    expect(url).toBe('https://example.com/test-page')
  })

  it('should handle root path', () => {
    const url = buildTrackingUrl({ pathname: '/' })
    expect(url).toBe('https://example.com/')
  })

  it('should handle empty path', () => {
    const url = buildTrackingUrl({ pathname: '' })
    expect(url).toBe('https://example.com')
  })

  it('should return null in SSR (no window)', () => {
    const origWindow = globalThis.window
    // @ts-expect-error - simulating SSR
    delete globalThis.window

    const url = buildTrackingUrl({ pathname: '/test' })
    expect(url).toBeNull()

    globalThis.window = origWindow
  })
})
