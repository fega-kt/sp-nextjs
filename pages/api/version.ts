import type { NextApiRequest, NextApiResponse } from 'next';

// Hash is baked in at build time by next.config.js (works without .git in the Docker image)
export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json({ hash: process.env.NEXT_PUBLIC_DEPLOY_HASH || '' });
}
