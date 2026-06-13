import { triggerDownload } from '@/lib/download';
import { CopyOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip, message } from 'antd';
import { useRef, useState } from 'react';

export default function CertTab() {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const fileRef = useRef<HTMLInputElement>(null);
  const fileUrl = Form.useWatch('fileUrl', form);

  function handlePemFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => form.setFieldValue('privateKey', (ev.target?.result as string) || '');
    reader.readAsText(file);
  }

  async function handleFinish(values) {
    setLoading(true);
    setAccessToken('');
    try {
      // Bước 1: luôn lấy token
      const res = await fetch('/api/download-cert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setAccessToken(json.token);

      // Bước 2: nếu có fileUrl, dùng token vừa lấy để download
      if (values.fileUrl) {
        const name = await triggerDownload('/api/download', {
          token: json.token,
          spUrl: values.spUrl,
          fileUrl: values.fileUrl,
        });
        messageApi.success(`Đã tải: ${name}`);
      } else {
        messageApi.success('Lấy token thành công');
      }
    } catch (e: any) {
      messageApi.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  function copyToken() {
    navigator.clipboard.writeText(accessToken);
    messageApi.success('Đã copy token');
  }

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-2">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="tenantId"
            label="Tenant ID"
            rules={[{ required: true, message: 'Nhập tenant ID' }]}
          >
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="clientId"
            label="Client ID (App ID)"
            rules={[{ required: true, message: 'Nhập client ID' }]}
          >
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autoComplete="off" />
          </Form.Item>
        </div>

        <Form.Item
          name="thumbprint"
          label="Thumbprint (x5t)"
          extra="Thumbprint SHA-1 của certificate — dạng hex từ Azure Portal"
          rules={[{ required: true, message: 'Nhập thumbprint' }]}
        >
          <Input placeholder="40 ký tự hex, lấy từ Azure Portal → Certificates & secrets" autoComplete="off" />
        </Form.Item>

        <Form.Item label="Private Key (PEM)" extra="Dán nội dung hoặc upload file .pem / .key">
          <div className="flex gap-2 items-start">
            <Form.Item
              name="privateKey"
              noStyle
              rules={[{ required: true, message: 'Nhập private key' }]}
            >
              <Input.TextArea
                rows={4}
                placeholder={"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"}
                spellCheck={false}
                autoComplete="off"
                style={{ fontFamily: 'Menlo, Monaco, Consolas, monospace', fontSize: 13, flex: 1 }}
              />
            </Form.Item>
            <Button
              icon={<UploadOutlined />}
              onClick={() => fileRef.current?.click()}
              title="Upload .pem"
              className="mt-0 shrink-0"
            />
            <input
              ref={fileRef}
              type="file"
              accept=".pem,.key,.txt"
              onChange={handlePemFile}
              style={{ display: 'none' }}
            />
          </div>
        </Form.Item>

        <Form.Item
          name="spUrl"
          label="Site URL"
          extra="URL của site SharePoint"
          rules={[{ required: true, message: 'Nhập site URL' }]}
        >
          <Input placeholder="https://tenant.sharepoint.com/sites/MySite" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="fileUrl"
          label="File URL (server-relative)"
          extra="Để trống nếu chỉ muốn lấy token"
        >
          <Input placeholder="/sites/MySite/Shared Documents/report.xlsx" autoComplete="off" />
        </Form.Item>

        {accessToken && (
          <Form.Item label="Access Token">
            <div className="relative">
              <Input.TextArea
                value={accessToken}
                readOnly
                rows={3}
                style={{ fontFamily: 'Menlo, Monaco, Consolas, monospace', fontSize: 11, paddingRight: 36 }}
              />
              <Tooltip title="Copy token">
                <Button
                  type="text"
                  size="small"
                  icon={<CopyOutlined />}
                  onClick={copyToken}
                  className="!absolute top-1.5 right-1.5"
                />
              </Tooltip>
            </div>
          </Form.Item>
        )}

        <div className="sticky bottom-0 -mx-8 px-8 pt-3 pb-5 bg-white/90 dark:bg-[#1a1d27]/90 backdrop-blur-sm border-t border-slate-100 dark:border-[#2d3148]">
          <Form.Item className="!mb-0">
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              icon={<DownloadOutlined />}
            >
              {loading
                ? (fileUrl ? 'Đang tải...' : 'Đang lấy token...')
                : (fileUrl ? 'Tải file' : 'Lấy token')}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
