import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';

function clientIp(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  const first = (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim();
  const ip = first || (req.headers['x-real-ip'] as string | undefined) || req.socket.remoteAddress || '-';
  return ip.replace(/^::ffff:/, '');
}

function now(): string {
  // sv-SE gives "YYYY-MM-DD HH:mm:ss" in local time
  return new Date().toLocaleString('sv-SE');
}

// Access log for API routes: time, client IP, method, path, status, duration, and error message on 4xx/5xx
export function withLog(handler: NextApiHandler): NextApiHandler {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const start = Date.now();
    const ip = clientIp(req);
    let errorMsg: string | undefined;

    const json = res.json.bind(res);
    res.json = (body: any) => {
      if (body && typeof body.error === 'string') errorMsg = body.error;
      return json(body);
    };

    res.on('finish', () => {
      const status = res.statusCode;
      const line = `[${now()}] ${ip} ${req.method} ${req.url} ${status} ${Date.now() - start}ms`;
      if (status >= 500) console.error(`${line} — ${errorMsg ?? ''}`);
      else if (status >= 400) console.warn(`${line} — ${errorMsg ?? ''}`);
      else console.log(line);
    });

    return handler(req, res);
  };
}
