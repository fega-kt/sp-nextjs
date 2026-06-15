import { LabelTip } from '@/components/LabelTip';
import { useTokenForm } from '@/lib/useTokenForm';
import { CopyOutlined, DownloadOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';
import { useRef } from 'react';

export default function CertTab() {
  const { loading, accessToken, contextHolder, form, fileUrl, handleFinish, copyToken } =
    useTokenForm('/api/download-cert');
  const fileRef = useRef<HTMLInputElement>(null);

  function handlePemFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => form.setFieldValue('privateKey', (ev.target?.result as string) || '');
    reader.readAsText(file);
  }

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-2">
        <div className="grid grid-cols-2 gap-x-4">
          <Form.Item
            name="tenantId"
            label="Tenant ID"
            rules={[{ required: true, message: 'Please enter tenant ID' }]}
          >
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autoComplete="off" />
          </Form.Item>
          <Form.Item
            name="clientId"
            label="Client ID (App ID)"
            rules={[{ required: true, message: 'Please enter client ID' }]}
          >
            <Input placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" autoComplete="off" />
          </Form.Item>
        </div>

        <Form.Item
          name="thumbprint"
          label={<LabelTip label="Thumbprint (x5t)" tip="SHA-1 thumbprint of the certificate — hex format from Azure Portal → Certificates & secrets" />}
          rules={[{ required: true, message: 'Please enter thumbprint' }]}
        >
          <Input placeholder="40-char hex, from Azure Portal → Certificates & secrets" autoComplete="off" />
        </Form.Item>

        <Form.Item
          label={<LabelTip label="Private Key (PEM)" tip="Paste .pem / .key content or upload the file directly" />}
        >
          <div className="flex gap-2 items-start">
            <Form.Item
              name="privateKey"
              noStyle
              rules={[{ required: true, message: 'Please enter private key' }]}
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
          label={<LabelTip label="Site URL" tip="SharePoint site URL" />}
          rules={[{ required: true, message: 'Please enter site URL' }]}
        >
          <Input placeholder="https://tenant.sharepoint.com/sites/MySite" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="fileUrl"
          label={<LabelTip label="File URL (server-relative)" tip="Leave empty to only retrieve a token without downloading" />}
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
                ? (fileUrl ? 'Downloading...' : 'Getting token...')
                : (fileUrl ? 'Download' : 'Get Token')}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
