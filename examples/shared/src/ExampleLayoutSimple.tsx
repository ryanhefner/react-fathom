'use client'

import type { ComponentType, ReactNode } from 'react'

import {
  Box,
  Container,
  Flex,
  HStack,
  Link,
  Text,
  useSlotRecipe,
} from '@chakra-ui/react'

import { ColorModeButtonSimple } from './ColorModeButtonSimple'
import { EventStreamPanel } from './EventStreamPanel'

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
  linkComponent: ComponentType<{
    to: string
    children: ReactNode
    className?: string
  }>
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
 * Shared layout component for example sites using React Router.
 * Minimal, content-focused design.
 */
export function ExampleLayoutSimple({
  children,
  linkComponent: LinkComponent,
  navLinks = defaultNavLinks,
  title = 'react-fathom',
  showColorModeButton = true,
  showEventStream = true,
  frameworkName,
}: ExampleLayoutSimpleProps) {
  const styles = useSlotRecipe({ key: 'exampleLayout' })()
  return (
    <>
      <Box css={styles.shell}>
        {/* Header */}
        <Box as="header" css={styles.header}>
          <Container css={styles.container}>
            <Flex justify="space-between" align="center">
              <HStack gap={{ base: 3, md: 4 }}>
                <Link asChild css={styles.brand}>
                  <LinkComponent to="/">{title}</LinkComponent>
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
                    css={styles.navLink}
                    display={{
                      base: link.href === '/' ? 'none' : 'block',
                      md: 'block',
                    }}
                  >
                    <LinkComponent to={link.href}>{link.label}</LinkComponent>
                  </Link>
                ))}
                {showColorModeButton && <ColorModeButtonSimple />}
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Box as="main" css={styles.main}>
          <Container css={styles.container}>{children}</Container>
        </Box>

        {/* Footer */}
        <Box as="footer" css={styles.footer}>
          <Container css={styles.container}>
            <Flex css={styles.footerContent}>
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
                  href="https://react-fathom.dev/docs"
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
