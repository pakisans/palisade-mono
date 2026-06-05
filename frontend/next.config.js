/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local dev — Payload backend on :3001
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      // Production — same host, no port
      {
        protocol: 'https',
        hostname: process.env.PAYLOAD_HOST || 'palisade.rs',
        pathname: '/**',
      },
      // Allow any configured custom domain
      ...(process.env.PAYLOAD_HOST && process.env.PAYLOAD_HOST !== 'localhost'
        ? [{ protocol: 'https', hostname: process.env.PAYLOAD_HOST, pathname: '/**' }]
        : []),
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ['clsx', 'tailwind-merge'],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
