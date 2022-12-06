/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,

  // Use modularized imports for MUI when "npm run dev"
  experimental: {
    modularizeImports: {
      '@mui/material': { transform: '@mui/material/{{member}}' },
      '@mui/icons-material': { transform: '@mui/icons-material/{{member}}' }
    }
  }
};

module.exports = nextConfig;
