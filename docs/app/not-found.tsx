import { LuArrowLeft } from 'react-icons/lu'

import { DocsSiteSearch } from '@/components/docs/DocsSiteSearch'
import { SiteLink } from '@/components/docs/SiteLink'
import { getDocsManifest } from '@/lib/chakra-docs'
import {
  Box,
  Button,
  Container,
  Heading,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react'

import { Navbar } from '../components/docs/Navbar'

const popularPages = [
  { title: 'Getting Started', href: '/docs/getting-started' },
  { title: 'React', href: '/docs/react' },
  { title: 'Next.js', href: '/docs/nextjs' },
  { title: 'API Reference', href: '/docs/api/providers' },
]

export default async function NotFound() {
  const manifest = await getDocsManifest()

  return (
    <>
      <Navbar searchRecords={manifest.search} />
      <Container as="main" maxW="3xl" py={20}>
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
                <Button asChild variant="surface" key={page.href}>
                  <SiteLink href={page.href}>{page.title}</SiteLink>
                </Button>
              ))}
            </Flex>
          </Box>

          <SiteLink
            href="/"
            alignItems="center"
            color="site.link"
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
