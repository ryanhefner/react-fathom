import type { ReactNode } from 'react'

import type { Metadata } from 'next'

import { createSiteMetadata, SITE_URL } from '@/lib/site-metadata'

import { SiteExperience } from './site-experience'

export const metadata: Metadata = createSiteMetadata()

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="preconnect"
          href="https://kits.fontstack.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://kits.fontstack.com/kit/o0v0t0oi.css"
          precedence="default"
        />
      </head>
      <body>
        <SiteExperience siteUrl={SITE_URL} year={new Date().getFullYear()}>
          {children}
        </SiteExperience>
      </body>
    </html>
  )
}
