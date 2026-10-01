import { describe, expect, it } from 'vitest'

import { postkitRecipeKeys } from '@postkit/react/theme'

import { testSystem } from './chakra-test-system'
import { postkitThemeConfig, siteThemeConfig } from '../app/theme'

describe('documentation prose theme', () => {
  it('uses pure black and white for the page canvas rather than palette near-black', () => {
    expect(testSystem.token('colors.black')).toBe('#000000')
    expect(testSystem.token('colors.white')).toBe('#ffffff')
    expect(
      siteThemeConfig.theme?.semanticTokens?.colors?.bg?.DEFAULT?.value,
    ).toEqual({
      _light: '{colors.white}',
      _dark: '{colors.black}',
    })
  })
  it('uses tight letter-spacing for headings while retaining medium weight', () => {
    expect(siteThemeConfig.theme?.recipes?.heading?.base).toMatchObject({
      fontWeight: 500,
      letterSpacing: 'tight',
    })
    expect(testSystem.css({ letterSpacing: 'tight' })).toEqual({
      letterSpacing: testSystem.token.var('letterSpacings.tight'),
    })
  })
  it('resolves shared document offsets through spacing tokens', () => {
    expect(
      testSystem.css({
        top: 'docsStickyTop',
        scrollMarginTop: 'docsScrollMargin',
      }),
    ).toEqual({
      top: testSystem.token.var('spacing.docsStickyTop'),
      scrollMarginTop: testSystem.token.var('spacing.docsScrollMargin'),
    })
  })
  it('registers site chrome recipes, animation tokens, and semantic event colors', () => {
    for (const key of [
      'siteNavbar',
      'siteFooter',
      'communeFooter',
      'siteEventStream',
    ]) {
      expect(
        siteThemeConfig.theme?.slotRecipes?.[key]?.slots.length,
      ).toBeGreaterThan(0)
    }
    expect(
      siteThemeConfig.theme?.tokens?.durations?.eventStreamPanel?.value,
    ).toBe('200ms')
    expect(siteThemeConfig.theme?.tokens?.easings?.snappy?.value).toBe(
      'cubic-bezier(0.4, 0, 0.2, 1)',
    )
    expect(
      siteThemeConfig.theme?.semanticTokens?.colors?.['eventStream.canvas']
        ?.value,
    ).toEqual({ _light: '{colors.gray.100}', _dark: '{colors.gray.900}' })
    expect(siteThemeConfig.theme?.keyframes?.eventCardEnter).toBeDefined()
  })
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
