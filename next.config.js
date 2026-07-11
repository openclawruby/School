/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  basePath: process.env.NODE_ENV === 'production' ? '/School' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/School/' : '',
};
module.exports = nextConfig;