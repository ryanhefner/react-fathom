import type { Metadata } from 'next'

import { getPublishedPages } from '@chakra-docs/core'

import { getDocsManifest } from './chakra-docs'
import { OG_IMAGE_DEFAULTS, type OgImageContent } from './og-image'
import { WITH_OSS_PAGE } from './site-metadata'

/** Build-time capture registry; only real site pages become exported templates. */
export async function getSocialImagePages(): Promise<
  (OgImageContent & { route: string })[]
> {
  const manifest = await getDocsManifest()
  return [
    { route: '/', ...OG_IMAGE_DEFAULTS },
    WITH_OSS_PAGE,
    ...getPublishedPages(manifest.pages).map((page) => ({
      route: page.route,
      title: page.title,
      description: page.description ?? OG_IMAGE_DEFAULTS.description,
    })),
  ]
}

export async function getSocialImagePage(route: string) {
  return (await getSocialImagePages()).find((page) => page.route === route)
}

export function createSocialImageMetadata(route: string): Metadata {
  return {
    title: 'Open Graph image',
    robots: { index: false, follow: false },
    alternates: {
      canonical: `${route === '/' ? '' : route}/social-image`,
    },
  }
}
