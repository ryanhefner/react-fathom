import { useFathom } from 'react-fathom'

import {
  Box,
  Heading,
  Text,
  VStack,
  Input,
  Button,
  Field,
  Textarea,
} from '@chakra-ui/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
})

function ContactPage() {
  const { trackEvent } = useFathom()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    trackEvent('contact_form_submit')
    alert('Form submitted! Check the debug panel to see the tracked event.')
  }

  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading as="h1" size="lg" mb={2}>
          Contact
        </Heading>
        <Text color="fg.muted">
          This page demonstrates form tracking. Submit the form to see custom
          event tracking in action.
        </Text>
      </Box>

      <Box as="form" onSubmit={handleSubmit}>
        <VStack gap={4} align="stretch">
          <Field.Root>
            <Field.Label>Name</Field.Label>
            <Input name="name" autoComplete="name" placeholder="Your name" />
          </Field.Root>
          <Field.Root>
            <Field.Label>Email</Field.Label>
            <Input
              name="email"
              autoComplete="email"
              type="email"
              placeholder="your@email.com"
            />
          </Field.Root>
          <Field.Root>
            <Field.Label>Message</Field.Label>
            <Textarea name="message" placeholder="Your message" />
          </Field.Root>
          <Button type="submit" colorPalette="purple">
            Send Message
          </Button>
        </VStack>
      </Box>
    </VStack>
  )
}
