import { useEffect } from 'react';
import { toast } from 'sonner';

const POLL_MS = 60_000;
// Commit hash baked into this bundle at build time (next.config.js)
const CURRENT_HASH = process.env.NEXT_PUBLIC_DEPLOY_HASH || '';

export function useUpdateCheck() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production' || !CURRENT_HASH) return;

    let notified = false;

    // Compare against the hash of the build the server is running now — ETag / Last-Modified
    // on "/" are stripped behind Cloudflare, so they can't be used to detect a new deploy
    async function check() {
      if (notified) return;
      try {
        const res = await fetch('/api/version', { cache: 'no-store' });
        if (!res.ok) return;
        const { hash } = (await res.json()) as { hash?: string };
        if (!hash || hash === CURRENT_HASH) return;

        notified = true;
        toast.info('Update available', {
          description: 'Reload the page to get the latest version.',
          action: { label: 'Reload now', onClick: () => window.location.reload() },
          duration: Infinity,
          onDismiss: () => { notified = false; },
        });
      } catch {}
    }

    check();
    const id = setInterval(check, POLL_MS);
    return () => clearInterval(id);
  }, []);
}
