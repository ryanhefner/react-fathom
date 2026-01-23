'use client'

import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  IconButton,
  Text,
  VStack,
} from '@chakra-ui/react'
import { useDebugSubscription, type DebugEvent } from 'react-fathom/debug'
import { useState, useEffect } from 'react'

const STORAGE_KEY = 'react-fathom-event-stream-visible'

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

interface EventCardProps {
  event: DebugEvent
}

function EventCard({ event }: EventCardProps) {
  const colors = {
    pageview: 'blue.500',
    event: 'purple.500',
    goal: 'green.500',
  }

  let title = ''
  let subtitle = ''

  switch (event.type) {
    case 'pageview':
      title = 'Pageview'
      subtitle = event.url || (typeof window !== 'undefined' ? window.location.pathname : '')
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
      borderRadius="md"
      borderLeftWidth="3px"
      borderLeftColor={colors[event.type]}
      bg="bg.muted"
      mb={2}
    >
      <Flex justify="space-between" mb={1}>
        <Text fontWeight="semibold" fontSize="sm">
          {title}
        </Text>
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

export interface EventStreamPanelProps {
  /**
   * Maximum number of events to display
   * @default 20
   */
  maxEvents?: number
  /**
   * Position of the toggle button
   * @default 'bottom-right'
   */
  position?: 'bottom-right' | 'bottom-left'
  /**
   * Initial visibility state (overridden by localStorage if available)
   * @default false
   */
  defaultVisible?: boolean
}

/**
 * A Chakra UI styled debug panel that displays tracked events in real-time.
 * Only renders when debug mode is enabled in the FathomProvider.
 */
export function EventStreamPanel({
  maxEvents = 20,
  position = 'bottom-right',
  defaultVisible = false,
}: EventStreamPanelProps = {}) {
  const [isVisible, setIsVisible] = useState(defaultVisible)
  const [isHydrated, setIsHydrated] = useState(false)
  const { events, debugEnabled, clearEvents } = useDebugSubscription({ maxEvents })

  useEffect(() => {
    setIsHydrated(true)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored !== null) {
          setIsVisible(stored === 'true')
        }
      } catch {
        // localStorage unavailable
      }
    }
  }, [])

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

  useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, String(isVisible))
      } catch {
        // localStorage unavailable
      }
    }
  }, [isVisible, isHydrated])

  if (!debugEnabled || !isHydrated) return null

  const isRight = position === 'bottom-right'

  return (
    <>
      {/* Toggle Button */}
      <IconButton
        aria-label={isVisible ? 'Hide event stream' : 'Show event stream'}
        onClick={() => setIsVisible(!isVisible)}
        position="fixed"
        bottom={4}
        {...(isRight ? { right: 4 } : { left: 4 })}
        zIndex={1000}
        rounded="full"
        size="lg"
        colorPalette="purple"
        boxShadow="lg"
      >
        {isVisible ? '✕' : '📊'}
      </IconButton>

      {/* Panel */}
      {isVisible && (
        <Box
          position="fixed"
          top={0}
          {...(isRight ? { right: 0 } : { left: 0 })}
          bottom={0}
          width="320px"
          bg="bg"
          borderLeftWidth={isRight ? '1px' : undefined}
          borderRightWidth={isRight ? undefined : '1px'}
          zIndex={999}
          display="flex"
          flexDirection="column"
          boxShadow={isRight ? '-4px 0 12px rgba(0,0,0,0.1)' : '4px 0 12px rgba(0,0,0,0.1)'}
        >
          {/* Header */}
          <Flex
            p={4}
            borderBottomWidth="1px"
            justify="space-between"
            align="center"
            bg="bg.muted"
          >
            <Heading size="sm">📊 Event Stream</Heading>
            <Button
              size="xs"
              variant="outline"
              onClick={clearEvents}
              disabled={events.length === 0}
            >
              Clear
            </Button>
          </Flex>

          {/* Event List */}
          <Box flex={1} overflowY="auto" p={3}>
            {events.length === 0 ? (
              <VStack py={8} color="fg.muted">
                <Text fontSize="2xl">🔍</Text>
                <Text fontSize="sm" textAlign="center">
                  No events yet.
                  <br />
                  Navigate or interact to see tracking events.
                </Text>
              </VStack>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </Box>

          {/* Footer */}
          <Box
            p={3}
            borderTopWidth="1px"
            bg="bg.muted"
            fontSize="xs"
            color="fg.muted"
            textAlign="center"
          >
            <HStack justify="center" gap={1}>
              <Text>{events.length} event{events.length !== 1 ? 's' : ''}</Text>
              <Text>•</Text>
              <Text
                as="kbd"
                bg="bg"
                px={1}
                borderRadius="sm"
                fontFamily="mono"
              >
                ⌘.
              </Text>
              <Text>to toggle</Text>
            </HStack>
          </Box>
        </Box>
      )}
    </>
  )
}
