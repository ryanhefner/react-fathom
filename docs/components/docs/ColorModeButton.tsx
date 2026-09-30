'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'

import { IconButton } from '@chakra-ui/react'

export function ColorModeButton() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timeoutId = window.setTimeout(() => setMounted(true), 0)
    return () => window.clearTimeout(timeoutId)
  }, [])

  if (!mounted) {
    return (
      <IconButton aria-label="Toggle color mode" variant="ghost" size="sm" />
    )
  }

  return (
    <IconButton
      aria-label="Toggle color mode"
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </IconButton>
  )
}
