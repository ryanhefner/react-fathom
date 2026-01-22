'use client'

import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { useState } from 'react'

interface CodeBlockProps {
  children: string
  language?: string
  filename?: string
  highlightedHtml?: string
}

export function CodeBlock({ children, language, filename, highlightedHtml }: CodeBlockProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box my={4} borderRadius="lg" overflow="hidden" bg="gray.900">
      {(filename || language) && (
        <Flex
          px={4}
          py={2}
          bg="gray.800"
          justify="space-between"
          align="center"
          borderBottomWidth="1px"
          borderColor="gray.700"
        >
          <Text fontSize="sm" color="gray.400">
            {filename || language}
          </Text>
          <IconButton
            aria-label="Copy code"
            size="xs"
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white' }}
            onClick={handleCopy}
          >
            {copied ? '✓' : '📋'}
          </IconButton>
        </Flex>
      )}
      <Box position="relative">
        {!filename && !language && (
          <IconButton
            aria-label="Copy code"
            size="xs"
            variant="ghost"
            color="gray.400"
            _hover={{ color: 'white' }}
            position="absolute"
            top={2}
            right={2}
            onClick={handleCopy}
          >
            {copied ? '✓' : '📋'}
          </IconButton>
        )}
        {highlightedHtml ? (
          <Box
            p={4}
            fontSize="sm"
            lineHeight="tall"
            overflowX="auto"
            css={{
              '& pre': {
                margin: 0,
                background: 'transparent',
              },
              '& code': {
                background: 'transparent',
              },
            }}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <Box
            as="pre"
            p={4}
            fontSize="sm"
            lineHeight="tall"
            overflowX="auto"
            color="gray.100"
          >
            <code>{children}</code>
          </Box>
        )}
      </Box>
    </Box>
  )
}

// Simple pre wrapper for MDX
export function Pre({ children, ...props }: React.ComponentProps<'pre'>) {
  return (
    <Box
      as="pre"
      my={4}
      p={4}
      borderRadius="lg"
      bg="gray.900"
      color="gray.100"
      fontSize="sm"
      lineHeight="tall"
      overflowX="auto"
      {...props}
    >
      {children}
    </Box>
  )
}
