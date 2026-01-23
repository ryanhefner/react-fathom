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
  description:
    'Privacy-focused analytics for React, Next.js, and React Native. A lightweight integration for Fathom Analytics with support for React Router, Gatsby, and TanStack Router.',
  keywords: [
    'react',
    'fathom',
    'analytics',
    'privacy',
    'nextjs',
    'react-native',
    'react-router',
    'gatsby',
    'tanstack-router',
    'gdpr',
    'ccpa',
    'cookie-free',
  ],
  authors: [{ name: 'Ryan Hefner', url: 'https://github.com/ryanhefner' }],
  creator: 'Ryan Hefner',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: SITE_URL,
    siteName: 'react-fathom',
    title: 'react-fathom - Privacy-focused analytics for React',
    description:
      'A lightweight React integration for Fathom Analytics. Track page views and custom events while respecting user privacy.',
    images: [
      {
        url: '/og-image.svg',
        width: 1200,
        height: 630,
        alt: 'react-fathom - Privacy-focused analytics for React',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'react-fathom - Privacy-focused analytics for React',
    description:
      'A lightweight React integration for Fathom Analytics. Track page views and custom events while respecting user privacy.',
    creator: '@ryanhefner',
    images: ['/og-image.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
