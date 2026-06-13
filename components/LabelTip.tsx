import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

export function LabelTip({ label, tip }: { label: string; tip: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <Tooltip title={tip} placement="top">
        <InfoCircleOutlined className="text-slate-400 hover:text-indigo-400 cursor-help !text-[11px] !flex leading-none translate-y-px" />
      </Tooltip>
    </span>
  );
}
