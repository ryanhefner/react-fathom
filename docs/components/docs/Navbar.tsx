'use client'

import { SiGithub } from 'react-icons/si'

import type { DocsSearchRecord } from '@chakra-docs/core'
import {
  Box,
  Container,
  Flex,
  HStack,
  IconButton,
  Portal,
  Tooltip,
} from '@chakra-ui/react'

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
      h="siteHeader"
      borderBottomWidth="1px"
      bg="bg"
      backdropFilter="blur(10px)"
    >
      <Container maxW="7xl" h="full">
        <Flex justify="space-between" align="center" h="full">
          <SiteLink
            href="/"
            fontWeight={500}
            fontSize="lg"
            _hover={{ textDecoration: 'none' }}
          >
            react-fathom
          </SiteLink>
          <HStack gap={6}>
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
            </HStack>
            <HStack gap={2}>
              <DocsSiteSearch records={searchRecords} />
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <IconButton
                    asChild
                    aria-label="View react-fathom on GitHub"
                    variant="ghost"
                    color="fg.muted"
                    minH="44px"
                    minW="44px"
                    _hover={{ color: 'fg', bg: 'bg.panel' }}
                  >
                    <SiteLink href="https://github.com/ryanhefner/react-fathom">
                      <SiGithub aria-hidden="true" />
                    </SiteLink>
                  </IconButton>
                </Tooltip.Trigger>
                <Portal>
                  <Tooltip.Positioner>
                    <Tooltip.Content>GitHub</Tooltip.Content>
                  </Tooltip.Positioner>
                </Portal>
              </Tooltip.Root>
            </HStack>
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
