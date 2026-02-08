import type * as FathomType from 'fathom-client'

export interface GatsbyFathomOptions {
  /**
   * Your Fathom site ID
   */
  siteId: string

  /**
   * Include search/query parameters in the tracked URL
   * @default true
   */
  includeSearchParams?: boolean

  /**
   * Include hash fragment in the tracked URL
   * @default false
   */
  includeHash?: boolean

  /**
   * Custom function to transform the URL before tracking
   * @param url The URL that would be tracked
   * @returns The transformed URL to track, or null/undefined to skip tracking
   */
  transformUrl?: (url: string) => string | null | undefined

  /**
   * Additional options to pass to Fathom's load function
   */
  loadOptions?: Parameters<typeof FathomType.load>[1]
}

/**
 * Creates Gatsby browser API handlers for Fathom Analytics.
 * Use in gatsby-browser.js to automatically track pageviews.
 *
 * @example
 * ```js
 * // gatsby-browser.js
 * import { createGatsbyFathomPlugins } from 'react-fathom/gatsby'
 *
 * const fathomPlugins = createGatsbyFathomPlugins({
 *   siteId: 'YOUR_SITE_ID',
 *   loadOptions: {
 *     includedDomains: ['yourdomain.com'],
 *   },
 * })
 *
 * export const onClientEntry = fathomPlugins.onClientEntry
 * export const onRouteUpdate = fathomPlugins.onRouteUpdate
 * ```
 *
 * @example
 * ```js
 * // Or use spread syntax to export all handlers
 * import { createGatsbyFathomPlugins } from 'react-fathom/gatsby'
 *
 * const { onClientEntry, onRouteUpdate } = createGatsbyFathomPlugins({
 *   siteId: process.env.GATSBY_FATHOM_SITE_ID,
 * })
 *
 * export { onClientEntry, onRouteUpdate }
 * ```
 */
export function createGatsbyFathomPlugins(options: GatsbyFathomOptions) {
  const {
    siteId,
    includeSearchParams = true,
    includeHash = false,
    transformUrl,
    loadOptions,
  } = options

  let fathomClient: typeof FathomType | null = null

  const buildUrl = (location: { pathname: string; search?: string; hash?: string }) => {
    if (typeof window === 'undefined') return null

    let url = window.location.origin + location.pathname

    if (includeSearchParams && location.search) {
      url += location.search
    }

    if (includeHash && location.hash) {
      url += location.hash
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

  return {
    /**
     * Called when the Gatsby browser runtime first starts.
     * Loads the Fathom script.
     */
    onClientEntry: async () => {
      if (typeof window === 'undefined') return

      // Dynamically import fathom-client
      const Fathom = await import('fathom-client')
      fathomClient = Fathom

      fathomClient.load(siteId, {
        auto: false, // We handle tracking manually
        ...loadOptions,
      })
    },

    /**
     * Called when the user changes routes.
     * Tracks a pageview for the new route.
     */
    onRouteUpdate: ({ location }: { location: { pathname: string; search?: string; hash?: string } }) => {
      if (!fathomClient) return

      const url = buildUrl(location)
      if (url) {
        fathomClient.trackPageview({ url })
      }
    },
  }
}

/**
 * Simplified helper to track a pageview in Gatsby.
 * Use this if you want more control over when tracking happens.
 *
 * @example
 * ```js
 * // gatsby-browser.js
 * import * as Fathom from 'fathom-client'
 * import { trackGatsbyPageview } from 'react-fathom/gatsby'
 *
 * export const onClientEntry = () => {
 *   Fathom.load('YOUR_SITE_ID', { auto: false })
 * }
 *
 * export const onRouteUpdate = ({ location }) => {
 *   trackGatsbyPageview(Fathom, location)
 * }
 * ```
 */
export function trackGatsbyPageview(
  fathomClient: typeof FathomType,
  location: { pathname: string; search?: string; hash?: string },
  options?: {
    includeSearchParams?: boolean
    includeHash?: boolean
    transformUrl?: (url: string) => string | null | undefined
  }
) {
  if (typeof window === 'undefined') return

  const { includeSearchParams = true, includeHash = false, transformUrl } = options || {}

  let url = window.location.origin + location.pathname

  if (includeSearchParams && location.search) {
    url += location.search
  }

  if (includeHash && location.hash) {
    url += location.hash
  }

  if (transformUrl) {
    const transformed = transformUrl(url)
    if (transformed === null || transformed === undefined) {
      return
    }
    url = transformed
  }

  fathomClient.trackPageview({ url })
}
