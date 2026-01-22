import type { ReactNode } from 'react'
import type { Metadata } from 'next'
import { Provider } from './provider'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'react-fathom',
    template: '%s – react-fathom',
  },
  description: 'Privacy-focused analytics for React, Next.js, and React Native',
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
