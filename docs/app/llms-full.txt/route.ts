import { getDocsManifest } from '../../lib/chakra-docs'
import { createSiteLlmsText } from '../../lib/llms'
import { SITE_URL } from '../../lib/site-metadata'

export const dynamic = 'force-static'

export async function GET() {
  return new Response(
    createSiteLlmsText(await getDocsManifest(), SITE_URL, true),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'X-Content-Type-Options': 'nosniff',
      },
    },
  )
}
