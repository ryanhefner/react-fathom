'use client'

import { Box, Flex, Text } from '@chakra-ui/react'
import type { ReactNode } from 'react'

interface CalloutProps {
  type?: 'info' | 'warning' | 'error' | 'tip'
  title?: string
  children: ReactNode
}

const calloutStyles = {
  info: {
    bg: 'blue.50',
    borderColor: 'blue.500',
    icon: 'ℹ️',
    _dark: { bg: 'blue.950' },
  },
  warning: {
    bg: 'yellow.50',
    borderColor: 'yellow.500',
    icon: '⚠️',
    _dark: { bg: 'yellow.950' },
  },
  error: {
    bg: 'red.50',
    borderColor: 'red.500',
    icon: '🚫',
    _dark: { bg: 'red.950' },
  },
  tip: {
    bg: 'green.50',
    borderColor: 'green.500',
    icon: '💡',
    _dark: { bg: 'green.950' },
  },
}

export function Callout({ type = 'info', title, children }: CalloutProps) {
  const styles = calloutStyles[type]

  return (
    <Box
      my={4}
      p={4}
      borderLeftWidth="4px"
      borderLeftColor={styles.borderColor}
      bg={styles.bg}
      borderRadius="md"
      _dark={styles._dark}
    >
      <Flex gap={3}>
        <Text fontSize="lg" flexShrink={0}>{styles.icon}</Text>
        <Box>
          {title && (
            <Text fontWeight="semibold" mb={1}>{title}</Text>
          )}
          <Box fontSize="sm" css={{ '& p': { margin: 0 } }}>
            {children}
          </Box>
        </Box>
      </Flex>
    </Box>
  )
}
