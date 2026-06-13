import CertTab from '@/components/CertTab';
import TokenTab from '@/components/TokenTab';
import { useTheme } from '@/contexts/theme';
import { BulbFilled, BulbOutlined, KeyOutlined, SafetyOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Head from 'next/head';
import { useState } from 'react';

type Tab = 'token' | 'cert';

export default function Home() {
  const { dark, toggle } = useTheme();
  const [activeTab, setActiveTab] = useState<Tab>('token');

  return (
    <>
      <Head>
        <title>SharePoint Downloader</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* Full viewport, no body scroll */}
      <div className="h-screen flex items-center justify-center p-6 bg-slate-100 dark:bg-[#0f1117] transition-colors duration-200">
        <div className="w-full max-w-4xl flex flex-col" style={{ height: 'min(calc(100vh - 3rem), 680px)' }}>

          {/* Card */}
          <div className="h-full rounded-2xl border border-slate-200 dark:border-[#2d3148] shadow-2xl bg-white dark:bg-[#1a1d27] transition-colors duration-200 flex flex-col overflow-hidden">

            {/* Header — fixed, never scrolls */}
            <div className="px-8 py-5 border-b border-slate-200 dark:border-[#2d3148] flex items-center justify-between flex-shrink-0 transition-colors duration-200">
              <div className="flex items-center gap-4">
                <SharePointIcon />
                <div className="flex flex-col justify-center">
                  <span className="text-base font-semibold leading-tight text-slate-800 dark:text-slate-100">
                    SharePoint Downloader
                  </span>
                  <span className="text-sm leading-tight text-slate-500 dark:text-slate-400 mt-0.5">
                    Tải file từ SharePoint qua Access Token hoặc Certificate
                  </span>
                </div>
              </div>
              <Button
                type="text"
                icon={dark ? <BulbOutlined /> : <BulbFilled />}
                onClick={toggle}
                title={dark ? 'Chuyển sang Light mode' : 'Chuyển sang Dark mode'}
                className="!border !border-slate-200 dark:!border-[#2d3148] hover:!border-indigo-400 !text-slate-500 dark:!text-slate-400 hover:!text-indigo-500 transition-colors"
              />
            </div>

            {/* Tab nav — fixed, never scrolls */}
            <div className="flex gap-0 px-6 pt-1 border-b border-slate-200 dark:border-[#2d3148] flex-shrink-0 transition-colors duration-200">
              <TabButton active={activeTab === 'token'} onClick={() => setActiveTab('token')}>
                <KeyOutlined /> Access Token
              </TabButton>
              <TabButton active={activeTab === 'cert'} onClick={() => setActiveTab('cert')}>
                <SafetyOutlined /> Certificate
              </TabButton>
            </div>

            {/* Form content — only this part scrolls */}
            <div className="scroll-area flex-1 px-8 pt-6 pb-0">
              {activeTab === 'token' ? <TokenTab /> : <CertTab />}
            </div>

          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-400 dark:text-slate-600 mt-3 flex-shrink-0">
            Copyright © 2026{' '}
            <span className="text-indigo-500 dark:text-indigo-400">zhizhu</span>
            {' '}All right reserved
          </p>
        </div>
      </div>
    </>
  );
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-0 border-b-2 -mb-px transition-colors duration-150 bg-transparent cursor-pointer outline-none',
        active
          ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
          : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
      ].join(' ')}
    >
      {children}
    </button>
  );
}

function SharePointIcon() {
  return (
    <svg width="40" height="40" viewBox="0 0 38 38" fill="none" aria-hidden>
      <rect width="38" height="38" rx="9" fill="#0078d4" />
      <circle cx="16" cy="15" r="7" fill="white" />
      <circle cx="16" cy="15" r="4.5" fill="#0078d4" />
      <circle cx="25" cy="22" r="5.5" fill="white" opacity=".9" />
      <circle cx="25" cy="22" r="3.5" fill="#0078d4" />
    </svg>
  );
}
