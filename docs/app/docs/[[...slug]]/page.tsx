import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import { DocsLayout } from '@/components/docs'
import {
  getDocBySlug,
  getAllDocSlugs,
  getDocsNav,
  extractTOC,
  getAdjacentPages,
  getBreadcrumbs,
  getLastUpdated,
} from '@/lib/docs'
import { getMDXComponents } from '@/components/docs/MDXComponents'

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
  const breadcrumbs = getBreadcrumbs(slug)
  const lastUpdated = getLastUpdated(slug)

  return (
    <DocsLayout
      nav={nav}
      toc={toc}
      frontmatter={doc.frontmatter}
      adjacentPages={adjacentPages}
      slug={slug}
      breadcrumbs={breadcrumbs}
      lastUpdated={lastUpdated}
    >
      <MDXRemote
        source={doc.content}
        components={getMDXComponents()}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
          },
        }}
      />
    </DocsLayout>
  )
}
