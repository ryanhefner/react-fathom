'use client'

import { useState, useEffect } from 'react'
import { Box, Button, Flex, IconButton, Text, VStack } from '@chakra-ui/react'
import { useDebugSubscription, type DebugEvent } from 'react-fathom'

const STORAGE_KEY = 'react-fathom-event-stream-visible'

function EventIcon({ type }: { type: DebugEvent['type'] }) {
  const icons = {
    pageview: '📄',
    event: '🎯',
    goal: '🏆',
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
  const bgColor = {
    pageview: { light: 'blue.50', dark: 'blue.950' },
    event: { light: 'purple.50', dark: 'purple.950' },
    goal: { light: 'green.50', dark: 'green.950' },
  }
  const borderColor = {
    pageview: 'blue.400',
    event: 'purple.400',
    goal: 'green.400',
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
      borderRadius="md"
      borderLeftWidth="3px"
      borderLeftColor={borderColor[event.type]}
      bg={bgColor[event.type].light}
      _dark={{ bg: bgColor[event.type].dark }}
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
          <Text fontWeight="semibold" fontSize="sm">
            {title}
          </Text>
        </Flex>
        <Text fontSize="xs" color="gray.500" _dark={{ color: 'gray.400' }}>
          {formatTime(event.timestamp)}
        </Text>
      </Flex>
      <Text
        fontSize="xs"
        color="gray.600"
        _dark={{ color: 'gray.300' }}
        wordBreak="break-all"
      >
        {subtitle}
      </Text>
    </Box>
  )
}

export function EventStream() {
  const [isVisible, setIsVisible] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)
  const { events, debugEnabled, clearEvents } = useDebugSubscription({
    maxEvents: 20,
  })

  // Load visibility state from localStorage on mount
  useEffect(() => {
    setIsHydrated(true)
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored !== null) {
      setIsVisible(stored === 'true')
    }
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
      localStorage.setItem(STORAGE_KEY, String(isVisible))
    }
  }, [isVisible, isHydrated])

  // Don't render if debug mode is not enabled
  if (!debugEnabled) {
    return null
  }

  // Don't render until hydrated to avoid SSR mismatch
  if (!isHydrated) {
    return null
  }

  return (
    <>
      {/* Toggle button */}
      <IconButton
        aria-label={isVisible ? 'Hide event stream' : 'Show event stream'}
        position="fixed"
        bottom={4}
        right={4}
        zIndex={1000}
        borderRadius="full"
        size="lg"
        bg="purple.500"
        color="white"
        _hover={{ bg: 'purple.600' }}
        _dark={{ bg: 'purple.400', _hover: { bg: 'purple.500' } }}
        onClick={() => setIsVisible(!isVisible)}
        boxShadow="lg"
      >
        {isVisible ? '✕' : '📊'}
      </IconButton>

      {/* Event stream panel */}
      {isVisible && (
        <Box
          position="fixed"
          top={0}
          right={0}
          bottom={0}
          w={{ base: '100%', md: '320px' }}
          bg="white"
          borderLeftWidth="1px"
          borderLeftColor="gray.200"
          _dark={{ bg: 'gray.900', borderLeftColor: 'gray.700' }}
          zIndex={999}
          display="flex"
          flexDirection="column"
          boxShadow="xl"
        >
          {/* Header */}
          <Flex
            p={4}
            borderBottomWidth="1px"
            borderBottomColor="gray.200"
            justifyContent="space-between"
            alignItems="center"
            bg="gray.50"
            _dark={{ bg: 'gray.800', borderBottomColor: 'gray.700' }}
          >
            <Flex alignItems="center" gap={2}>
              <Text fontSize="lg">📊</Text>
              <Text fontWeight="semibold">Event Stream</Text>
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
                color="gray.500"
                gap={2}
              >
                <Text fontSize="2xl">🔍</Text>
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
          <Box
            p={3}
            borderTopWidth="1px"
            borderTopColor="gray.200"
            bg="gray.50"
            _dark={{ bg: 'gray.800', borderTopColor: 'gray.700' }}
          >
            <Text fontSize="xs" color="gray.500" textAlign="center">
              {events.length} event{events.length !== 1 ? 's' : ''} • Press{' '}
              <Text as="span" fontFamily="mono" bg="gray.200" _dark={{ bg: 'gray.700' }} px={1} borderRadius="sm">
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
