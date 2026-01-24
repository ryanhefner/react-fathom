import { Box, Heading, Text, VStack, Link, Code } from '@chakra-ui/react'
import { Link as RouterLink } from 'react-router-dom'

export function Home() {
  return (
    <VStack gap={10} align="stretch">
      <Box>
        <Heading as="h1" size="4xl" fontWeight="bold" lineHeight="1.1" mb={4}>
          React + Vite
          <Text as="span" display="block" color="fg.muted">
            Example
          </Text>
        </Heading>
        <Text fontSize="md" color="fg.muted" maxW="480px">
          This example demonstrates how to integrate react-fathom into a standard React application
          using Vite and React Router.
        </Text>
      </Box>

      <Box borderTopWidth="1px" borderColor="border.muted" pt={8}>
        <Heading as="h2" size="lg" fontWeight="semibold" mb={6}>
          Features
        </Heading>
        <VStack align="stretch" gap={4}>
          <Box>
            <Text fontWeight="medium" mb={1}>Automatic Pageview Tracking</Text>
            <Text color="fg.muted" fontSize="sm">
              Navigate between pages to see pageviews tracked automatically via React Router integration.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={1}>Custom Event Tracking</Text>
            <Text color="fg.muted" fontSize="sm">
              Visit the <Link as={RouterLink} to="/events" fontWeight="medium" _hover={{ opacity: 0.7 }}>Events Demo</Link> page
              to see custom event tracking in action.
            </Text>
          </Box>
          <Box>
            <Text fontWeight="medium" mb={1}>useFathom Hook</Text>
            <Text color="fg.muted" fontSize="sm">
              Access <Code fontSize="sm">trackEvent</Code> and <Code fontSize="sm">trackPageview</Code> from anywhere in your app.
            </Text>
          </Box>
        </VStack>
      </Box>

      <Box borderTopWidth="1px" borderColor="border.muted" pt={8}>
        <Heading as="h2" size="lg" fontWeight="semibold" mb={4}>
          Quick Setup
        </Heading>
        <Box bg="black" p={5} borderRadius="lg" fontFamily="mono" fontSize="sm" color="gray.100">
          <Text color="gray.400">import</Text>
          <Text as="span"> {'{ '}</Text>
          <Text as="span" color="white">FathomProvider</Text>
          <Text as="span">{' }'} </Text>
          <Text as="span" color="gray.400">from</Text>
          <Text as="span" color="gray.300"> 'react-fathom'</Text>
          <Text mt={4}>{'<'}<Text as="span" color="white">FathomProvider</Text></Text>
          <Text ml={4}><Text as="span" color="gray.400">siteId</Text>=<Text as="span" color="gray.300">"YOUR_SITE_ID"</Text></Text>
          <Text>{'>'}</Text>
          <Text ml={4}>{'<'}<Text as="span" color="white">App</Text> /{'>'}</Text>
          <Text>{'</'}<Text as="span" color="white">FathomProvider</Text>{'>'}</Text>
        </Box>
      </Box>

      <Box>
        <Link as={RouterLink} to="/docs" fontWeight="medium" _hover={{ opacity: 0.7 }}>
          Read the full documentation →
        </Link>
      </Box>
    </VStack>
  )
}
