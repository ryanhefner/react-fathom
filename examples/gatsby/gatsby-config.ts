import type { GatsbyConfig } from 'gatsby'

const config: GatsbyConfig = {
  siteMetadata: {
    title: 'Gatsby Example - react-fathom',
    description:
      'Example Gatsby application demonstrating react-fathom analytics integration',
    siteUrl: 'https://example.com',
  },
  plugins: ['gatsby-plugin-react-helmet'],
}

export default config
