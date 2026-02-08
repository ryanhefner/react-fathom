export interface BuildTrackingUrlOptions {
  /** The pathname portion of the URL */
  pathname: string
  /** Search/query string (should include leading '?') */
  search?: string
  /** Hash fragment (will be normalized to include leading '#') */
  hash?: string
  /** Whether to include search params in the tracked URL @default true */
  includeSearchParams?: boolean
  /** Whether to include hash fragment in the tracked URL @default false */
  includeHash?: boolean
  /** Optional function to transform the URL before tracking. Return null/undefined to skip. */
  transformUrl?: (url: string) => string | null | undefined
}

/**
 * Builds a full tracking URL from location parts, with optional search/hash
 * inclusion and URL transformation.
 *
 * Shared across router adapters (React Router, Gatsby, TanStack Router)
 * to eliminate duplicated URL-building logic.
 *
 * @returns The built URL, or null if the URL should be skipped (SSR or transformUrl returned null)
 */
export function buildTrackingUrl(options: BuildTrackingUrlOptions): string | null {
  if (typeof window === 'undefined') return null

  const {
    pathname,
    search,
    hash,
    includeSearchParams = true,
    includeHash = false,
    transformUrl,
  } = options

  let url = window.location.origin + pathname

  if (includeSearchParams && search) {
    url += search
  }

  if (includeHash && hash) {
    url += hash.startsWith('#') ? hash : `#${hash}`
  }

  if (transformUrl) {
    const transformed = transformUrl(url)
    if (transformed === null || transformed === undefined) {
      return null
    }
    url = transformed
  }

  return url
}
