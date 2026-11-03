import {
  createDocsLlmsFullText,
  createDocsLlmsText,
  type DocsManifest,
} from '@chakra-docs/core'

export function createSiteLlmsText(
  manifest: DocsManifest,
  siteUrl: string,
  full = false,
) {
  const options = {
    title: 'react-fathom',
    description:
      'Privacy-focused Fathom Analytics for React, Next.js, React Native, Gatsby, React Router, and TanStack Router.',
    siteUrl,
    // Link to real docs pages; this site does not export per-page Markdown.
    markdownUrl: (page: DocsManifest['pages'][number]) => page.route,
    details: `Full documentation: [llms-full.txt](${siteUrl}/llms-full.txt).`,
  }
  return full
    ? createDocsLlmsFullText(manifest, options)
    : createDocsLlmsText(manifest, options)
}
