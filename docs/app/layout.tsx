import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Provider } from './provider'
import './globals.css'

const SITE_URL = process.env.SITE_URL || 'https://react-fathom.com'

export const metadata: Metadata = {
  title: {
    default: 'react-fathom',
    template: '%s – react-fathom',
  },
  description: 'Privacy-focused analytics for React, Next.js, and React Native',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'react-fathom',
  },
  twitter: {
    card: 'summary_large_image',
  },
  alternates: {
    canonical: SITE_URL,
  },
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>{children}</Provider>
      </body>
    </html>
  )
}
