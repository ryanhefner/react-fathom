import React from 'react'
import { Link } from 'gatsby'
import { Helmet } from 'react-helmet'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { FathomProvider } from 'react-fathom'
import { GatsbyFathomTrackView } from 'react-fathom/gatsby'

import { Navbar } from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const siteId = process.env.GATSBY_FATHOM_SITE_ID || 'DEMO'

export function Layout({ children }: LayoutProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <FathomProvider siteId={siteId} debug={{ enabled: true }}>
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Gatsby Example - react-fathom" />
          <meta
            property="og:description"
            content="Example Gatsby application demonstrating react-fathom analytics integration"
          />
          <meta property="og:site_name" content="react-fathom examples" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Gatsby Example - react-fathom" />
          <meta
            name="twitter:description"
            content="Example Gatsby application demonstrating react-fathom analytics integration"
          />
        </Helmet>
        <GatsbyFathomTrackView />
        <Navbar />
        <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
          {children}
        </main>
      </FathomProvider>
    </ChakraProvider>
  )
}
