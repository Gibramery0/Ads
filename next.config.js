/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['via.placeholder.com', 'picsum.photos', 'images.unsplash.com', 'img.gamedistribution.com'],
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  typescript: {
    // !! WARN !!
    // TypeScript hatalarını görmezden gelmek için
    // Bu sadece geçici bir çözümdür, gerçek projelerde kullanmayın
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig;