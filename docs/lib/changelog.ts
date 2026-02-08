import { execSync } from 'child_process'

export interface ChangelogEntry {
  version: string
  date: string
  commits: {
    hash: string
    message: string
    author: string
  }[]
}

export function getChangelog(): ChangelogEntry[] {
  try {
    // Get all tags sorted by version
    const tagsOutput = execSync('git tag --sort=-version:refname', {
      encoding: 'utf-8',
      cwd: process.cwd(),
    }).trim()

    if (!tagsOutput) {
      return []
    }

    const tags = tagsOutput.split('\n').filter(Boolean)
    const changelog: ChangelogEntry[] = []

    for (let i = 0; i < tags.length; i++) {
      const tag = tags[i]
      const prevTag = tags[i + 1]

      // Get tag date
      const dateOutput = execSync(`git log -1 --format=%cI ${tag}`, {
        encoding: 'utf-8',
        cwd: process.cwd(),
      }).trim()

      // Get commits between this tag and the previous one
      const range = prevTag ? `${prevTag}..${tag}` : tag
      const commitsOutput = execSync(
        `git log ${range} --format="%H|%s|%an" --no-merges`,
        { encoding: 'utf-8', cwd: process.cwd() }
      ).trim()

      const commits = commitsOutput
        .split('\n')
        .filter(Boolean)
        .map((line) => {
          const [hash, message, author] = line.split('|')
          return { hash: hash.slice(0, 7), message, author }
        })

      changelog.push({
        version: tag,
        date: dateOutput,
        commits,
      })
    }

    return changelog
  } catch (error) {
    console.error('Failed to get changelog:', error)
    return []
  }
}

export function formatChangelogDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
