import { triggerDownload } from '@/lib/download';
import { toastError } from '@/lib/notify';
import { Form } from 'antd';
import { useState } from 'react';
import { toast } from 'sonner';

export function useTokenForm(apiEndpoint: string) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [form] = Form.useForm();
  const fileUrl = Form.useWatch('fileUrl', form);

  async function handleFinish(values: Record<string, string>) {
    setLoading(true);
    setAccessToken('');
    try {
      const res = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setAccessToken(json.token);

      if (values.fileUrl) {
        const name = await triggerDownload('/api/download', {
          token: json.token,
          spUrl: values.spUrl,
          fileUrl: values.fileUrl,
        });
        toast.success(`Downloaded: ${name}`);
      } else {
        toast.success('Token retrieved successfully');
      }
    } catch (e) {
      toastError(values.fileUrl ? 'Download failed' : 'Failed to get token', e);
    } finally {
      setLoading(false);
    }
  }

  function copyToken() {
    navigator.clipboard.writeText(accessToken);
    toast.success('Token copied');
  }

  return { loading, accessToken, form, fileUrl, handleFinish, copyToken };
}
