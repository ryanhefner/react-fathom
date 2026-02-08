import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Box, Heading, Text, VStack, Button, HStack } from '@chakra-ui/react'
import { useFathom } from 'react-fathom'

import { Layout } from '../components/Layout'

const IndexPage: React.FC<PageProps> = () => {
  const { trackEvent, trackGoal } = useFathom()

  return (
    <Layout>
      <VStack gap={10} align="stretch">
        <Box>
          <Heading as="h1" size="4xl" fontWeight="bold" lineHeight="1.1" mb={4}>
            Gatsby
            <Text as="span" display="block" color="fg.muted">
              Example
            </Text>
          </Heading>
          <Text fontSize="md" color="fg.muted" maxW="480px">
            This example demonstrates the Gatsby integration with react-fathom
            for privacy-focused analytics.
          </Text>
        </Box>

        <Box borderTopWidth="1px" borderColor="border.muted" pt={8}>
          <Heading as="h2" size="lg" fontWeight="semibold" mb={6}>
            Try It Out
          </Heading>
          <HStack gap={3}>
            <Button
              bg="black"
              color="white"
              _hover={{ opacity: 0.8 }}
              _dark={{ bg: 'white', color: 'black' }}
              onClick={() => trackEvent('button_click')}
            >
              Track Event
            </Button>
            <Button
              bg="#E53935"
              color="white"
              _hover={{ opacity: 0.8 }}
              onClick={() => trackGoal('EXAMPLE01', 100)}
            >
              Track Goal ($1.00)
            </Button>
          </HStack>
        </Box>

        <Box borderTopWidth="1px" borderColor="border.muted" pt={8}>
          <Heading as="h2" size="lg" fontWeight="semibold" mb={6}>
            Features
          </Heading>
          <VStack align="start" gap={3}>
            <Text color="fg.muted">— Automatic pageview tracking on route changes</Text>
            <Text color="fg.muted">— Custom event tracking</Text>
            <Text color="fg.muted">— Goal conversion tracking</Text>
            <Text color="fg.muted">— Debug mode with event visualization</Text>
            <Text color="fg.muted">— Privacy-focused (no cookies)</Text>
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
