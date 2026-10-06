import type { NextApiRequest, NextApiResponse } from 'next';

// Hash is baked in at build time by next.config.js (works without .git in the Docker image).
// Polled by useUpdateCheck — must never be cached by the browser or Cloudflare.
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ hash: process.env.NEXT_PUBLIC_DEPLOY_HASH || '' });
}
