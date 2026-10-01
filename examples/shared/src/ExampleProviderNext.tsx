'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from 'next-themes'

import { ChakraProvider } from '@chakra-ui/react'

import { exampleSystem } from './theme'

export interface ExampleProviderNextProps {
  children: ReactNode
}

/**
 * Provider for Next.js example sites.
 * Wraps children with Chakra UI and next-themes for color mode support.
 */
export function ExampleProviderNext({ children }: ExampleProviderNextProps) {
  return (
    <ChakraProvider value={exampleSystem}>
      <ThemeProvider attribute="class" disableTransitionOnChange>
        {children}
      </ThemeProvider>
    </ChakraProvider>
  )
}
