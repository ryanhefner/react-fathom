import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

import { it as test } from 'vitest'

const read = (file: string) => readFileSync(file, 'utf8')
const LAYOUT_FILES = ['docs/components/docs/DocsLayout.tsx']

test('On this page uses an explicit SVG chevron instead of a text fallback', () => {
  const controls = read('docs/components/docs/DocsMobileControls.tsx')
  assert.match(
    controls,
    /import \{[^}]*\bLuChevronDown\b[^}]*\} from 'react-icons\/lu'/,
  )
  assert.match(
    controls,
    /<DocsMobileTableOfContents\b[^>]*indicator=\{<LuChevronDown size=\{16\} aria-hidden="true" \/>\}/,
  )
})

test('all documentation layouts share compact mobile controls, including home', () => {
  for (const file of LAYOUT_FILES) {
    const source = read(file)
    assert.match(source, /<DocsMobileControls\b/)
    assert.match(source, /mobileNavigation=\{false\}/)
    assert.match(source, /mobileToc=\{false\}/)
    assert.doesNotMatch(source, /mobileNavigationProps=/)
  }
  const controls = read('docs/components/docs/DocsMobileControls.tsx')
  assert.match(controls, /aria-label="Documentation controls"/)
  assert.match(controls, /DocsMobileNavigation\.Root/)
  assert.match(controls, /DocsMobileTableOfContents/)
  assert.match(controls, /hasToc: Boolean\(page\?\.headings\?\.length\)/)
  assert.match(
    controls,
    /triggerLabelSlotProps=\{\{ css: styles\.tocLabel \}\}/,
  )
})

test('mobile recipes fill the viewport and retain tablet and desktop controls', () => {
  const recipes = read('docs/app/site-recipes.ts')
  assert.match(recipes, /display: \{ base: 'flex', xl: 'none' \}/)
  assert.match(
    recipes,
    /false: \{ root: \{ display: \{ base: 'flex', lg: 'none' \} \} \}/,
  )
  assert.match(
    recipes,
    /toc: \{ flex: '1', minW: 0, mb: 0, pb: 0, borderBottomWidth: 0 \}/,
  )
  const theme = read('docs/app/theme.ts')
  assert.match(theme, /pt: \{ base: 4, lg: 8 \}/)
  assert.match(
    theme,
    /positioner: \{\s*position: 'fixed',\s*inset: 0,\s*w: '100dvw',\s*h: '100dvh',\s*p: 0/,
  )
  assert.match(
    theme,
    /content: \{\s*w: '100dvw',\s*maxW: 'none',\s*h: '100dvh',\s*maxH: '100dvh'/,
  )
  assert.match(theme, /pt: 'calc\(env\(safe-area-inset-top, 0px\) \+ 6px\)'/)
  assert.match(theme, /pb: '6px'/)
  assert.match(theme, /pb: 'max\(1rem, env\(safe-area-inset-bottom\)\)'/)
})

test('the mobile menu preserves search and navigation analytics', () => {
  const layout = read('docs/components/docs/DocsLayout.tsx')
  assert.match(
    layout,
    /search=\{<DocsSiteSearch records=\{searchRecords\} \/>\}/,
  )
  assert.match(layout, /onExpandedChange: handleSidebarExpandedChange/)
  assert.match(
    layout,
    /docs-mobile-navigation-\$\{open \? 'expand' : 'collapse'\}/,
  )
})
