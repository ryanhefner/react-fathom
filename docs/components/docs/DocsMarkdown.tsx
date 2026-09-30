import { compileMDX } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'

import { MarkdownContent } from '@chakra-docs/chakra'
import { getDocsMarkdownHeadings } from '@chakra-docs/core'

import { getMDXComponents } from './MDXComponents'
import { MDXDocument } from './MDXDocument'

interface ContentNode {
  type: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: ContentNode[]
  position?: { start: { offset?: number } }
}

function walk(node: ContentNode, visit: (node: ContentNode) => void) {
  visit(node)
  node.children?.forEach((child) => walk(child, visit))
}

export async function DocsMarkdown({ source }: { source: string }) {
  let hasMdx = false
  const headings = getDocsMarkdownHeadings(source)
  const { content } = await compileMDX({
    source,
    components: getMDXComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [
          remarkGfm,
          () => (tree: ContentNode) => {
            walk(tree, (node) => {
              if (node.type.startsWith('mdx')) hasMdx = true
            })
          },
        ],
        rehypePlugins: [
          () => (tree: ContentNode) => {
            walk(tree, (node) => {
              if (!/^h[1-6]$/.test(node.tagName ?? '')) return
              const heading = headings.find(
                (entry) => entry.start === node.position?.start.offset,
              )
              if (heading) {
                node.properties = { ...node.properties, id: heading.id }
              }
            })
          },
        ],
      },
    },
  })

  // MDX needs the host compiler for JSX. Ordinary Markdown uses the full native
  // renderer, including GFM tables, code blocks, safe links and heading IDs.
  return hasMdx ? (
    <MDXDocument>{content}</MDXDocument>
  ) : (
    <MarkdownContent source={source} headingPermalinks />
  )
}
