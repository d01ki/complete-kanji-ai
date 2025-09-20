/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // パフォーマンス最適化
  swcMinify: true,
  // 画像最適化
  images: {
    domains: ['tabelog.com'],
  },
  // ビルド最適化
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // ファイルシステムキャッシュを無効化（開発時の高速化）
  experimental: {
    isrMemoryCacheSize: 0,
  },
}

module.exports = nextConfig