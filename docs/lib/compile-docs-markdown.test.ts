import { describe, expect, it } from 'vitest'

import { compileDocsMarkdown } from './compile-docs-markdown'

describe('Postkit docs compilation', () => {
  it('keeps duplicate heading IDs aligned with the Chakra Docs table of contents', async () => {
    const { compiledSource } = await compileDocsMarkdown(
      '## Setup\n\nFirst.\n\n## Setup\n\nSecond.',
    )
    expect(compiledSource).toContain('id: "setup"')
    expect(compiledSource).toContain('id: "setup-2"')
  })

  it('supports GFM tables, task lists, and strikethrough through the Postkit preset', async () => {
    const { compiledSource } = await compileDocsMarkdown(
      '| Package | Use |\n| --- | --- |\n| react-fathom | Analytics |\n\n- [x] Ready\n\n~~Old~~',
    )
    expect(compiledSource).toContain('_components.table')
    expect(compiledSource).toContain('checked: true')
    expect(compiledSource).toContain('_components.del')
  })

  it('preserves native JSX aliases while routing directives to Postkit components', async () => {
    const { compiledSource } = await compileDocsMarkdown(
      '<Callout title="Frameworks">Use the dedicated guides.</Callout>\n\n:::callout{tone="warning"}\nCheck your configuration.\n:::',
    )
    expect(compiledSource).toContain('PostkitCallout')
    expect(compiledSource).toContain('tone: "warning"')
    expect(compiledSource).toContain('title: "Frameworks"')
  })

  it('does not mistake headings inside fenced code for document headings', async () => {
    const { compiledSource } = await compileDocsMarkdown(
      '```bash\n# Setup\n```\n\n## Setup',
    )
    expect(compiledSource).toContain('id: "setup"')
    expect(compiledSource).not.toContain('id: "setup-2"')
  })
})
