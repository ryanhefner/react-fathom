import { Navbar } from '@/components/docs/Navbar'
import { WithOssPage } from '@/components/docs/WithOssPage'
import { getDocsManifest } from '@/lib/chakra-docs'
import { createPageMetadata, WITH_OSS_PAGE } from '@/lib/site-metadata'

export const metadata = createPageMetadata(WITH_OSS_PAGE)

export default async function WithOss() {
  const manifest = await getDocsManifest()
  return (
    <>
      <Navbar searchRecords={manifest.search} />
      <WithOssPage />
    </>
  )
}
