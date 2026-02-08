import { beforeEach, describe, expect, it } from 'vitest'

import { buildTrackingUrl } from './utils'

describe('buildTrackingUrl', () => {
  beforeEach(() => {
    delete (window as { location?: unknown }).location
    window.location = {
      origin: 'https://example.com',
    } as Location
  })

  it('should build a full URL from a path', () => {
    const url = buildTrackingUrl('/test-page')
    expect(url).toBe('https://example.com/test-page')
  })

  it('should build a full URL from a path with query string', () => {
    const url = buildTrackingUrl('/test-page?foo=bar')
    expect(url).toBe('https://example.com/test-page?foo=bar')
  })

  it('should apply transformUrl when provided', () => {
    const transformUrl = (url: string) => {
      const u = new URL(url)
      u.searchParams.delete('token')
      return u.toString()
    }

    const url = buildTrackingUrl('/test-page?token=secret&page=1', transformUrl)
    expect(url).toBe('https://example.com/test-page?page=1')
  })

  it('should not modify URL when transformUrl is not provided', () => {
    const url = buildTrackingUrl('/test-page?token=secret')
    expect(url).toBe('https://example.com/test-page?token=secret')
  })

  it('should handle transformUrl that returns a different URL', () => {
    const transformUrl = () => 'https://other.com/different-page'

    const url = buildTrackingUrl('/test-page', transformUrl)
    expect(url).toBe('https://other.com/different-page')
  })

  it('should handle empty path', () => {
    const url = buildTrackingUrl('')
    expect(url).toBe('https://example.com')
  })

  it('should handle root path', () => {
    const url = buildTrackingUrl('/')
    expect(url).toBe('https://example.com/')
  })
})
