import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';
import { triggerDownload } from '@/lib/download';

export default function TokenTab() {
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();

  async function handleFinish(values: { token: string; spUrl: string; fileUrl: string }) {
    setLoading(true);
    try {
      const name = await triggerDownload('/api/download', values);
      messageApi.success(`Đã tải: ${name}`);
    } catch (e: any) {
      messageApi.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleFinish} className="pt-2">
        <Form.Item
          name="token"
          label="Access Token"
          extra="Bearer token lấy từ Azure AD (audience phải là SharePoint site)"
          rules={[{ required: true, message: 'Nhập access token' }]}
        >
          <Input.TextArea
            rows={3}
            placeholder="eyJ0eXAiOiJKV1Qi... (JWT từ Azure AD)"
            spellCheck={false}
            autoComplete="off"
            style={{ fontFamily: 'Menlo, Monaco, Consolas, monospace', fontSize: 13 }}
          />
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
          extra="Đường dẫn server-relative của file"
          rules={[{ required: true, message: 'Nhập file URL' }]}
        >
          <Input placeholder="/sites/MySite/Shared Documents/report.xlsx" autoComplete="off" />
        </Form.Item>

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
              {loading ? 'Đang tải...' : 'Tải file'}
            </Button>
          </Form.Item>
        </div>
      </Form>
    </>
  );
}
