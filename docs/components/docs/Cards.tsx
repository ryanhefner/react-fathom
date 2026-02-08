'use client'

import { Box, Grid, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'
import type { ReactNode } from 'react'

interface CardsProps {
  children: ReactNode
  cols?: number
}

export function Cards({ children, cols = 2 }: CardsProps) {
  return (
    <Grid
      my={4}
      templateColumns={{ base: '1fr', md: `repeat(${cols}, 1fr)` }}
      gap={4}
    >
      {children}
    </Grid>
  )
}

interface CardProps {
  title: string
  href: string
  children?: ReactNode
}

export function Card({ title, href, children }: CardProps) {
  const isExternal = href.startsWith('http')

  const content = (
    <Box
      p={4}
      borderWidth="1px"
      borderRadius="lg"
      _hover={{ borderColor: 'blue.500', shadow: 'sm' }}
      transition="all 0.2s"
    >
      <Text fontWeight="semibold" mb={1}>{title}</Text>
      {children && (
        <Text fontSize="sm" color="fg.muted">{children}</Text>
      )}
    </Box>
  )

  if (isExternal) {
    return (
      <Link href={href} _hover={{ textDecoration: 'none' }}>
        {content}
      </Link>
    )
  }

  return (
    <Link asChild _hover={{ textDecoration: 'none' }}>
      <NextLink href={href}>{content}</NextLink>
    </Link>
  )
}
