import type { Metadata } from 'next'
import Link from 'next/link'
import { NextFathomProviderApp } from 'react-fathom/next'
import { EventStream } from 'react-fathom/debug'
import { ExampleProviderNext, ExampleLayout } from '@react-fathom/example-ui/next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Next.js App Router Example - react-fathom',
  description:
    'Example Next.js App Router application demonstrating react-fathom analytics integration',
  openGraph: {
    type: 'website',
    title: 'Next.js App Router Example - react-fathom',
    description:
      'Example Next.js App Router application demonstrating react-fathom analytics integration',
    siteName: 'react-fathom examples',
  },
  twitter: {
    card: 'summary',
    title: 'Next.js App Router Example - react-fathom',
    description:
      'Example Next.js App Router application demonstrating react-fathom analytics integration',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ExampleProviderNext>
          <NextFathomProviderApp siteId={siteId} debug={{ enabled: true }}>
            <ExampleLayout
              linkComponent={Link}
              frameworkName="Next.js App Router"
            >
              {children}
            </ExampleLayout>
            <EventStream />
          </NextFathomProviderApp>
        </ExampleProviderNext>
      </body>
    </html>
  )
}
