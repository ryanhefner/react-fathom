import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Box, Heading, Text, VStack, Button } from '@chakra-ui/react'
import { useFathom } from 'react-fathom'

import { Layout } from '../components/Layout'

const IndexPage: React.FC<PageProps> = () => {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <Layout>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Welcome to react-fathom
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            This example demonstrates the Gatsby integration with react-fathom
            for privacy-focused analytics.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Try It Out
          </Heading>
          <VStack gap={3} align="start">
            <Button
              colorScheme="purple"
              onClick={() => trackEvent('button_click')}
            >
              Track Event
            </Button>
            <Button
              colorScheme="green"
              onClick={() => trackGoal('EXAMPLE01', 100)}
            >
              Track Goal ($1.00)
            </Button>
          </VStack>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            Features
          </Heading>
          <VStack align="start" gap={2}>
            <Text>- Automatic pageview tracking on route changes</Text>
            <Text>- Custom event tracking</Text>
            <Text>- Goal conversion tracking</Text>
            <Text>- Debug mode with event visualization</Text>
            <Text>- Privacy-focused (no cookies)</Text>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  )
}

export default IndexPage

export const Head: HeadFC = () => (
  <>
    <title>Gatsby Example - react-fathom</title>
    <meta
      name="description"
      content="Example Gatsby application demonstrating react-fathom analytics integration"
    />
  </>
)
