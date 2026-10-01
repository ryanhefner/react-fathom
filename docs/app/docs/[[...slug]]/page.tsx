import { notFound } from 'next/navigation'

import { DocsLayout } from '@/components/docs'
import { DocsMarkdown } from '@/components/docs/DocsMarkdown'
import { getDocsManifest } from '@/lib/chakra-docs'
import { getLastUpdated } from '@/lib/docs'
import { createPageMetadata } from '@/lib/site-metadata'
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

  return createPageMetadata(page)
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
      <DocsMarkdown source={page.body ?? ''} />
    </DocsLayout>
  )
}
