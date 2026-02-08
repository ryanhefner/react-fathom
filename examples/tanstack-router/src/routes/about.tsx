import { createFileRoute } from '@tanstack/react-router'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading size="lg" mb={2}>
          About
        </Heading>
        <Text color="gray.600" _dark={{ color: 'gray.400' }}>
          This page demonstrates automatic pageview tracking. When you navigate
          here, react-fathom automatically tracks the pageview.
        </Text>
      </Box>

      <Box>
        <Heading size="md" mb={3}>
          How It Works
        </Heading>
        <Text mb={3}>
          The <code>TanStackRouterFathomTrackView</code> component listens for
          route changes and automatically sends pageview events to Fathom
          Analytics.
        </Text>
        <Text>
          Check the debug panel in the bottom-right corner to see the events
          being tracked in real-time.
        </Text>
      </Box>
    </VStack>
  )
}
