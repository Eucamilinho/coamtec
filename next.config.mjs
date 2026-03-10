/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimización experimental
  experimental: {
    optimizePackageImports: ['lucide-react', '@react-three/fiber', '@react-three/drei', 'three'],
  },

  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'coamtec.com' }],
        destination: 'https://www.coamtec.com/:path*',
        permanent: true,
      },
    ];
  },
  
  async headers() {
    return [
      {
        source: '/(.*)\\.(jpg|jpeg|png|svg|webp|avif|gif)$',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=604800, stale-while-revalidate=86400',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, s-maxage=60, stale-while-revalidate=120',
          },
        ],
      },
    ];
  },
  images: {
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lraxahespfbnnelztrjg.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
