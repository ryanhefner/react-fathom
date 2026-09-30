'use client'

import type { ReactNode } from 'react'

import {
  DocsArticle,
  DocsBreadcrumbs,
  DocsLayout as ChakraDocsLayout,
  DocsPageActions,
  DocsPagination,
} from '@chakra-docs/chakra'
import type { DocsNavItem, DocsPage, DocsSearchRecord } from '@chakra-docs/core'
import { Box, Flex, Text } from '@chakra-ui/react'

import { DocsSiteSearch } from './DocsSiteSearch'
import { Navbar } from './Navbar'

const GITHUB_REPO = 'https://github.com/ryanhefner/react-fathom'
const DOCS_PATH = 'docs/content'

interface DocsLayoutProps {
  children: ReactNode
  lastUpdated?: string | null
  nav: DocsNavItem[]
  page: DocsPage
  searchRecords: readonly DocsSearchRecord[]
}

function getEditUrl(page: DocsPage): string {
  const filePath = page.slug.length === 0 ? 'index' : page.slug.join('/')
  return `${GITHUB_REPO}/edit/main/${DOCS_PATH}/${filePath}.mdx`
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function DocsLayout({
  children,
  lastUpdated,
  nav,
  page,
  searchRecords,
}: DocsLayoutProps) {
  const editUrl = getEditUrl(page)

  return (
    <Box minH="100vh">
      <Navbar searchRecords={searchRecords} />
      <ChakraDocsLayout
        headings={page.headings}
        mobileNavigationProps={{
          search: <DocsSiteSearch records={searchRecords} />,
          title: 'Browse documentation',
        }}
        nav={nav}
        page={page}
        sidebarCollapsible
        sidebarDefaultExpanded="active"
      >
        <DocsArticle
          actions={
            <DocsPageActions.Root
              editUrl={editUrl}
              page={page}
              variant="split"
            />
          }
          breadcrumbs={
            <DocsBreadcrumbs
              homeHref="/"
              homeLabel="Home"
              nav={nav}
              page={page}
            />
          }
          headings={page.headings}
          page={page}
        >
          <Box className="mdx-content">{children}</Box>
          {lastUpdated ? (
            <Flex
              align="center"
              borderTopWidth="1px"
              justify="space-between"
              mt={8}
              pt={4}
            >
              <Text color="fg.muted" fontSize="sm">
                Last updated: {formatDate(lastUpdated)}
              </Text>
            </Flex>
          ) : null}
          <DocsPagination nav={nav} page={page} />
          <Box as="footer" borderTopWidth="1px" mt={12} pt={6}>
            <Text color="fg.muted" fontSize="sm">
              MIT {new Date().getFullYear()} © Ryan Hefner
            </Text>
          </Box>
        </DocsArticle>
      </ChakraDocsLayout>
    </Box>
  )
}
