'use client'

import { MDXRemote, type MDXRemoteSerializeResult } from 'next-mdx-remote'

import { MDXComponents } from './MDXComponents'
import { MDXDocument } from './MDXDocument'

interface MDXContentProps {
  source: MDXRemoteSerializeResult
}

export function MDXContent({ source }: MDXContentProps) {
  return (
    <MDXDocument>
      <MDXRemote {...source} components={MDXComponents} />
    </MDXDocument>
  )
}
