import React from 'react'
import type { HeadFC, PageProps } from 'gatsby'
import { Box, Heading, Text, VStack, Input, Button } from '@chakra-ui/react'
import { useFathom } from 'react-fathom'

import { Layout } from '../components/Layout'

const ContactPage: React.FC<PageProps> = () => {
  const { trackEvent } = useFathom()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('contact_form_submit')
    alert('Form submitted! Check the console to see the tracked event.')
  }

  return (
    <Layout>
      <VStack gap={6} align="stretch">
        <Box>
          <Heading size="lg" mb={2}>
            Contact
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            This page demonstrates form tracking. Submit the form to see custom
            event tracking in action.
          </Text>
        </Box>

        <Box as="form" onSubmit={handleSubmit}>
          <VStack gap={4} align="stretch">
            <Box>
              <Text mb={1} fontWeight="medium">
                Name
              </Text>
              <Input placeholder="Your name" />
            </Box>
            <Box>
              <Text mb={1} fontWeight="medium">
                Email
              </Text>
              <Input type="email" placeholder="your@email.com" />
            </Box>
            <Box>
              <Text mb={1} fontWeight="medium">
                Message
              </Text>
              <Input placeholder="Your message" />
            </Box>
            <Button type="submit" colorScheme="purple">
              Send Message
            </Button>
          </VStack>
        </Box>
      </VStack>
    </Layout>
  )
}

export default ContactPage

export const Head: HeadFC = () => (
  <>
    <title>Contact - Gatsby Example - react-fathom</title>
    <meta
      name="description"
      content="Contact page demonstrating react-fathom with Gatsby"
    />
  </>
)
