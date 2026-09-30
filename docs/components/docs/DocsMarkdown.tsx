import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

import { getMDXComponents } from './MDXComponents'

const rehypePrettyCodeOptions = {
  defaultLang: 'plaintext',
  keepBackground: false,
  theme: 'github-dark',
}

interface DocsMarkdownProps {
  source: string
}

export function DocsMarkdown({ source }: DocsMarkdownProps) {
  return (
    <MDXRemote
      source={source}
      components={getMDXComponents()}
      options={{
        mdxOptions: {
          rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
          remarkPlugins: [remarkGfm],
        },
      }}
    />
  )
}
