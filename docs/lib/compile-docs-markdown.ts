import { serialize } from 'next-mdx-remote/serialize'

import { getDocsMarkdownHeadings } from '@chakra-docs/core'
import { createPostkitRemarkPlugins } from '@postkit/react/remark'

interface ContentNode {
  type?: string
  name?: string
  tagName?: string
  properties?: Record<string, unknown>
  children?: ContentNode[]
  position?: { start: { offset?: number } }
}

function walk(node: ContentNode, visit: (node: ContentNode) => void) {
  visit(node)
  node.children?.forEach((child) => walk(child, visit))
}

export function compileDocsMarkdown(source: string) {
  const headings = getDocsMarkdownHeadings(source)
  return serialize(source, {
    mdxOptions: {
      remarkPlugins: createPostkitRemarkPlugins({
        postkit: { output: 'mdx' },
        after: [
          () => (tree: ContentNode) => {
            walk(tree, (node) => {
              const offset = node.position?.start.offset
              // Generated directives use Postkit's APIs; existing authored JSX
              // keeps the native Docs Callout/Steps/Tabs compatibility aliases.
              if (
                node.type?.startsWith('mdxJsx') &&
                node.name &&
                offset !== undefined &&
                source[offset] === ':'
              ) {
                node.name = `Postkit${node.name}`
              }
            })
          },
        ],
      }),
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
  })
}
