import { Navbar } from '@/components/docs/Navbar'
import { WithOssPage } from '@/components/docs/WithOssPage'
import { getDocsManifest } from '@/lib/chakra-docs'
import { createPageMetadata } from '@/lib/site-metadata'

export const metadata = createPageMetadata({
  route: '/withoss',
  title: 'Made w/ Open-Source Software',
  description:
    'The key open-source projects behind react-fathom and its documentation site.',
})

export default async function WithOss() {
  const manifest = await getDocsManifest()
  return (
    <>
      <Navbar searchRecords={manifest.search} />
      <WithOssPage />
    </>
  )
}
