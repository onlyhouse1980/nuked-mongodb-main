// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable URL imports if needed, otherwise keep defaults
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'nuked-mongodb-main.vercel.app']
    }
  },
  images: {
    qualities: [50, 75, 85, 90, 100]
  },
  cacheComponents: true
};

module.exports = nextConfig;
