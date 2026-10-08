export interface BuildTrackingUrlOptions {
  pathname: string
  search?: string
  hash?: string
  includeSearchParams?: boolean
  includeHash?: boolean
  transformUrl?: (url: string) => string | null | undefined
  /** Explicit origin for non-browser runtimes and tests. */
  origin?: string
}

const withPrefix = (value: string | undefined, prefix: string) => {
  if (!value) return ''
  return value.startsWith(prefix) ? value : `${prefix}${value}`
}

/**
 * Builds the absolute URL used by every router adapter.
 *
 * Returns `null` during server rendering when no explicit origin is supplied,
 * or when `transformUrl` opts out of tracking.
 */
export function buildTrackingUrl({
  pathname,
  search,
  hash,
  includeSearchParams = true,
  includeHash = false,
  transformUrl,
  origin,
}: BuildTrackingUrlOptions): string | null {
  const resolvedOrigin =
    origin ??
    (typeof window !== 'undefined' ? window.location.origin : undefined)

  if (!resolvedOrigin) return null

  const normalizedOrigin = resolvedOrigin.replace(/\/+$/, '')
  const normalizedPathname =
    pathname === '' || pathname.startsWith('/') ? pathname : `/${pathname}`

  let url = normalizedOrigin + normalizedPathname

  if (includeSearchParams) {
    url += withPrefix(search, '?')
  }

  if (includeHash) {
    url += withPrefix(hash, '#')
  }

  return transformUrl ? (transformUrl(url) ?? null) : url
}
