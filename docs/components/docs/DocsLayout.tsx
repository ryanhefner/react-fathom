'use client'

import { Box, Container, Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'
import type { NavItem, TOCItem, Frontmatter, AdjacentPages } from '@/lib/docs'

interface DocsLayoutProps {
  children: React.ReactNode
  nav: NavItem[]
  toc: TOCItem[]
  frontmatter: Frontmatter
  adjacentPages?: AdjacentPages
}

export function DocsLayout({
  children,
  nav,
  toc,
  frontmatter,
  adjacentPages,
}: DocsLayoutProps) {
  return (
    <Box minH="100vh">
      <Navbar nav={nav} />
      <Container maxW="container.xl">
        <Flex>
          <Sidebar nav={nav} />
          <Box
            as="main"
            flex={1}
            minW={0}
            py={8}
            px={{ base: 4, lg: 8 }}
          >
            <Box maxW="container.md">
              {frontmatter.title && (
                <Text as="h1" fontSize="4xl" fontWeight="bold" mb={2}>
                  {frontmatter.title}
                </Text>
              )}
              {frontmatter.description && (
                <Text fontSize="xl" color="fg.muted" mb={8}>
                  {frontmatter.description}
                </Text>
              )}
              <Box className="mdx-content">
                {children}
              </Box>
              {adjacentPages && (
                <Flex
                  mt={12}
                  pt={6}
                  borderTopWidth="1px"
                  justify="space-between"
                  gap={4}
                >
                  {adjacentPages.prev ? (
                    <Link asChild flex={1}>
                      <NextLink href={adjacentPages.prev.href}>
                        <Text fontSize="sm" color="fg.muted">Previous</Text>
                        <Text fontWeight="medium">{adjacentPages.prev.title}</Text>
                      </NextLink>
                    </Link>
                  ) : <Box flex={1} />}
                  {adjacentPages.next ? (
                    <Link asChild flex={1} textAlign="right">
                      <NextLink href={adjacentPages.next.href}>
                        <Text fontSize="sm" color="fg.muted">Next</Text>
                        <Text fontWeight="medium">{adjacentPages.next.title}</Text>
                      </NextLink>
                    </Link>
                  ) : <Box flex={1} />}
                </Flex>
              )}
              <Box as="footer" mt={12} pt={6} borderTopWidth="1px">
                <Text fontSize="sm" color="fg.muted">
                  MIT {new Date().getFullYear()} © Ryan Hefner
                </Text>
              </Box>
            </Box>
          </Box>
          <TableOfContents toc={toc} />
        </Flex>
      </Container>
    </Box>
  )
}
