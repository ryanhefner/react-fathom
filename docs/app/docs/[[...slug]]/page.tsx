import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkGfm from 'remark-gfm'

import { DocsLayout } from '@/components/docs'
import { getMDXComponents } from '@/components/docs/MDXComponents'
import { getDocsManifest } from '@/lib/chakra-docs'
import { getLastUpdated } from '@/lib/docs'
import {
  createGenerateStaticParams,
  getAppRouterDoc,
} from '@chakra-docs/next/app'

export async function generateStaticParams() {
  const manifest = await getDocsManifest()
  return createGenerateStaticParams({ manifest, basePath: '/docs' })()
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const manifest = await getDocsManifest()
  const route = slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`
  const page = getAppRouterDoc({ manifest, basePath: '/docs' }, route)

  if (!page) {
    return { title: 'Not Found' }
  }

  return {
    title: page.title,
    description: page.description,
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
  const manifest = await getDocsManifest()
  const route = slug.length === 0 ? '/docs' : `/docs/${slug.join('/')}`
  const page = getAppRouterDoc({ manifest, basePath: '/docs' }, route)

  if (!page) {
    notFound()
  }

  const lastUpdated = getLastUpdated(page.slug)

  return (
    <DocsLayout
      lastUpdated={lastUpdated}
      nav={manifest.nav}
      page={page}
      searchRecords={manifest.search}
    >
      <MDXRemote
        source={page.body ?? ''}
        components={getMDXComponents()}
        options={{
          mdxOptions: {
            rehypePlugins: [[rehypePrettyCode, rehypePrettyCodeOptions]],
            remarkPlugins: [remarkGfm],
          },
        }}
      />
    </DocsLayout>
  )
}
