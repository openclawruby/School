/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  // GitHub Pages: needs /School prefix (served at openclawruby.github.io/School/)
  // Zeabur Static Site: no prefix (served at <name>.zeabur.app/)
  // Detect by checking if ZEABUR env var is set (Zeabur auto-injects this)
  // ZEABUR takes precedence — auto-injected on Zeabur hosts (served at root, no prefix)
  // Otherwise NODE_ENV=production → /School basePath for GH Pages
  // Otherwise (local dev/preview) → no prefix so localhost works
  basePath: process.env.ZEABUR ? '' : (process.env.NODE_ENV === 'production' ? '/School' : ''),
  assetPrefix: process.env.ZEABUR ? '' : (process.env.NODE_ENV === 'production' ? '/School/' : ''),
  // Expose for debugging
  ...(process.env.NEXT_DEBUG_CONFIG ? { env: { NEXT_BUILD_TARGET: process.env.ZEABUR ? 'zeabur' : (process.env.NODE_ENV === 'production' ? 'ghpages' : 'local') } } : {}),
};
module.exports = nextConfig;