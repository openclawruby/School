/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // GitHub Pages: needs /School prefix (served at openclawruby.github.io/School/)
  // Zeabur Static Site: no prefix (served at <name>.zeabur.app/)
  // Detect by checking if ZEABUR env var is set (Zeabur auto-injects this)
  basePath: process.env.ZEABUR ? '' : (process.env.NODE_ENV === 'production' ? '/School' : ''),
  assetPrefix: process.env.ZEABUR ? '' : (process.env.NODE_ENV === 'production' ? '/School/' : ''),
};
module.exports = nextConfig;