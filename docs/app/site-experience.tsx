'use client'

import type { ReactNode } from 'react'

import { usePathname } from 'next/navigation'

import { isOgImageCapturePath } from '@/lib/og-image'
import { Box, ChakraProvider } from '@chakra-ui/react'

import { Provider } from './provider'
import { siteSystem } from './system'
import { CommuneFooter } from '../components/docs/CommuneFooter'
import { SiteFooter } from '../components/docs/SiteFooter'

/** Capture pages share the theme, but never mount analytics or site chrome. */
export function SiteExperience({
  children,
  siteUrl,
  year,
}: {
  children: ReactNode
  siteUrl: string
  year: number
}) {
  const pathname = usePathname()
  if (isOgImageCapturePath(pathname)) {
    return <ChakraProvider value={siteSystem}>{children}</ChakraProvider>
  }
  return (
    <Provider siteUrl={siteUrl}>
      <Box
        className="site-wrapper"
        display="flex"
        flexDirection="column"
        minH="100dvh"
      >
        <Box className="site-content" flexGrow="1">
          {children}
        </Box>
        <SiteFooter year={year} />
      </Box>
      <CommuneFooter />
    </Provider>
  )
}
