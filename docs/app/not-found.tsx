import { LuArrowLeft } from 'react-icons/lu'

import { ColorModeButton } from '@/components/docs/ColorModeButton'
import { DocsSiteSearch } from '@/components/docs/DocsSiteSearch'
import { SiteLink } from '@/components/docs/SiteLink'
import { getDocsManifest } from '@/lib/chakra-docs'
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
  HStack,
} from '@chakra-ui/react'

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
          <SiteLink
            href="/"
            fontWeight={500}
            fontSize="lg"
            _hover={{ textDecoration: 'none' }}
          >
            react-fathom
          </SiteLink>
          <HStack gap={4}>
            <SiteLink href="/docs" color="fg.muted" _hover={{ color: 'fg' }}>
              Docs
            </SiteLink>
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}

export default async function NotFound() {
  const manifest = await getDocsManifest()

  return (
    <>
      <SimpleNavbar />
      <Container maxW="container.md" py={20}>
        <VStack gap={8} textAlign="center">
          <Box>
            <Text
              fontSize="8xl"
              fontWeight="bold"
              color="fg.muted"
              lineHeight={1}
            >
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
            <DocsSiteSearch records={manifest.search} />
          </Box>

          <Box>
            <Text fontWeight="medium" mb={3}>
              Or check out these popular pages:
            </Text>
            <Flex gap={3} flexWrap="wrap" justify="center">
              {popularPages.map((page) => (
                <SiteLink
                  key={page.href}
                  href={page.href}
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
                  {page.title}
                </SiteLink>
              ))}
            </Flex>
          </Box>

          <SiteLink
            href="/"
            alignItems="center"
            color="blue.500"
            display="inline-flex"
            fontWeight="medium"
            gap={1}
            _hover={{ textDecoration: 'underline' }}
          >
            <LuArrowLeft aria-hidden="true" />
            Back to home
          </SiteLink>
        </VStack>
      </Container>
    </>
  )
}
