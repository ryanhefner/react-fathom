'use client'

import { ChakraProvider, defaultSystem } from '@chakra-ui/react'
import type { ReactNode } from 'react'
import { ColorModeProvider } from './ColorModeContext'

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
    <ChakraProvider value={defaultSystem}>
      <ColorModeProvider>{children}</ColorModeProvider>
    </ChakraProvider>
  )
}
