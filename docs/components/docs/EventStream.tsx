'use client'

import { useState, useEffect, useCallback, useId, useRef } from 'react'

import {
  LuActivity,
  LuFileText,
  LuMousePointerClick,
  LuTrophy,
  LuX,
} from 'react-icons/lu'

import { type DebugEvent } from '@/lib/fathom'
import {
  Box,
  Button,
  Flex,
  IconButton,
  Presence,
  Text,
  VStack,
  useSlotRecipe,
} from '@chakra-ui/react'

const STORAGE_KEY = 'react-fathom-event-stream-visible'

function EventIcon({ type }: { type: DebugEvent['type'] }) {
  const icons = {
    pageview: <LuFileText aria-hidden="true" />,
    event: <LuMousePointerClick aria-hidden="true" />,
    goal: <LuTrophy aria-hidden="true" />,
  }
  return <span>{icons[type]}</span>
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

function EventCard({ event }: { event: DebugEvent }) {
  const styles = useSlotRecipe({ key: 'siteEventStream' })()
  const borderColor = {
    pageview: 'eventStream.pageview',
    event: 'eventStream.event',
    goal: 'eventStream.goal',
  }

  let title = ''
  let subtitle = ''

  switch (event.type) {
    case 'pageview':
      title = 'Pageview'
      subtitle = event.url || window.location.pathname
      break
    case 'event':
      title = 'Event'
      subtitle = event.eventName || ''
      break
    case 'goal':
      title = 'Goal'
      subtitle = `${event.goalCode} ($${((event.goalCents || 0) / 100).toFixed(2)})`
      break
  }

  return (
    <Box css={styles.card} borderColor={borderColor[event.type]}>
      <Flex justifyContent="space-between" alignItems="center" mb={1}>
        <Flex alignItems="center" gap={2}>
          <EventIcon type={event.type} />
          <Text fontWeight={500} fontSize="sm">
            {title}
          </Text>
        </Flex>
        <Text fontSize="xs" color="fg.muted">
          {formatTime(event.timestamp)}
        </Text>
      </Flex>
      <Text fontSize="xs" color="fg.muted" wordBreak="break-all">
        {subtitle}
      </Text>
    </Box>
  )
}

interface EventStreamProps {
  /**
   * Force show the EventStream panel regardless of debug context.
   * Useful for docs site where context may not be shared properly with linked packages.
   */
  forceShow?: boolean
}

export function EventStream({ forceShow = false }: EventStreamProps) {
  const styles = useSlotRecipe({ key: 'siteEventStream' })()
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [events, setEvents] = useState<DebugEvent[]>([])
  const panelId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  const toggleVisibility = useCallback(() => {
    if (isVisible && panelRef.current?.contains(document.activeElement)) {
      toggleRef.current?.focus()
    }
    setIsVisible((prev) => !prev)
  }, [isVisible])

  // Load visibility state from localStorage on mount
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored !== null) {
          setIsVisible(stored === 'true')
        }
      } catch {
        // localStorage not available (private browsing, etc.)
      }

      setIsHydrated(true)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [])

  // Keyboard shortcut (Cmd/Ctrl + .) to toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '.') {
        e.preventDefault()
        toggleVisibility()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [toggleVisibility])

  // Save visibility state to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, String(isVisible))
      } catch {
        // localStorage not available
      }
    }
  }, [isVisible, isHydrated])

  // Subscribe to global debug events via custom event
  useEffect(() => {
    const handleDebugEvent = (event: Event) => {
      const debugEvent = (event as CustomEvent<DebugEvent>).detail
      setEvents((prev) => [debugEvent, ...prev].slice(0, 20))
    }
    window.addEventListener('react-fathom:debug', handleDebugEvent)
    return () =>
      window.removeEventListener('react-fathom:debug', handleDebugEvent)
  }, [])

  const clearEvents = () => setEvents([])

  // Don't render until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return null
  }

  // Show if forceShow is true (bypasses context check)
  if (!forceShow) {
    return null
  }

  return (
    <>
      {/* Toggle button */}
      <IconButton
        ref={toggleRef}
        aria-label={isVisible ? 'Hide event stream' : 'Show event stream'}
        aria-expanded={isVisible}
        aria-controls={panelId}
        title={isVisible ? 'Hide event stream' : 'Show event stream'}
        css={styles.toggle}
        size="md"
        onClick={toggleVisibility}
      >
        {isVisible ? <LuX /> : <LuActivity />}
      </IconButton>

      {/* Event stream panel */}
      <Presence
        ref={panelRef}
        id={panelId}
        role="complementary"
        aria-label="Event stream"
        aria-hidden={!isVisible}
        inert={!isVisible}
        present={isVisible}
        lazyMount
        unmountOnExit
        css={styles.panel}
        pointerEvents={isVisible ? 'auto' : 'none'}
      >
        {/* Header */}
        <Flex css={styles.header}>
          <Flex alignItems="center" gap={2}>
            <LuActivity aria-hidden="true" />
            <Text fontWeight={500}>Event Stream</Text>
          </Flex>
          <Button
            size="xs"
            variant="ghost"
            onClick={clearEvents}
            disabled={events.length === 0}
          >
            Clear
          </Button>
        </Flex>

        {/* Events list */}
        <Box css={styles.events}>
          {events.length === 0 ? (
            <Flex css={styles.empty}>
              <LuActivity aria-hidden="true" size={24} />
              <Text fontSize="sm" textAlign="center">
                No events yet.
                <br />
                Navigate or interact to see tracking events.
              </Text>
            </Flex>
          ) : (
            <VStack gap={2} alignItems="stretch">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </VStack>
          )}
        </Box>

        {/* Footer */}
        <Box css={styles.footer}>
          <Text fontSize="xs" color="fg.muted" textAlign="center">
            {events.length} event{events.length !== 1 ? 's' : ''} • Press{' '}
            <Text as="span" css={styles.shortcut}>
              ⌘.
            </Text>{' '}
            to toggle
          </Text>
        </Box>
      </Presence>
    </>
  )
}
