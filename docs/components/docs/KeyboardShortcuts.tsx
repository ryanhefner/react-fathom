'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface KeyboardShortcutsProps {
  prevHref?: string
  nextHref?: string
}

export function KeyboardShortcuts({ prevHref, nextHref }: KeyboardShortcutsProps) {
  const router = useRouter()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input, textarea, or contenteditable
      const target = e.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      // Ignore if modifier keys are pressed (except for Cmd/Ctrl+K which Search handles)
      if (e.altKey || e.shiftKey) {
        return
      }

      switch (e.key) {
        case 'j':
          // Next page
          if (nextHref) {
            e.preventDefault()
            router.push(nextHref)
          }
          break
        case 'k':
          // Previous page
          if (prevHref) {
            e.preventDefault()
            router.push(prevHref)
          }
          break
        case '/':
          // Focus search (Cmd+K is handled by Search component)
          if (!e.metaKey && !e.ctrlKey) {
            e.preventDefault()
            // Dispatch a custom event that Search component listens to
            window.dispatchEvent(new CustomEvent('open-search'))
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [router, prevHref, nextHref])

  // This component doesn't render anything
  return null
}
