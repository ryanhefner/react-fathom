/** Selected credits, not an exhaustive transitive dependency or license inventory. */
export const ossProjectGroups = [
  {
    id: 'library',
    title: 'Library and packages',
    description:
      'Selected dependencies and framework peers used by the published library and its optional packages. Optional integrations are labeled below.',
    projects: [
      {
        name: 'React',
        packages: ['react'],
        description: 'Components and rendering for the library APIs.',
        href: 'https://react.dev/',
      },
      {
        name: 'fathom-client',
        packages: ['fathom-client'],
        description:
          'The official analytics client used by the web integration.',
        href: 'https://github.com/derrickreimer/fathom-client',
      },
      {
        name: 'Babel runtime',
        packages: ['@babel/runtime'],
        description: 'Shared helpers in the published JavaScript bundles.',
        href: 'https://babeljs.io/',
      },
      {
        name: 'Next.js',
        packages: ['next'],
        description:
          'Framework integration through the optional Next.js adapter.',
        href: 'https://nextjs.org/',
      },
      {
        name: 'React Router',
        packages: ['react-router-dom'],
        description:
          'Optional pageview tracking for React Router applications.',
        href: 'https://reactrouter.com/',
      },
      {
        name: 'TanStack Router',
        packages: ['@tanstack/react-router'],
        description:
          'Optional route tracking for TanStack Router applications.',
        href: 'https://tanstack.com/router',
      },
      {
        name: 'Gatsby',
        packages: ['gatsby'],
        description: 'Optional integration for Gatsby sites.',
        href: 'https://www.gatsbyjs.com/',
      },
      {
        name: 'React Native',
        packages: ['react-native', 'react-native-webview'],
        description:
          'Optional native tracking through a WebView-backed provider.',
        href: 'https://reactnative.dev/',
      },
    ],
  },
  {
    id: 'site',
    title: 'Documentation site',
    description:
      'Projects used to build and run this website. Shared dependencies appear in both sections when they serve both.',
    projects: [
      {
        name: 'React',
        packages: ['react', 'react-dom'],
        description: 'The component and rendering foundation for this site.',
        href: 'https://react.dev/',
      },
      {
        name: 'Next.js',
        packages: ['next'],
        description: 'Routing, static generation, and site builds.',
        href: 'https://nextjs.org/',
      },
      {
        name: 'Chakra UI',
        packages: ['@chakra-ui/react'],
        description:
          "Accessible interface components and the site's theme system.",
        href: 'https://chakra-ui.com/',
      },
      {
        name: 'Emotion',
        packages: ['@emotion/react'],
        description: 'The styling runtime behind Chakra UI.',
        href: 'https://emotion.sh/',
      },
      {
        name: 'Chakra Docs',
        packages: ['@chakra-docs/chakra', '@chakra-docs/core'],
        description:
          'Documentation navigation, search, page actions, and code examples.',
        href: 'https://github.com/chakra-docs/chakra-docs',
      },
      {
        name: 'Postkit',
        packages: ['@postkit/react'],
        description: 'Markdown prose and document components for the guides.',
        href: 'https://github.com/postkit-org/postkit-js',
      },
      {
        name: 'next-themes',
        packages: ['next-themes'],
        description: 'System-aware light and dark color modes.',
        href: 'https://github.com/pacocoursey/next-themes',
      },
      {
        name: 'React Icons',
        packages: ['react-icons'],
        description: 'Consistent SVG icons across the interface.',
        href: 'https://react-icons.github.io/react-icons/',
      },
      {
        name: 'react-fathom',
        packages: ['react-fathom'],
        description:
          'Pageviews, interaction analytics, and the live event stream.',
        href: 'https://github.com/ryanhefner/react-fathom',
      },
      {
        name: 'fathom-client',
        packages: ['fathom-client'],
        description: 'Connecting this site to Fathom Analytics.',
        href: 'https://github.com/derrickreimer/fathom-client',
      },
      {
        name: 'next-mdx-remote',
        packages: ['next-mdx-remote'],
        description:
          'Server-side compilation of trusted documentation content.',
        href: 'https://github.com/hashicorp/next-mdx-remote',
      },
      {
        name: 'gray-matter',
        packages: ['gray-matter'],
        description: 'Frontmatter parsing for documentation metadata.',
        href: 'https://github.com/jonschlinkert/gray-matter',
      },
    ],
  },
] as const
