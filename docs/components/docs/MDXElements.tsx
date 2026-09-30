'use client'

import type { ComponentProps, ElementType, HTMLAttributes } from 'react'

import { DocsHeadingPermalink } from '@chakra-docs/chakra'
import { chakraDocsRecipeKeys } from '@chakra-docs/chakra/theme'
import { isSafeLinkHref } from '@chakra-docs/core'
import { Box, Code, Heading, useSlotRecipe } from '@chakra-ui/react'

import { SiteLink } from './SiteLink'

export function MarkdownElement({
  as,
  slot,
  ...props
}: HTMLAttributes<HTMLElement> & { as: ElementType; slot: string }) {
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const styles = recipe()
  return <Box as={as} css={styles[slot]} {...props} />
}

export function MarkdownHeading({
  as,
  children,
  id,
  ...props
}: ComponentProps<'h2'> & { as: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' }) {
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const section = as === 'h1' || as === 'h2'
  const styles = recipe({ headingLevel: section ? 'section' : 'subsection' })

  return (
    <Heading
      as={as}
      css={styles.heading}
      id={id}
      size={section ? '2xl' : 'xl'}
      scrollMarginTop="6rem"
      {...props}
    >
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
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const styles = recipe()
  return isSafeLinkHref(href) ? (
    <SiteLink href={href} css={styles.link} {...props}>
      {children}
    </SiteLink>
  ) : (
    <span>{children}</span>
  )
}

export function MarkdownCode({
  className,
  children,
  ...props
}: ComponentProps<'code'>) {
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const styles = recipe()
  return className ? (
    <code className={className} {...props}>
      {children}
    </code>
  ) : (
    <Code variant="subtle" css={styles.inlineCode} {...props}>
      {children}
    </Code>
  )
}

export function MarkdownTable({ children, ...props }: ComponentProps<'table'>) {
  const recipe = useSlotRecipe({ key: chakraDocsRecipeKeys.markdownContent })
  const styles = recipe()
  return (
    <Box
      role="region"
      tabIndex={0}
      aria-label="Markdown table"
      css={styles.tableContainer}
    >
      <Box
        as="table"
        data-chakra-docs-table-scroll="external"
        css={styles.table}
        {...props}
      >
        {children}
      </Box>
    </Box>
  )
}
