import { describe, expect, it } from 'vitest'

import { postkitRecipeKeys } from '@postkit/react/theme'

import { postkitThemeConfig, siteThemeConfig } from '../app/theme'

describe('documentation prose theme', () => {
  it('uses blue inline links with hover and keyboard-focus underlines without changing navigation links', () => {
    const prose =
      postkitThemeConfig.theme?.slotRecipes?.[postkitRecipeKeys.prose]
    expect(prose?.base?.a).toMatchObject({
      color: 'blue.600',
      textDecoration: 'none',
      textDecorationColor: 'currentColor',
      _dark: { color: 'blue.300' },
      _hover: { textDecoration: 'underline' },
      _focusVisible: { textDecoration: 'underline' },
    })
    expect(siteThemeConfig.theme?.recipes?.link).toBeUndefined()
  })
})
