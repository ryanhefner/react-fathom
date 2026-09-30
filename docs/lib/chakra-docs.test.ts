import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { buildFilesystemManifest } = vi.hoisted(() => ({
  buildFilesystemManifest: vi.fn(),
}))

vi.mock('@chakra-docs/source-filesystem', () => ({
  buildFilesystemManifest,
  defineDocsDiscoveryConfig: (config: unknown) => config,
}))

vi.mock('./docs', () => ({
  DOCS_ROOT: '/docs-fixture',
  getDocsNav: () => [
    { title: 'Getting Started', href: '/docs/getting-started' },
  ],
}))

function manifest(body: string) {
  return {
    pages: [{ id: 'getting-started', body }],
    nav: [],
    byCollection: { docs: { nav: [] } },
  }
}

describe('docs manifest caching', () => {
  beforeEach(() => {
    vi.resetModules()
    buildFilesystemManifest.mockReset()
  })

  afterEach(() => {
    vi.unstubAllEnvs()
  })

  it('rereads content edits in development without restarting the server', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    buildFilesystemManifest
      .mockResolvedValueOnce(manifest('# Getting Started\n\n## Installation'))
      .mockResolvedValueOnce(manifest('## Installation'))
    const { getDocsManifest } = await import('./chakra-docs')

    expect((await getDocsManifest()).pages[0].body).toContain(
      '# Getting Started',
    )
    const updated = await getDocsManifest()
    expect(updated.pages[0].body).toBe('## Installation')
    expect(buildFilesystemManifest).toHaveBeenCalledTimes(2)
    expect(updated.nav[0].href).toBe('/docs/getting-started')
  })

  it('shares one manifest build in production', async () => {
    vi.stubEnv('NODE_ENV', 'production')
    buildFilesystemManifest.mockResolvedValue(manifest('## Installation'))
    const { getDocsManifest } = await import('./chakra-docs')

    const first = getDocsManifest()
    const second = getDocsManifest()
    expect(second).toBe(first)
    await first
    expect(buildFilesystemManifest).toHaveBeenCalledTimes(1)
  })
})
