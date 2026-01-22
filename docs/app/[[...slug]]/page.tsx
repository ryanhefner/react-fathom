import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { DocsLayout, MDXComponents } from '@/components/docs'
import {
  getDocBySlug,
  getAllDocSlugs,
  getDocsNav,
  extractTOC,
  getAdjacentPages,
} from '@/lib/docs'

export async function generateStaticParams() {
  const slugs = getAllDocSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    return { title: 'Not Found' }
  }

  return {
    title: doc.frontmatter.title,
    description: doc.frontmatter.description,
  }
}

const rehypePrettyCodeOptions = {
  theme: {
    dark: 'github-dark',
    light: 'github-light',
  },
  keepBackground: false,
  defaultLang: 'plaintext',
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const doc = getDocBySlug(slug)

  if (!doc) {
    notFound()
  }

  const nav = getDocsNav()
  const toc = extractTOC(doc.content)
  const adjacentPages = getAdjacentPages(slug)

  return (
    <DocsLayout
      nav={nav}
      toc={toc}
      frontmatter={doc.frontmatter}
      adjacentPages={adjacentPages}
      slug={slug}
    >
      <MDXRemote
        source={doc.content}
        components={MDXComponents}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
          },
        }}
      />
    </DocsLayout>
  )
}
