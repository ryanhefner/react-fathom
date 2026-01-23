'use client'

import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react'
import type { ComponentType, ReactNode } from 'react'
import { ColorModeButtonSimple } from './ColorModeButtonSimple'

export interface NavLink {
  href: string
  label: string
}

export interface ExampleLayoutSimpleProps {
  children: ReactNode
  /**
   * The Link component to use for navigation.
   * Pass React Router's Link component.
   */
  linkComponent: ComponentType<{ to: string; children: ReactNode; className?: string }>
  /**
   * Navigation links to display in the header.
   */
  navLinks?: NavLink[]
  /**
   * The title/brand shown in the header.
   * @default 'react-fathom'
   */
  title?: string
  /**
   * Show the color mode toggle button.
   * @default true
   */
  showColorModeButton?: boolean
  /**
   * The framework name shown in the footer.
   */
  frameworkName?: string
}

const defaultNavLinks: NavLink[] = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/events', label: 'Events' },
  { href: '/contact', label: 'Contact' },
]

/**
 * Shared layout component for example sites using React Router.
 * Includes a responsive navbar, main content area, and footer.
 */
export function ExampleLayoutSimple({
  children,
  linkComponent: LinkComponent,
  navLinks = defaultNavLinks,
  title = 'react-fathom',
  showColorModeButton = true,
  frameworkName,
}: ExampleLayoutSimpleProps) {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      {/* Navbar */}
      <Box
        as="nav"
        borderBottomWidth="1px"
        bg="bg"
        position="sticky"
        top={0}
        zIndex={50}
      >
        <Container maxW="container.lg" py={4}>
          <Flex justify="space-between" align="center">
            <Link
              asChild
              fontWeight="bold"
              fontSize="lg"
              _hover={{ textDecoration: 'none', color: 'blue.500' }}
            >
              <LinkComponent to="/">{title}</LinkComponent>
            </Link>

            <HStack gap={6}>
              <HStack gap={4} display={{ base: 'none', md: 'flex' }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    asChild
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    fontSize="sm"
                  >
                    <LinkComponent to={link.href}>{link.label}</LinkComponent>
                  </Link>
                ))}
              </HStack>
              <Link
                href="https://github.com/ryanhefner/react-fathom"
                color="fg.muted"
                _hover={{ color: 'fg' }}
                fontSize="sm"
              >
                GitHub
              </Link>
              {showColorModeButton && <ColorModeButtonSimple />}
            </HStack>
          </Flex>
        </Container>
      </Box>

      {/* Main Content */}
      <Box as="main" flex={1} py={8}>
        <Container maxW="container.lg">{children}</Container>
      </Box>

      {/* Footer */}
      <Box borderTopWidth="1px" py={6}>
        <Container maxW="container.lg">
          <Flex
            justify="space-between"
            align="center"
            flexDir={{ base: 'column', md: 'row' }}
            gap={4}
          >
            <Text fontSize="sm" color="fg.muted">
              {frameworkName
                ? `${frameworkName} example demonstrating `
                : 'An example application demonstrating '}
              <Link
                href="https://github.com/ryanhefner/react-fathom"
                color="blue.500"
                _hover={{ textDecoration: 'underline' }}
              >
                react-fathom
              </Link>
            </Text>
            <HStack gap={4} fontSize="sm">
              <Link
                href="https://react-fathom.com/docs"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                Documentation
              </Link>
              <Link
                href="https://usefathom.com"
                color="fg.muted"
                _hover={{ color: 'fg' }}
              >
                Fathom Analytics
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </Box>
  )
}
