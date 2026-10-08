'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { Box, IconButton } from '@chakra-ui/react'

/**
 * A button that toggles between light and dark mode.
 * Uses next-themes under the hood.
 */
export function ColorModeButton() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle color mode"
        variant="ghost"
        size="sm"
        disabled
      >
        <Box as="span" opacity={0} aria-hidden="true">
          🌙
        </Box>
      </IconButton>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      {isDark ? '☀️' : '🌙'}
    </IconButton>
  )
}
