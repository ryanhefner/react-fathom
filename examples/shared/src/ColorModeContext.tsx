'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

type ColorMode = 'light' | 'dark'

interface ColorModeContextValue {
  colorMode: ColorMode
  toggleColorMode: () => void
}

const ColorModeContext = createContext<ColorModeContextValue | null>(null)

const STORAGE_KEY = 'react-fathom-example-color-mode'

function getInitialColorMode(): ColorMode {
  if (typeof window === 'undefined') return 'light'

  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'dark' || stored === 'light') {
      return stored
    }
  } catch {
    // localStorage unavailable
  }

  // Check system preference
  if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) {
    return 'dark'
  }

  return 'light'
}

export function ColorModeProvider({ children }: { children: ReactNode }) {
  const [colorMode, setColorMode] = useState<ColorMode>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setColorMode(getInitialColorMode())
  }, [])

  useEffect(() => {
    if (!mounted) return

    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(colorMode)

    try {
      localStorage.setItem(STORAGE_KEY, colorMode)
    } catch {
      // localStorage unavailable
    }
  }, [colorMode, mounted])

  const toggleColorMode = () => {
    setColorMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <ColorModeContext.Provider value={{ colorMode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  )
}

export function useColorMode() {
  const context = useContext(ColorModeContext)
  if (!context) {
    throw new Error('useColorMode must be used within a ColorModeProvider')
  }
  return context
}
