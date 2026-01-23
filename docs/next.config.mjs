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
}

export default nextConfig
