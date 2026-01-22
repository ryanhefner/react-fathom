'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { NextFathomProviderApp } from 'react-fathom/next'
import { ColorModeProvider } from './color-mode'

export function Provider({ children }: { children: React.ReactNode }) {
  const siteId = process.env.NEXT_PUBLIC_FATHOM_SITE_ID

  return (
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>
        {siteId ? (
          <NextFathomProviderApp siteId={siteId}>
            {children}
          </NextFathomProviderApp>
        ) : (
          children
        )}
      </ColorModeProvider>
    </ChakraProvider>
  )
}
