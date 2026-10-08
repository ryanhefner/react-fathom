'use client'

import type { ComponentProps } from 'react'

import { DocsHeadingPermalink } from '@chakra-docs/chakra'
import { isSafeLinkHref } from '@chakra-docs/core'
import { NextLink } from '@chakra-docs/next/link'
import { createPostkitMdxComponents } from '@postkit/react'

function PostkitNextLink(props: ComponentProps<'a'> & { href: string }) {
  return <NextLink {...props} />
}

export const postkitComponents = createPostkitMdxComponents({
  link: {
    adapter: {
      component: PostkitNextLink,
      mapProps: (props) => props,
    },
  },
})

export function MarkdownHeading({
  as,
  children,
  id,
  ...props
}: ComponentProps<'h2'> & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  const Heading = postkitComponents[as]

  return (
    <Heading id={id} scrollMarginTop="docsScrollMargin" {...props}>
      {children}
      {id ? <DocsHeadingPermalink headingId={id} /> : null}
    </Heading>
  )
}

export function MarkdownLink({
  href = '',
  children,
  ...props
}: ComponentProps<'a'>) {
  const Link = postkitComponents.a
  return isSafeLinkHref(href) ? (
    <Link href={href} {...props}>
      {children}
    </Link>
  ) : (
    <span>{children}</span>
  )
}

export function MarkdownTable(props: ComponentProps<'table'>) {
  const Table = postkitComponents.table
  return (
    <Table
      {...props}
      aria-label={props['aria-label'] ?? 'Documentation table'}
      tabIndex={props.tabIndex ?? 0}
    />
  )
}
