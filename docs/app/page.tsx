import { DocsLayout, WelcomePage } from '@/components/docs'
import { getDocsManifest } from '@/lib/chakra-docs'
import type { DocsPage } from '@chakra-docs/core'

const welcomePage: DocsPage = {
  id: 'welcome',
  slug: [],
  path: '',
  route: '/',
  title: 'Welcome to react-fathom',
  description: 'Privacy-focused analytics integrations for React applications.',
  frontmatter: {},
}

export default async function Home() {
  const manifest = await getDocsManifest()

  return (
    <DocsLayout
      breadcrumbs={false}
      nav={manifest.nav}
      page={welcomePage}
      pageActions={false}
      pagination={false}
      searchRecords={manifest.search}
    >
      <WelcomePage />
    </DocsLayout>
  )
}
