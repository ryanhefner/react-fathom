'use client'

import { useEffect, useState } from 'react'

import { useTheme } from 'next-themes'
import { LuMoon, LuSun } from 'react-icons/lu'

import { IconButton } from '@chakra-ui/react'

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
        disabled
        variant="ghost"
        size="sm"
      />
    )
  }

  const isDark = resolvedTheme === 'dark'
  const nextTheme = isDark ? 'light' : 'dark'

  return (
    <IconButton
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      variant="ghost"
      size="sm"
      onClick={() => setTheme(nextTheme)}
    >
      {isDark ? <LuSun /> : <LuMoon />}
    </IconButton>
  )
}
