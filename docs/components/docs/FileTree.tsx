'use client'

import type { ReactNode } from 'react'

import { LuChevronRight } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import { Box, Collapsible, Flex, Text, useSlotRecipe } from '@chakra-ui/react'

interface FileTreeProps {
  children: ReactNode
}

export function FileTree({ children }: FileTreeProps) {
  const styles = useSlotRecipe({ key: 'siteFileTree' })()
  return <Box css={styles.root}>{children}</Box>
}

interface FolderProps {
  name: string
  children?: ReactNode
  defaultOpen?: boolean
}

export function Folder({ name, children, defaultOpen = true }: FolderProps) {
  const styles = useSlotRecipe({ key: 'siteFileTree' })()
  const { trackEvent } = useFathom()
  const hasChildren = Boolean(children)

  if (!hasChildren) {
    return (
      <Flex css={styles.folder} cursor="default" _hover={{ color: 'inherit' }}>
        <Box aria-hidden="true" boxSize={3} flexShrink={0} />
        <Text as="span" aria-hidden="true">
          📁
        </Text>
        <Text as="span">{name}</Text>
      </Flex>
    )
  }

  return (
    <Collapsible.Root
      defaultOpen={defaultOpen}
      lazyMount
      unmountOnExit
      onOpenChange={({ open }) =>
        trackEvent(`docs-file-tree-${open ? 'expand' : 'collapse'}`)
      }
    >
      <Collapsible.Trigger css={styles.folder}>
        <Collapsible.Indicator aria-hidden="true" css={styles.indicator}>
          <LuChevronRight />
        </Collapsible.Indicator>
        <Text as="span" aria-hidden="true">
          📁
        </Text>
        <Text as="span">{name}</Text>
      </Collapsible.Trigger>
      <Collapsible.Content css={styles.content}>{children}</Collapsible.Content>
    </Collapsible.Root>
  )
}

interface FileProps {
  name: string
  highlight?: boolean
  added?: boolean
  removed?: boolean
}

export function File({ name, highlight, added, removed }: FileProps) {
  const styles = useSlotRecipe({ key: 'siteFileTree' })()
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
  if (highlight) color = 'site.link'
  if (added) color = 'fg.success'
  if (removed) color = 'fg.error'

  return (
    <Flex css={styles.file} color={color}>
      <Box aria-hidden="true" boxSize={3} flexShrink={0} />
      <Text aria-hidden="true">{getIcon(name)}</Text>
      <Text textDecoration={removed ? 'line-through' : undefined}>
        {name}
        {added && (
          <Text as="span" color="fg.success" ml={1}>
            +
          </Text>
        )}
        {removed && (
          <Text as="span" color="fg.error" ml={1}>
            -
          </Text>
        )}
      </Text>
    </Flex>
  )
}
