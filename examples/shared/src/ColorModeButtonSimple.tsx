'use client'

import { IconButton } from '@chakra-ui/react'
import { useColorMode } from './ColorModeContext'

/**
 * A button that toggles between light and dark mode.
 * Uses the simple ColorModeContext (for non-Next.js apps).
 */
export function ColorModeButtonSimple() {
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="ghost"
      size="sm"
      onClick={toggleColorMode}
    >
      {colorMode === 'dark' ? '☀️' : '🌙'}
    </IconButton>
  )
}
