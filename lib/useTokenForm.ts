import { triggerDownload } from '@/lib/download';
import { Form, message } from 'antd';
import { useState } from 'react';

export function useTokenForm(apiEndpoint: string) {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
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
        messageApi.success(`Downloaded: ${name}`);
      } else {
        messageApi.success('Token retrieved successfully');
      }
    } catch (e: any) {
      messageApi.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyToken() {
    navigator.clipboard.writeText(accessToken);
    messageApi.success('Token copied');
  }

  return { loading, accessToken, messageApi, contextHolder, form, fileUrl, handleFinish, copyToken };
}
