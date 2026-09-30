'use client'

import { useState, type ReactNode } from 'react'

import { LuChevronDown, LuChevronRight } from 'react-icons/lu'

import { Box, chakra, Flex, Text } from '@chakra-ui/react'

interface FileTreeProps {
  children: ReactNode
}

export function FileTree({ children }: FileTreeProps) {
  return (
    <Box
      my={4}
      p={4}
      borderRadius="lg"
      bg="gray.900"
      _light={{ bg: 'gray.50' }}
      fontFamily="mono"
      fontSize="sm"
    >
      {children}
    </Box>
  )
}

interface FolderProps {
  name: string
  children?: ReactNode
  defaultOpen?: boolean
}

export function Folder({ name, children, defaultOpen = true }: FolderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const hasChildren = Boolean(children)

  return (
    <Box>
      <chakra.button
        alignItems="center"
        display="flex"
        gap={2}
        py={0.5}
        disabled={!hasChildren}
        type="button"
        width="full"
        textAlign="left"
        cursor={hasChildren ? 'pointer' : 'default'}
        _hover={hasChildren ? { color: 'blue.400' } : undefined}
        aria-expanded={hasChildren ? isOpen : undefined}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        <Box aria-hidden="true" color="fg.muted" fontSize="xs" width="12px">
          {hasChildren ? isOpen ? <LuChevronDown /> : <LuChevronRight /> : null}
        </Box>
        <Text>📁</Text>
        <Text>{name}</Text>
      </chakra.button>
      {isOpen && children && (
        <Box
          pl={6}
          borderLeftWidth="1px"
          borderColor="gray.700"
          _light={{ borderColor: 'gray.200' }}
          ml={1.5}
        >
          {children}
        </Box>
      )}
    </Box>
  )
}

interface FileProps {
  name: string
  highlight?: boolean
  added?: boolean
  removed?: boolean
}

export function File({ name, highlight, added, removed }: FileProps) {
  // Determine file icon based on extension
  const getIcon = (filename: string) => {
    const ext = filename.split('.').pop()?.toLowerCase()
    switch (ext) {
      case 'ts':
      case 'tsx':
        return '📘'
      case 'js':
      case 'jsx':
        return '📒'
      case 'json':
        return '📋'
      case 'md':
      case 'mdx':
        return '📝'
      case 'css':
      case 'scss':
        return '🎨'
      case 'html':
        return '🌐'
      case 'svg':
      case 'png':
      case 'jpg':
      case 'gif':
        return '🖼️'
      case 'env':
        return '🔐'
      case 'gitignore':
        return '🚫'
      default:
        return '📄'
    }
  }

  let color = 'inherit'
  if (highlight) color = 'blue.400'
  if (added) color = 'green.400'
  if (removed) color = 'red.400'

  return (
    <Flex align="center" gap={2} py={0.5} color={color}>
      <Text fontSize="xs" width="12px" />
      <Text>{getIcon(name)}</Text>
      <Text textDecoration={removed ? 'line-through' : undefined}>
        {name}
        {added && (
          <Text as="span" color="green.400" ml={1}>
            +
          </Text>
        )}
        {removed && (
          <Text as="span" color="red.400" ml={1}>
            -
          </Text>
        )}
      </Text>
    </Flex>
  )
}
