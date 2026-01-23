'use client'

import { IconButton } from '@chakra-ui/react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

/**
 * A button that toggles between light and dark mode.
 * Uses next-themes under the hood.
 */
export function ColorModeButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <IconButton
        aria-label="Toggle color mode"
        variant="ghost"
        size="sm"
        disabled
      >
        <span style={{ opacity: 0 }}>🌙</span>
      </IconButton>
    )
  }

  const isDark = theme === 'dark'

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
