'use client'

import { LuGithub } from 'react-icons/lu'

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
            </HStack>
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
                    <LuGithub aria-hidden="true" />
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
        </Flex>
      </Container>
    </Box>
  )
}
