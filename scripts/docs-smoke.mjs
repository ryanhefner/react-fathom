import assert from 'node:assert/strict'
import { once } from 'node:events'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { JSDOM } from 'jsdom'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = path.join(root, 'docs/out')
const readme = readFileSync(path.join(root, 'README.md'), 'utf8')
const origin = 'https://react-fathom.dev'

function exportedFile(pathname) {
  const route = path.resolve(output, `.${decodeURIComponent(pathname)}`)
  if (route !== output && !route.startsWith(output + path.sep)) return undefined
  return [route, route + '.html', path.join(route, 'index.html')].find(
    (candidate) => existsSync(candidate) && statSync(candidate).isFile(),
  )
}

let links = 0
for (const [, href] of readme.matchAll(
  /\]\((https:\/\/react-fathom\.dev[^\s)]*)\)/g,
)) {
  const url = new URL(href)
  assert.equal(url.origin, origin, href)
  const file = exportedFile(url.pathname)
  assert.ok(file, `README link must resolve to exported content: ${href}`)
  if (url.hash) {
    const dom = new JSDOM(readFileSync(file, 'utf8'))
    try {
      assert.ok(
        dom.window.document.getElementById(
          decodeURIComponent(url.hash.slice(1)),
        ),
        href,
      )
    } finally {
      dom.window.close()
    }
  }
  links++
}
assert.ok(links > 0, 'README must invite readers into the documentation')

const crawlerFiles = ['robots.txt', 'sitemap.xml', 'llms.txt', 'llms-full.txt']
for (const route of crawlerFiles) {
  const file = exportedFile('/' + route)
  assert.ok(file, route)
  assert.ok(readFileSync(file, 'utf8').length > 50, route)
}
assert.match(
  readFileSync(exportedFile('/robots.txt'), 'utf8'),
  /Sitemap: https:\/\/react-fathom\.dev\/sitemap\.xml/,
)
const sitemap = new JSDOM(readFileSync(exportedFile('/sitemap.xml'), 'utf8'), {
  contentType: 'application/xml',
})
try {
  const locations = sitemap.window.document.querySelectorAll('loc')
  assert.ok(locations.length > 0, 'sitemap must list public pages')
  for (const location of locations) {
    const url = new URL(location.textContent)
    assert.equal(url.origin, origin)
    assert.ok(exportedFile(url.pathname), url.href)
  }
} finally {
  sitemap.window.close()
}
console.log(
  `Docs artifacts passed: ${links} README links, sitemap destinations, robots, and LLM files.`,
)

if (process.argv.includes('--http')) {
  // Exercise the exported files as HTTP resources. This local test server is
  // not shipped as application code and does not change the site's static mode.
  const server = createServer((request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end()
      return
    }
    const pathname = new URL(request.url, 'http://127.0.0.1').pathname
    let file
    try {
      file = exportedFile(pathname)
    } catch {
      response.writeHead(400).end()
      return
    }
    const status = file ? 200 : 404
    file ??= path.join(output, '404.html')
    const body = readFileSync(file)
    const type = file.endsWith('.xml')
      ? 'application/xml'
      : file.endsWith('.txt')
        ? 'text/plain'
        : 'text/html'
    response.writeHead(status, {
      'Content-Type': `${type}; charset=utf-8`,
      'Content-Length': body.length,
    })
    response.end(request.method === 'HEAD' ? undefined : body)
  })
  server.listen(0, '127.0.0.1')
  try {
    await once(server, 'listening')
    const local = `http://127.0.0.1:${server.address().port}`
    const request = (route, options) =>
      fetch(local + route, { ...options, signal: AbortSignal.timeout(10_000) })
    for (const route of [
      '/',
      '/docs/getting-started',
      ...crawlerFiles.map((file) => '/' + file),
    ]) {
      const response = await request(route)
      assert.equal(response.status, 200, route)
      assert.match(
        response.headers.get('content-type'),
        route.endsWith('.xml')
          ? /application\/xml/
          : route.endsWith('.txt')
            ? /text\/plain/
            : /text\/html/,
        route,
      )
      assert.ok((await response.text()).length > 50, route)
      const head = await request(route, { method: 'HEAD' })
      assert.equal(head.status, 200, route)
      assert.equal(await head.text(), '', route)
    }
    const missing = await request('/definitely-not-a-doc')
    assert.equal(missing.status, 404)
    assert.match(await missing.text(), /404|not found/i)
    assert.equal((await request('/llms.txt', { method: 'POST' })).status, 405)
    console.log(
      'Static docs HTTP smoke passed: HTML, discovery GET/HEAD, 404, and method handling.',
    )
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    )
  }
}
