'use client'

import { Box, Container, Flex, HStack, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { TableOfContents } from './TableOfContents'
import type { NavItem, TOCItem, Frontmatter, AdjacentPages } from '@/lib/docs'

const GITHUB_REPO = 'https://github.com/ryanhefner/react-fathom'
const DOCS_PATH = 'docs/content'

interface DocsLayoutProps {
  children: React.ReactNode
  nav: NavItem[]
  toc: TOCItem[]
  frontmatter: Frontmatter
  adjacentPages?: AdjacentPages
  slug?: string[]
}

function getEditUrl(slug: string[]): string {
  const filePath = slug.length === 0 ? 'index' : slug.join('/')
  return `${GITHUB_REPO}/edit/main/${DOCS_PATH}/${filePath}.mdx`
}

export function DocsLayout({
  children,
  nav,
  toc,
  frontmatter,
  adjacentPages,
  slug = [],
}: DocsLayoutProps) {
  const editUrl = getEditUrl(slug)

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
              <Box className="mdx-content" data-pagefind-body>
                {children}
              </Box>
              <HStack mt={8} pt={4} borderTopWidth="1px" justify="flex-end">
                <Link
                  href={editUrl}
                  fontSize="sm"
                  color="fg.muted"
                  _hover={{ color: 'fg' }}
                >
                  Edit this page on GitHub →
                </Link>
              </HStack>
              {adjacentPages && (
                <Flex
                  mt={8}
                  pt={6}
                  borderTopWidth="1px"
                  justify="space-between"
                  gap={4}
                >
                  {adjacentPages.prev ? (
                    <Link asChild flex={1} _hover={{ textDecoration: 'none' }}>
                      <NextLink href={adjacentPages.prev.href}>
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderRadius="lg"
                          _hover={{ borderColor: 'blue.500' }}
                        >
                          <Text fontSize="sm" color="fg.muted">← Previous</Text>
                          <Text fontWeight="medium">{adjacentPages.prev.title}</Text>
                        </Box>
                      </NextLink>
                    </Link>
                  ) : <Box flex={1} />}
                  {adjacentPages.next ? (
                    <Link asChild flex={1} _hover={{ textDecoration: 'none' }}>
                      <NextLink href={adjacentPages.next.href}>
                        <Box
                          p={4}
                          borderWidth="1px"
                          borderRadius="lg"
                          textAlign="right"
                          _hover={{ borderColor: 'blue.500' }}
                        >
                          <Text fontSize="sm" color="fg.muted">Next →</Text>
                          <Text fontWeight="medium">{adjacentPages.next.title}</Text>
                        </Box>
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
