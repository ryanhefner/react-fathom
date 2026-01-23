'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'

export interface ExampleProviderNextProps {
  children: ReactNode
}

/**
 * Provider for Next.js example sites.
 * Wraps children with Chakra UI and next-themes for color mode support.
 */
export function ExampleProviderNext({ children }: ExampleProviderNextProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
