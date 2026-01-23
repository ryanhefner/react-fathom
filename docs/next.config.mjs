import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Transpile linked packages to ensure context works correctly
  transpilePackages: ['react-fathom'],
  eslint: {
    // Allow build to succeed even with ESLint errors
    // This is useful for initial setup - lint issues should be fixed separately
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow build to succeed even with TypeScript errors
    ignoreBuildErrors: false,
  },
  // Turbopack configuration (Next.js 16+ default)
  turbopack: {
    resolveAlias: {
      'react-fathom': path.resolve(__dirname, '../dist/es'),
      'react-fathom/next': path.resolve(__dirname, '../dist/es/next'),
      'react-fathom/debug': path.resolve(__dirname, '../dist/es/debug'),
    },
  },
  // Webpack fallback for production builds
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
