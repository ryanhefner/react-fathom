import { dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  typescript: {
    // Allow build to succeed even with TypeScript errors
    ignoreBuildErrors: false,
  },
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
