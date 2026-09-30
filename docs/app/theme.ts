import { defineConfig, defineRecipe } from '@chakra-ui/react'

export const siteThemeConfig = defineConfig({
  conditions: {
    dark: '@media (prefers-color-scheme: dark)',
  },
  globalCss: {
    html: {
      scrollBehavior: 'smooth',
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
    tokens: {
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
