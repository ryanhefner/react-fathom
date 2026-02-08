import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'
import { ExampleProviderNext, ExampleLayout } from '@react-fathom/example-ui/next'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <ExampleProviderNext>
      <FathomProvider siteId={siteId} debug={{ enabled: true }}>
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta
            name="description"
            content="Example Next.js Pages Router application demonstrating react-fathom analytics integration"
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:title"
            content="Next.js Pages Router Example - react-fathom"
          />
          <meta
            property="og:description"
            content="Example Next.js Pages Router application demonstrating react-fathom analytics integration"
          />
          <meta property="og:site_name" content="react-fathom examples" />
          <meta name="twitter:card" content="summary" />
          <meta
            name="twitter:title"
            content="Next.js Pages Router Example - react-fathom"
          />
          <meta
            name="twitter:description"
            content="Example Next.js Pages Router application demonstrating react-fathom analytics integration"
          />
          <title>Next.js Pages Router Example - react-fathom</title>
        </Head>
        <NextFathomTrackViewPages />
        <ExampleLayout linkComponent={Link} frameworkName="Next.js Pages Router">
          <Component {...pageProps} />
        </ExampleLayout>
      </FathomProvider>
    </ExampleProviderNext>
  )
}
