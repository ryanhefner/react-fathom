import { Box, Heading, Text, VStack, Link, Code } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Home() {
  return (
    <VStack gap={8} align="stretch">
      <Box>
        <Heading as="h1" size="2xl" mb={4}>
          react-fathom React Example
        </Heading>
        <Text fontSize="lg" color="fg.muted">
          This example demonstrates how to integrate react-fathom into a standard React application
          using Vite and React Router.
        </Text>
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Features Demonstrated
        </Heading>
        <VStack align="stretch" gap={3}>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="medium">Automatic Pageview Tracking</Text>
            <Text color="fg.muted" fontSize="sm">
              Navigate between pages to see pageviews tracked automatically via React Router integration.
            </Text>
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="medium">Custom Event Tracking</Text>
            <Text color="fg.muted" fontSize="sm">
              Visit the <Link as={RouterLink} to="/events" color="blue.500">Events Demo</Link> page
              to see custom event tracking in action.
            </Text>
          </Box>
          <Box p={4} borderWidth="1px" borderRadius="lg">
            <Text fontWeight="medium">useFathom Hook</Text>
            <Text color="fg.muted" fontSize="sm">
              Access <Code>trackEvent</Code> and <Code>trackPageview</Code> from anywhere in your app.
            </Text>
          </Box>
        </VStack>
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={4}>
          Quick Setup
        </Heading>
        <Box bg="gray.900" p={4} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100">
          <Text color="purple.400">import</Text>
          <Text as="span"> {'{ '}</Text>
          <Text as="span" color="yellow.300">FathomProvider</Text>
          <Text as="span">{' }'} </Text>
          <Text as="span" color="purple.400">from</Text>
          <Text as="span" color="green.300"> 'react-fathom'</Text>
          <Text mt={4}>{'<'}<Text as="span" color="blue.300">FathomProvider</Text></Text>
          <Text ml={4}><Text as="span" color="cyan.300">siteId</Text>=<Text as="span" color="green.300">"YOUR_SITE_ID"</Text></Text>
          <Text>{'>'}</Text>
          <Text ml={4}>{'<'}<Text as="span" color="blue.300">App</Text> /{'>'}</Text>
          <Text>{'</'}<Text as="span" color="blue.300">FathomProvider</Text>{'>'}</Text>
        </Box>
      </Box>

      <Box>
        <Link as={RouterLink} to="/docs" color="blue.500" fontWeight="medium">
          Read the full documentation →
        </Link>
      </Box>
    </VStack>
  )
}
