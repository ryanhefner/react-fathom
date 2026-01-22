import type { Metadata } from 'next'
import Link from 'next/link'
import { NextFathomProviderApp } from 'react-fathom/next'
import { EventStream } from 'react-fathom/debug'

import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js App Router Example - react-fathom',
  description: 'Example Next.js App Router application using react-fathom',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <html lang="en">
      <body>
        <NextFathomProviderApp siteId={siteId} debug={{ enabled: true }}>
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
          <main className="main">{children}</main>
          <footer className="footer">
            <p>
              This is an example Next.js App Router application demonstrating{' '}
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
        </NextFathomProviderApp>
      </body>
    </html>
  )
}
