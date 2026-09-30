'use client'

import { ThemeProvider } from 'next-themes'

export function ColorModeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      disableTransitionOnChange
      enableColorScheme
      enableSystem
      storageKey="react-fathom-color-mode"
    >
      {children}
    </ThemeProvider>
  )
}
