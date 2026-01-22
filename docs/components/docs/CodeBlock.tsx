'use client'

import { Box, IconButton } from '@chakra-ui/react'
import { useState, useRef, type ReactNode, type ComponentProps } from 'react'
import { useFathom } from 'react-fathom'

// Pre component for rehype-pretty-code
export function Pre({ children, ...props }: ComponentProps<'pre'>) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)
  const { trackEvent } = useFathom()

  const handleCopy = async () => {
    const text = preRef.current?.textContent || ''
    await navigator.clipboard.writeText(text)
    setCopied(true)
    trackEvent?.('code-copy')
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
      <pre
        ref={preRef}
        style={{
          padding: '1rem',
          fontSize: '0.875rem',
          lineHeight: '1.625',
          overflowX: 'auto',
          borderRadius: '0.5rem',
        }}
        {...props}
      >
        <style>{`
          pre code {
            display: block;
            background: transparent;
            padding: 0;
            font-size: inherit;
            font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
          }
          pre [data-line] {
            padding-left: 1rem;
            padding-right: 1rem;
            margin-left: -1rem;
            margin-right: -1rem;
          }
          pre [data-highlighted-line] {
            background: rgba(200, 200, 255, 0.1);
          }
          pre [data-highlighted-chars] {
            background: rgba(200, 200, 255, 0.2);
            border-radius: 0.25rem;
            padding: 0.125rem 0.25rem;
          }
          pre [data-line-numbers] {
            counter-reset: line;
          }
          pre [data-line-numbers] > [data-line]::before {
            counter-increment: line;
            content: counter(line);
            display: inline-block;
            width: 1rem;
            margin-right: 1.5rem;
            text-align: right;
            color: rgb(100, 100, 100);
          }
        `}</style>
        {children}
      </pre>
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
    <figure
      style={{
        margin: '1rem 0',
        borderRadius: '0.5rem',
        overflow: 'hidden',
      }}
      className="code-figure"
      {...props}
    >
      <style>{`
        .code-figure {
          background: var(--chakra-colors-gray-900);
        }
        [data-theme="light"] .code-figure {
          background: var(--chakra-colors-gray-50);
        }
      `}</style>
      {children}
    </figure>
  )
}

// Figcaption for filename
export function Figcaption({ children, ...props }: ComponentProps<'figcaption'>) {
  const isCodeTitle = 'data-rehype-pretty-code-title' in props

  if (!isCodeTitle) {
    return <figcaption {...props}>{children}</figcaption>
  }

  return (
    <figcaption
      style={{
        display: 'flex',
        padding: '0.5rem 1rem',
        borderBottom: '1px solid var(--chakra-colors-gray-700)',
        fontSize: '0.875rem',
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
      }}
      className="code-title"
      {...props}
    >
      <style>{`
        .code-title {
          background: var(--chakra-colors-gray-800);
          color: var(--chakra-colors-gray-400);
        }
        [data-theme="light"] .code-title {
          background: var(--chakra-colors-gray-100);
          color: var(--chakra-colors-gray-600);
        }
      `}</style>
      {children}
    </figcaption>
  )
}
