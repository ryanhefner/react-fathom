import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

import matter from 'gray-matter'

export interface NavItem {
  title: string
  href?: string
  children?: NavItem[]
}

// Meta file structure: { [filename]: title | { title, ... } }
type MetaValue = string | { title: string; [key: string]: unknown }
type MetaFile = Record<string, MetaValue>

export const DOCS_ROOT = fs.existsSync(path.join(process.cwd(), 'content'))
  ? process.cwd()
  : path.join(process.cwd(), 'docs')
const CONTENT_DIR = path.join(DOCS_ROOT, 'content')
const DOCS_BASE_PATH = '/docs'

function loadMeta(dir: string): MetaFile | null {
  const metaPath = path.join(dir, '_meta.ts')
  const metaJsonPath = path.join(dir, '_meta.json')

  // Try _meta.ts first (as exported default)
  if (fs.existsSync(metaPath)) {
    try {
      // Read the file and extract the default export
      const content = fs.readFileSync(metaPath, 'utf-8')
      // Simple parsing for `export default { ... }`
      const match = content.match(/export\s+default\s+(\{[\s\S]*\})/)
      if (match) {
        // Use Function constructor to evaluate (safe for static config)
        const fn = new Function(`return ${match[1]}`)
        return fn() as MetaFile
      }
    } catch {
      // Fall through to JSON
    }
  }

  // Try _meta.json
  if (fs.existsSync(metaJsonPath)) {
    try {
      return JSON.parse(fs.readFileSync(metaJsonPath, 'utf-8')) as MetaFile
    } catch {
      return null
    }
  }

  return null
}

function getTitleFromMeta(meta: MetaFile | null, key: string): string | null {
  if (!meta || !(key in meta)) return null
  const value = meta[key]
  return typeof value === 'string' ? value : value.title
}

function getTitleFromFrontmatter(filePath: string): string | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8')
    const { data } = matter(content)
    return data.title || null
  } catch {
    return null
  }
}

function formatTitle(name: string): string {
  return name.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

function buildNavFromDir(dir: string, basePath: string = ''): NavItem[] {
  const items: NavItem[] = []
  const meta = loadMeta(dir)

  // Get all files and directories
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  // Separate files and directories
  const files: string[] = []
  const dirs: string[] = []

  for (const entry of entries) {
    if (entry.name.startsWith('_')) continue // Skip meta files
    if (entry.isDirectory()) {
      dirs.push(entry.name)
    } else if (entry.name.endsWith('.mdx')) {
      files.push(entry.name.replace('.mdx', ''))
    }
  }

  // Get order from meta file, or use alphabetical
  const allKeys = [...new Set([...Object.keys(meta || {}), ...files, ...dirs])]
  const orderedKeys = meta ? Object.keys(meta) : allKeys.sort()

  // Add remaining items not in meta
  for (const key of allKeys) {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key)
    }
  }

  for (const key of orderedKeys) {
    const dirPath = path.join(dir, key)
    const filePath = path.join(dir, `${key}.mdx`)
    const isDir = dirs.includes(key)
    const isFile = files.includes(key)

    if (isDir) {
      // It's a directory - check for index.mdx
      const indexPath = path.join(dirPath, 'index.mdx')
      const hasIndex = fs.existsSync(indexPath)
      const children = buildNavFromDir(dirPath, `${basePath}/${key}`)

      // Get title from meta, index frontmatter, or format from name
      const title =
        getTitleFromMeta(meta, key) ||
        (hasIndex ? getTitleFromFrontmatter(indexPath) : null) ||
        formatTitle(key)

      if (hasIndex) {
        // Directory with index - link to index, children are sub-pages
        items.push({
          title,
          href: `${basePath}/${key}`,
          children: children.length > 0 ? children : undefined,
        })
      } else if (children.length > 0) {
        // Directory without index - just a group
        items.push({
          title,
          children,
        })
      }
    } else if (isFile && key !== 'index') {
      // Regular file (not index)
      const title =
        getTitleFromMeta(meta, key) ||
        getTitleFromFrontmatter(filePath) ||
        formatTitle(key)

      items.push({
        title,
        href: `${basePath}/${key}`,
      })
    }
  }

  return items
}

// Generate navigation from file structure
export function getDocsNav(): NavItem[] {
  // Handle root index separately
  const indexPath = path.join(CONTENT_DIR, 'index.mdx')
  const rootItems: NavItem[] = []

  if (fs.existsSync(indexPath)) {
    const title = getTitleFromFrontmatter(indexPath) || 'Introduction'
    rootItems.push({ title, href: DOCS_BASE_PATH })
  }

  // Build from directory structure
  const dirItems = buildNavFromDir(CONTENT_DIR, DOCS_BASE_PATH)

  // Combine - put index first, then dir items
  return [...rootItems, ...dirItems]
}

export function getLastUpdated(slug: string[]): string | null {
  const slugPath = slug.length === 0 ? 'index' : slug.join('/')
  let filePath = path.join(CONTENT_DIR, `${slugPath}.mdx`)

  // Try direct file first
  if (!fs.existsSync(filePath)) {
    // Try as directory with index.mdx
    filePath = path.join(CONTENT_DIR, slugPath, 'index.mdx')
    if (!fs.existsSync(filePath)) {
      return null
    }
  }

  try {
    // Get the last commit date for this file
    const result = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
      cwd: DOCS_ROOT,
    }).trim()

    if (!result) return null

    return result
  } catch {
    return null
  }
}
