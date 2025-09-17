/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  env: {
    DEV_USERNAME: process.env.DEV_USERNAME,
    DEV_PASSWORD: process.env.DEV_PASSWORD,
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    DATABASE_URL: process.env.DATABASE_URL,
  },
}

module.exports = nextConfig