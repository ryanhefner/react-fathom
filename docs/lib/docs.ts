import fs from 'fs'
import path from 'path'
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

export interface DocPage {
  content: string
  frontmatter: Frontmatter
  slug: string[]
}

const CONTENT_DIR = path.join(process.cwd(), 'content')

// Navigation structure - defined manually for now
// This could be auto-generated from file structure
export function getDocsNav(): NavItem[] {
  return [
    {
      title: 'Getting Started',
      children: [
        { title: 'Introduction', href: '/' },
        { title: 'Installation', href: '/getting-started' },
      ],
    },
    {
      title: 'Guides',
      children: [
        { title: 'React', href: '/react' },
        { title: 'Next.js', href: '/nextjs' },
        { title: 'App Router', href: '/nextjs/app-router' },
        { title: 'Pages Router', href: '/nextjs/pages-router' },
        { title: 'React Native', href: '/react-native' },
        { title: 'Navigation', href: '/react-native/navigation' },
        { title: 'App State', href: '/react-native/app-state' },
        { title: 'Advanced', href: '/react-native/advanced' },
      ],
    },
    {
      title: 'API Reference',
      children: [
        { title: 'Providers', href: '/api/providers' },
        { title: 'Hooks', href: '/api/hooks' },
        { title: 'Components', href: '/api/components' },
        { title: 'Native API', href: '/api/native' },
      ],
    },
    {
      title: 'More',
      children: [
        { title: 'Default Options', href: '/guides/default-options' },
        { title: 'Custom Client', href: '/guides/custom-client' },
        { title: 'Testing', href: '/guides/testing' },
        { title: 'Custom Domains', href: '/guides/custom-domains' },
        { title: 'Troubleshooting', href: '/troubleshooting' },
        { title: 'Contributing', href: '/contributing' },
      ],
    },
  ]
}

export function getDocBySlug(slug: string[]): DocPage | null {
  const slugPath = slug.length === 0 ? 'index' : slug.join('/')
  const filePath = path.join(CONTENT_DIR, `${slugPath}.mdx`)

  if (!fs.existsSync(filePath)) {
    return null
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
      const filePath = path.join(dir, file)
      const stat = fs.statSync(filePath)

      if (stat.isDirectory()) {
        walkDir(filePath, [...prefix, file])
      } else if (file.endsWith('.mdx')) {
        const name = file.replace('.mdx', '')
        if (name === 'index') {
          slugs.push(prefix)
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

  const currentHref = '/' + slug.join('/')
  const normalizedHref = currentHref === '/' ? '/' : currentHref
  const currentIndex = flatNav.findIndex(
    (item) => item.href === normalizedHref || (normalizedHref === '/' && item.href === '/')
  )

  return {
    prev: currentIndex > 0 ? flatNav[currentIndex - 1] : undefined,
    next: currentIndex < flatNav.length - 1 ? flatNav[currentIndex + 1] : undefined,
  }
}
