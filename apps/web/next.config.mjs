/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  transpilePackages: ['@herside/shared'],
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
