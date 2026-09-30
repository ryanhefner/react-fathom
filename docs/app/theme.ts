import { defineConfig } from '@chakra-ui/react'

export const siteThemeConfig = defineConfig({
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
      _print: {
        bg: 'white !important',
        color: 'black !important',
      },
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
})
