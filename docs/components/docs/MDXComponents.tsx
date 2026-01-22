'use client'

import {
  Box,
  Code,
  Heading,
  Link,
  ListItem,
  OrderedList,
  Table,
  Text,
  UnorderedList,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import type { MDXComponents as MDXComponentsType } from 'mdx/types'
import { Callout } from './Callout'
import { Pre, Figure, Figcaption } from './CodeBlock'
import { Steps } from './Steps'
import { Tabs, Tab } from './Tabs'
import { Cards, Card } from './Cards'
import { PackageInstall, NpmToYarn } from './PackageInstall'

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export const MDXComponents: MDXComponentsType = {
  h1: (props) => (
    <Heading as="h1" size="2xl" mt={8} mb={4} {...props} />
  ),
  h2: (props) => {
    const id = props.children ? slugify(String(props.children)) : undefined
    return (
      <Heading
        as="h2"
        size="xl"
        mt={10}
        mb={4}
        pb={2}
        borderBottomWidth="1px"
        id={id}
        css={{
          '&:hover a': { opacity: 1 },
          scrollMarginTop: '80px',
        }}
        {...props}
      >
        {props.children}
        {id && (
          <Link
            href={`#${id}`}
            ml={2}
            opacity={0}
            color="fg.muted"
            _hover={{ color: 'fg' }}
          >
            #
          </Link>
        )}
      </Heading>
    )
  },
  h3: (props) => {
    const id = props.children ? slugify(String(props.children)) : undefined
    return (
      <Heading
        as="h3"
        size="lg"
        mt={8}
        mb={3}
        id={id}
        css={{
          '&:hover a': { opacity: 1 },
          scrollMarginTop: '80px',
        }}
        {...props}
      >
        {props.children}
        {id && (
          <Link
            href={`#${id}`}
            ml={2}
            opacity={0}
            color="fg.muted"
            _hover={{ color: 'fg' }}
          >
            #
          </Link>
        )}
      </Heading>
    )
  },
  h4: (props) => (
    <Heading as="h4" size="md" mt={6} mb={2} {...props} />
  ),
  p: (props) => (
    <Text my={4} lineHeight="tall" {...props} />
  ),
  a: ({ href, ...props }) => {
    const isExternal = href?.startsWith('http')
    if (isExternal) {
      return (
        <Link
          href={href}
          color="blue.500"
          _hover={{ textDecoration: 'underline' }}
          {...props}
        />
      )
    }
    return (
      <Link
        asChild
        color="blue.500"
        _hover={{ textDecoration: 'underline' }}
      >
        <NextLink href={href || '#'} {...props} />
      </Link>
    )
  },
  ul: (props) => (
    <UnorderedList my={4} pl={4} spaceY={2} {...props} />
  ),
  ol: (props) => (
    <OrderedList my={4} pl={4} spaceY={2} {...props} />
  ),
  li: (props) => (
    <ListItem {...props} />
  ),
  code: ({ children, className, ...props }) => {
    // If it has data-theme, it's from rehype-pretty-code - pass through
    if ('data-theme' in props || 'data-language' in props) {
      return <code className={className} {...props}>{children}</code>
    }
    // If it's inline code (no className), render as inline
    if (!className) {
      return (
        <Code
          px={1.5}
          py={0.5}
          borderRadius="md"
          fontSize="0.9em"
          {...props}
        >
          {children}
        </Code>
      )
    }
    // Block code without highlighting
    return <code className={className} {...props}>{children}</code>
  },
  pre: Pre,
  figure: Figure,
  figcaption: Figcaption,
  table: (props) => (
    <Box my={4} overflowX="auto">
      <Table.Root size="sm" {...props} />
    </Box>
  ),
  thead: Table.Header,
  tbody: Table.Body,
  tr: Table.Row,
  th: (props) => (
    <Table.ColumnHeader
      fontWeight="semibold"
      textAlign="left"
      {...props}
    />
  ),
  td: Table.Cell,
  blockquote: (props) => (
    <Box
      as="blockquote"
      my={4}
      pl={4}
      borderLeftWidth="4px"
      borderLeftColor="gray.300"
      color="fg.muted"
      fontStyle="italic"
      {...props}
    />
  ),
  hr: () => <Box as="hr" my={8} borderTopWidth="1px" />,
  // Custom components
  Callout,
  Steps,
  Tabs,
  Tab,
  Cards,
  Card,
  PackageInstall,
  NpmToYarn,
}
