/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');

function getGitInfo() {
  try {
    return {
      by: execSync('git log -1 --format=%an').toString().trim(),
      at: execSync('git log -1 --format=%aI').toString().trim(),
      hash: execSync('git log -1 --format=%h').toString().trim(),
      msg: execSync('git log -1 --format=%s').toString().trim(),
    };
  } catch {
    return { by: 'unknown', at: new Date().toISOString(), hash: '', msg: '' };
  }
}

const git = getGitInfo();

const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@pnp/sp-commonjs', '@pnp/common-commonjs', '@pnp/odata-commonjs', '@pnp/logging-commonjs', '@pnp/nodejs-commonjs'],
  },
  env: {
    NEXT_PUBLIC_DEPLOY_BY: git.by,
    NEXT_PUBLIC_DEPLOY_AT: git.at,
    NEXT_PUBLIC_DEPLOY_HASH: git.hash,
    NEXT_PUBLIC_DEPLOY_MSG: git.msg,
  },
};

module.exports = nextConfig;
