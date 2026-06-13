/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@pnp/sp-commonjs', '@pnp/common-commonjs', '@pnp/odata-commonjs', '@pnp/logging-commonjs', '@pnp/nodejs-commonjs'],
  },
};

module.exports = nextConfig;
