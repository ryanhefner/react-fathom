import { chakraDocsSlotRecipes } from '@chakra-docs/chakra/theme'
import { defineConfig, defineRecipe, defineSlotRecipe } from '@chakra-ui/react'
import { createPostkitTheme } from '@postkit/react/theme'

import { siteSlotRecipes } from './site-recipes'

export const postkitThemeConfig = createPostkitTheme({
  prose: {
    base: {
      a: {
        color: 'blue.600',
        textDecoration: 'none',
        textDecorationColor: 'currentColor',
        _dark: { color: 'blue.300' },
        _hover: { textDecoration: 'underline' },
        _focusVisible: { textDecoration: 'underline' },
      },
      table: {
        _focusVisible: {
          outline: '2px solid',
          outlineColor: 'fg.muted',
          outlineOffset: '-2px',
        },
      },
    },
  },
})

export const siteThemeConfig = defineConfig({
  globalCss: {
    html: {
      bg: 'bg',
      color: 'fg',
      scrollBehavior: 'smooth',
      _motionReduce: { scrollBehavior: 'auto' },
    },
    'header, nav, aside, [data-pagefind-body]::before, [aria-label="Search"], [aria-label="Table of contents"], [aria-label="Breadcrumb"], button, [role="button"], footer':
      {
        _print: {
          display: 'none !important',
        },
      },
    body: {
      bg: 'bg',
      color: 'fg',
      _print: {
        bg: 'white !important',
        color: 'black !important',
      },
    },
    'strong, b': {
      fontWeight: 500,
    },
    main: {
      _print: {
        maxW: 'full !important',
        m: '0 !important',
        p: '0 !important',
      },
    },
    'h1, h2, h3, h4, h5, h6': {
      _print: {
        breakAfter: 'avoid',
        color: 'black !important',
      },
    },
    'p, li': {
      _print: {
        orphans: 3,
        widows: 3,
      },
    },
    'pre, code': {
      _print: {
        bg: 'gray.100 !important',
        borderColor: 'gray.300 !important',
        borderWidth: '1px !important',
        color: 'black !important',
        overflowWrap: 'break-word !important',
        whiteSpace: 'pre-wrap !important',
      },
    },
    pre: {
      _print: {
        breakInside: 'avoid',
      },
    },
    a: {
      _print: {
        color: 'black !important',
        textDecoration: 'underline !important',
      },
    },
    'a[href^="http"]::after': {
      _print: {
        color: 'gray.600',
        content: '" (" attr(href) ")"',
        fontSize: '0.8em',
      },
    },
    '@page': {
      margin: '2cm',
    },
  },
  theme: {
    semanticTokens: {
      colors: {
        'og.canvas': { value: '{colors.black}' },
        'og.foreground': { value: '{colors.white}' },
        'og.muted': { value: '{colors.gray.400}' },
        'og.rule': { value: '{colors.gray.800}' },
        'fileTree.canvas': {
          value: { _light: '{colors.gray.50}', _dark: '{colors.gray.900}' },
        },
        'eventStream.canvas': {
          value: { _light: '{colors.gray.100}', _dark: '{colors.gray.900}' },
        },
        'eventStream.pageview': { value: '{colors.blue.500}' },
        'eventStream.event': { value: '{colors.purple.500}' },
        'eventStream.goal': { value: '{colors.green.500}' },
        'site.link': {
          value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' },
        },
        bg: {
          DEFAULT: {
            value: { _light: '{colors.white}', _dark: '{colors.black}' },
          },
        },
        fg: {
          DEFAULT: {
            value: { _light: '{colors.black}', _dark: '{colors.white}' },
          },
        },
      },
    },
    recipes: {
      heading: defineRecipe({
        base: {
          fontWeight: 500,
          letterSpacing: 'tight',
        },
      }),
    },
    slotRecipes: {
      ...siteSlotRecipes,
      chakraDocsLayout: defineSlotRecipe({
        slots: [...chakraDocsSlotRecipes.chakraDocsLayout.slots],
        base: { root: { pt: { base: 4, lg: 8 } } },
      }),
      chakraDocsMobileNavigation: defineSlotRecipe({
        slots: [...chakraDocsSlotRecipes.chakraDocsMobileNavigation.slots],
        base: {
          trigger: {
            borderWidth: 0,
            boxSize: '44px',
            minW: '44px',
            minH: '44px',
            px: 0,
            gap: 0,
            justifyContent: 'center',
            _icon: { boxSize: '24px' },
          },
          triggerIcon: {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxSize: '24px',
            lineHeight: 1,
            '& svg': { display: 'block' },
          },
          triggerLabel: { display: 'none' },
          positioner: {
            position: 'fixed',
            inset: 0,
            w: '100dvw',
            h: '100dvh',
            p: 0,
            overflow: 'hidden',
          },
          content: {
            w: '100dvw',
            maxW: 'none',
            h: '100dvh',
            maxH: '100dvh',
            flexShrink: 0,
            m: 0,
            borderEndWidth: 0,
            borderRadius: 0,
            boxShadow: 'none',
            overflow: 'hidden',
          },
          header: { pt: 'env(safe-area-inset-top)' },
          closeTrigger: {
            boxSize: '44px',
            minW: '44px',
            minH: '44px',
            _icon: { boxSize: '24px', display: 'block' },
          },
          body: {
            flex: 1,
            minH: 0,
            overflowY: 'auto',
            overscrollBehaviorY: 'contain',
            pb: 'max(1rem, env(safe-area-inset-bottom))',
          },
        },
      }),
      chakraDocsPageActions: defineSlotRecipe({
        slots: [...chakraDocsSlotRecipes.chakraDocsPageActions.slots],
        variants: {
          size: {
            sm: {
              root: {
                '--chakra-docs-page-actions-height': {
                  base: 'sizes.11',
                  md: 'sizes.8',
                },
              },
              menuTrigger: { minW: { base: 11, md: 8 } },
            },
          },
        },
      }),
      chakraDocsSearch: defineSlotRecipe({
        slots: [
          'trigger',
          'triggerLabel',
          'shortcut',
          'backdrop',
          'positioner',
          'root',
          'header',
          'title',
          'body',
          'inputGroup',
          'input',
          'searchIcon',
          'clearTrigger',
          'results',
          'sectionLabel',
          'resultList',
          'result',
          'resultLink',
          'resultRow',
          'resultContent',
          'resultTitle',
          'resultDescription',
          'resultBadge',
          'status',
        ],
        base: {
          // The full-width library trigger suits mobile drawers, not a header row.
          trigger: { minW: { base: 0, md: '13rem' }, flexShrink: 0 },
          shortcut: { display: { base: 'none', md: 'inline-flex' } },
          root: { borderRadius: 'xl' },
          input: {
            borderTopRadius: 'xl',
            focusRingColor: 'fg.muted',
            focusRingWidth: '1px',
            _focusVisible: {
              borderColor: 'transparent',
              boxShadow: 'none',
              outline: '1px solid',
              outlineColor: 'fg.muted',
              outlineOffset: '-2px',
            },
          },
        },
      }),
      chakraDocsCodeBlock: defineSlotRecipe({
        slots: [
          'root',
          'header',
          'title',
          'control',
          'language',
          'copyTrigger',
          'copyIndicator',
          'content',
          'code',
          'codeText',
        ],
        base: {
          root: {
            bg: 'black',
            borderColor: 'gray.800',
            borderRadius: 'lg',
            color: 'gray.100',
            my: 4,
            _dark: { bg: 'gray.900' },
          },
          header: { borderBottomColor: 'gray.800' },
          title: { color: 'gray.400' },
          language: { color: 'gray.400' },
          copyTrigger: {
            color: 'white',
            _hover: { bg: 'whiteAlpha.200', color: 'white' },
            _focusVisible: { outlineColor: 'white' },
          },
          copyIndicator: { boxSize: 4 },
        },
      }),
    },
    tokens: {
      colors: {
        // Chakra's named black token is near-black; this site's canvas is pure black.
        black: { value: '#000000' },
        white: { value: '#ffffff' },
      },
      sizes: {
        siteHeader: { value: 'calc({sizes.11} + {spacing.6} + 1px)' },
      },
      spacing: {
        docsStickyTop: { value: '5rem' },
        docsScrollMargin: { value: '6rem' },
      },
      zIndex: {
        siteHeader: { value: '50' },
        eventStreamPanel: { value: '999' },
        eventStreamToggle: { value: '1000' },
      },
      durations: {
        eventStreamPanel: { value: '200ms' },
        eventStreamCard: { value: '300ms' },
      },
      easings: { snappy: { value: 'cubic-bezier(0.4, 0, 0.2, 1)' } },
      fontWeights: { semibold: { value: '500' } },
      fonts: {
        body: {
          value:
            "'Suisse Intl', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        heading: {
          value:
            "'Suisse Intl', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        },
        mono: {
          value:
            "'Suisse Intl Mono', ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
        },
      },
    },
    keyframes: {
      eventCardEnter: {
        from: { opacity: 0, transform: 'translateX(20px)' },
        to: { opacity: 1, transform: 'translateX(0)' },
      },
    },
  },
})
