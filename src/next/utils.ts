import { buildTrackingUrl as buildTrackingUrlFromParts } from '../utils'

/**
 * Builds a full URL for tracking, applying optional transformation.
 *
 * @param path - The path portion of the URL (can include query string)
 * @param transformUrl - Optional function to transform the URL before tracking
 * @returns The full URL ready for tracking
 */
export function buildTrackingUrl(
  path: string,
  transformUrl?: (url: string) => string,
): string {
  // The Next.js adapter always returns a string (never null) since it runs
  // client-side only and its transformUrl signature doesn't support null.
  return buildTrackingUrlFromParts({
    pathname: path,
    transformUrl,
  }) ?? ''
}
