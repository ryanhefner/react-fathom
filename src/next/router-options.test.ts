import { describe, expect, it } from 'vitest'

import { routerClientOptions } from './router-options'

describe('router tracking ownership', () => {
  it('disables automatic embed tracking when the adapter owns pageviews', () => {
    const options = { auto: true, spa: 'auto' as const, honorDNT: true }
    expect(routerClientOptions(options, false)).toEqual({
      auto: false,
      spa: undefined,
      honorDNT: true,
    })
    expect(options).toEqual({ auto: true, spa: 'auto', honorDNT: true })
  })
  it('does not implicitly enable the embed when adapter tracking is disabled', () => {
    expect(routerClientOptions(undefined, true)).toEqual({
      auto: false,
      spa: undefined,
    })
    expect(routerClientOptions({ auto: true, spa: 'history' }, true)).toEqual({
      auto: true,
      spa: 'history',
    })
  })
})
