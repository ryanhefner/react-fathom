'use client'

import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react'
import type { ComponentType, ReactNode } from 'react'
import { ColorModeButton } from './ColorModeButton'
import { EventStreamPanel } from './EventStreamPanel'

export interface NavLink {
  href: string
  label: string
}

export interface ExampleLayoutProps {
  children: ReactNode
  /**
   * The Link component to use for navigation.
   * Pass Next.js Link or React Router Link component.
   */
  linkComponent: ComponentType<{ href: string; children: ReactNode; className?: string }>
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
   * Show the debug EventStream panel.
   * @default true
   */
  showEventStream?: boolean
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
 * Shared layout component for example sites.
 * Minimal, content-focused design.
 */
export function ExampleLayout({
  children,
  linkComponent: LinkComponent,
  navLinks = defaultNavLinks,
  title = 'react-fathom',
  showColorModeButton = true,
  showEventStream = true,
  frameworkName,
}: ExampleLayoutProps) {
  return (
    <>
      <Box minH="100vh" display="flex" flexDirection="column">
        {/* Header */}
        <Box as="header" pt={{ base: 6, md: 8 }} pb={{ base: 4, md: 6 }}>
          <Container maxW="640px" px={{ base: 5, md: 6 }}>
            <Flex justify="space-between" align="center">
              <HStack gap={{ base: 3, md: 4 }}>
                <Link
                  asChild
                  fontWeight="medium"
                  fontSize="sm"
                  _hover={{ textDecoration: 'none', opacity: 0.7 }}
                >
                  <LinkComponent href="/">{title}</LinkComponent>
                </Link>
                {frameworkName && (
                  <Text fontSize="sm" color="fg.muted">
                    — {frameworkName}
                  </Text>
                )}
              </HStack>

              <HStack gap={{ base: 4, md: 5 }}>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    asChild
                    color="fg.muted"
                    _hover={{ color: 'fg' }}
                    fontSize="sm"
                    display={{ base: link.href === '/' ? 'none' : 'block', md: 'block' }}
                  >
                    <LinkComponent href={link.href}>{link.label}</LinkComponent>
                  </Link>
                ))}
                {showColorModeButton && <ColorModeButton />}
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Box as="main" flex={1} py={{ base: 8, md: 12 }}>
          <Container maxW="640px" px={{ base: 5, md: 6 }}>
            {children}
          </Container>
        </Box>

        {/* Footer */}
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
      {showEventStream && <EventStreamPanel />}
    </>
  )
}
