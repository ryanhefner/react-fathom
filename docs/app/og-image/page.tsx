import type { Metadata } from 'next'

import { OgImagePage } from '@/components/docs/OgImagePage'
import { createCaptureMetadata } from '@/lib/site-metadata'

export const metadata: Metadata = createCaptureMetadata('/og-image')

export default function OpenGraphImage() {
  return <OgImagePage />
}
