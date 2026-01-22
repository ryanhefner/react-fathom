'use client'

import { Flex, Link, Text } from '@chakra-ui/react'
import NextLink from 'next/link'

interface BreadcrumbItem {
  title: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  if (items.length <= 1) return null

  return (
    <Flex
      as="nav"
      aria-label="Breadcrumb"
      mb={4}
      fontSize="sm"
      color="fg.muted"
      flexWrap="wrap"
      gap={1}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <Flex key={index} align="center" gap={1}>
            {index > 0 && <Text color="fg.subtle">/</Text>}
            {isLast || !item.href ? (
              <Text color={isLast ? 'fg' : 'fg.muted'}>{item.title}</Text>
            ) : (
              <Link
                asChild
                color="fg.muted"
                _hover={{ color: 'fg', textDecoration: 'underline' }}
              >
                <NextLink href={item.href}>{item.title}</NextLink>
              </Link>
            )}
          </Flex>
        )
      })}
    </Flex>
  )
}
