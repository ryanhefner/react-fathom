import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '..')

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['react-fathom.test'],
  experimental: {
    optimizePackageImports: ['@chakra-ui/react'],
  },
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Keep linked React context shared and compile MDXRemote.
  transpilePackages: ['react-fathom', 'next-mdx-remote'],
  typescript: {
    // Allow build to succeed even with TypeScript errors
    ignoreBuildErrors: false,
  },
  // Turbopack configuration (Next.js 16+ default)
  turbopack: {
    root: rootDir,
    resolveAlias: {
      'react-fathom': '../dist/es/index.js',
      'react-fathom/next': '../dist/es/next/index.js',
      'react-fathom/debug': '../dist/es/debug/index.js',
    },
  },
  // Use Webpack until Turbopack's Emotion hydration mismatch is resolved.
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-fathom': path.resolve(__dirname, '../dist/es'),
      'react-fathom/next': path.resolve(__dirname, '../dist/es/next'),
      'react-fathom/debug': path.resolve(__dirname, '../dist/es/debug'),
    }
    return config
  },
}

export default nextConfig
