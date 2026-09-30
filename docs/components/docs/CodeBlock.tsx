'use client'

import {
  Children,
  isValidElement,
  type ComponentProps,
  type ReactNode,
} from 'react'

import { CodeBlock } from '@chakra-docs/chakra'

function codeText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number')
        return String(child)
      return isValidElement<{ children?: ReactNode }>(child)
        ? codeText(child.props.children)
        : ''
    })
    .join('')
}

// Translate the MDX compiler's <pre><code> output into the native component.
export function Pre({ children }: ComponentProps<'pre'>) {
  const code = Children.toArray(children).find(isValidElement)
  const className = isValidElement<{ className?: string }>(code)
    ? code.props.className
    : undefined
  const language = className
    ?.split(/\s+/)
    .find((value) => value.startsWith('language-'))
    ?.slice(9)

  return (
    <CodeBlock
      code={codeText(children).replace(/\n$/, '')}
      language={language}
    />
  )
}
