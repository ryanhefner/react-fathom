import { defineConfig, defineRecipe, defineSlotRecipe } from '@chakra-ui/react'

export const siteThemeConfig = defineConfig({
  globalCss: {
    html: {
      bg: 'bg',
      color: 'fg',
      scrollBehavior: 'smooth',
    },
    'header, nav, aside, [data-pagefind-body]::before, [aria-label="Search"], [aria-label="Table of contents"], [aria-label="Breadcrumb"], button, [role="button"], footer':
      {
        _print: {
          display: 'none !important',
        },
      },
    body: {
      bg: 'white',
      color: 'black',
      _dark: {
        bg: 'black',
        color: 'white',
      },
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
        },
      }),
    },
    slotRecipes: {
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
            '&:where(html.dark *)': { bg: 'gray.900' },
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
  },
})
