import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Иначе Next берёт за корень C:\Users\Armen (там лежит чужой package-lock.json).
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  eslint: {
    // ESLint is not installed in this project; skip it during production builds.
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '**.supabase.co' }],
  },
};

export default nextConfig;
