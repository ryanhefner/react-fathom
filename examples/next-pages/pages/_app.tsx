import type { AppProps } from 'next/app'
import Link from 'next/link'

import { FathomProvider } from 'react-fathom'
import { NextFathomTrackViewPages } from 'react-fathom/next'

import '../styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <FathomProvider siteId={siteId}>
      <NextFathomTrackViewPages />
      <nav className="nav">
        <div className="nav-container">
          <Link href="/" className="nav-logo">
            react-fathom
          </Link>
          <div className="nav-links">
            <Link href="/">Home</Link>
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
    </FathomProvider>
  )
}
