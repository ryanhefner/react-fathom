import { OgImagePage } from '@/components/docs/OgImagePage'
import { WITH_OSS_PAGE } from '@/lib/site-metadata'
import { createSocialImageMetadata } from '@/lib/social-image'

export const metadata = createSocialImageMetadata(WITH_OSS_PAGE.route)

export default function SocialImage() {
  return <OgImagePage defaults={WITH_OSS_PAGE} />
}
