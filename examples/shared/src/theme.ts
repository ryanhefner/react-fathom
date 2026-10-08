import {
  createSystem,
  defaultConfig,
  defineConfig,
  defineSlotRecipe,
} from '@chakra-ui/react'

export const exampleThemeConfig = defineConfig({
  globalCss: { body: { bg: 'bg', color: 'fg' } },
  theme: {
    tokens: {
      sizes: {
        exampleContent: { value: '40rem' },
        exampleIntro: { value: '30rem' },
        exampleInput: { value: '12.5rem' },
      },
      zIndex: {
        eventStreamPanel: { value: '999' },
        eventStreamToggle: { value: '1000' },
      },
      shadows: {
        eventPanelLeft: { value: '4px 0 12px rgba(0, 0, 0, 0.1)' },
        eventPanelRight: { value: '-4px 0 12px rgba(0, 0, 0, 0.1)' },
      },
    },
    slotRecipes: {
      exampleLayout: defineSlotRecipe({
        slots: [
          'shell',
          'header',
          'container',
          'main',
          'footer',
          'footerContent',
          'brand',
          'navLink',
        ],
        base: {
          shell: { minH: 'dvh', display: 'flex', flexDirection: 'column' },
          header: { pt: { base: 6, md: 8 }, pb: { base: 4, md: 6 } },
          container: { maxW: 'exampleContent', px: { base: 5, md: 6 } },
          main: { flex: 1, py: { base: 8, md: 12 } },
          footer: {
            borderTopWidth: '1px',
            borderColor: 'border.muted',
            py: { base: 6, md: 8 },
          },
          footerContent: {
            justifyContent: 'space-between',
            alignItems: 'center',
            flexDirection: { base: 'column', md: 'row' },
            gap: 4,
          },
          brand: {
            fontWeight: 'medium',
            fontSize: 'sm',
            _hover: { textDecoration: 'none', opacity: 0.7 },
          },
          navLink: {
            color: 'fg.muted',
            fontSize: 'sm',
            _hover: { color: 'fg' },
          },
        },
      }),
    },
  },
})

export const exampleSystem = createSystem(defaultConfig, exampleThemeConfig)
