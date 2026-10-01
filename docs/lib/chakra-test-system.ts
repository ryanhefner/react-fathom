import { createSystem, defaultConfig } from '@chakra-ui/react'

import { siteThemeConfig } from '../app/theme'

// jsdom cannot compute cascade-layer styles. Keep the real theme and tokens,
// but emit unlayered CSS so disclosure lifecycle tests can observe animations.
export const testSystem = createSystem(defaultConfig, siteThemeConfig, {
  disableLayers: true,
})
