#!/usr/bin/env node

/**
 * Simple subdomain proxy for local development
 *
 * Routes requests based on subdomain:
 *   docs.localhost:8080      → localhost:3000
 *   next-app.localhost:8080  → localhost:3001
 *   next-pages.localhost:8080 → localhost:3002
 *   react.localhost:8080     → localhost:3003
 *   tanstack.localhost:8080  → localhost:3004
 *   gatsby.localhost:8080    → localhost:3005
 *
 * Note: Most modern browsers resolve *.localhost to 127.0.0.1 automatically.
 */

import http from 'http'
import { URL } from 'url'

const PROXY_PORT = 8080

// Subdomain to port mapping
const routes = {
  docs: 3000,
  'next-app': 3001,
  'next-pages': 3002,
  react: 3003,
  tanstack: 3004,
  gatsby: 3005,
}

// Extract subdomain from host header
function getSubdomain(host) {
  if (!host) return null
  // Remove port if present
  const hostname = host.split(':')[0]
  // Match patterns like "docs.localhost" or "next-app.localhost"
  const match = hostname.match(/^([a-z0-9-]+)\.localhost$/i)
  return match ? match[1] : null
}

// Proxy request to target server
function proxyRequest(req, res, targetPort) {
  const targetUrl = new URL(req.url, `http://localhost:${targetPort}`)

  const proxyReq = http.request(
    {
      hostname: 'localhost',
      port: targetPort,
      path: req.url,
      method: req.method,
      headers: {
        ...req.headers,
        host: `localhost:${targetPort}`,
      },
    },
    proxyRes => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers)
      proxyRes.pipe(res, { end: true })
    }
  )

  proxyReq.on('error', err => {
    console.error(`Proxy error to port ${targetPort}: ${err.message}`)
    res.writeHead(502, { 'Content-Type': 'text/plain' })
    res.end(`Bad Gateway: Could not connect to localhost:${targetPort}`)
  })

  req.pipe(proxyReq, { end: true })
}

// Handle WebSocket upgrades (for HMR)
function handleUpgrade(req, socket, head, targetPort) {
  const proxyReq = http.request({
    hostname: 'localhost',
    port: targetPort,
    path: req.url,
    method: req.method,
    headers: {
      ...req.headers,
      host: `localhost:${targetPort}`,
    },
  })

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write(
      `HTTP/1.1 101 Switching Protocols\r\n` +
        Object.entries(proxyRes.headers)
          .map(([k, v]) => `${k}: ${v}`)
          .join('\r\n') +
        '\r\n\r\n'
    )
    proxySocket.pipe(socket)
    socket.pipe(proxySocket)
  })

  proxyReq.on('error', err => {
    console.error(`WebSocket proxy error: ${err.message}`)
    socket.end()
  })

  proxyReq.end()
}

// Create proxy server
const server = http.createServer((req, res) => {
  const host = req.headers.host
  const subdomain = getSubdomain(host)

  if (!subdomain || !routes[subdomain]) {
    // Show available routes
    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>react-fathom Dev Sites</title>
          <style>
            body { font-family: system-ui, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            h1 { color: #333; }
            ul { list-style: none; padding: 0; }
            li { margin: 10px 0; }
            a { color: #0066cc; text-decoration: none; font-size: 18px; }
            a:hover { text-decoration: underline; }
            .port { color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>react-fathom Development Sites</h1>
          <ul>
            ${Object.entries(routes)
              .map(
                ([name, port]) =>
                  `<li><a href="http://${name}.localhost:${PROXY_PORT}">${name}.localhost</a> <span class="port">(port ${port})</span></li>`
              )
              .join('\n            ')}
          </ul>
        </body>
      </html>
    `)
    return
  }

  const targetPort = routes[subdomain]
  proxyRequest(req, res, targetPort)
})

// Handle WebSocket upgrades
server.on('upgrade', (req, socket, head) => {
  const host = req.headers.host
  const subdomain = getSubdomain(host)

  if (subdomain && routes[subdomain]) {
    handleUpgrade(req, socket, head, routes[subdomain])
  } else {
    socket.end()
  }
})

server.listen(PROXY_PORT, () => {
  console.log(`Subdomain proxy listening on port ${PROXY_PORT}`)
  console.log('Available sites:')
  Object.entries(routes).forEach(([name, port]) => {
    console.log(`  http://${name}.localhost:${PROXY_PORT} → localhost:${port}`)
  })
})
