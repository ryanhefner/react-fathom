#!/usr/bin/env node

/**
 * Development script to run docs and all example sites simultaneously
 *
 * Sites and their ports:
 * - docs:           http://localhost:3000  or http://docs.localhost:8080
 * - next-app:       http://localhost:3001  or http://next-app.localhost:8080
 * - next-pages:     http://localhost:3002  or http://next-pages.localhost:8080
 * - react:          http://localhost:3003  or http://react.localhost:8080
 * - tanstack:       http://localhost:3004  or http://tanstack.localhost:8080
 * - gatsby:         http://localhost:3005  or http://gatsby.localhost:8080
 *
 * Usage:
 *   node scripts/dev-all.js           # Run all sites
 *   node scripts/dev-all.js --proxy   # Run all sites with subdomain proxy on port 8080
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

const useProxy = process.argv.includes('--proxy')

// Site configurations
const sites = [
  {
    name: 'docs',
    dir: 'docs',
    command: 'npm',
    args: ['run', 'dev', '--', '-p', '3000'],
    port: 3000,
    color: '\x1b[36m', // cyan
  },
  {
    name: 'next-app',
    dir: 'examples/next-app',
    command: 'npm',
    args: ['run', 'dev', '--', '-p', '3001'],
    port: 3001,
    color: '\x1b[33m', // yellow
  },
  {
    name: 'next-pages',
    dir: 'examples/next-pages',
    command: 'npm',
    args: ['run', 'dev', '--', '-p', '3002'],
    port: 3002,
    color: '\x1b[35m', // magenta
  },
  {
    name: 'react',
    dir: 'examples/react',
    command: 'npm',
    args: ['run', 'dev', '--', '--port', '3003'],
    port: 3003,
    color: '\x1b[32m', // green
  },
  {
    name: 'tanstack',
    dir: 'examples/tanstack-router',
    command: 'npm',
    args: ['run', 'dev', '--', '--port', '3004'],
    port: 3004,
    color: '\x1b[34m', // blue
  },
  {
    name: 'gatsby',
    dir: 'examples/gatsby',
    command: 'npm',
    args: ['run', 'develop', '--', '-p', '3005'],
    port: 3005,
    color: '\x1b[31m', // red
  },
]

const reset = '\x1b[0m'

console.log('\n📦 Starting react-fathom development servers...\n')

if (useProxy) {
  console.log('🔀 Subdomain proxy enabled on port 8080')
  console.log('   Access sites via: <site>.localhost:8080\n')
} else {
  console.log('   Use --proxy flag to enable subdomain routing on port 8080\n')
}

console.log('Sites:')
sites.forEach(site => {
  const url = useProxy
    ? `http://${site.name}.localhost:8080`
    : `http://localhost:${site.port}`
  console.log(`  ${site.color}${site.name.padEnd(12)}${reset} → ${url}`)
})
console.log('')

// Track child processes for cleanup
const processes = []

// Cleanup function
function cleanup() {
  console.log('\n\nShutting down all servers...')
  processes.forEach(proc => {
    if (proc && !proc.killed) {
      proc.kill('SIGTERM')
    }
  })
  process.exit(0)
}

process.on('SIGINT', cleanup)
process.on('SIGTERM', cleanup)

// Start each site
sites.forEach(site => {
  const cwd = path.join(rootDir, site.dir)
  const proc = spawn(site.command, site.args, {
    cwd,
    stdio: ['ignore', 'pipe', 'pipe'],
    shell: true,
  })

  processes.push(proc)

  const prefix = `${site.color}[${site.name}]${reset}`

  proc.stdout.on('data', data => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => console.log(`${prefix} ${line}`))
  })

  proc.stderr.on('data', data => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => console.log(`${prefix} ${line}`))
  })

  proc.on('error', err => {
    console.error(`${prefix} Failed to start: ${err.message}`)
  })

  proc.on('exit', (code, signal) => {
    if (code !== null && code !== 0) {
      console.log(`${prefix} Exited with code ${code}`)
    }
  })
})

// Start proxy if requested
if (useProxy) {
  const proxyPath = path.join(__dirname, 'subdomain-proxy.js')
  const proxyProc = spawn('node', [proxyPath], {
    cwd: rootDir,
    stdio: ['ignore', 'pipe', 'pipe'],
  })

  processes.push(proxyProc)

  const prefix = '\x1b[37m[proxy]\x1b[0m'

  proxyProc.stdout.on('data', data => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => console.log(`${prefix} ${line}`))
  })

  proxyProc.stderr.on('data', data => {
    const lines = data.toString().split('\n').filter(Boolean)
    lines.forEach(line => console.log(`${prefix} ${line}`))
  })
}

// Keep process running
process.stdin.resume()
