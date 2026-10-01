/** Key runtime dependencies of this site; not a complete transitive inventory. */
export const ossProjects = [
  {
    name: 'react + react-dom',
    packages: ['react', 'react-dom'],
    description: 'The component and rendering foundation for the site.',
    urls: ['https://react.dev/'],
  },
  {
    name: 'next',
    packages: ['next'],
    description: 'Routing, static generation, and production builds.',
    urls: ['https://nextjs.org/'],
  },
  {
    name: '@chakra-ui/react',
    packages: ['@chakra-ui/react'],
    description:
      'Accessible UI components and the theme-driven styling system.',
    urls: ['https://chakra-ui.com/'],
  },
  {
    name: '@emotion/react',
    packages: ['@emotion/react'],
    description: 'The CSS-in-JS runtime behind the Chakra theme.',
    urls: ['https://emotion.sh/'],
  },
  {
    name: '@chakra-docs/*',
    packages: [
      '@chakra-docs/chakra',
      '@chakra-docs/core',
      '@chakra-docs/next',
      '@chakra-docs/shiki',
      '@chakra-docs/source-filesystem',
    ],
    description:
      'Documentation navigation, search, page actions, and Shiki code highlighting.',
    urls: ['https://github.com/chakra-docs/chakra-docs'],
  },
  {
    name: '@postkit/react',
    packages: ['@postkit/react'],
    description:
      'The Markdown prose and document components used in the guides.',
    urls: ['https://github.com/postkit-org/postkit-js'],
  },
  {
    name: 'react-fathom',
    packages: ['react-fathom'],
    description:
      'Pageview tracking, interaction events, and the live event stream.',
    urls: ['https://github.com/ryanhefner/react-fathom'],
  },
  {
    name: 'fathom-client',
    packages: ['fathom-client'],
    description: 'The official client connecting the site to Fathom Analytics.',
    urls: ['https://github.com/derrickreimer/fathom-client'],
  },
  {
    name: 'next-themes',
    packages: ['next-themes'],
    description:
      'System color-mode detection and light/dark theme synchronization.',
    urls: ['https://github.com/pacocoursey/next-themes'],
  },
  {
    name: 'react-icons',
    packages: ['react-icons'],
    description: 'The SVG icon sets used throughout the interface.',
    urls: ['https://react-icons.github.io/react-icons/'],
  },
  {
    name: 'next-mdx-remote',
    packages: ['next-mdx-remote'],
    description:
      'Server-side compilation of the trusted documentation content.',
    urls: ['https://github.com/hashicorp/next-mdx-remote'],
  },
  {
    name: 'gray-matter',
    packages: ['gray-matter'],
    description:
      'Frontmatter parsing for documentation metadata and navigation.',
    urls: ['https://github.com/jonschlinkert/gray-matter'],
  },
] as const
