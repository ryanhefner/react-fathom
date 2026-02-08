import React from 'react'
import { Helmet } from 'react-helmet'
import { ChakraProvider, defaultSystem, Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react'
import { FathomProvider } from 'react-fathom'
import { GatsbyFathomTrackView } from 'react-fathom/gatsby'

import { Navbar } from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

const siteId = process.env.GATSBY_FATHOM_SITE_ID || 'DEMO'

export function Layout({ children }: LayoutProps) {
  return (
    <ChakraProvider value={defaultSystem}>
      <FathomProvider siteId={siteId} debug={{ enabled: true }}>
        <Helmet>
          <meta property="og:type" content="website" />
          <meta property="og:title" content="Gatsby Example - react-fathom" />
          <meta
            property="og:description"
            content="Example Gatsby application demonstrating react-fathom analytics integration"
          />
          <meta property="og:site_name" content="react-fathom examples" />
          <meta name="twitter:card" content="summary" />
          <meta name="twitter:title" content="Gatsby Example - react-fathom" />
          <meta
            name="twitter:description"
            content="Example Gatsby application demonstrating react-fathom analytics integration"
          />
        </Helmet>
        <GatsbyFathomTrackView />
        <Box minH="100vh" display="flex" flexDirection="column">
          <Navbar />
          <Box as="main" flex={1} py={{ base: 8, md: 12 }}>
            <Container maxW="640px" px={{ base: 5, md: 6 }}>
              {children}
            </Container>
          </Box>
          <Box borderTopWidth="1px" borderColor="border.muted" py={{ base: 6, md: 8 }}>
            <Container maxW="640px" px={{ base: 5, md: 6 }}>
              <Flex
                justify="space-between"
                align="center"
                flexDir={{ base: 'column', md: 'row' }}
                gap={4}
              >
                <Text fontSize="xs" color="fg.muted">
                  © {new Date().getFullYear()} —{' '}
                  <Link
                    href="https://github.com/ryanhefner/react-fathom"
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                  >
                    react-fathom
                  </Link>
                </Text>
                <HStack gap={4} fontSize="xs">
                  <Link
                    href="https://react-fathom.com/docs"
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                  >
                    Docs
                  </Link>
                  <Link
                    href="https://github.com/ryanhefner/react-fathom"
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                  >
                    GitHub
                  </Link>
                  <Link
                    href="https://usefathom.com"
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                  >
                    Fathom
                  </Link>
                </HStack>
              </Flex>
            </Container>
          </Box>
        </Box>
      </FathomProvider>
    </ChakraProvider>
  )
}
