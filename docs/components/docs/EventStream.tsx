'use client'

import { useState, useEffect } from 'react'

import {
  LuActivity,
  LuFileText,
  LuMousePointerClick,
  LuTrophy,
  LuX,
} from 'react-icons/lu'

import { type DebugEvent } from '@/lib/fathom'
import { Box, Button, Flex, IconButton, Text, VStack } from '@chakra-ui/react'

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
  const borderColor = {
    pageview: 'blue.500',
    event: 'purple.500',
    goal: 'green.500',
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
    <Box
      p={3}
      borderWidth="1px"
      borderColor={borderColor[event.type]}
      bg="bg"
      w="100%"
      animation="fadeIn 0.3s ease-out"
      css={{
        '@keyframes fadeIn': {
          from: { opacity: 0, transform: 'translateX(20px)' },
          to: { opacity: 1, transform: 'translateX(0)' },
        },
      }}
    >
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
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const [events, setEvents] = useState<DebugEvent[]>([])

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
        setIsVisible((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

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
        aria-label={isVisible ? 'Hide event stream' : 'Show event stream'}
        title={isVisible ? 'Hide event stream' : 'Show event stream'}
        position="fixed"
        bottom={4}
        right={4}
        zIndex={1000}
        borderWidth="1px"
        borderColor="border"
        borderRadius="md"
        size="md"
        bg="bg"
        color="fg"
        _hover={{ bg: 'bg.panel' }}
        onClick={() => setIsVisible(!isVisible)}
      >
        {isVisible ? <LuX /> : <LuActivity />}
      </IconButton>

      {/* Event stream panel */}
      {isVisible && (
        <Box
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          w={{ base: '100%', md: '320px' }}
          bg="bg"
          borderLeftWidth="1px"
          borderLeftColor="border"
          zIndex={999}
          display="flex"
          flexDirection="column"
        >
          {/* Header */}
          <Flex
            p={4}
            borderBottomWidth="1px"
            borderBottomColor="border"
            justifyContent="space-between"
            alignItems="center"
            bg="bg"
          >
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
          <Box flex={1} overflowY="auto" p={3}>
            {events.length === 0 ? (
              <Flex
                h="100%"
                alignItems="center"
                justifyContent="center"
                flexDirection="column"
                color="fg.muted"
                gap={2}
              >
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
          <Box p={3} borderTopWidth="1px" borderTopColor="border" bg="bg">
            <Text fontSize="xs" color="fg.muted" textAlign="center">
              {events.length} event{events.length !== 1 ? 's' : ''} • Press{' '}
              <Text as="span" fontFamily="mono" bg="bg.panel" px={1}>
                ⌘.
              </Text>{' '}
              to toggle
            </Text>
          </Box>
        </Box>
      )}
    </>
  )
}
