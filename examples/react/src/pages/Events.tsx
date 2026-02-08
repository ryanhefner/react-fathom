import { Box, Button, Heading, Text, VStack, HStack, Code, Input } from '@chakra-ui/react'
import { useState } from 'react'
import { useFathom, TrackClick } from 'react-fathom'

export function Events() {
  const { trackEvent } = useFathom()
  const [customEventName, setCustomEventName] = useState('custom-event')
  const [eventCount, setEventCount] = useState(0)

  const handleTrackEvent = (eventName: string) => {
    trackEvent(eventName)
    setEventCount((c) => c + 1)
  }

  return (
    <VStack gap={8} align="stretch">
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          Event Tracking Demo
        </Heading>
        <Text color="fg.muted">
          This page demonstrates different ways to track custom events with react-fathom.
        </Text>
        <Text fontSize="sm" color="fg.muted" mt={2}>
          Events tracked this session: <strong>{eventCount}</strong>
        </Text>
      </Box>

      {/* useFathom Hook */}
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size="md" mb={4}>
          Using the <Code>useFathom</Code> Hook
        </Heading>
        <Text color="fg.muted" mb={4}>
          Call <Code>trackEvent()</Code> imperatively from any component.
        </Text>
        <HStack gap={4}>
          <Button
            colorPalette="blue"
            onClick={() => handleTrackEvent('button-click')}
          >
            Track "button-click"
          </Button>
          <Button
            variant="outline"
            onClick={() => handleTrackEvent('signup-intent')}
          >
            Track "signup-intent"
          </Button>
        </HStack>
        <Box mt={4} bg="gray.900" p={3} borderRadius="md" fontSize="sm" fontFamily="mono" color="gray.100">
          <Text color="purple.400">const</Text>
          <Text as="span"> {'{ '}<Text as="span" color="yellow.300">trackEvent</Text>{' }'} = </Text>
          <Text as="span" color="blue.300">useFathom</Text>
          <Text as="span">()</Text>
          <Text mt={2}><Text as="span" color="blue.300">trackEvent</Text>(<Text as="span" color="green.300">'button-click'</Text>)</Text>
        </Box>
      </Box>

      {/* TrackClick Component */}
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size="md" mb={4}>
          Using the <Code>{'<TrackClick>'}</Code> Component
        </Heading>
        <Text color="fg.muted" mb={4}>
          Wrap any clickable element to track clicks declaratively.
        </Text>
        <HStack gap={4}>
          <TrackClick eventName="cta-click" onTrack={() => setEventCount((c) => c + 1)}>
            <Button colorPalette="green">
              Tracked CTA Button
            </Button>
          </TrackClick>
          <TrackClick eventName="link-click" onTrack={() => setEventCount((c) => c + 1)}>
            <Button variant="outline">
              Tracked Link Button
            </Button>
          </TrackClick>
        </HStack>
        <Box mt={4} bg="gray.900" p={3} borderRadius="md" fontSize="sm" fontFamily="mono" color="gray.100">
          <Text>{'<'}<Text as="span" color="blue.300">TrackClick</Text></Text>
          <Text ml={4}><Text as="span" color="cyan.300">eventName</Text>=<Text as="span" color="green.300">"cta-click"</Text></Text>
          <Text>{'>'}</Text>
          <Text ml={4}>{'<'}<Text as="span" color="blue.300">Button</Text>{'>'}Click Me{'</'}<Text as="span" color="blue.300">Button</Text>{'>'}</Text>
          <Text>{'</'}<Text as="span" color="blue.300">TrackClick</Text>{'>'}</Text>
        </Box>
      </Box>

      {/* Custom Event */}
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size="md" mb={4}>
          Custom Event Name
        </Heading>
        <Text color="fg.muted" mb={4}>
          Track any event name you want.
        </Text>
        <HStack gap={4}>
          <Input
            value={customEventName}
            onChange={(e) => setCustomEventName(e.target.value)}
            placeholder="Event name"
            maxW="200px"
          />
          <Button
            colorPalette="purple"
            onClick={() => handleTrackEvent(customEventName)}
          >
            Track Event
          </Button>
        </HStack>
      </Box>

      {/* Event with Value */}
      <Box p={6} borderWidth="1px" borderRadius="lg">
        <Heading as="h2" size="md" mb={4}>
          Events with Monetary Value
        </Heading>
        <Text color="fg.muted" mb={4}>
          Track events with an associated value (in cents) for revenue tracking.
        </Text>
        <HStack gap={4}>
          <Button
            colorPalette="yellow"
            onClick={() => {
              trackEvent('purchase', { _value: 1999 }) // $19.99
              setEventCount((c) => c + 1)
            }}
          >
            Track Purchase ($19.99)
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              trackEvent('subscription', { _value: 9900 }) // $99.00
              setEventCount((c) => c + 1)
            }}
          >
            Track Subscription ($99)
          </Button>
        </HStack>
        <Box mt={4} bg="gray.900" p={3} borderRadius="md" fontSize="sm" fontFamily="mono" color="gray.100">
          <Text><Text as="span" color="blue.300">trackEvent</Text>(</Text>
          <Text ml={4}><Text as="span" color="green.300">'purchase'</Text>,</Text>
          <Text ml={4}>{'{ '}<Text as="span" color="cyan.300">_value</Text>: <Text as="span" color="orange.300">1999</Text>{' }'}</Text>
          <Text>)</Text>
        </Box>
      </Box>
    </VStack>
  )
}
