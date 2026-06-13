import { execSync } from 'child_process';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  try {
    const hash = execSync('git log -1 --format=%h').toString().trim();
    res.status(200).json({ hash });
  } catch {
    res.status(200).json({ hash: '' });
  }
}
