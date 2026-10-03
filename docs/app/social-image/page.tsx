import { OgImagePage } from '@/components/docs/OgImagePage'
import { createSocialImageMetadata } from '@/lib/social-image'

export const metadata = createSocialImageMetadata('/')

export default function SocialImage() {
  return <OgImagePage />
}
