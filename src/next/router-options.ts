import type { LoadOptions } from 'fathom-client'

/** A convenience router adapter must not compete with the embed script. */
export function routerClientOptions(
  options: LoadOptions | undefined,
  disableAutoTrack: boolean,
): LoadOptions {
  return {
    ...options,
    auto: disableAutoTrack ? (options?.auto ?? false) : false,
    spa: disableAutoTrack ? options?.spa : undefined,
  }
}
