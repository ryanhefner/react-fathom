import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

// Gatsby keeps its React 18/Chakra provider local to this example.
const themeConfig = defineConfig({
  globalCss: { body: { bg: 'bg', color: 'fg' } },
  theme: {
    tokens: {
      sizes: {
        exampleContent: { value: '40rem' },
        exampleIntro: { value: '30rem' },
      },
    },
  },
})

export const exampleSystem = createSystem(defaultConfig, themeConfig)
