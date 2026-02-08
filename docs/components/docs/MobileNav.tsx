'use client'

import {
  Box,
  IconButton,
  Link,
  Text,
  VStack,
} from '@chakra-ui/react'
import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import type { NavItem } from '@/lib/docs'

interface MobileNavProps {
  nav: NavItem[]
}

export function MobileNav({ nav }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <Box display={{ base: 'block', lg: 'none' }}>
      <IconButton
        aria-label="Toggle navigation"
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? '✕' : '☰'}
      </IconButton>
      {isOpen && (
        <Box
          position="fixed"
          top="57px"
          left={0}
          right={0}
          bottom={0}
          bg="bg"
          zIndex={40}
          overflowY="auto"
          p={4}
        >
          <VStack align="stretch" gap={1}>
            {nav.map((item) => (
              <MobileNavItem
                key={item.href || item.title}
                item={item}
                pathname={pathname}
                onClose={() => setIsOpen(false)}
              />
            ))}
          </VStack>
        </Box>
      )}
    </Box>
  )
}

interface MobileNavItemProps {
  item: NavItem
  pathname: string
  onClose: () => void
  depth?: number
}

function MobileNavItem({ item, pathname, onClose, depth = 0 }: MobileNavItemProps) {
  const isActive = pathname === item.href
  const hasChildren = item.children && item.children.length > 0

  return (
    <Box>
      {item.href ? (
        <Link
          asChild
          display="block"
          py={2}
          px={3}
          pl={depth > 0 ? `${depth * 16 + 12}px` : 3}
          borderRadius="md"
          fontWeight={isActive ? 'semibold' : 'normal'}
          color={isActive ? 'fg' : 'fg.muted'}
          bg={isActive ? 'bg.muted' : 'transparent'}
          onClick={onClose}
        >
          <NextLink href={item.href}>{item.title}</NextLink>
        </Link>
      ) : (
        <Text
          py={2}
          px={3}
          pl={depth > 0 ? `${depth * 16 + 12}px` : 3}
          fontSize="sm"
          fontWeight="semibold"
          textTransform="uppercase"
          letterSpacing="wider"
          color="fg.muted"
          mt={depth === 0 ? 4 : 0}
        >
          {item.title}
        </Text>
      )}
      {hasChildren && (
        <VStack align="stretch" gap={0}>
          {item.children!.map((child) => (
            <MobileNavItem
              key={child.href || child.title}
              item={child}
              pathname={pathname}
              onClose={onClose}
              depth={depth + 1}
            />
          ))}
        </VStack>
      )}
    </Box>
  )
}
