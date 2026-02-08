'use client'

import { Box, Container, Heading, Text, VStack, Link, Flex, HStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Search } from '@/components/docs/Search'
import { ColorModeButton } from '@/components/docs/ColorModeButton'

const popularPages = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'React', href: '/docs/react' },
  { title: 'Next.js', href: '/docs/nextjs' },
  { title: 'API Reference', href: '/docs/api' },
]

function SimpleNavbar() {
  return (
    <Box
      as="header"
      position="sticky"
      top={0}
      zIndex={50}
      borderBottomWidth="1px"
      bg="bg"
      backdropFilter="blur(10px)"
    >
      <Container maxW="container.xl" py={3}>
        <Flex justify="space-between" align="center">
          <Link asChild fontWeight="bold" fontSize="lg" _hover={{ textDecoration: 'none' }}>
            <NextLink href="/">react-fathom</NextLink>
          </Link>
          <HStack gap={4}>
            <Link asChild color="fg.muted" _hover={{ color: 'fg' }}>
              <NextLink href="/docs">Docs</NextLink>
            </Link>
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default function NotFound() {
  return (
    <>
      <SimpleNavbar />
      <Container maxW="container.md" py={20}>
        <VStack gap={8} textAlign="center">
          <Box>
            <Text fontSize="8xl" fontWeight="bold" color="fg.muted" lineHeight={1}>
              404
            </Text>
            <Heading as="h1" size="xl" mt={4}>
              Page not found
            </Heading>
            <Text color="fg.muted" mt={2} fontSize="lg">
              The page you're looking for doesn't exist or has been moved.
            </Text>
          </Box>

          <Box w="full" maxW="md">
            <Text fontWeight="medium" mb={3}>
              Try searching for what you need:
            </Text>
            <Search />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={3}>
              Or check out these popular pages:
            </Text>
            <Flex gap={3} flexWrap="wrap" justify="center">
              {popularPages.map((page) => (
                <Link
                  key={page.href}
                  asChild
                  px={4}
                  py={2}
                  borderRadius="md"
                  bg="gray.800"
                  _light={{ bg: 'gray.100' }}
                  _hover={{
                    bg: 'gray.700',
                    _light: { bg: 'gray.200' },
                  }}
                >
                  <NextLink href={page.href}>{page.title}</NextLink>
                </Link>
              ))}
            </Flex>
          </Box>

          <Link
            asChild
            color="blue.500"
            fontWeight="medium"
            _hover={{ textDecoration: 'underline' }}
          >
            <NextLink href="/">← Back to home</NextLink>
          </Link>
        </VStack>
      </Container>
    </>
  )
}
