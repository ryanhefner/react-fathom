'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { NextFathomProviderApp } from 'react-fathom/next'
import { ColorModeProvider } from './color-mode'
import { EventStream } from '../components/docs/EventStream'

export function Provider({ children }: { children: React.ReactNode }) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID || 'DEMO'

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        <NextFathomProviderApp
          siteId={siteId}
          debug={{ enabled: true, console: false }}
        >
          {children}
          <EventStream />
        </NextFathomProviderApp>
      </ColorModeProvider>
    </ChakraProvider>
  )
}
