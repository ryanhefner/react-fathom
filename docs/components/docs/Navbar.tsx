'use client'

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { ColorModeButton } from './ColorModeButton'
import { MobileNav } from './MobileNav'
import { Search } from './Search'
import type { NavItem } from '@/lib/docs'

interface NavbarProps {
  nav: NavItem[]
}

export function Navbar({ nav }: NavbarProps) {
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
          <HStack gap={8}>
            <Link asChild fontWeight="bold" fontSize="lg" _hover={{ textDecoration: 'none' }}>
              <NextLink href="/">react-fathom</NextLink>
            </Link>
            <HStack as="nav" gap={6} display={{ base: 'none', md: 'flex' }}>
              <Link asChild color="fg.muted" _hover={{ color: 'fg' }}>
                <NextLink href="/docs/getting-started">Docs</NextLink>
              </Link>
              <Link asChild color="fg.muted" _hover={{ color: 'fg' }}>
                <NextLink href="/docs/api">API</NextLink>
              </Link>
              <Link
                href="https://github.com/ryanhefner/react-fathom"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                GitHub
              </Link>
            </HStack>
          </HStack>
          <HStack gap={2}>
            <Search />
            <ColorModeButton />
            <MobileNav nav={nav} />
          </HStack>
        </Flex>
      </Container>
    </Box>
  )
}
