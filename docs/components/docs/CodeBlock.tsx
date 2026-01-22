'use client'

import { Box, Flex, IconButton } from '@chakra-ui/react'
import { useState, useRef, type ReactNode, type ComponentProps } from 'react'

// Pre component for rehype-pretty-code
export function Pre({ children, ...props }: ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = async () => {
    const text = preRef.current?.textContent || ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box position="relative">
      <IconButton
        aria-label="Copy code"
        size="xs"
        variant="ghost"
        color="gray.400"
        _hover={{ color: 'white', bg: 'whiteAlpha.200' }}
        position="absolute"
        top={2}
        right={2}
        zIndex={1}
        onClick={handleCopy}
      >
        {copied ? '✓' : '📋'}
      </IconButton>
      <Box
        as="pre"
        ref={preRef}
        p={4}
        fontSize="sm"
        lineHeight="tall"
        overflowX="auto"
        borderRadius="lg"
        css={{
          '& code': {
            display: 'block',
            background: 'transparent',
            padding: 0,
            fontSize: 'inherit',
            fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          },
          '& [data-line]': {
            paddingLeft: '1rem',
            paddingRight: '1rem',
            marginLeft: '-1rem',
            marginRight: '-1rem',
          },
          '& [data-highlighted-line]': {
            background: 'rgba(200, 200, 255, 0.1)',
          },
          '& [data-highlighted-chars]': {
            background: 'rgba(200, 200, 255, 0.2)',
            borderRadius: '0.25rem',
            padding: '0.125rem 0.25rem',
          },
          '& [data-line-numbers]': {
            counterReset: 'line',
          },
          '& [data-line-numbers] > [data-line]::before': {
            counterIncrement: 'line',
            content: 'counter(line)',
            display: 'inline-block',
            width: '1rem',
            marginRight: '1.5rem',
            textAlign: 'right',
            color: 'rgb(100, 100, 100)',
          },
        }}
        {...props}
      >
        {children}
      </Box>
    </Box>
  )
}

// Figure wrapper for code blocks with filename (from rehype-pretty-code)
export function Figure({ children, ...props }: ComponentProps<'figure'>) {
  const isCodeBlock = 'data-rehype-pretty-code-figure' in props

  if (!isCodeBlock) {
    return <figure {...props}>{children}</figure>
  }

  return (
    <Box
      as="figure"
      my={4}
      borderRadius="lg"
      overflow="hidden"
      bg="gray.900"
      _light={{ bg: 'gray.50' }}
      {...props}
    >
      {children}
    </Box>
  )
}

// Figcaption for filename
export function Figcaption({ children, ...props }: ComponentProps<'figcaption'>) {
  const isCodeTitle = 'data-rehype-pretty-code-title' in props

  if (!isCodeTitle) {
    return <figcaption {...props}>{children}</figcaption>
  }

  return (
    <Flex
      as="figcaption"
      px={4}
      py={2}
      bg="gray.800"
      _light={{ bg: 'gray.100' }}
      borderBottomWidth="1px"
      borderColor="gray.700"
      fontSize="sm"
      color="gray.400"
      _light={{ color: 'gray.600' }}
      fontFamily="mono"
      {...props}
    >
      {children}
    </Flex>
  )
}
