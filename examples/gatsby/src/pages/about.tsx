import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Box, Heading, Text, VStack } from '@chakra-ui/react'

import { Layout } from '../components/Layout'

const AboutPage: React.FC<PageProps> = () => {
  return (
    <Layout>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            About
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            This page demonstrates automatic pageview tracking. When you
            navigate here, react-fathom automatically tracks the pageview.
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={3}>
            How It Works
          </Heading>
          <Text mb={3}>
            The <code>GatsbyFathomTrackView</code> component uses Gatsby's
            @reach/router to listen for route changes and automatically sends
            pageview events to Fathom Analytics.
          </Text>
          <Text>
            Open your browser's developer console to see the debug output, or
            check the debug panel if visible.
          </Text>
        </Box>
      </VStack>
    </Layout>
  )
}

export default AboutPage

export const Head: HeadFC = () => (
  <>
    <title>About - Gatsby Example - react-fathom</title>
    <meta
      name="description"
      content="About page demonstrating react-fathom with Gatsby"
    />
  </>
)
