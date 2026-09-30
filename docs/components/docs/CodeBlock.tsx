'use client'

import { useRef, useState, type ComponentProps } from 'react'

import { LuCheck, LuCopy } from 'react-icons/lu'

import { useFathom } from '@/lib/fathom'
import { Box, chakra, IconButton } from '@chakra-ui/react'

// Pre component for rehype-pretty-code
export function Pre({ children, ...props }: ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const { trackEvent } = useFathom()

  const handleCopy = async () => {
    const text = preRef.current?.textContent || ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    trackEvent('code-copy')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Box position="relative">
      <IconButton
        aria-label={copied ? 'Code copied' : 'Copy code'}
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
        {copied ? <LuCheck /> : <LuCopy />}
      </IconButton>
      <chakra.pre
        ref={preRef}
        bg="black"
        borderRadius="lg"
        color="gray.100"
        fontSize="sm"
        lineHeight="1.625"
        overflowX="auto"
        p={4}
        css={{
          '& code': {
            bg: 'transparent',
            display: 'block',
            fontFamily: 'mono',
            fontSize: 'inherit',
            p: 0,
          },
          '& [data-line]': {
            mx: -4,
            px: 4,
          },
          '& [data-highlighted-line]': {
            bg: 'whiteAlpha.100',
          },
          '& [data-highlighted-chars]': {
            bg: 'whiteAlpha.200',
            borderRadius: 'sm',
            px: 1,
            py: 0.5,
          },
          '& [data-line-numbers]': {
            counterReset: 'line',
          },
          '& [data-line-numbers] > [data-line]::before': {
            color: 'gray.500',
            content: 'counter(line)',
            counterIncrement: 'line',
            display: 'inline-block',
            mr: 6,
            textAlign: 'right',
            w: 4,
          },
        }}
        {...props}
      >
        {children}
      </chakra.pre>
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
    <chakra.figure
      bg="black"
      borderRadius="lg"
      my={4}
      overflow="hidden"
      {...props}
    >
      {children}
    </chakra.figure>
  )
}

// Figcaption for filename
export function Figcaption({
  children,
  ...props
}: ComponentProps<'figcaption'>) {
  const isCodeTitle = 'data-rehype-pretty-code-title' in props

  if (!isCodeTitle) {
    return <figcaption {...props}>{children}</figcaption>
  }

  return (
    <chakra.figcaption
      bg="gray.950"
      borderBottomColor="gray.800"
      borderBottomWidth="1px"
      color="gray.400"
      display="flex"
      fontFamily="mono"
      fontSize="sm"
      px={4}
      py={2}
      {...props}
    >
      {children}
    </chakra.figcaption>
  )
}
