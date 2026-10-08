'use client'

import type { ReactNode } from 'react'

import { ChakraProvider } from '@chakra-ui/react'

import { ColorModeProvider } from './ColorModeContext'
import { exampleSystem } from './theme'

export interface ExampleProviderProps {
  children: ReactNode
}

/**
 * Provider for non-Next.js example sites (React, Vite, etc.).
 * Wraps children with Chakra UI and simple color mode support.
 * For Next.js apps, use ExampleProviderNext which uses next-themes.
 */
export function ExampleProvider({ children }: ExampleProviderProps) {
  return (
    <ChakraProvider value={exampleSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
