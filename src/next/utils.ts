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
  let url = window.location.origin + path
  if (transformUrl) {
    url = transformUrl(url)
  }
  return url
}
