'use client'

import { Box, Link, Text, VStack } from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/lib/docs'

interface SidebarProps {
  nav: NavItem[]
}

export function Sidebar({ nav }: SidebarProps) {
  const pathname = usePathname()

  return (
    <Box
      as="aside"
      position="sticky"
      top="73px"
      height="calc(100vh - 73px)"
      overflowY="auto"
      py={8}
      pr={4}
      display={{ base: 'none', lg: 'block' }}
      width="240px"
      flexShrink={0}
    >
      <VStack align="stretch" gap={1}>
        {nav.map((item) => (
          <SidebarItem key={item.href} item={item} pathname={pathname} />
        ))}
      </VStack>
    </Box>
  )
}

interface SidebarItemProps {
  item: NavItem
  pathname: string
  depth?: number
}

function SidebarItem({ item, pathname, depth = 0 }: SidebarItemProps) {
  const isActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0

  return (
    <Box>
      {item.href ? (
        <Link
          asChild
          display="block"
          py={1.5}
          px={3}
          pl={depth > 0 ? `${depth * 12 + 12}px` : 3}
          borderRadius="md"
          fontSize="sm"
          fontWeight={isActive ? 'semibold' : 'normal'}
          color={isActive ? 'fg' : 'fg.muted'}
          bg={isActive ? 'bg.muted' : 'transparent'}
          _hover={{ bg: 'bg.muted', color: 'fg' }}
        >
          <NextLink href={item.href}>{item.title}</NextLink>
        </Link>
      ) : (
        <Text
          py={1.5}
          px={3}
          pl={depth > 0 ? `${depth * 12 + 12}px` : 3}
          fontSize="xs"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wider"
          color="fg.muted"
          mt={depth === 0 ? 4 : 0}
          _first={{ mt: 0 }}
        >
          {item.title}
        </Text>
      )}
      {hasChildren && (
        <VStack align="stretch" gap={0.5}>
          {item.children!.map((child) => (
            <SidebarItem
              key={child.href || child.title}
              item={child}
              pathname={pathname}
              depth={depth + 1}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}
