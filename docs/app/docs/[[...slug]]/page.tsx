import { notFound } from 'next/navigation'

import { DocsLayout } from '@/components/docs'
import { DocsMarkdown } from '@/components/docs/DocsMarkdown'
import { OgImagePage } from '@/components/docs/OgImagePage'
import { getDocsManifest } from '@/lib/chakra-docs'
import { getLastUpdated } from '@/lib/docs'
import { OG_IMAGE_DEFAULTS } from '@/lib/og-image'
import { createPageMetadata } from '@/lib/site-metadata'
import { createSocialImageMetadata } from '@/lib/social-image'
import {
  createGenerateStaticParams,
  getAppRouterDoc,
} from '@chakra-docs/next/app'

export const dynamicParams = false

function resolveDocRequest(slug: string[]) {
  const capture = slug.at(-1) === 'social-image'
  const pageSlug = capture ? slug.slice(0, -1) : slug
  const route = pageSlug.length === 0 ? '/docs' : `/docs/${pageSlug.join('/')}`
  return { route, capture }
}

export async function generateStaticParams() {
  const manifest = await getDocsManifest()
  const params = await createGenerateStaticParams({
    manifest,
    basePath: '/docs',
  })()
  return [
    ...params,
    ...params.map(({ slug = [] }) => ({ slug: [...slug, 'social-image'] })),
  ]
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const manifest = await getDocsManifest()
  const { route, capture } = resolveDocRequest(slug)
  const page = getAppRouterDoc({ manifest, basePath: '/docs' }, route)

  if (!page) {
    return { title: 'Not Found' }
  }

  return capture ? createSocialImageMetadata(route) : createPageMetadata(page)
}

export default async function DocPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug = [] } = await params
  const manifest = await getDocsManifest()
  const { route, capture } = resolveDocRequest(slug)
  const page = getAppRouterDoc({ manifest, basePath: '/docs' }, route)

  if (!page) {
    notFound()
  }

  if (capture) {
    return (
      <OgImagePage
        defaults={{
          title: page.title,
          description: page.description ?? OG_IMAGE_DEFAULTS.description,
        }}
      />
    )
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
