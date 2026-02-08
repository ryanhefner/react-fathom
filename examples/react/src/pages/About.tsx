import { Box, Heading, Text, VStack, Link } from '@chakra-ui/react'

export function About() {
  return (
    <VStack gap={6} align="stretch">
      <Box>
        <Heading as="h1" size="xl" mb={4}>
          About This Example
        </Heading>
        <Text color="fg.muted">
          This is a demonstration of react-fathom integration in a React application.
        </Text>
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={3}>
          Tech Stack
        </Heading>
        <VStack align="stretch" gap={2}>
          <Text>• <strong>Vite</strong> — Fast build tool and dev server</Text>
          <Text>• <strong>React 19</strong> — UI library</Text>
          <Text>• <strong>React Router</strong> — Client-side routing</Text>
          <Text>• <strong>Chakra UI</strong> — Component library</Text>
          <Text>• <strong>react-fathom</strong> — Privacy-focused analytics</Text>
        </VStack>
      </Box>

      <Box>
        <Heading as="h2" size="lg" mb={3}>
          Why Fathom Analytics?
        </Heading>
        <Text mb={4}>
          Fathom Analytics is a privacy-focused alternative to Google Analytics that:
        </Text>
        <VStack align="stretch" gap={2}>
          <Text>• Doesn't use cookies — GDPR/CCPA compliant by default</Text>
          <Text>• Respects user privacy — No personal data collection</Text>
          <Text>• Lightweight — Won't slow down your site</Text>
          <Text>• Simple — Easy to understand dashboard</Text>
        </VStack>
      </Box>

      <Box>
        <Link href="https://usefathom.com/ref/EKONBS" color="blue.500" fontWeight="medium">
          Try Fathom Analytics (Get $10 credit) →
        </Link>
      </Box>
    </VStack>
  )
}
