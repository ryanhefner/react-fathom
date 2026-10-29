/** Return the exact copyable example, not a separately maintained fixture. */
export function extractReadmeExample(markdown, name) {
  const start = `<!-- quickstart:${name}:start -->`
  const end = `<!-- quickstart:${name}:end -->`
  if (
    markdown.split(start).length !== 2 ||
    markdown.split(end).length !== 2 ||
    markdown.indexOf(start) >= markdown.indexOf(end)
  ) {
    throw new Error(`README ${name}: expected one ordered quick-start section`)
  }
  const section = markdown.split(start)[1].split(end)[0]
  const blocks = [...section.matchAll(/^```tsx\r?\n([\s\S]*?)^```\s*$/gm)]
  if (blocks.length !== 1 || !blocks[0][1].trim()) {
    throw new Error(`README ${name}: expected one complete TSX example`)
  }
  return blocks[0][1]
}
