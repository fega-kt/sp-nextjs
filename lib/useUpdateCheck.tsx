import { Button, notification } from 'antd';
import { useEffect } from 'react';

const POLL_MS = 60_000;

export function useUpdateCheck() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;

    let notified = false;
    let baseline: string | null = null;

    async function check() {
      if (notified) return;
      try {
        const res = await fetch('/', { method: 'HEAD' });
        const marker = res.headers.get('etag') || res.headers.get('last-modified');
        if (!marker) return;
        if (baseline === null) { baseline = marker; return; }
        if (marker === baseline) return;

        notified = true;
        notification.info({
          message: 'Update available',
          description: 'Reload the page to get the latest version.',
          btn: (
            <Button type="primary" size="small" onClick={() => window.location.reload()}>
              Reload now
            </Button>
          ),
          duration: 0,
          placement: 'topRight',
          onClose: () => { notified = false; },
        });
      } catch {}
    }

    check();
    const id = setInterval(check, POLL_MS);
    return () => clearInterval(id);
  }, []);
}
