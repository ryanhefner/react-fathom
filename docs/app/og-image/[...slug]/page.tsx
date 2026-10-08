import { notFound } from 'next/navigation'

import { OgImagePage } from '@/components/docs/OgImagePage'
import {
  createSocialImageMetadata,
  getSocialImagePage,
  getSocialImagePages,
} from '@/lib/social-image'

export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await getSocialImagePages()
  return pages
    .filter((page) => page.route !== '/')
    .map((page) => ({ slug: page.route.split('/').filter(Boolean) }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  return createSocialImageMetadata(`/${slug.join('/')}`)
}

export default async function SocialImage({
  params,
}: {
  params: Promise<{ slug: string[] }>
}) {
  const { slug } = await params
  const page = await getSocialImagePage(`/${slug.join('/')}`)
  if (!page) notFound()
  return <OgImagePage defaults={page} />
}
