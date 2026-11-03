import { Navbar } from '@/components/docs/Navbar'
import { StructuredData } from '@/components/docs/StructuredData'
import { WithOssPage } from '@/components/docs/WithOssPage'
import { getDocsManifest } from '@/lib/chakra-docs'
import { ossProjectGroups } from '@/lib/oss-projects'
import { createPageMetadata, WITH_OSS_PAGE } from '@/lib/site-metadata'

export const metadata = createPageMetadata(WITH_OSS_PAGE)

export default async function WithOss() {
  const manifest = await getDocsManifest()
  return (
    <>
      <StructuredData
        page={WITH_OSS_PAGE}
        items={ossProjectGroups.flatMap((group) =>
          group.projects.map((project) => ({
            name: project.name,
            description: project.description,
            url: project.href,
          })),
        )}
      />
      <Navbar searchRecords={manifest.search} />
      <WithOssPage />
    </>
  )
}
