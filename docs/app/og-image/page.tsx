import type { Metadata } from 'next'

import { OgImagePage } from '@/components/docs/OgImagePage'

export const metadata: Metadata = {
  title: 'Open Graph image',
  robots: { index: false, follow: false },
  alternates: { canonical: '/og-image' },
}

export default function OpenGraphImage() {
  return <OgImagePage />
}
