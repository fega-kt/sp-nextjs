/** @type {import('next').NextConfig} */
const { execSync } = require('child_process');

function getGitInfo() {
  // Docker builds have no .git — CI passes the info as DEPLOY_* build args instead
  if (process.env.DEPLOY_HASH) {
    return {
      by: process.env.DEPLOY_BY || 'unknown',
      at: process.env.DEPLOY_AT || new Date().toISOString(),
      hash: process.env.DEPLOY_HASH,
      msg: process.env.DEPLOY_MSG || '',
    };
  }
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
  // Self-contained server (.next/standalone) for the Docker image only — on Windows the
  // standalone copy needs symlink permission and breaks a plain local `pnpm build`
  output: process.env.BUILD_STANDALONE === '1' ? 'standalone' : undefined,
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
