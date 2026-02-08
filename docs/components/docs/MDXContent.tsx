'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'
import { MDXComponents } from './MDXComponents'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export function MDXContent({ source }: MDXContentProps) {
  return <MDXRemote {...source} components={MDXComponents} />
}
