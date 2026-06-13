import { Button, notification } from 'antd';
import { useEffect } from 'react';

const BUILT_HASH = process.env.NEXT_PUBLIC_DEPLOY_HASH || 'ssdv';
const POLL_MS = 60_000;

export function useUpdateCheck() {
  useEffect(() => {
    if (!BUILT_HASH) return;

    let notified = false;

    async function check() {
      if (notified) return;
      try {
        const res = await fetch('/api/version');
        if (!res.ok) return;
        const { hash } = await res.json();

        if (!hash || hash === BUILT_HASH) return;
        notified = true;
        notification.info({
          message: 'Có bản cập nhật mới',
          description: `Phiên bản ${hash} đã sẵn sàng — tải lại trang để cập nhật.`,
          btn: (
            <Button type="primary" size="small" onClick={() => window.location.reload()}>
              Tải lại ngay
            </Button>
          ),
          duration: 0,
          placement: 'topRight',
        });
      } catch {}
    }

    check();
    const id = setInterval(check, POLL_MS);
    return () => clearInterval(id);
  }, []);
}
