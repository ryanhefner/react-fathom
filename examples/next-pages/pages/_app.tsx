import type { AppProps } from 'next/app'
import Head from 'next/head'
import Link from 'next/link'

import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'
import { EventStream } from 'react-fathom/debug'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
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
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            react-fathom
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/docs">Docs</Link>
            <Link href="/events">Events</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>
      <main className="main">
        <Component {...pageProps} />
      </main>
      <footer className="footer">
        <p>
          This is an example Next.js Pages Router application demonstrating{' '}
          <a
            href="https://github.com/ryanhefner/react-fathom"
            target="_blank"
            rel="noopener noreferrer"
          >
            react-fathom
          </a>
        </p>
      </footer>
      <EventStream />
    </FathomProvider>
  )
}
