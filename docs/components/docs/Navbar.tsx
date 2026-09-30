'use client'

import type { DocsSearchRecord } from '@chakra-docs/core'
import { Box, Container, Flex, HStack } from '@chakra-ui/react'

import { ColorModeButton } from './ColorModeButton'
import { DocsSiteSearch } from './DocsSiteSearch'
import { SiteLink } from './SiteLink'

interface NavbarProps {
  searchRecords: readonly DocsSearchRecord[]
}

export function Navbar({ searchRecords }: NavbarProps) {
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
      <Container maxW="7xl" py={3}>
        <Flex justify="space-between" align="center">
          <HStack gap={8}>
            <SiteLink
              href="/"
              fontWeight={500}
              fontSize="lg"
              _hover={{ textDecoration: 'none' }}
            >
              react-fathom
            </SiteLink>
            <HStack as="nav" gap={6} display={{ base: 'none', md: 'flex' }}>
              <SiteLink
                href="/docs/getting-started"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                Docs
              </SiteLink>
              <SiteLink
                href="/docs/api"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                API
              </SiteLink>
              <SiteLink
                href="https://github.com/ryanhefner/react-fathom"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                GitHub
              </SiteLink>
            </HStack>
          </HStack>
          <HStack gap={2}>
            <DocsSiteSearch records={searchRecords} />
            <ColorModeButton />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
