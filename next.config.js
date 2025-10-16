/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is stable in Next.js 14+, no experimental flag needed
  async rewrites() {
    return [
      {
        source: '/original.html',
        destination: '/original',
      },
    ];
  },
}

module.exports = nextConfig