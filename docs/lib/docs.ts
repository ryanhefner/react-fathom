import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import matter from 'gray-matter'

export interface NavItem {
  title: string
  href?: string
  children?: NavItem[]
}

export interface TOCItem {
  id: string
  title: string
  level: number
  children?: TOCItem[]
}

export interface Frontmatter {
  title?: string
  description?: string
  [key: string]: unknown
}

export interface AdjacentPages {
  prev?: { title: string; href: string }
  next?: { title: string; href: string }
}

export interface BreadcrumbItem {
  title: string
  href?: string
}

export interface DocPage {
  content: string
  frontmatter: Frontmatter
  slug: string[]
}

// Meta file structure: { [filename]: title | { title, ... } }
type MetaValue = string | { title: string; [key: string]: unknown }
type MetaFile = Record<string, MetaValue>

const CONTENT_DIR = path.join(process.cwd(), 'content')
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
  return name
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
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
      const title = getTitleFromMeta(meta, key)
        || (hasIndex ? getTitleFromFrontmatter(indexPath) : null)
        || formatTitle(key)

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
      const title = getTitleFromMeta(meta, key)
        || getTitleFromFrontmatter(filePath)
        || formatTitle(key)

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

export function getDocBySlug(slug: string[]): DocPage | null {
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

  const fileContent = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(fileContent)

  return {
    content,
    frontmatter: data as Frontmatter,
    slug,
  }
}

export function getAllDocSlugs(): string[][] {
  const slugs: string[][] = []

  function walkDir(dir: string, prefix: string[] = []) {
    const files = fs.readdirSync(dir)

    for (const file of files) {
      if (file.startsWith('_')) continue // Skip meta files

      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, [...prefix, file])
      } else if (file.endsWith('.mdx')) {
        const name = file.replace('.mdx', '')
        if (name === 'index') {
          slugs.push(prefix.length === 0 ? [] : prefix)
        } else {
          slugs.push([...prefix, name])
        }
      }
    }
  }

  walkDir(CONTENT_DIR)
  return slugs
}

export function extractTOC(content: string): TOCItem[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  const toc: TOCItem[] = []

  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    toc.push({ id, title, level })
  }

  return toc
}

export function getAdjacentPages(slug: string[]): AdjacentPages {
  const nav = getDocsNav()
  const flatNav: { title: string; href: string }[] = []

  function flatten(items: NavItem[]) {
    for (const item of items) {
      if (item.href) {
        flatNav.push({ title: item.title, href: item.href })
      }
      if (item.children) {
        flatten(item.children)
      }
    }
  }

  flatten(nav)

  const currentHref = slug.length === 0 ? DOCS_BASE_PATH : `${DOCS_BASE_PATH}/${slug.join('/')}`
  const currentIndex = flatNav.findIndex((item) => item.href === currentHref)

  return {
    prev: currentIndex > 0 ? flatNav[currentIndex - 1] : undefined,
    next: currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : undefined,
  }
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
    const result = execSync(
      `git log -1 --format=%cI -- "${filePath}"`,
      { encoding: 'utf-8', cwd: process.cwd() }
    ).trim()

    if (!result) return null

    return result
  } catch {
    return null
  }
}

export function getBreadcrumbs(slug: string[]): BreadcrumbItem[] {
  if (slug.length === 0) {
    return [{ title: 'Docs', href: DOCS_BASE_PATH }]
  }

  const nav = getDocsNav()
  const breadcrumbs: BreadcrumbItem[] = [{ title: 'Docs', href: DOCS_BASE_PATH }]

  // Find the path through the navigation
  function findPath(items: NavItem[], targetPath: string, currentPath: BreadcrumbItem[] = []): BreadcrumbItem[] | null {
    for (const item of items) {
      if (item.href === targetPath) {
        return [...currentPath, { title: item.title, href: item.href }]
      }
      if (item.children) {
        const result = findPath(item.children, targetPath, [...currentPath, { title: item.title, href: item.href }])
        if (result) return result
      }
    }
    return null
  }

  const targetHref = `${DOCS_BASE_PATH}/${slug.join('/')}`
  const foundPath = findPath(nav, targetHref)

  if (foundPath) {
    return [...breadcrumbs, ...foundPath]
  }

  // Fallback: build breadcrumbs from slug segments
  let href = DOCS_BASE_PATH
  for (const segment of slug) {
    href += `/${segment}`
    breadcrumbs.push({
      title: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      href: href,
    })
  }

  return breadcrumbs
}
