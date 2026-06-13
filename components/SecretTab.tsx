import { LabelTip } from '@/components/LabelTip';
import { useTokenForm } from '@/lib/useTokenForm';
import { CopyOutlined, DownloadOutlined } from '@ant-design/icons';
import { Button, Form, Input, Tooltip } from 'antd';

export default function SecretTab() {
  const { loading, accessToken, contextHolder, form, fileUrl, handleFinish, copyToken } =
    useTokenForm('/api/download-secret');

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
          name="clientSecret"
          label={<LabelTip label="Client Secret" tip="Secret value từ Azure Portal → App registrations → Certificates & secrets" />}
          rules={[{ required: true, message: 'Nhập client secret' }]}
        >
          <Input.Password placeholder="Dán client secret value vào đây" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="spUrl"
          label={<LabelTip label="Site URL" tip="URL của site SharePoint" />}
          rules={[{ required: true, message: 'Nhập site URL' }]}
        >
          <Input placeholder="https://tenant.sharepoint.com/sites/MySite" autoComplete="off" />
        </Form.Item>

        <Form.Item
          name="fileUrl"
          label={<LabelTip label="File URL (server-relative)" tip="Để trống nếu chỉ muốn lấy token, không download file" />}
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
