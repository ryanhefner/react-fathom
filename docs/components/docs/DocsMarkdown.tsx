import { MDXContent } from './MDXContent'
import { compileDocsMarkdown } from '../../lib/compile-docs-markdown'

export async function DocsMarkdown({ source }: { source: string }) {
  const compiled = await compileDocsMarkdown(source)

  // Compilation stays server-side. Markdown and authored MDX use one Postkit
  // component map, with Chakra Docs handling code and documentation actions.
  return <MDXContent source={compiled} />
}
